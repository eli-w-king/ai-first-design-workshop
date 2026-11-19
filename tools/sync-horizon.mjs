#!/usr/bin/env node
// Copies the Horizon kit into src/assets/horizon/, byte for byte, and records what it copied.
//   node tools/sync-horizon.mjs <the kit's folder>
// Rerun it whenever the kit changes. Never edit the copied files: theme through the kit's custom properties instead
// (src/assets/theme.css maps the site's values to them). Only what the site needs comes over: horizon.css,
// horizon.js, the fonts and their licenses, and the README. Files that left the kit leave the copy too. The record is
// src/horizon-sync.json (each file's size and SHA-256, and the kit's version).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEST = path.join(ROOT, 'src/assets/horizon');
const RECORD = path.join(ROOT, 'src/horizon-sync.json');
const from = process.argv[2];
if (!from || !fs.existsSync(path.join(from, 'horizon.js')) || !fs.existsSync(path.join(from, 'horizon.css'))) {
	console.error('Usage: node tools/sync-horizon.mjs <the kit\'s folder, with horizon.js and horizon.css>');
	process.exit(2);
}
const keep = rel => /^(horizon\.css|horizon\.js|README\.md)$/.test(rel) || /^fonts\/[^/]+\.(woff2|txt)$/.test(rel);
const list = (dir, base = '') => fs.readdirSync(path.join(dir, base), { withFileTypes: true }).flatMap(e => {
	const rel = base ? `${base}/${e.name}` : e.name;
	return e.isDirectory() ? list(dir, rel) : [rel];
});
const wanted = list(from).filter(keep).sort();
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
fs.writeFileSync(RECORD, JSON.stringify({ _readme: 'Written by tools/sync-horizon.mjs. The files in src/assets/horizon/ are the Horizon kit as is.', version, synced: new Date().toISOString(), files }, null, '\t') + '\n');
console.log(JSON.stringify({ version, files: Object.keys(files).length }));
