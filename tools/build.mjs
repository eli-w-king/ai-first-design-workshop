import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { PAGES } from '../src/pages.mjs';
import { BASE, COURSE, SITE_URL } from '../src/data.mjs';
import { escapeHtml, renderMarkdown } from './render.mjs';
import { seal, unseal } from './crypto.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs');
const HOME = os.homedir();
const source = path.resolve(process.env.TAKEHOME_SOURCE || path.join(HOME, 'Desktop', 'AI-First Design Workshop', 'Takehome-source'));
const credentialFile = path.resolve(process.env.TAKEHOME_PASSWORD_FILE || path.join(HOME, '.config', 'ai-first-design-workshop', 'takehome-password'));
const lockedFile = path.join(OUT, 'keep-going', 'course.json');

async function externalOnly(file) {
  const real = await fs.realpath(file);
  const relative = path.relative(ROOT, real);
  if (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)) throw new Error('Course source and credentials must remain outside the repository.');
  return real;
}

async function buildCourse() {
  if (process.argv.includes('--public-only')) {
    const payload = JSON.parse(await fs.readFile(lockedFile, 'utf8'));
    if (payload.version !== 1 || payload.cipher !== 'AES-GCM' || typeof payload.ct !== 'string') throw new Error('A valid encrypted course is required for a public-only build.');
    return payload;
  }
  const sourcePath = await externalOnly(source);
  const credentialsPath = await externalOnly(credentialFile);
  const phrase = (await fs.readFile(credentialsPath, 'utf8')).replace(/\r?\n$/, '');
  if (phrase.length < 12 || /[\r\n]/.test(phrase)) throw new Error('The course credential must be one line of at least 12 characters.');
  const modules = [];
  for (const [index, module] of COURSE.entries()) {
    const file = await externalOnly(path.join(sourcePath, module.source));
    const markdown = await fs.readFile(file, 'utf8');
    if (/[\u2013\u2014]/u.test(markdown)) throw new Error(`Use plain punctuation in ${module.source}.`);
    const body = markdown.replace(/^# [^\n]+\n+/, '');
    for (const heading of ['Goal', 'Steps', 'What it costs', 'How to undo it']) {
      if (!body.includes(`## ${heading}`)) throw new Error(`Missing ${heading} in ${module.source}.`);
    }
    modules.push(`<article class="module" id="${module.slug}"><p class="eyebrow">MODULE ${String(index + 1).padStart(2, '0')}</p><h2>${escapeHtml(module.title)}</h2>${renderMarkdown(body, module.slug)}</article>`);
  }
  const nav = `<nav class="side-nav" aria-label="Take-home modules"><p>THE TAKE-HOME</p>${COURSE.map((m, i) => `<a href="#${m.slug}">${String(i + 1).padStart(2, '0')}. ${escapeHtml(m.title)}</a>`).join('')}</nav>`;
  const html = `<div class="page-layout">${nav}<div class="reading">${modules.join('\n')}</div></div>`;
  const plain = JSON.stringify({ version: 1, html });
  // Reuse unchanged ciphertext only after authenticating and comparing it in memory.
  try {
    const previous = JSON.parse(await fs.readFile(lockedFile, 'utf8'));
    if (unseal(previous, phrase) === plain) return previous;
  } catch { /* A changed credential or absent payload creates a fresh salt and IV. */ }
  return seal(plain, phrase);
}

async function main() {
  // Finish all private-source work before writing any public output.
  const encrypted = await buildCourse();
  const template = await fs.readFile(path.join(ROOT, 'templates', 'page.html'), 'utf8');
  const outputPages = PAGES.map(page => {
    const nav = PAGES.filter(p => p.nav).map(p => `<a href="${BASE}${p.slug ? p.slug + '/' : ''}"${p.slug === page.slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('');
    const title = page.slug ? `${page.title} | AI-First Design Workshop` : page.title;
    const vars = { title: escapeHtml(title), description: escapeHtml(page.description), canonical: SITE_URL + (page.slug === '404' ? '404.html' : page.slug ? page.slug + '/' : ''), siteUrl: SITE_URL, base: BASE, nav, bodyClass: page.body || 'page-content', content: page.content };
    const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in vars)) throw new Error(`Unknown template key: ${key}`);
      return vars[key];
    });
    if (/[\u2013\u2014]/u.test(html)) throw new Error(`Use plain punctuation on the ${page.slug || 'home'} page.`);
    return [page.slug === '404' ? '404.html' : `${page.slug ? page.slug + '/' : ''}index.html`, html];
  });
  await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });
  for (const entry of await fs.readdir(path.join(ROOT, 'src', 'assets'))) {
    await fs.copyFile(path.join(ROOT, 'src', 'assets', entry), path.join(OUT, 'assets', entry));
  }
  for (const [file, html] of outputPages) {
    const target = path.join(OUT, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html);
  }
  await fs.copyFile(path.join(ROOT, 'src', 'downloads', 'workshop-settings.jsonc'), path.join(OUT, 'get-ready', 'workshop-settings.jsonc'));
  await fs.writeFile(lockedFile, JSON.stringify(encrypted));
  await fs.writeFile(path.join(OUT, '.nojekyll'), '');
  await fs.writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${PAGES.filter(p => p.nav).map(p => `<url><loc>${SITE_URL}${p.slug ? p.slug + '/' : ''}</loc></url>`).join('')}</urlset>\n`);
  console.log(`Built ${outputPages.length} pages and one encrypted take-home. No plaintext course was written to docs/.`);
}

main().catch(error => {
  console.error(`Build stopped: ${error.message}`);
  process.exitCode = 1;
});
