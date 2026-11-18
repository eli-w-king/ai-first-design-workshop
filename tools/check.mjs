import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, COURSE, SITE_URL } from '../src/data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs');
async function files(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(name));
    else result.push(name);
  }
  return result;
}
const all = await files(ROOT);
const pages = new Map();
const errors = [];
let links = 0;
for (const file of all.filter(f => f.endsWith('.html'))) {
  const html = await fs.readFile(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`Duplicate id: ${path.relative(ROOT, file)}`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`Expected one h1: ${path.relative(ROOT, file)}`);
  if (/[\u2013\u2014]/u.test(html)) errors.push(`Non-plain punctuation: ${path.relative(ROOT, file)}`);
  for (const match of html.matchAll(/\bdata-copy="([^"]+)"/g)) {
    if (!ids.includes(match[1])) errors.push(`Copy target missing: ${match[1]}`);
  }
  pages.set(file, { html, ids });
}
for (const [file, { html }] of pages) {
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  const pageUrl = new URL(relative, SITE_URL);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replace(/&amp;/g, '&');
    const url = new URL(href, pageUrl);
    if (url.origin !== new URL(SITE_URL).origin) continue;
    if (!url.pathname.startsWith(BASE)) { errors.push(`Link outside project base: ${href}`); continue; }
    let targetPath = decodeURIComponent(url.pathname.slice(BASE.length));
    if (targetPath.endsWith('/') || !targetPath) targetPath += 'index.html';
    const target = path.join(ROOT, targetPath);
    links++;
    if (!all.includes(target)) { errors.push(`Missing ${href} from ${relative}`); continue; }
    if (url.hash && pages.has(target) && !(targetPath === 'keep-going/index.html' && COURSE.some(module => module.slug === url.hash.slice(1))) && !pages.get(target).ids.includes(decodeURIComponent(url.hash.slice(1)))) errors.push(`Missing anchor ${href} from ${relative}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${pages.size} pages and ${links} internal links/assets. No missing targets, duplicate IDs, copy targets or heading errors.`);
