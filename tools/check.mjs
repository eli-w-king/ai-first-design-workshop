#!/usr/bin/env node
// Headless checks of the built site (dist/), in Chromium from Playwright:
//   node tools/check.mjs [--shots work/shots] [--only setup.html] [--external]
// Every page at 1440x900 and 390x844: a full-page screenshot in work/shots/, no sideways scrolling, every image and
// the fonts load, no console errors or failed requests, one h1, and text contrast of at least 4.5:1 (3:1 for large
// text). Every internal link and #anchor resolves. Every copy button copies exactly its block's text, and blocks made
// from a file copy exactly that file. No em or en dashes anywhere. The agenda has noindex and no page links to it.
// --external also checks every outside link (without signing in). Results go to work/check.json; it exits 1 on any
// failure. Playwright comes from ~/Code/microsoft-vscode, or PLAYWRIGHT_FROM=<a package.json next to it>.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const argv = process.argv.slice(2);
const opt = (n, d) => {
	const i = argv.indexOf(`--${n}`);
	return i < 0 ? d : argv[i + 1];
};
const SHOTS = path.resolve(ROOT, opt('shots', 'work/shots'));
const ONLY = opt('only', null);
const require = createRequire(process.env.PLAYWRIGHT_FROM || path.join(os.homedir(), 'Code/microsoft-vscode/package.json'));
const { chromium } = require('playwright');

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jsonc': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.woff2': 'font/woff2' };
// A static server on a free port, with the site under /ai-first-design-workshop/ like GitHub Pages.
const BASE_PATH = '/ai-first-design-workshop/';
const server = http.createServer((req, res) => {
	const url = new URL(req.url, 'http://x');
	if (!url.pathname.startsWith(BASE_PATH)) {
		res.statusCode = 404;
		res.end();
		return;
	}
	let file = path.join(DIST, decodeURIComponent(url.pathname.slice(BASE_PATH.length)));
	if (file.endsWith(path.sep) || (fs.existsSync(file) && fs.statSync(file).isDirectory())) {
		file = path.join(file, 'index.html');
	}
	if (!file.startsWith(DIST) || !fs.existsSync(file)) {
		res.statusCode = 404;
		res.setHeader('Content-Type', TYPES['.html']);
		res.end(fs.readFileSync(path.join(DIST, '404.html')));
		return;
	}
	res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
	res.end(fs.readFileSync(file));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const ORIGIN = `http://localhost:${server.address().port}`;
const SITE = `${ORIGIN}${BASE_PATH}`;

const pages = fs.readdirSync(DIST).filter(f => f.endsWith('.html')).filter(f => !ONLY || f === ONLY).sort();
const html = new Map(fs.readdirSync(DIST).filter(f => f.endsWith('.html')).map(f => [f, fs.readFileSync(path.join(DIST, f), 'utf8')]));
const failures = [];
const notes = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);
fs.mkdirSync(SHOTS, { recursive: true });

// Static checks on the HTML: dashes, internal links and anchors, the agenda.
for (const [file, text] of html) {
	if (/[\u2013\u2014]/.test(text)) {
		fail(file, 'has an em or en dash');
	}
	for (const m of text.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
		const href = m[1].replace(/&amp;/g, '&');
		if (/^(https?:|mailto:)/.test(href)) {
			continue;
		}
		const [target, hash] = href.split('#');
		const page = target || file;
		if (!html.has(page) && !fs.existsSync(path.join(DIST, page))) {
			fail(file, `links to a missing file: ${href}`);
			continue;
		}
		if (hash && html.has(page) && !new RegExp(`\\bid="${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html.get(page))) {
			fail(file, `links to a missing anchor: ${href}`);
		}
	}
	if (file !== 'agenda.html' && /href="agenda\.html/.test(text)) {
		fail(file, 'links to the unlisted agenda');
	}
}
if (html.has('agenda.html') && !/<meta name="robots" content="noindex, nofollow">/.test(html.get('agenda.html'))) {
	fail('agenda.html', 'is missing noindex');
}

const browser = await chromium.launch({ headless: true });
const sizes = [{ width: 1440, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'phone' }];
for (const size of sizes) {
	const mobile = size.width < 600;
	const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce', colorScheme: 'light' });
	await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: ORIGIN });
	for (const file of pages) {
		const tab = await context.newPage();
		const errors = [];
		tab.on('console', m => {
			if (m.type() === 'error') {
				errors.push(m.text());
			}
		});
		tab.on('pageerror', e => errors.push(String(e)));
		tab.on('response', r => {
			if (r.status() >= 400 && !(file === '404.html' && r.url().endsWith('404.html'))) {
				errors.push(`${r.status()} ${r.url()}`);
			}
		});
		tab.on('requestfailed', r => {
			if (!/\.mp4$/.test(r.url())) {
				errors.push(`failed ${r.url()}`);
			}
		});
		await tab.goto(SITE + file, { waitUntil: 'load' });
		await tab.evaluate(async () => {
			const images = [...document.querySelectorAll('img[loading="lazy"]')];
			images.forEach(img => { img.loading = 'eager'; });
			await Promise.all(images.map(img => img.decode().catch(() => null)));
			await document.fonts.ready;
		});
		const where = `${file} at ${size.width}`;
		const result = await tab.evaluate(() => {
			const out = {};
			const vw = document.documentElement.clientWidth;
			out.overflow = document.documentElement.scrollWidth - vw;
			out.wide = [];
			if (out.overflow > 1) {
				for (const el of document.querySelectorAll('body *')) {
					const r = el.getBoundingClientRect();
					if (r.right > vw + 1 && r.width > 0 && !el.closest('pre, .table-wrap, .agenda-jump, .flow-canvas')) {
						out.wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
					}
				}
				out.wide = out.wide.slice(0, 6);
			}
			out.brokenImages = [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src'));
			out.h1 = document.querySelectorAll('h1').length;
			out.fonts = ['400 16px Inter', '500 16px Inter', '400 48px "Inter Display"'].map(f => [f, document.fonts.check(f)]);
			// Contrast: every element with its own visible text, against the first solid background behind it.
			const parse = c => {
				const m = c.match(/rgba?\(([^)]+)\)/);
				if (!m) {
					return null;
				}
				const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
				return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
			};
			const lum = c => {
				const f = v => {
					v /= 255;
					return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
				};
				return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
			};
			const behind = el => {
				let layers = [];
				for (let n = el; n; n = n.parentElement) {
					const c = parse(getComputedStyle(n).backgroundColor);
					if (c && c.a > 0) {
						layers.push(c);
						if (c.a >= 1) {
							break;
						}
					}
				}
				let base = { r: 255, g: 255, b: 255 };
				for (const c of layers.reverse()) {
					base = { r: c.r * c.a + base.r * (1 - c.a), g: c.g * c.a + base.g * (1 - c.a), b: c.b * c.a + base.b * (1 - c.a) };
				}
				return base;
			};
			out.lowContrast = [];
			for (const el of document.querySelectorAll('body *')) {
				if (el.closest('svg, video, .wall-media, .sr-only, [aria-hidden="true"]')) {
					continue;
				}
				const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
				if (!own) {
					continue;
				}
				const s = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				if (s.visibility === 'hidden' || s.display === 'none' || !r.width || !r.height || Number(s.opacity) === 0) {
					continue;
				}
				const fg = parse(s.color);
				if (!fg) {
					continue;
				}
				const bg = behind(el);
				const mixed = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
				const [a, b] = [lum(mixed), lum(bg)].sort((x, y) => y - x);
				const ratio = (a + 0.05) / (b + 0.05);
				const size = parseFloat(s.fontSize);
				const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 600);
				if (ratio < (large ? 3 : 4.5)) {
					out.lowContrast.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${el.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)}`);
				}
			}
			out.lowContrast = [...new Set(out.lowContrast)].slice(0, 8);
			return out;
		});
		if (result.overflow > 1) {
			fail(where, `scrolls sideways by ${result.overflow}px: ${result.wide.join(', ')}`);
		}
		if (result.brokenImages.length) {
			fail(where, `broken images: ${result.brokenImages.join(', ')}`);
		}
		if (result.h1 !== 1) {
			fail(where, `has ${result.h1} h1 elements`);
		}
		for (const [f, ok] of result.fonts) {
			if (!ok && size.name === 'desktop' && file === 'index.html') {
				fail(where, `font not loaded: ${f}`);
			}
		}
		if (result.lowContrast.length) {
			fail(where, `low contrast: ${result.lowContrast.join('; ')}`);
		}
		if (errors.length) {
			fail(where, `console or network errors: ${[...new Set(errors)].slice(0, 5).join(' | ')}`);
		}
		// The screenshot comes first, from the top, before the copy checks scroll the page.
		await tab.evaluate(() => window.scrollTo(0, 0));
		await tab.screenshot({ path: path.join(SHOTS, `${file.replace('.html', '')}-${size.name}.png`), fullPage: true });
		// Copy buttons, at desktop size: each copies exactly its block's text, and a block made from a file, that file.
		if (size.name === 'desktop') {
			const blocks = await tab.locator('.block').count();
			for (let i = 0; i < blocks; i++) {
				const block = tab.locator('.block').nth(i);
				const expected = await block.locator('code').evaluate(c => c.textContent);
				const fromFile = await block.getAttribute('data-file');
				await block.locator('.copy').click();
				await tab.waitForTimeout(60);
				const copied = await tab.evaluate(() => navigator.clipboard.readText());
				const state = await block.locator('.copy').getAttribute('data-state');
				if (copied !== expected || state !== 'copied') {
					fail(where, `copy button ${i + 1} copied something else (${JSON.stringify(copied.slice(0, 40))})`);
				}
				if (fromFile) {
					const want = fs.readFileSync(path.join(ROOT, 'content', fromFile), 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');
					if (copied !== want) {
						fail(where, `copy button ${i + 1} doesn't match ${fromFile} exactly`);
					}
				}
			}
			notes.push(`${file}: ${blocks} copy buttons checked`);
		}
		await tab.close();
	}
	await context.close();
}
await browser.close();
server.close();

// Outside links, without signing in.
if (argv.includes('--external')) {
	const links = new Set();
	for (const text of html.values()) {
		for (const m of text.matchAll(/href="(https?:[^"]+)"/g)) {
			links.add(m[1].replace(/&amp;/g, '&'));
		}
	}
	for (const url of [...links].sort()) {
		let code = '000';
		try {
			code = execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-L', '--max-time', '25', '-A', 'Mozilla/5.0', url], { encoding: 'utf8', env: { PATH: process.env.PATH, HOME: process.env.HOME } }).trim();
		} catch {
			code = 'ERR';
		}
		if (!/^(200|301|302)$/.test(code)) {
			fail('external', `${code} ${url}`);
		}
	}
	notes.push(`${links.size} outside links checked`);
}

fs.mkdirSync(path.join(ROOT, 'work'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'work/check.json'), JSON.stringify({ checked: new Date().toISOString(), pages: pages.length, failures, notes }, null, 2));
for (const f of failures) {
	console.log(`FAIL ${f}`);
}
console.log(`${pages.length} pages at ${sizes.length} sizes. ${failures.length} failure(s). Screenshots in ${path.relative(ROOT, SHOTS)}.`);
process.exit(failures.length ? 1 : 0);
