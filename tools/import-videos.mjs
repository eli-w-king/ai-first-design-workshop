#!/usr/bin/env node
// Brings delivered course videos into the site.
//   node tools/import-videos.mjs <the delivery folder> [--only <slug>,<slug>]
// The folder has videos.json ({ "videos": { "<slug>": { file, captions, poster, note, duration, sha256, ... } } })
// and, for each slug, <slug>.mp4, <slug>.vtt and <slug>-poster.jpg. Each video is checked against its sha256, then the
// three files are copied into content/videos/ and its entry in content/videos.json gets file, captions, poster,
// duration, credits (shown under the video) and note (what's real in it). Slugs the site has no slot for are skipped.
// Then build, check and commit.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = process.argv[2];
const onlyArg = process.argv.indexOf('--only');
const only = onlyArg > 0 ? new Set(process.argv[onlyArg + 1].split(',').map(s => s.trim())) : null;
if (!from || !fs.existsSync(path.join(from, 'videos.json'))) {
	console.error('Usage: node tools/import-videos.mjs <the delivery folder, with videos.json> [--only <slug>,<slug>]');
	process.exit(2);
}
const delivered = JSON.parse(fs.readFileSync(path.join(from, 'videos.json'), 'utf8')).videos || {};
const sitePath = path.join(ROOT, 'content/videos.json');
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
const dest = path.join(ROOT, 'content/videos');
fs.mkdirSync(dest, { recursive: true });
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pick = (value, fallback) => path.join(from, path.basename(value || fallback));
const done = [];
const problems = [];
for (const [slug, d] of Object.entries(delivered)) {
	if (only && !only.has(slug)) {
		continue;
	}
	if (!site.videos?.[slug]) {
		problems.push(`${slug}: the site has no slot for it, skipped`);
		continue;
	}
	const mp4 = pick(d.file, `${slug}.mp4`);
	const vtt = pick(d.captions, `${slug}.vtt`);
	const poster = pick(d.poster, `${slug}-poster.jpg`);
	if (!fs.existsSync(mp4)) {
		problems.push(`${slug}: ${path.basename(mp4)} isn't there`);
		continue;
	}
	if (d.sha256 && sha(mp4) !== d.sha256) {
		problems.push(`${slug}: ${path.basename(mp4)} doesn't match its sha256, skipped`);
		continue;
	}
	if (fs.statSync(mp4).size > 95e6) {
		problems.push(`${slug}: ${path.basename(mp4)} is over 95 MB, too big for GitHub, skipped`);
		continue;
	}
	fs.copyFileSync(mp4, path.join(dest, `${slug}.mp4`));
	const entry = { ...site.videos[slug], file: `videos/${slug}.mp4` };
	if (fs.existsSync(vtt)) {
		fs.copyFileSync(vtt, path.join(dest, `${slug}.vtt`));
		entry.captions = `videos/${slug}.vtt`;
	} else {
		delete entry.captions;
		problems.push(`${slug}: no captions`);
	}
	if (fs.existsSync(poster)) {
		fs.copyFileSync(poster, path.join(dest, `${slug}-poster${path.extname(poster).toLowerCase()}`));
		entry.poster = `videos/${slug}-poster${path.extname(poster).toLowerCase()}`;
	}
	if (d.duration) {
		entry.duration = Number(d.duration);
	}
	if (typeof d.credits === 'number' || (typeof d.credits === 'string' && d.credits.trim())) {
		entry.credits = typeof d.credits === 'string' ? d.credits.trim().replace(/\s*[\u2013\u2014]\s*/g, ', ') : d.credits;
	} else {
		problems.push(`${slug}: no credits`);
	}
	if (d.note) {
		entry.note = String(d.note).replace(/\s*[\u2013\u2014]\s*/g, ', ');
	} else {
		problems.push(`${slug}: no note on what's real`);
	}
	site.videos[slug] = entry;
	done.push(slug);
}
fs.writeFileSync(sitePath, JSON.stringify(site, null, '\t') + '\n');
console.log(JSON.stringify({ imported: done, problems }, null, 2));
