import { readFile, mkdir, realpath, rename, writeFile } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';

const viewport = { width: 1280, height: 800 };
const keys = new Set(['Enter', 'Tab', 'Space', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function checkTarget(target) {
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    throw new Error('Each target needs an exact role and name, or exact visible text.');
  }
  const fields = Object.keys(target).sort().join(',');
  const valid = fields === 'text'
    ? typeof target.text === 'string' && target.text.trim().length > 0
    : fields === 'name,role' && ['name', 'role'].every(key => typeof target[key] === 'string' && target[key].trim().length > 0);
  if (!valid) throw new Error('Targets must contain only role and name, or only text.');
}

export function validatePlan(plan) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('The plan must be a JSON object.');
  const url = new URL(plan.url);
  if (!['http:', 'https:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.username || url.password) {
    throw new Error('Record only an approved localhost prototype, without URL credentials.');
  }
  checkTarget(plan.ready);
  checkTarget(plan.finish);
  if (!Array.isArray(plan.steps) || plan.steps.length < 1 || plan.steps.length > 12) {
    throw new Error('Use 1 to 12 bounded steps.');
  }
  for (const step of plan.steps) {
    if (!step || !['click', 'fill', 'press', 'expect', 'wait'].includes(step.action)) throw new Error('Unsupported recording action.');
    if (step.action === 'wait') {
      if (!Number.isInteger(step.ms) || step.ms < 0 || step.ms > 3000) throw new Error('A reading hold must be 0 to 3000 milliseconds.');
      continue;
    }
    checkTarget(step.target);
    if (step.action === 'fill' && (typeof step.value !== 'string' || step.value.length > 300)) throw new Error('Use a fill value of at most 300 characters.');
    if (step.action === 'press' && !keys.has(step.key)) throw new Error('Use a simple navigation key, not a keyboard shortcut.');
  }
  return plan;
}

export function requestAllowed(requestUrl, method, origin) {
  const url = new URL(requestUrl);
  return url.origin === origin && ['GET', 'HEAD'].includes(method) && !url.username && !url.password;
}

function targetFor(page, target) {
  return 'text' in target ? page.getByText(target.text, { exact: true }) : page.getByRole(target.role, { name: target.name, exact: true });
}

function installPointer() {
  const attach = () => {
    const pointer = document.createElement('div');
    pointer.setAttribute('aria-hidden', 'true');
    pointer.style.cssText = 'position:fixed;left:0;top:0;width:28px;height:34px;pointer-events:none;z-index:2147483647;transform:translate(24px,24px)';
    pointer.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 34"><path d="M3 2 L3 26 L10 20 L15 31 L20 28 L15 18 L25 18 Z" fill="white" stroke="#17212b" stroke-width="2"/></svg>';
    const ring = document.createElement('div');
    ring.style.cssText = 'position:fixed;left:0;top:0;width:28px;height:28px;border:3px solid #4b9eff;border-radius:50%;box-sizing:border-box;pointer-events:none;z-index:2147483646;opacity:0';
    ring.setAttribute('aria-hidden', 'true');
    document.documentElement.append(ring, pointer);
    document.addEventListener('mousemove', event => {
      pointer.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
    }, true);
    document.addEventListener('mousedown', event => {
      ring.style.left = `${event.clientX - 14}px`;
      ring.style.top = `${event.clientY - 14}px`;
      ring.animate([{ opacity: 1, transform: 'scale(.65)' }, { opacity: 0, transform: 'scale(1.6)' }], { duration: 500 });
    }, true);
  };
  if (document.documentElement) attach();
  else document.addEventListener('DOMContentLoaded', attach, { once: true });
}

async function glide(page, locator, cursor) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error('The next control has no visible bounds.');
  const end = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  for (let i = 1; i <= 20; i++) {
    const t = i / 20;
    const eased = t * t * (3 - 2 * t);
    await page.mouse.move(cursor.x + (end.x - cursor.x) * eased, cursor.y + (end.y - cursor.y) * eased);
    await sleep(15);
  }
  Object.assign(cursor, end);
}

export async function recordWalkthrough({ plan, output, runtime, packageName = 'playwright', browserPath, channel }) {
  validatePlan(plan);
  if (!['playwright', 'playwright-core'].includes(packageName)) throw new Error('Use an existing playwright or playwright-core package.');
  if (browserPath && channel) throw new Error('Choose a browser path or a channel, not both.');
  if (channel && !['chrome', 'msedge'].includes(channel)) throw new Error('Only an existing chrome or msedge channel is supported.');
  const cwd = await realpath(process.cwd());
  const outputPath = resolve(output);
  const parent = await realpath(dirname(outputPath));
  const inside = path => {
    const rel = relative(cwd, path);
    return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
  };
  if (outputPath === cwd || !inside(outputPath) || !inside(parent)) throw new Error('Choose a new output folder inside the current project.');
  await mkdir(outputPath); // Refuse existing takes instead of overwriting them.
  const statePath = resolve(outputPath, 'browser-state');
  await mkdir(statePath);
  const savedTemp = Object.fromEntries(['TMPDIR', 'TMP', 'TEMP'].map(key => [key, process.env[key]]));
  for (const key of Object.keys(savedTemp)) process.env[key] = statePath;

  const errors = [];
  const result = { status: 'failed', source: plan.url, viewport, video: null, flowChecksPassed: false, errors };
  let browser, context, video, timer;
  const abort = reason => {
    errors.push(reason);
    void browser?.close().catch(() => {});
  };
  const interrupt = () => abort('Recording interrupted; this take needs to be repeated.');
  process.once('SIGINT', interrupt);
  process.once('SIGTERM', interrupt);
  try {
    const require = createRequire(resolve(runtime, 'package.json'));
    const { chromium } = require(packageName);
    browser = await chromium.launch({ headless: true, executablePath: browserPath, channel, timeout: 30000 });
    timer = setTimeout(() => abort('Recording exceeded its 90-second limit.'), 90000);
    context = await browser.newContext({ viewport, recordVideo: { dir: outputPath, size: viewport }, serviceWorkers: 'block', acceptDownloads: false });
    const origin = new URL(plan.url).origin;
    await context.route('**/*', route => {
      if (requestAllowed(route.request().url(), route.request().method(), origin)) return route.continue();
      errors.push('Blocked an outside-origin request or a non-read-only request.');
      return route.abort('blockedbyclient');
    });
    await context.routeWebSocket('**/*', socket => {
      errors.push('Blocked a WebSocket; this recorder supports local static prototypes.');
      socket.close();
    });
    await context.addInitScript(installPointer);
    const page = await context.newPage();
    video = page.video();
    context.on('page', popup => {
      errors.push('The flow opened another tab. Keep the demo in one page.');
      void popup.close().catch(() => {});
    });
    page.setDefaultTimeout(5000);
    page.on('pageerror', () => errors.push('The page raised a JavaScript error.'));
    page.on('console', message => { if (message.type() === 'error') errors.push('The page logged a console error.'); });
    page.on('requestfailed', () => errors.push('A page request failed.'));
    page.on('response', response => { if (response.status() >= 400) errors.push(`A page request returned HTTP ${response.status()}.`); });
    page.on('dialog', dialog => {
      errors.push('An unexpected browser dialog appeared.');
      void dialog.dismiss().catch(() => {});
    });
    page.on('download', download => {
      errors.push('An unexpected download started.');
      void download.cancel().catch(() => {});
    });
    await page.goto(plan.url, { waitUntil: 'load', timeout: 15000 });
    await targetFor(page, plan.ready).waitFor({ state: 'visible' });
    await page.mouse.move(24, 24);
    await page.screenshot({ path: resolve(outputPath, 'start.png') });
    await sleep(2000);
    const cursor = { x: 24, y: 24 };
    for (const step of plan.steps) {
      if (errors.length) throw new Error('Fix the page errors before recording again.');
      if (step.action === 'wait') {
        await sleep(step.ms);
        continue;
      }
      const target = targetFor(page, step.target);
      await target.waitFor({ state: 'visible' });
      if (step.action !== 'expect') {
        await glide(page, target, cursor);
        if (step.action === 'click') await target.click();
        if (step.action === 'fill') {
          await target.click();
          await target.fill('');
          await target.pressSequentially(step.value, { delay: 35 });
        }
        if (step.action === 'press') {
          await target.focus();
          await target.press(step.key);
        }
      }
      await sleep(800);
    }
    await targetFor(page, plan.finish).waitFor({ state: 'visible' });
    await sleep(2500);
    if (errors.length) throw new Error('The take contains errors and is not a finished demo.');
    await page.screenshot({ path: resolve(outputPath, 'finish.png') });
    result.flowChecksPassed = true;
  } catch (error) {
    errors.push(error.message);
  } finally {
    clearTimeout(timer);
    await context?.close().catch(error => errors.push(`Could not finalize the context: ${error.message}`));
    await browser?.close().catch(error => errors.push(`Could not close the browser: ${error.message}`));
    process.removeListener('SIGINT', interrupt);
    process.removeListener('SIGTERM', interrupt);
    for (const [key, value] of Object.entries(savedTemp)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
  if (errors.length) result.flowChecksPassed = false;
  if (video) {
    try {
      const filename = result.flowChecksPassed ? 'walkthrough.webm' : 'failed-take.webm';
      await rename(await video.path(), resolve(outputPath, filename));
      result.video = filename;
    } catch (error) {
      result.flowChecksPassed = false;
      errors.push(`Could not finalize the video: ${error.message}`);
    }
  }
  result.status = result.flowChecksPassed && result.video ? 'recorded-needs-visual-review' : 'failed';
  await writeFile(resolve(outputPath, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  if (result.status === 'failed') throw new Error(`Recording failed. Inspect ${relative(cwd, outputPath)}/result.json; do not present this take as finished.`);
  return result;
}

async function main() {
  const { values } = parseArgs({ options: {
    plan: { type: 'string' }, output: { type: 'string' }, runtime: { type: 'string' },
    package: { type: 'string', default: 'playwright' }, browser: { type: 'string' }, channel: { type: 'string' },
    help: { type: 'boolean', short: 'h' }
  }});
  if (values.help) {
    console.log('Record an owned localhost prototype. No installation or upload.\n--plan FILE --output NEW_FOLDER --runtime EXISTING_PROJECT\nOptional: --package playwright-core --browser EXECUTABLE, or --channel chrome\nRead references/recording.md and approve any missing tools first.');
    return;
  }
  if (!values.plan || !values.output || !values.runtime) throw new Error('Provide --plan, --output and --runtime. Use --help for the contract.');
  const text = await readFile(values.plan, 'utf8');
  if (Buffer.byteLength(text) > 64000) throw new Error('Keep the recording plan under 64 KB.');
  const result = await recordWalkthrough({ plan: JSON.parse(text), output: values.output, runtime: values.runtime, packageName: values.package, browserPath: values.browser, channel: values.channel });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
