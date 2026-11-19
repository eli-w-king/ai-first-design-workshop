#!/usr/bin/env node
// Builds the AI-First Design Workshop site into dist/ from content/.
//   node build.mjs               build into dist/
//   node build.mjs --out <dir>   build somewhere else
//
// Pages are Markdown files in content/pages/. Course modules are in content/pages/modules/ and take their order and
// numbers from content/course.json. Site settings are in content/site.json, videos in content/videos.json, and the
// pull request snapshot in content/data/prs.json. README.md lists the blocks and front matter a page can use. Every
// build writes work/build-report.md: the pages, the videos, the wall and anything it had to leave out.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Marked } from './vendor/marked.esm.js';
import { renderFlow } from './src/flow.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => {
	const i = process.argv.indexOf(`--${name}`);
	return i < 0 ? fallback : process.argv[i + 1];
};
const CONTENT = path.join(ROOT, 'content');
const OUT = path.resolve(arg('out', path.join(ROOT, 'dist')));
// Images and clips are copied here first under hashed names, then into dist/media when a page uses them.
const MEDIA_CACHE = path.join(ROOT, 'work', 'media-cache');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const SITE = readJson('content/site.json');
const VIDEOS = readJson('content/videos.json');
const ICONS = readJson('src/icons.json');
// The course's order: groups of module names (content/pages/modules/<name>.md). A module's number, its file name
// (module-NN.html, unless its front matter sets `out`), the sidebar and the pager all follow this list.
const COURSE = readJson('content/course.json');

const report = {
	built: new Date().toISOString(),
	fixes: [],
	videos: [],
	wall: [],
	prs: null,
};

// ------------------------------------------------------------------ small helpers

const esc = s => String(s ?? '')
	.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const icon = (name, cls = '') => {
	const inner = ICONS[name];
	if (!inner) {
		throw new Error(`Unknown icon ${name}`);
	}
	return `<svg class="icon ${cls}" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">${inner}</svg>`;
};
const slug = s => String(s).toLowerCase()
	.replace(/<[^>]+>/g, '')
	.replace(/&[a-z0-9#]+;/g, '')
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '') || 'section';
const pad2 = n => String(n).padStart(2, '0');
const hash = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

function mkdirp(p) {
	fs.mkdirSync(p, { recursive: true });
}

function copyIfChanged(from, to) {
	mkdirp(path.dirname(to));
	const a = fs.statSync(from);
	if (fs.existsSync(to)) {
		const b = fs.statSync(to);
		if (a.size === b.size && Math.abs(a.mtimeMs - b.mtimeMs) < 1) {
			return;
		}
	}
	fs.copyFileSync(from, to);
	fs.utimesSync(to, a.atime, a.mtime);
}

function copyDir(from, to) {
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		if (entry.name.startsWith('.')) {
			continue;
		}
		const a = path.join(from, entry.name);
		const b = path.join(to, entry.name);
		if (entry.isDirectory()) {
			copyDir(a, b);
		} else {
			copyIfChanged(a, b);
		}
	}
}

// dist/assets mirrors src/assets: a file that left src/assets leaves dist/assets too.
function pruneTo(from, to) {
	if (!fs.existsSync(to)) {
		return;
	}
	for (const entry of fs.readdirSync(to, { withFileTypes: true })) {
		const a = path.join(from, entry.name);
		const b = path.join(to, entry.name);
		if (!fs.existsSync(a)) {
			fs.rmSync(b, { recursive: true, force: true });
		} else if (entry.isDirectory()) {
			pruneTo(a, b);
		}
	}
}

// A file under content/, or null (and a note in the report) when it isn't there.
function contentFile(rel, where, what = 'file') {
	const file = path.resolve(CONTENT, rel);
	if (!file.startsWith(CONTENT + path.sep) || !fs.existsSync(file)) {
		report.fixes.push(`${where}: ${what} not found, left out: ${rel}`);
		return null;
	}
	return file;
}

// ------------------------------------------------------------------ Markdown structure helpers

function parseFrontmatter(text) {
	const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) {
		return { data: {}, body: text };
	}
	const data = {};
	for (const line of m[1].split('\n')) {
		const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!mm) {
			continue;
		}
		let v = mm[2].trim();
		if (/^".*"$/.test(v)) {
			v = JSON.parse(v);
		} else if (/^-?\d+(?:\.\d+)?$/.test(v)) {
			v = Number(v);
		} else if (v === 'true' || v === 'false') {
			v = v === 'true';
		}
		data[mm[1]] = v;
	}
	return { data, body: text.slice(m[0].length) };
}

// Lines with fence awareness: each line gets inFence (true for fence lines and their contents).
function scanLines(md) {
	const out = [];
	let fence = null;
	for (const line of md.split('\n')) {
		const f = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
		if (fence) {
			out.push({ line, inFence: true });
			if (f && f[1][0] === fence[0] && f[1].length >= fence.length && !f[2].trim()) {
				fence = null;
			}
			continue;
		}
		if (f) {
			fence = f[1];
			out.push({ line, inFence: true });
			continue;
		}
		out.push({ line, inFence: false });
	}
	return out;
}

// Sections split at one heading level (outside code fences). The first entry is the text before any heading.
function splitSections(md, level) {
	const sections = [{ heading: null, lines: [] }];
	for (const { line, inFence } of scanLines(md)) {
		const m = !inFence && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
		if (m && m[1].length === level) {
			sections.push({ heading: m[2].trim(), lines: [] });
		} else {
			sections[sections.length - 1].lines.push(line);
		}
	}
	return sections.map(s => ({ heading: s.heading, body: s.lines.join('\n') }));
}

// "## Heading {#id} {collapsed}": an id of its own, and a section that starts closed.
function headingParts(text) {
	let heading = text;
	let id = null;
	let collapsed = false;
	for (let i = 0; i < 2; i++) {
		const c = heading.match(/\s*\{collapsed\}\s*$/);
		if (c) {
			collapsed = true;
			heading = heading.slice(0, c.index);
		}
		const m = heading.match(/\s*\{#([a-z0-9][a-z0-9-]*)\}\s*$/);
		if (m) {
			id = m[1];
			heading = heading.slice(0, m.index);
		}
	}
	return { heading: heading.trim(), id, collapsed };
}

// ------------------------------------------------------------------ rendering Markdown

const CODE_LANGS = new Map([
	['sh', 'Terminal'], ['bash', 'Terminal'], ['zsh', 'Terminal'], ['shell', 'Terminal'], ['console', 'Terminal'],
	['powershell', 'PowerShell'], ['ps1', 'PowerShell'], ['pwsh', 'PowerShell'], ['cmd', 'Command Prompt'],
	['json', 'JSON'], ['jsonc', 'Settings (JSON)'], ['js', 'JavaScript'], ['javascript', 'JavaScript'], ['mjs', 'JavaScript'],
	['ts', 'TypeScript'], ['typescript', 'TypeScript'], ['tsx', 'TypeScript'], ['yaml', 'YAML'], ['yml', 'YAML'], ['diff', 'Diff'],
	['html', 'HTML'], ['css', 'CSS'], ['python', 'Python'], ['py', 'Python'], ['ini', 'Config'], ['toml', 'Config'],
	['gitignore', 'Patterns'], ['xml', 'XML'],
]);
const PROMPT_LANGS = new Set(['text', 'txt', 'prompt', 'md', 'markdown', 'plaintext', '']);
const COMMANDS = new Set(['git', 'gh', 'npm', 'npx', 'node', 'cd', 'code', 'code-insiders', 'caffeinate', 'brew', 'winget',
	'python', 'python3', 'curl', 'open', 'cp', 'mv', 'ls', 'mkdir', 'rm', 'export', 'powercfg', 'chmod', 'cat', 'echo', 'sudo',
	'ffmpeg', 'Remove-Item', 'rmdir', 'del']);

function looksLikeCommand(text) {
	const lines = text.trim().split('\n').filter(l => l.trim());
	if (!lines.length || lines.length > 8) {
		return false;
	}
	return lines.every(l => {
		const first = l.trim().replace(/^\$\s+/, '').split(/\s+/)[0];
		return COMMANDS.has(first) || l.trim().startsWith('#');
	});
}

function codeKind(text, lang) {
	const l = (lang || '').trim().toLowerCase().split(/\s+/)[0];
	if (CODE_LANGS.has(l)) {
		return { kind: 'code', label: CODE_LANGS.get(l), lang: l };
	}
	if (PROMPT_LANGS.has(l)) {
		if (looksLikeCommand(text)) {
			return { kind: 'code', label: 'Terminal', lang: 'sh' };
		}
		return { kind: 'prompt', label: 'Prompt', lang: '' };
	}
	return { kind: 'code', label: 'Code', lang: l };
}

// A prompt or a code block with a copy button. The button copies exactly the text in the block.
// `label=...` on the fence line names the block ("```text label=Prompt 1").
function renderBlock(text, lang) {
	const k = codeKind(text, lang);
	const named = (lang || '').match(/\blabel=("[^"]*"|\S+)/)?.[1]?.replace(/^"|"$/g, '');
	const file = (lang || '').match(/\bfile=(\S+)/)?.[1];
	const label = named || k.label;
	const body = text.replace(/\n+$/, '');
	return `<div class="block block-${k.kind}"${file ? ` data-file="${esc(file)}"` : ''}>`
		+ `<div class="block-head"><span class="block-label">${esc(label)}</span>`
		+ `<button class="copy" type="button" data-copy aria-label="Copy ${esc(label.toLowerCase())}">${icon('copy')}<span class="copy-text">Copy</span></button></div>`
		+ `<pre tabindex="0"><code${k.lang ? ` class="language-${esc(k.lang)}"` : ''}>${esc(body)}</code></pre></div>\n`;
}

// "```jsonc file=data/workshop-settings.jsonc": the block's text comes from that file under content/, as is.
function blockText(text, lang, ctx) {
	const rel = (lang || '').match(/\bfile=(\S+)/)?.[1];
	if (!rel) {
		return text;
	}
	const file = contentFile(rel, ctx.page, 'block file');
	return file ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
}

function makeMarked(ctx) {
	const marked = new Marked({ gfm: true });
	marked.use({
		renderer: {
			code({ text, lang }) {
				const kind = (lang || '').split(/\s+/)[0];
				const blocks = { wall: renderWall, flow: renderFlowBlock, figure: renderFigure, prs: renderPrs, clock: renderClock, callout: renderCallout };
				if (blocks[kind]) {
					return blocks[kind](text, ctx, lang);
				}
				return renderBlock(blockText(text, lang, ctx), lang);
			},
			heading({ tokens, depth }) {
				const inner = this.parser.parseInline(tokens);
				const parts = headingParts(inner);
				const id = ctx.uniqueId(parts.id || slug(parts.heading));
				return `<h${depth} id="${id}">${parts.heading}</h${depth}>\n`;
			},
			html({ text }) {
				const collapse = text.trim().match(/^<!--\s*collapsed:\s*([\s\S]*?)\s*-->/);
				if (collapse) {
					return `<!--COLLAPSE ${encodeURIComponent(collapse[1])}-->`;
				}
				if (/^<!--/.test(text.trim())) {
					return '';
				}
				return text;
			},
			link({ href, title, tokens }) {
				const inner = this.parser.parseInline(tokens);
				const target = href || '';
				const external = /^https?:/i.test(target);
				return `<a href="${esc(target)}"${title ? ` title="${esc(title)}"` : ''}${external ? ' rel="noopener"' : ''}>${inner}${external ? '<span class="sr-only"> (opens a web page)</span>' : ''}</a>`;
			},
			image({ href, title, text }) {
				const src = href || '';
				if (/^https?:/i.test(src)) {
					return `<img src="${esc(src)}" alt="${esc(text)}" loading="lazy">`;
				}
				if (/\.(mp4|m4v|webm)(#.*)?$/i.test(src)) {
					const clip = contentClip(src, ctx);
					return clip ? `<!--CLIP ${encodeURIComponent(JSON.stringify({ ...clip, alt: text, title: title || '' }))}-->` : '';
				}
				const media = contentMedia(decodeURIComponent(src), ctx, 'image');
				if (!media) {
					return esc(text);
				}
				const size = media.width && media.height ? ` width="${media.width}" height="${media.height}"` : '';
				return `<img src="${esc(media.src)}" alt="${esc(text)}"${size} loading="lazy" decoding="async"${title ? ` data-caption="${esc(title)}"` : ''}>`;
			},
			paragraph({ tokens }) {
				// A paragraph of nothing but images becomes a row of captioned screenshots, or a clip in a disclosure.
				const images = tokens.filter(t => t.type === 'image');
				const onlyImages = images.length && tokens.every(t => t.type === 'image' || (t.type === 'text' && !t.text.trim()) || t.type === 'br');
				if (!onlyImages) {
					// "**4.1**" at the start of a paragraph gets an anchor, so a prompt can be linked to (#prompt-4-1).
					const lead = tokens[0];
					const number = lead && lead.type === 'strong' && lead.text.trim().match(/^(?:Prompt\s+)?(\d+)(?:\.(\d+))?([a-z])?\b/);
					const id = number ? ctx.uniqueId(`prompt-${number[1]}${number[2] ? `-${number[2]}` : ''}${number[3] || ''}`) : null;
					return `<p${id ? ` id="${id}" class="prompt-label"` : ''}>${this.parser.parseInline(tokens)}</p>\n`;
				}
				const rendered = images.map(t => this.parser.parseInline([t])).filter(Boolean);
				const clips = rendered.filter(r => r.startsWith('<!--CLIP '));
				if (clips.length) {
					// A clip sits in a closed disclosure, so the page loads nothing until someone opens it.
					return clips.map(r => {
						const c = JSON.parse(decodeURIComponent(r.slice('<!--CLIP '.length, -'-->'.length)));
						const label = `${c.title || 'Watch the clip'}${c.duration ? `, ${formatDuration(c.duration)}` : ''}`;
						return `<details class="more clip"><summary>${icon('play')}<span>${esc(label)}</span></summary><div class="more-body"><div class="clip-frame" style="aspect-ratio: ${c.width} / ${c.height}"><video controls preload="none" playsinline${c.poster ? ` poster="${esc(c.poster)}"` : ''} aria-label="${esc(c.alt)}"><source src="${esc(c.src)}" type="video/mp4">${c.captions ? `<track kind="captions" src="${esc(c.captions)}" srclang="en" label="English" default>` : ''}</video></div></div></details>\n`;
					}).join('');
				}
				const ratios = [];
				const figures = rendered.map(img => {
					const caption = img.match(/data-caption="([^"]*)"/)?.[1];
					const w = Number(img.match(/ width="(\d+)"/)?.[1]);
					const h = Number(img.match(/ height="(\d+)"/)?.[1]);
					const ratio = w && h ? w / h : 1.6;
					ratios.push(ratio);
					const clean = img.replace(/ data-caption="[^"]*"/, '');
					return `<figure class="shot${ratio < 0.8 ? ' shot-tall' : ''}">${clean}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
				});
				// Columns sized by each image's width-to-height ratio, so a row of images shares one height.
				const columns = ratios.map(r => `minmax(0, ${r.toFixed(3)}fr)`).join(' ');
				const mixed = Math.max(...ratios) / Math.min(...ratios) > 1.5;
				return `<div class="shots shots-${Math.min(figures.length, 2)}${mixed ? ' shots-mixed' : ''}" style="--cols: ${columns}">${figures.join('')}</div>\n`;
			},
			table(token) {
				let head = '';
				const labels = token.header.map(cell => this.parser.parseInline(cell.tokens, this.parser.textRenderer).trim());
				for (const cell of token.header) {
					head += `<th${cell.align ? ` style="text-align:${cell.align}"` : ''}>${this.parser.parseInline(cell.tokens)}</th>`;
				}
				let rows = '';
				for (const row of token.rows) {
					rows += '<tr>' + row.map((cell, i) => `<td${labels[i] ? ` data-label="${esc(labels[i])}"` : ''}${cell.align ? ` style="text-align:${cell.align}"` : ''}>${this.parser.parseInline(cell.tokens)}</td>`).join('') + '</tr>\n';
				}
				return `<div class="table-wrap" tabindex="0" role="region" aria-label="Table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
			},
		},
	});
	return marked;
}

function pngSize(file) {
	const head = Buffer.alloc(24);
	const fd = fs.openSync(file, 'r');
	fs.readSync(fd, head, 0, 24, 0);
	fs.closeSync(fd);
	if (head.toString('ascii', 1, 4) !== 'PNG') {
		return { width: 0, height: 0 };
	}
	return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

function webpSize(file) {
	const head = Buffer.alloc(30);
	const fd = fs.openSync(file, 'r');
	fs.readSync(fd, head, 0, 30, 0);
	fs.closeSync(fd);
	if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WEBP') {
		return { width: 0, height: 0 };
	}
	const kind = head.toString('ascii', 12, 16);
	if (kind === 'VP8X') {
		return { width: 1 + head.readUIntLE(24, 3), height: 1 + head.readUIntLE(27, 3) };
	}
	if (kind === 'VP8L') {
		const bits = head.readUInt32LE(21);
		return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
	}
	return { width: head.readUInt16LE(26) & 0x3fff, height: head.readUInt16LE(28) & 0x3fff };
}

// Images are 2x captures; they show at their 1x size or smaller. A file name with "@1x" shows at its own size.
function imageSize(file) {
	const ext = path.extname(file).toLowerCase();
	const size = ext === '.webp' ? webpSize(file) : ext === '.png' ? pngSize(file) : { width: 0, height: 0 };
	const scale = /@1x\./.test(file) ? 1 : 2;
	return { width: Math.round(size.width / scale), height: Math.round(size.height / scale) };
}

// A file under content/ for a page: copied into the media cache under a hashed name, so it reaches dist/media.
function contentMedia(rel, ctx, what = 'media') {
	const file = contentFile(rel, ctx.page, what);
	if (!file) {
		return null;
	}
	const buf = fs.readFileSync(file);
	const ext = path.extname(file).toLowerCase();
	const name = `${hash(buf)}-${slug(path.basename(file, ext))}${ext}`;
	mkdirp(MEDIA_CACHE);
	if (!fs.existsSync(path.join(MEDIA_CACHE, name))) {
		fs.writeFileSync(path.join(MEDIA_CACHE, name), buf);
	}
	return { src: `media/${name}`, file, ...imageSize(file) };
}

let ffmpegAvailable = null;
function hasFfmpeg() {
	if (ffmpegAvailable === null) {
		try {
			execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
			ffmpegAvailable = true;
		} catch {
			ffmpegAvailable = false;
		}
	}
	return ffmpegAvailable;
}

function probe(file) {
	try {
		const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', file], { encoding: 'utf8' }));
		return { width: j.streams?.[0]?.width || null, height: j.streams?.[0]?.height || null, duration: Number(j.format?.duration) || null };
	} catch {
		return { width: null, height: null, duration: null };
	}
}

// A clip under content/: "![alt](wall/clip.mp4#poster=2 "Title")". Its poster is <name>.jpg or .webp next to it, or
// a frame from ffmpeg; captions are <name>.vtt next to it.
function contentClip(spec, ctx) {
	const [rel, frag] = decodeURIComponent(spec).split('#');
	const clip = contentMedia(rel, ctx, 'clip');
	if (!clip) {
		return null;
	}
	const base = clip.file.replace(/\.[^.]+$/, '');
	const poster = ['.jpg', '.webp', '.png'].map(e => base + e).find(p => fs.existsSync(p));
	let posterSrc = poster ? contentMedia(path.relative(CONTENT, poster), ctx, 'poster').src : null;
	if (!posterSrc && hasFfmpeg()) {
		const at = frag?.match(/poster=([\d.]+)/)?.[1] || '1';
		const out = path.join(MEDIA_CACHE, `${path.basename(clip.src, path.extname(clip.src))}-poster-${at.replace('.', '_')}s.jpg`);
		if (!fs.existsSync(out)) {
			try {
				execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', at, '-i', clip.file, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', out], { stdio: 'ignore' });
			} catch {
				// no poster: the browser shows the first frame once it loads
			}
		}
		posterSrc = fs.existsSync(out) ? `media/${path.basename(out)}` : null;
	}
	const vtt = fs.existsSync(`${base}.vtt`) ? contentMedia(path.relative(CONTENT, `${base}.vtt`), ctx, 'captions').src : null;
	const p = probe(clip.file);
	return { src: clip.src, poster: posterSrc, captions: vtt, width: p.width || 16, height: p.height || 10, duration: p.duration };
}

// "key: value" lines, one per line; a key that can repeat (like link) collects a list.
function blockFields(text, lists = []) {
	const fields = Object.fromEntries(lists.map(k => [k, []]));
	for (const line of text.split('\n')) {
		const m = line.match(/^\s*([a-z-]+):\s*(.*?)\s*$/);
		if (!m) {
			continue;
		}
		if (lists.includes(m[1])) {
			fields[m[1]].push(m[2]);
		} else {
			fields[m[1]] = m[2];
		}
	}
	return fields;
}

// A ```figure block: one screenshot (still, alt, caption), paths under content/. The site is light, so a light
// capture (still-light) wins when there is one.
function renderFigure(text, ctx) {
	const fields = blockFields(text);
	const rel = fields['still-light'] || fields.still;
	const still = rel ? contentMedia(rel, ctx, 'figure image') : null;
	if (!still) {
		return '';
	}
	const size = still.width && still.height ? ` width="${still.width}" height="${still.height}"` : '';
	return `<figure class="shot shot-figure"><img src="${esc(still.src)}" alt="${esc(fields.alt || '')}"${size} loading="lazy" decoding="async">${fields.caption ? `<figcaption>${renderInline(fields.caption, ctx)}</figcaption>` : ''}</figure>\n`;
}

// A ```flow block (the Intro page): the map of the whole flow, drawn by src/flow.mjs. The block has its alt text and
// the legend, one line per shade: "legend: <kind> | <title> | <module name or nothing> | <text>".
function renderFlowBlock(text, ctx) {
	const fields = blockFields(text, ['legend']);
	const legend = fields.legend.map(line => {
		const [kind, title, module, ...rest] = line.split('|').map(s => s.trim());
		return { kind, title, module, text: rest.join(' | ') };
	});
	return renderFlow({ alt: fields.alt || '', legend }, { esc, icons: ICONS, mod: name => moduleRef(name, ctx.page) });
}

// A ```wall block (the Intro): a wall of tiles, one per feature or prototype, each with a real capture. Tiles are
// separated by a blank line, one "key: value" per line: label, mark (In VS Code and Live get the accent; In review,
// Prototype), still (or still-light, which wins), or loop with its poster, alt, fit: contain with bg (the capture's
// own edge color, for one that isn't 16:10), text, link (url | label, one or more), credit, and size: wide for a tile
// that spans the wall. Paths are under content/. Loops are muted, load nothing until they play, and play only on
// screen; with reduced motion they wait for Play (site.js).
function renderWall(text, ctx) {
	const tiles = text.split(/\n\s*\n/).map(block => {
		const fields = blockFields(block, ['link']);
		const links = fields.link.map(value => {
			const [href, label] = value.split('|').map(s => s.trim());
			return { href, label: label || href };
		});
		delete fields.link;
		return { ...fields, links };
	}).filter(t => t.label);
	const media = rel => contentMedia(rel, ctx, 'wall media');
	const items = tiles.map(t => {
		const stillRel = t['still-light'] || t.still || t.poster;
		if (!stillRel) {
			report.fixes.push(`${ctx.page}: wall tile "${t.label}" has no still or poster, left out`);
			return '';
		}
		const still = media(stillRel);
		const loop = t.loop ? media(t.loop) : null;
		if (!still || (t.loop && !loop)) {
			return '';
		}
		report.wall.push({ label: t.label, still: stillRel, loop: t.loop || null });
		const size = still.width && still.height ? ` width="${still.width}" height="${still.height}"` : '';
		const picture = `<img src="${esc(still.src)}" alt="${esc(t.alt || '')}"${size} loading="lazy" decoding="async">`;
		const clip = loop ? `<video muted loop playsinline preload="none" aria-hidden="true"><source src="${esc(loop.src)}" type="video/mp4"></video><button type="button" class="wall-play" data-label="${esc(t.label)}" aria-label="Play the clip: ${esc(t.label)}">${icon('play', 'wall-icon-play')}${icon('debug-pause', 'wall-icon-pause')}</button>` : '';
		const classes = ['wall-media', t.fit === 'contain' ? 'wall-contain' : '', loop ? 'wall-has-loop' : ''].filter(Boolean).join(' ');
		const bg = /^#[0-9a-f]{3,8}$/i.test(t.bg || '') ? ` style="--wall-bg: ${t.bg}"` : '';
		const mark = t.mark ? ` <span class="tag wall-mark${/^(in vs code|live)$/i.test(t.mark) ? ' wall-mark-on' : ''}">${esc(t.mark)}</span>` : '';
		const links = t.links.map(l => {
			const external = /^https?:/i.test(l.href);
			return `<a href="${esc(l.href)}"${external ? ' rel="noopener"' : ''}>${esc(l.label)}${external ? '<span class="sr-only"> (opens a web page)</span>' : ''}</a>`;
		}).join('<span class="wall-dot" aria-hidden="true"> · </span>');
		return `<li class="wall-tile${t.size === 'wide' ? ' wall-wide' : ''}"><figure class="wall-figure"><div class="${classes}"${bg}>${picture}${clip}</div><figcaption class="wall-caption"><h3 class="wall-label">${esc(t.label)}${mark}</h3>${t.text ? `<p class="wall-text">${esc(t.text)}</p>` : ''}${links ? `<p class="wall-links">${links}</p>` : ''}${t.credit ? `<p class="wall-credit">${esc(t.credit)}</p>` : ''}</figcaption></figure></li>`;
	}).filter(Boolean);
	return `<div class="wall"><ul class="wall-grid" role="list">${items.join('\n')}</ul></div>\n`;
}

// A ```prs block: the pull request snapshot in content/data/prs.json (tools/refresh-prs.mjs), newest first. The
// first `show` (default 12) are listed; the rest wait in a closed disclosure.
function renderPrs(text, ctx) {
	const fields = blockFields(text);
	const file = contentFile('data/prs.json', ctx.page, 'pull request snapshot');
	if (!file) {
		return '';
	}
	const data = JSON.parse(fs.readFileSync(file, 'utf8'));
	const items = data.items || [];
	const show = Number(fields.show || 12);
	const taken = new Date(data.taken);
	const when = taken.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
	const date = iso => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
	const row = p => `<li class="pr"><span class="tag pr-state pr-${esc(p.status)}">${p.status === 'merged' ? 'Merged' : p.draft ? 'Open draft' : 'Open'}</span><span class="pr-main"><a class="pr-title" href="${esc(p.url)}" rel="noopener">${esc(p.title)}<span class="sr-only"> (opens a web page)</span></a><span class="pr-meta">${esc(p.repo)} #${p.number} · ${esc(date(p.date))}</span></span></li>`;
	const counts = { open: items.filter(p => p.status === 'open').length, merged: items.filter(p => p.status === 'merged').length };
	report.prs = { taken: data.taken, total: items.length, ...counts, repos: [...new Set(items.map(p => p.repo))] };
	const rest = items.slice(show);
	return `<div class="prs">
<p class="prs-summary">${items.length} pull requests in ${report.prs.repos.length} public repositories: ${counts.merged} merged and ${counts.open} open. Snapshot taken ${esc(when)}.</p>
<ol class="pr-list" role="list">${items.slice(0, show).map(row).join('')}</ol>
${rest.length ? `<details class="more"><summary>${icon('chevron-right')}<span>${rest.length} older pull requests</span></summary><div class="more-body"><ol class="pr-list" role="list">${rest.map(row).join('')}</ol></div></details>` : ''}
</div>\n`;
}

// A ```clock block: one line per time, "time | what | link (optional) | note (optional)".
function renderClock(text, ctx) {
	const rows = text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
		const [time, what, link, note] = line.split('|').map(s => (s || '').trim());
		const href = /^module:/.test(link) ? moduleRef(link.slice('module:'.length), ctx.page).href : link;
		const label = href ? `<a href="${esc(href)}">${renderInline(what, ctx)}</a>` : renderInline(what, ctx);
		return `<li><span class="clock-time">${esc(time)}</span><span class="clock-what">${label}${note ? `<span class="clock-note">${renderInline(note, ctx)}</span>` : ''}</span></li>`;
	});
	return `<ol class="clock" role="list">${rows.join('')}</ol>\n`;
}

// A ```callout block: its first line is the title, the rest one line each ("Label: text" gets a bold label).
function renderCallout(text, ctx) {
	const [title = '', ...rest] = text.split('\n').map(l => l.trim()).filter(Boolean);
	return `<aside class="callout"><p class="callout-title">${renderInline(title, ctx)}</p>${rest.map(line => {
		const m = line.match(/^([^:]{2,32}):\s+(.+)$/);
		return `<p>${m ? `<strong>${renderInline(m[1], ctx)}:</strong> ${renderInline(m[2], ctx)}` : renderInline(line, ctx)}</p>`;
	}).join('')}</aside>\n`;
}

function renderMarkdown(md, ctx) {
	return stepAnchors(makeMarked(ctx).parse(md), ctx);
}

function renderInline(md, ctx = { uniqueId: x => x, page: 'inline' }) {
	return makeMarked(ctx).parseInline(String(md || ''));
}

// A list item that starts with {#name} gets that id, so a step can be linked to directly (setup.html#redeem).
function stepAnchors(html, ctx) {
	return html.replace(/<li>(\s*(?:<p>)?)\{#([a-z0-9][a-z0-9-]*)\}\s*/g, (_, lead, id) => `<li id="${ctx.uniqueId(id)}">${lead}`);
}

// ------------------------------------------------------------------ pages

// Course modules take their number from content/course.json. Links between pages use names, so they survive a
// reorder: [Demo videos](module:demo-videos) links to that module's page (module:demo-videos#section for a part of
// it), {n:demo-videos} is its number, and {n} is the page's own number.
function loadPages() {
	const dir = path.join(CONTENT, 'pages');
	const read = (folder, f) => parseFrontmatter(fs.readFileSync(path.join(folder, f), 'utf8').replace(/\r\n/g, '\n'));
	const pages = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => {
		const { data, body } = read(dir, f);
		return { file: f, out: f.replace(/\.md$/, '.html'), ...data, body };
	});
	const groups = COURSE.groups || [];
	const order = groups.flatMap(g => g.modules);
	const groupOf = new Map(groups.flatMap(g => g.modules.map(m => [m, g.title])));
	const modDir = path.join(dir, 'modules');
	const files = fs.existsSync(modDir) ? fs.readdirSync(modDir).filter(f => f.endsWith('.md')).sort() : [];
	for (const f of files) {
		const name = f.replace(/\.md$/, '');
		const at = order.indexOf(name);
		if (at < 0) {
			throw new Error(`content/pages/modules/${f} isn't in content/course.json, so it has no place in the course.`);
		}
		const { data, body } = read(modDir, f);
		if ('number' in data) {
			throw new Error(`content/pages/modules/${f} has a number; module numbers come from content/course.json.`);
		}
		const number = at + 1;
		pages.push({ file: `modules/${f}`, ...data, name, number, group: groupOf.get(name), out: data.out || `module-${pad2(number)}.html`, body });
	}
	for (const name of order) {
		if (!files.includes(`${name}.md`)) {
			throw new Error(`content/course.json lists "${name}", but content/pages/modules/${name}.md isn't there.`);
		}
	}
	const outs = new Map();
	for (const p of pages) {
		if (outs.has(p.out)) {
			throw new Error(`${p.file} and ${outs.get(p.out)} both build ${p.out}.`);
		}
		outs.set(p.out, p.file);
	}
	const byName = new Map(pages.filter(p => p.name).map(p => [p.name, p]));
	const lookup = (name, where) => {
		const p = byName.get(name);
		if (!p) {
			throw new Error(`${where} links to the module "${name}", which isn't in content/course.json.`);
		}
		return p;
	};
	for (const p of pages) {
		const fix = text => String(text)
			.replace(/\(module:([a-z0-9-]+)(#[^)\s]*)?\)/g, (_, name, anchor) => `(${lookup(name, p.file).out}${anchor || ''})`)
			.replace(/\{n:([a-z0-9-]+)\}/g, (_, name) => String(lookup(name, p.file).number))
			.replace(/\{n\}/g, () => String(p.number ?? ''));
		p.body = fix(p.body);
		for (const k of ['title', 'short', 'description', 'lead', 'eyebrow']) {
			if (typeof p[k] === 'string') {
				p[k] = fix(p[k]);
			}
		}
	}
	return pages.sort((a, b) => a.out.localeCompare(b.out));
}

const pages = loadPages();
const modulePages = pages.filter(p => typeof p.number === 'number').sort((a, b) => a.number - b.number);

function moduleRef(name, where) {
	const p = modulePages.find(x => x.name === name);
	if (!p) {
		throw new Error(`${where} links to the module "${name}", which isn't in content/course.json.`);
	}
	return { number: p.number, href: p.out, short: p.short || p.title };
}

function idFactory() {
	const used = new Set(['main', 'site-nav', 'live']);
	return base => {
		let id = base;
		let i = 2;
		while (used.has(id)) {
			id = `${base}-${i++}`;
		}
		used.add(id);
		return id;
	};
}

// A page's sections: [{ heading, id, html, collapsed }]. The text before the first section heading is the intro.
function buildSections(page, uniqueId) {
	const ctx = { number: page.number, page: page.file, uniqueId };
	return splitSections(page.body, 2).map(s => {
		const parts = s.heading ? headingParts(s.heading) : { heading: null, id: null, collapsed: false };
		// heading is HTML (inline Markdown rendered, so `code` works); plain is its text, for ids and comparisons.
		const heading = parts.heading ? renderInline(parts.heading, ctx) : null;
		const plain = heading ? heading.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&') : null;
		const id = heading ? uniqueId(parts.id || slug(plain)) : null;
		const html = s.body.trim() ? renderMarkdown(s.body, ctx) : '';
		return { heading, plain, id, html, collapsed: parts.collapsed };
	});
}

function renderSectionsHtml(sections, { skip = [] } = {}) {
	return sections.filter(s => s.heading && !skip.includes(s.plain.toLowerCase())).map(s => {
		if (!s.html.trim()) {
			return '';
		}
		const kind = slug(s.plain);
		// Everything after a <!-- collapsed: label --> comment sits in a disclosure, closed by default.
		let body = s.html;
		const marker = body.match(/<!--COLLAPSE (\S+)-->/);
		if (marker) {
			const before = body.slice(0, marker.index);
			const after = body.slice(marker.index + marker[0].length);
			body = after.replace(/<[^>]+>/g, '').trim()
				? `${before}<details class="more"><summary>${icon('chevron-right')}<span>${esc(decodeURIComponent(marker[1]))}</span></summary><div class="more-body">${after}</div></details>`
				: before;
		}
		if (s.collapsed) {
			return `<section class="section section-${kind} section-collapsible" aria-labelledby="${s.id}">
<details class="section-details"><summary>${icon('chevron-right')}<h2 id="${s.id}">${s.heading}</h2></summary>
<div class="section-body">${body}</div>
</details>
</section>`;
		}
		return `<section class="section section-${kind}" aria-labelledby="${s.id}">
<h2 id="${s.id}">${s.heading}</h2>
${body}
</section>`;
	}).join('\n');
}

// ------------------------------------------------------------------ videos

// content/videos.json maps a key (a module's name, or "uninstall") to its files under content/: file (the .mp4),
// captions (the .vtt, which also becomes the transcript at the end of the page), poster (optional) and note (what's
// real in it, shown under the video). Until a file is there, the page shows nothing: no placeholder.
function resolveVideo(key) {
	const conf = VIDEOS.videos?.[key];
	const entry = { key, kind: 'none', conf: conf || {} };
	if (!conf || !conf.file) {
		report.videos.push({ key, state: 'no entry' });
		return entry;
	}
	const file = path.resolve(CONTENT, conf.file);
	if (!fs.existsSync(file)) {
		report.videos.push({ key, state: `waiting for ${conf.file}` });
		return entry;
	}
	const ext = path.extname(file).toLowerCase();
	const stem = `videos/${key}`;
	copyIfChanged(file, path.join(OUT, `${stem}${ext}`));
	Object.assign(entry, { kind: 'local', src: `${stem}${ext}`, path: file });
	const vtt = conf.captions ? path.resolve(CONTENT, conf.captions) : file.replace(/\.[^.]+$/, '.vtt');
	if (fs.existsSync(vtt)) {
		copyIfChanged(vtt, path.join(OUT, `${stem}.vtt`));
		entry.captions = `${stem}.vtt`;
		entry.captionsPath = vtt;
	}
	const poster = conf.poster ? path.resolve(CONTENT, conf.poster) : ['.jpg', '.png', '.webp'].map(e => file.replace(/\.[^.]+$/, e)).find(p => fs.existsSync(p));
	if (poster && fs.existsSync(poster)) {
		const out = `${stem}-poster${path.extname(poster).toLowerCase()}`;
		copyIfChanged(poster, path.join(OUT, out));
		entry.poster = out;
	} else if (hasFfmpeg()) {
		const out = `${stem}-poster.jpg`;
		const abs = path.join(OUT, out);
		if (!fs.existsSync(abs) || fs.statSync(abs).mtimeMs < fs.statSync(file).mtimeMs) {
			try {
				execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(conf.posterAt ?? VIDEOS.posterAt ?? 2), '-i', file, '-frames:v', '1', '-vf', 'scale=1600:-2', '-q:v', '3', abs], { stdio: 'ignore' });
			} catch {
				// no poster: the browser shows the first frame
			}
		}
		if (fs.existsSync(abs)) {
			entry.poster = out;
		}
	}
	Object.assign(entry, probe(file));
	entry.bytes = fs.statSync(file).size;
	report.videos.push({ key, state: 'shown', megabytes: +(entry.bytes / 1e6).toFixed(1), captions: Boolean(entry.captions), poster: Boolean(entry.poster), note: Boolean(conf.note) });
	if (entry.bytes > 95e6) {
		report.fixes.push(`${key}: the video is ${(entry.bytes / 1e6).toFixed(0)} MB; GitHub refuses files over 100 MB`);
	}
	return entry;
}

function formatDuration(sec) {
	if (!sec) {
		return '';
	}
	const m = Math.floor(sec / 60);
	const s = Math.round(sec % 60);
	return m ? `${m} min${s ? ` ${s} s` : ''}` : `${s} s`;
}

function videoSlot(title, video, transcriptId) {
	if (video?.kind !== 'local') {
		return '';
	}
	const ratio = video.width && video.height ? `${video.width} / ${video.height}` : '16 / 9';
	const real = whatsReal(video);
	const meta = [
		video.duration ? `<span class="video-length">${esc(formatDuration(video.duration))}</span>` : '',
		transcriptId ? `<a href="#${esc(transcriptId)}">Transcript</a>` : '',
	].filter(Boolean).join('<span class="video-meta-dot" aria-hidden="true">·</span>') + (real ? `<span class="video-real">${esc(real)}</span>` : '');
	return `<figure class="video" style="--ratio: ${ratio}">
<div class="video-frame"><video controls preload="metadata" playsinline${video.poster ? ` poster="${esc(video.poster)}"` : ''} aria-label="${esc(`Video: ${title}`)}">
<source src="${esc(video.src)}" type="video/mp4">
${video.captions ? `<track kind="captions" src="${esc(video.captions)}" srclang="en" label="English" default>` : ''}
</video></div>
${meta ? `<figcaption class="video-meta">${icon('device-camera-video')}${meta}</figcaption>` : ''}
</figure>`;
}

// ------------------------------------------------------------------ transcripts

function whatsReal(video) {
	const vtt = video?.captionsPath && fs.existsSync(video.captionsPath) ? parseVtt(fs.readFileSync(video.captionsPath, 'utf8')).note : null;
	return [video?.conf?.note || vtt, video?.conf?.extraNote].filter(Boolean).join(' ');
}

const vttSeconds = t => t.split(':').map(Number).reduce((acc, x) => acc * 60 + x, 0);

// The spoken lines of a .vtt, in order, plus the first NOTE block (a fallback for what's real).
function parseVtt(text) {
	const cues = [];
	let note = null;
	for (const block of text.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '').split(/\n{2,}/)) {
		const lines = block.split('\n').filter(l => l.trim());
		if (!lines.length) {
			continue;
		}
		if (/^NOTE\b/.test(lines[0])) {
			note ??= [lines[0].replace(/^NOTE\b\s*/, ''), ...lines.slice(1)].join(' ').trim() || null;
			continue;
		}
		const at = lines.findIndex(l => l.includes('-->'));
		if (at < 0) {
			continue;
		}
		const [start, end] = lines[at].split('-->').map(s => vttSeconds(s.trim().split(/\s+/)[0]));
		const words = lines.slice(at + 1).join(' ')
			.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
			.replace(/\s+[\u2013\u2014]\s+/g, ', ').replace(/[\u2013\u2014]/g, ', ')
			.replace(/\s+/g, ' ')
			.trim();
		if (words) {
			cues.push({ start, end, words });
		}
	}
	return { cues, note };
}

// The transcript, from the video's own .vtt: its cues joined into paragraphs at the pauses between spoken lines.
function transcriptSection(video, id) {
	if (video?.kind !== 'local' || !video.captionsPath) {
		return '';
	}
	const { cues } = parseVtt(fs.readFileSync(video.captionsPath, 'utf8'));
	if (!cues.length) {
		return '';
	}
	const paragraphs = [];
	let current = [];
	let lastEnd = null;
	for (const cue of cues) {
		const ended = /[.!?]["')]?$/.test(current[current.length - 1] || '');
		const pause = lastEnd !== null && cue.start - lastEnd >= 0.3 && ended;
		const long = current.join(' ').length > 420 && ended;
		if (current.length && (pause || long)) {
			paragraphs.push(current.join(' '));
			current = [];
		}
		current.push(cue.words);
		lastEnd = cue.end;
	}
	if (current.length) {
		paragraphs.push(current.join(' '));
	}
	return `<section class="section section-transcript section-collapsible" aria-labelledby="${id}">
<details class="section-details"><summary>${icon('chevron-right')}<h2 id="${id}">Transcript</h2></summary>
<div class="section-body transcript">
${paragraphs.map(p => `<p>${esc(p)}</p>`).join('\n')}
</div>
</details>
</section>`;
}

// ------------------------------------------------------------------ layout

let ASSET_V = '';
// The Horizon kit (src/assets/horizon/, synced as is by tools/sync-horizon.mjs) draws the home page's hero and the
// strip under the header on inner pages. Without it, the site builds and reads the same, with no band.
const HORIZON = fs.existsSync(path.join(ROOT, 'src/assets/horizon/horizon.js')) && fs.existsSync(path.join(ROOT, 'src/assets/site-horizon.js'));

function header(active) {
	const items = SITE.nav.map(n => `<li><a href="${esc(n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('');
	return `<a class="skip" href="#main">Skip to content</a>
<header class="top">
<div class="top-inner">
<a class="brand" href="index.html">${esc(SITE.title)}</a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icon('menu', 'menu-open')}${icon('close', 'menu-close')}<span>Menu</span></button>
<nav id="site-nav" class="nav" aria-label="Site"><ul>${items}</ul></nav>
</div>
</header>`;
}

function footer() {
	return `<footer class="foot">
<div class="foot-inner">
${SITE.footer.map(line => `<p>${renderInline(line)}</p>`).join('\n')}
</div>
</footer>`;
}

function layout({ title, description, bodyClass, active, main, noindex = false, base = null, bare = false, strip = !bare }) {
	const fullTitle = title === SITE.title ? `${SITE.title} · ${SITE.series}` : `${title} · ${SITE.title}`;
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${base ? `<base href="${esc(base)}">\n` : ''}<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || SITE.description)}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#ffffff">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${HORIZON ? '<link rel="preload" href="assets/horizon/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>\n' : ''}${HORIZON ? `<link rel="stylesheet" href="assets/horizon/horizon.css?v=${ASSET_V}">\n` : ''}<link rel="stylesheet" href="assets/theme.css?v=${ASSET_V}">
<link rel="stylesheet" href="assets/site.css?v=${ASSET_V}">
<script>document.documentElement.classList.add('js');if(/[?&]motion=off\\b/.test(location.search))document.documentElement.dataset.motion='off';</script>
<script src="assets/site.js?v=${ASSET_V}" defer></script>
${HORIZON ? `<script src="assets/horizon/horizon.js?v=${ASSET_V}" defer></script>\n<script src="assets/site-horizon.js?v=${ASSET_V}" defer></script>\n` : ''}</head>
<body class="${esc(bodyClass)}">
${bare ? '' : header(active)}
${strip ? '<div class="page-horizon" data-horizon="strip" aria-hidden="true"></div>\n' : ''}${main}
${bare ? '' : footer()}
<div id="live" class="sr-only" aria-live="polite"></div>
</body>
</html>
`;
}

// The sidebar's list: each group's title, then its modules.
function moduleNavList(current, cls) {
	return (COURSE.groups || []).map(g => {
		const items = g.modules.map(name => modulePages.find(p => p.name === name)).map(p => `<li><a href="${esc(p.out)}"${p === current ? ' aria-current="page"' : ''}><span class="num">${p.number}</span><span class="label">${esc(p.short || p.title)}</span></a></li>`).join('');
		return `<p class="module-group">${esc(g.title)}</p><ol class="${cls}">${items}</ol>`;
	}).join('');
}

function pager(page) {
	const i = modulePages.indexOf(page);
	const prev = modulePages[i - 1];
	const next = modulePages[i + 1] || (SITE.afterCourse ? { out: SITE.afterCourse.href, title: SITE.afterCourse.label } : null);
	const link = (p, dir) => (p ? `<a class="pager-${dir}" href="${esc(p.out)}"><span class="pager-dir">${dir === 'prev' ? `${icon('arrow-left')} Previous` : `Next ${icon('arrow-right')}`}</span><span class="pager-title">${p.number ? `${p.number}. ` : ''}${esc(p.short || p.title)}</span></a>` : '<span></span>');
	return `<nav class="pager" aria-label="Previous and next module">${link(prev, 'prev')}${link(next, 'next')}</nav>`;
}

function renderModulePage(page) {
	const uniqueId = idFactory();
	const sections = buildSections(page, uniqueId);
	const intro = sections.find(s => !s.heading);
	const why = sections.find(s => s.heading && /^why$/i.test(s.plain));
	const lead = why ? why.html : (intro?.html || '');
	const video = page.video === false ? null : resolveVideo(page.name);
	const transcriptId = video?.kind === 'local' && video.captionsPath ? uniqueId('transcript') : null;
	const transcript = transcriptId ? transcriptSection(video, transcriptId) : '';
	const eyebrow = page.eyebrow || `Module ${page.number}${page.group ? ` · ${page.group}` : ''}`;
	const main = `<div class="page-wrap with-sidebar">
<aside class="sidebar" aria-label="All modules">
${moduleNavList(page, 'module-list')}
</aside>
<main id="main" class="content" tabindex="-1">
<details class="modules-disclosure"><summary>${icon('chevron-right')}<span>All modules</span></summary><div class="modules-inline">${moduleNavList(page, 'module-list module-list-inline')}</div></details>
<header class="page-head">
<p class="eyebrow">${esc(eyebrow)}</p>
<h1>${esc(page.title)}</h1>
${lead ? `<div class="lead">${lead}</div>` : ''}
</header>
${videoSlot(page.title, video, transcriptId)}
${intro && why ? `<div class="section-intro">${intro.html}</div>` : ''}
${renderSectionsHtml(sections, { skip: ['why'] })}
${transcript}
${pager(page)}
</main>
</div>`;
	return layout({ title: page.title, description: page.description, bodyClass: `page-module page-${page.name}`, active: page.name === 'setup' ? 'setup' : 'course', main });
}

function renderDocPage(page) {
	const uniqueId = idFactory();
	const sections = buildSections(page, uniqueId);
	const intro = sections.find(s => !s.heading);
	const toc = page.toc ? `<nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ul>${sections.filter(s => s.heading && s.html.trim()).map(s => `<li><a href="#${s.id}">${s.heading}</a></li>`).join('')}</ul></nav>` : '';
	const video = page.video ? resolveVideo(page.video) : null;
	const transcriptId = video?.kind === 'local' && video.captionsPath ? uniqueId('transcript') : null;
	const main = `<div class="page-wrap doc">
<main id="main" class="content" tabindex="-1">
<header class="page-head">
${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ''}
<h1>${esc(page.title)}</h1>
${intro?.html ? `<div class="lead">${intro.html}</div>` : ''}
</header>
${videoSlot(page.title, video, transcriptId)}
${toc}
${renderSectionsHtml(sections)}
${transcriptId ? transcriptSection(video, transcriptId) : ''}
</main>
</div>`;
	return layout({
		title: page.title,
		description: page.description,
		bodyClass: `page-doc page-${slug(page.out.replace('.html', ''))}`,
		active: page.key,
		main,
		noindex: Boolean(page.noindex),
		base: page.out === '404.html' && SITE.basePath ? SITE.basePath : null,
	});
}

// The home page: the hero (the series, the title, when and where, the host, the lede and two buttons) over the
// Horizon band, then the page's own sections, each with its title beside it.
function renderHome(page) {
	const uniqueId = idFactory();
	const sections = buildSections(page, uniqueId);
	const intro = sections.find(s => !s.heading);
	const main = `<main id="main" class="home" tabindex="-1">
<section class="hero" data-horizon="hero" aria-labelledby="hero-title">
<div class="hero-text">
<p class="hero-series">${esc(SITE.series)}</p>
<h1 id="hero-title" class="hero-title">${SITE.titleLines.map(esc).join('<br>')}</h1>
<div>
<p class="hero-when">${esc(SITE.when)}</p>
<p class="hero-host">${esc(SITE.host)}</p>
${intro?.html ? `<div class="hero-lede">${intro.html}</div>` : ''}
<p class="actions">${(page.actions || SITE.actions || []).map((a, i) => `<a class="button${i === 0 ? ' button-primary' : ''}" href="${esc(a.href)}">${esc(a.label)}${i === 0 ? icon('arrow-right') : ''}</a>`).join('')}</p>
</div>
</div>
<button class="hero-pause" type="button" hidden>${icon('debug-pause', 'when-playing')}${icon('play', 'when-paused')}<span class="hero-pause-label sr-only">Pause the animation</span></button>
</section>
<div class="home-body">
${sections.filter(sec => sec.heading && sec.html.trim()).map(sec => `<section class="home-section" aria-labelledby="${sec.id}"><div class="home-grid"><h2 class="home-title" id="${sec.id}">${sec.heading}</h2><div class="home-content">${sec.html}</div></div></section>`).join('\n')}
</div>
</main>`;
	return layout({ title: SITE.title, description: page.description || SITE.description, bodyClass: 'page-home', active: 'home', main, strip: false });
}

// The agenda (unlisted): Eli's run of show for the evening, built for a phone. No site header or footer, a row of
// times to jump between, and every step as a card.
function renderAgenda(page) {
	const uniqueId = idFactory();
	const sections = buildSections(page, uniqueId);
	const intro = sections.find(s => !s.heading);
	const steps = sections.filter(s => s.heading);
	const time = h => (h.match(/^(\d{1,2}:\d{2})/) || [])[1] || '';
	const jump = `<nav class="agenda-jump" aria-label="Times"><ol role="list">${steps.map(s => `<li><a href="#${s.id}">${esc(time(s.plain) || s.plain.slice(0, 14))}</a></li>`).join('')}</ol></nav>`;
	const cards = steps.map(s => `<section class="agenda-step" aria-labelledby="${s.id}">
<h2 id="${s.id}">${s.heading}</h2>
${s.html}
</section>`).join('\n');
	const main = `<main id="main" class="agenda" tabindex="-1">
<header class="agenda-head">
<p class="eyebrow">${esc(page.eyebrow || 'Run of show')}</p>
<h1>${esc(page.title)}</h1>
${intro?.html ? `<div class="agenda-intro">${intro.html}</div>` : ''}
</header>
${jump}
${cards}
</main>`;
	return layout({ title: page.title, description: page.description, bodyClass: 'page-agenda', active: 'none', main, noindex: true, bare: true });
}

// ------------------------------------------------------------------ report

function writeReport(pagesBuilt) {
	const lines = ['# Build report', '', `Built ${report.built}. This file is rewritten on every build.`, ''];
	lines.push('## Pages', '', ...pagesBuilt.map(p => `- ${p}`), '');
	lines.push('## Videos', '', '| Key | State | MB | Captions | Poster | Note |', '|---|---|---|---|---|---|');
	for (const v of report.videos) {
		lines.push(`| ${v.key} | ${v.state} | ${v.megabytes ?? ' '} | ${v.captions ? 'yes' : ' '} | ${v.poster ? 'yes' : ' '} | ${v.state === 'shown' ? (v.note ? 'yes' : 'MISSING') : ' '} |`);
	}
	lines.push('', '## The wall', '', ...report.wall.map(w => `- ${w.label}: ${w.still}${w.loop ? `, ${w.loop}` : ''}`), '');
	lines.push('## Pull request snapshot', '', report.prs ? `${report.prs.total} pull requests (${report.prs.merged} merged, ${report.prs.open} open), taken ${report.prs.taken}, from ${report.prs.repos.join(', ')}.` : 'Not shown.', '');
	lines.push('## Left out or fixed', '');
	const fixes = [...new Set(report.fixes)];
	lines.push(...(fixes.length ? fixes.map(f => `- ${f}`) : ['- nothing']), '');
	mkdirp(path.join(ROOT, 'work'));
	fs.writeFileSync(path.join(ROOT, 'work/build-report.md'), lines.join('\n'));
}

// ------------------------------------------------------------------ main

function main() {
	mkdirp(OUT);
	copyDir(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'));
	pruneTo(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'));
	ASSET_V = hash(['theme.css', 'site.css', 'site.js', 'site-horizon.js', 'horizon/horizon.js', 'horizon/horizon.css'].map(f => {
		const p = path.join(ROOT, 'src/assets', f);
		return fs.existsSync(p) ? fs.readFileSync(p) : '';
	}).join('\n'));
	fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
	for (const c of SITE.copy || []) {
		const from = contentFile(c.from, 'site.json', 'download');
		if (from) {
			copyIfChanged(from, path.join(OUT, c.to));
		}
	}
	const written = new Set(['.nojekyll']);
	const html = new Map();
	for (const page of pages) {
		let out;
		if (page.layout === 'home') {
			out = renderHome(page);
		} else if (page.layout === 'agenda') {
			out = renderAgenda(page);
		} else if (typeof page.number === 'number') {
			out = renderModulePage(page);
		} else {
			out = renderDocPage(page);
		}
		html.set(page.out, out);
	}
	// Media: what pages use is copied into dist/media; anything no page uses leaves.
	const REF = /\b(media|videos|downloads)\/[A-Za-z0-9._~%-]+/g;
	const refs = new Set();
	for (const out of html.values()) {
		for (const m of out.matchAll(REF)) {
			refs.add(m[0]);
		}
	}
	for (const ref of refs) {
		if (ref.startsWith('media/')) {
			const from = path.join(MEDIA_CACHE, ref.slice('media/'.length));
			if (fs.existsSync(from)) {
				copyIfChanged(from, path.join(OUT, ref));
			}
		}
	}
	for (const dir of ['media', 'videos']) {
		const abs = path.join(OUT, dir);
		if (!fs.existsSync(abs)) {
			continue;
		}
		for (const f of fs.readdirSync(abs)) {
			if (!refs.has(`${dir}/${f}`)) {
				fs.rmSync(path.join(abs, f), { recursive: true });
			}
		}
	}
	for (const [out, text] of html) {
		fs.writeFileSync(path.join(OUT, out), text);
		written.add(out);
	}
	// Pages removed from content/ leave no stale copies behind.
	for (const f of fs.readdirSync(OUT)) {
		if (f.endsWith('.html') && !written.has(f)) {
			fs.rmSync(path.join(OUT, f));
		}
	}
	writeReport([...html.keys()]);
	console.log(JSON.stringify({ out: path.relative(ROOT, OUT) || OUT, pages: html.size, videos: report.videos.filter(v => v.state === 'shown').length, wall: report.wall.length, prs: report.prs?.total ?? 0, notes: new Set(report.fixes).size }));
}

main();
