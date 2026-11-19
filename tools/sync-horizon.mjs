#!/usr/bin/env node
// Copies the Horizon kit into vendor/horizon/, byte for byte, and records what it copied.
//   node tools/sync-horizon.mjs <the kit's folder>
// Rerun it whenever the kit changes. Never edit the copied files: theme through the kit's --hz-* custom properties
// (src/assets/theme.css maps the site's values to them) and pass options when mounting (src/assets/site-horizon.js).
// Everything comes over except tools/ (the kit's own recording and check scripts, which point at one machine) and
// stills/ (review images and clips). Files that left the kit leave the copy too. The build publishes only what runs:
// horizon.css, horizon.js and the fonts with their licenses. The record is vendor/horizon-sync.json: each file's size
// and SHA-256, the kit's version and what was skipped.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEST = path.join(ROOT, 'vendor/horizon');
const RECORD = path.join(ROOT, 'vendor/horizon-sync.json');
const from = process.argv[2];
if (!from || !fs.existsSync(path.join(from, 'horizon.js')) || !fs.existsSync(path.join(from, 'horizon.css'))) {
	console.error('Usage: node tools/sync-horizon.mjs <the kit\'s folder, with horizon.js and horizon.css>');
	process.exit(2);
}
const SKIP = /^(tools|stills)\//;
const list = (dir, base = '') => (fs.existsSync(path.join(dir, base)) ? fs.readdirSync(path.join(dir, base), { withFileTypes: true }) : []).flatMap(e => {
	const rel = base ? `${base}/${e.name}` : e.name;
	if (e.name.startsWith('.')) {
		return [];
	}
	return e.isDirectory() ? list(dir, rel) : [rel];
});
const all = list(from).sort();
const wanted = all.filter(rel => !SKIP.test(rel));
const skipped = all.filter(rel => SKIP.test(rel));
fs.mkdirSync(DEST, { recursive: true });
const files = {};
for (const rel of wanted) {
	const buf = fs.readFileSync(path.join(from, rel));
	fs.mkdirSync(path.dirname(path.join(DEST, rel)), { recursive: true });
	fs.writeFileSync(path.join(DEST, rel), buf);
	files[rel] = { bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex') };
}
for (const rel of list(DEST)) {
	if (!wanted.includes(rel)) {
		fs.rmSync(path.join(DEST, rel));
	}
}
const version = (fs.readFileSync(path.join(from, 'horizon.js'), 'utf8').match(/VERSION\s*=\s*'([^']+)'/) || [])[1] || null;
fs.writeFileSync(RECORD, JSON.stringify({
	_readme: 'Written by tools/sync-horizon.mjs. vendor/horizon/ is the Horizon kit as is, minus tools/ and stills/.',
	version,
	synced: new Date().toISOString(),
	skipped,
	files,
}, null, '\t') + '\n');
console.log(JSON.stringify({ version, copied: wanted.length, skipped: skipped.length }));
