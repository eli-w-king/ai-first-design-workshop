#!/usr/bin/env node
// One screenshot of a page or one element, for reviewing a specific state.
//   node tools/shot.mjs <page> <out.png> [--width 1440 --height 900 --selector "<css>" --full --scale 2 --base http://localhost:4806]
// Playwright comes from ~/Code/microsoft-vscode, or PLAYWRIGHT_FROM=<a package.json next to it>.
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1]; };
const flag = n => argv.includes(`--${n}`);
const [page, out] = argv;
const require = createRequire(process.env.PLAYWRIGHT_FROM || path.join(os.homedir(), 'Code/microsoft-vscode/package.json'));
const { chromium } = require('playwright');
const width = Number(opt('width', 1440));
const height = Number(opt('height', 900));
const mobile = width < 600;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: Number(opt('scale', mobile ? 2 : 1)), isMobile: mobile, hasTouch: mobile, colorScheme: 'light', reducedMotion: opt('motion', 'reduce') });
const tab = await context.newPage();
await tab.goto(`${opt('base', 'http://localhost:4806')}/${page}`, { waitUntil: 'load' });
await tab.evaluate(async () => {
	const images = [...document.querySelectorAll('img[loading="lazy"]')];
	images.forEach(img => { img.loading = 'eager'; });
	await Promise.all(images.map(img => img.decode().catch(() => null)));
	await document.fonts.ready;
});
await tab.waitForTimeout(Number(opt('wait', 150)));
const sel = opt('selector', null);
if (sel) {
	await tab.locator(sel).first().scrollIntoViewIfNeeded();
	await tab.locator(sel).first().screenshot({ path: out });
} else {
	await tab.screenshot({ path: out, fullPage: flag('full') });
}
await browser.close();
console.log(out);
