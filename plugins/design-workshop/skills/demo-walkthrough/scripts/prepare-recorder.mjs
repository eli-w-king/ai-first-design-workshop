import { access, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, delimiter, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify, parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

const run = promisify(execFile);
const dependencies = { 'playwright-core': '1.65.0', 'ffmpeg-static': '5.3.0' };
const manifest = { name: 'design-workshop-recorder', version: '0.0.0', private: true, dependencies };

export function validateExistingManifest(value) {
  if (value.name !== manifest.name || value.private !== true ||
      Object.keys(value.dependencies ?? {}).length !== Object.keys(dependencies).length ||
      Object.entries(dependencies).some(([key, version]) => value.dependencies?.[key] !== version)) {
    throw new Error('The existing tool folder has a different manifest. Leave it unchanged and review an upgrade separately.');
  }
}

function cacheRoot() {
  if (process.platform === 'win32') {
    if (!process.env.LOCALAPPDATA) throw new Error('LOCALAPPDATA is unavailable. Choose the approved cache location explicitly before setup.');
    return join(process.env.LOCALAPPDATA, 'design-workshop');
  }
  return process.platform === 'darwin'
    ? join(homedir(), 'Library', 'Caches', 'design-workshop')
    : join(homedir(), '.cache', 'design-workshop');
}

async function npmCli() {
  const candidates = [
    process.env.npm_execpath,
    join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'),
    join(dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js')
  ];
  for (const directory of (process.env.PATH ?? '').split(delimiter)) {
    candidates.push(join(directory, 'node_modules/npm/bin/npm-cli.js'));
    try { candidates.push(await realpath(join(directory, 'npm'))); } catch {}
  }
  for (const candidate of candidates) {
    if (!candidate?.endsWith('npm-cli.js')) continue;
    try { await access(candidate, constants.R_OK); return candidate; } catch {}
  }
  throw new Error('Cannot locate npm-cli.js beside the installed Node/npm tools. Do not change execution policy or install a second package manager.');
}

async function main() {
  const { values } = parseArgs({ options: { install: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } });
  const root = cacheRoot();
  const tools = join(root, 'tools');
  const plan = {
    tools, outputs: join(root, 'demos'), dependencies,
    existingBrowser: process.platform === 'win32' ? 'Edge, or an already installed Chrome' : 'an already installed Chrome or Edge',
    downloads: 'Node packages, a full encoder and the small Playwright capture encoder. No browser.',
    measuredPayloadMB: process.platform === 'darwin' && process.arch === 'arm64' ? 24.16 : process.platform === 'win32' && process.arch === 'x64' ? 34.79 : null,
    approval: 'Run with --install only after approving this setup. An explicit recorder-install request already provides that approval.'
  };
  if (!values.install || values.help) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  if (!['darwin', 'linux', 'win32'].includes(process.platform) || !['x64', 'arm64'].includes(process.arch) || (process.platform === 'win32' && process.arch !== 'x64')) {
    throw new Error('This pinned encoder route is not checked for this platform/architecture. Use a reviewed existing encoder or agree on another setup; do not download a browser automatically.');
  }
  const npm = await npmCli();
  const before = await run(process.execPath, [npm, 'config', 'get', 'registry', '--cache', join(tools, 'npm-cache')], { timeout: 30000 });
  await mkdir(root, { recursive: true, mode: 0o700 });
  await mkdir(tools, { recursive: true, mode: 0o700 });
  const packageFile = join(tools, 'package.json');
  try { validateExistingManifest(JSON.parse(await readFile(packageFile, 'utf8'))); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(packageFile, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  }
  const effective = await run(process.execPath, [npm, '--prefix', tools, 'config', 'get', 'registry', '--cache', join(tools, 'npm-cache')], { timeout: 30000 });
  if (before.stdout.trim() !== effective.stdout.trim()) {
    throw new Error('The cache install would use a different npm registry from this project. Review the intended npm configuration first; no registry was changed.');
  }
  const temp = join(root, 't');
  await mkdir(temp, { recursive: true, mode: 0o700 });
  const env = { ...process.env, TMPDIR: temp, TMP: temp, TEMP: temp };
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once('SIGINT', interrupt);
  process.once('SIGTERM', interrupt);
  const receipt = { ...plan, started: new Date().toISOString(), steps: [], browserDownloaded: false };
  const started = performance.now();
  const step = async (label, args, environment = env) => {
    const begin = performance.now();
    try {
      const result = await run(process.execPath, args, { env: environment, timeout: 240000, maxBuffer: 8 * 1024 * 1024, signal: controller.signal });
      await writeFile(join(tools, `${label}.log`), result.stdout + result.stderr);
      receipt.steps.push({ label, seconds: (performance.now() - begin) / 1000 });
    } catch (error) {
      await writeFile(join(tools, `${label}.log`), String(error.stdout ?? '') + String(error.stderr ?? ''));
      throw new Error(`${label} failed. Inspect its local log. Do not retry with another registry, proxy or certificate setting.`, { cause: error });
    }
  };
  try {
    await step('npm-install', [npm, 'install', '--prefix', tools, '--cache', join(tools, 'npm-cache'), '--ignore-scripts']);
    await step('full-encoder-install', [join(tools, 'node_modules/ffmpeg-static/install.js')], {
      ...env, HOME: join(tools, 'download-home'), LOCALAPPDATA: join(tools, 'download-home'), XDG_CACHE_HOME: join(tools, 'download-cache')
    });
    await step('capture-encoder-install', [join(tools, 'node_modules/playwright-core/cli.js'), 'install', 'ffmpeg'], {
      ...env, PLAYWRIGHT_BROWSERS_PATH: join(tools, 'browsers')
    });
    receipt.seconds = (performance.now() - started) / 1000;
    receipt.status = 'installed-browser-and-recording-check-still-required';
    await writeFile(join(tools, 'setup-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify(receipt, null, 2));
  } finally {
    controller.abort();
    process.removeListener('SIGINT', interrupt);
    process.removeListener('SIGTERM', interrupt);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
