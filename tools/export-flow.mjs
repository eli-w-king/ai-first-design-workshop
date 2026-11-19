#!/usr/bin/env node
// Saves "How I work right now" (the Intro's flow, src/flow.mjs) as one standalone light SVG, for the slide deck.
//   node tools/export-flow.mjs [out.svg ...]
// Writes work/how-i-work.svg, plus a copy at each path given. Its colors come from src/assets/theme.css, so the
// export follows the theme. Text is set in Inter, with the system font as the fallback where Inter isn't installed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flowSvg } from '../src/flow.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const theme = fs.readFileSync(path.join(ROOT, 'src/assets/theme.css'), 'utf8');
const token = name => {
	const m = theme.match(new RegExp(`${name}:\\s*([^;]+);`));
	if (!m) {
		throw new Error(`theme.css has no ${name}`);
	}
	return m[1].trim();
};
const icons = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/icons.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rgb = v => `rgb(${v.split(/\s+/).join(',')})`;
const rgba = (v, a) => `rgba(${v.split(/\s+/).join(',')},${a})`;
const night = token('--flow-night');
const box = token('--flow-box');
const font = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
const css = `
.flow-ground, .flow-fill, .flow-knockout { fill: ${token('--bg')}; }
.flow-ink { fill: none; stroke: ${token('--text')}; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; }
.flow-edge { stroke: ${token('--muted')}; }
.flow-dim .flow-ink { stroke: ${token('--muted')}; stroke-dasharray: 4 5; }
.flow-dim .flow-label { fill: ${token('--muted')}; }
.flow-pick .flow-ink { stroke: ${token('--accent')}; stroke-width: 1.6; }
text { font-family: ${font}; }
.flow-label { fill: ${token('--heading')}; font-size: 14px; font-weight: 500; }
.flow-sub, .flow-note { fill: ${token('--muted')}; font-size: 12px; font-weight: 400; }
.flow-head { fill: ${token('--muted')}; font-size: 12px; font-weight: 500; }
.flow-glyph { fill: ${token('--heading')}; }
.flow-zone-night .flow-zone-fill { fill: ${rgba(night, 0.06)}; }
.flow-zone-night .flow-hachure { fill: none; stroke: ${rgba(night, 0.22)}; stroke-width: 1; stroke-linecap: round; }
.flow-zone-night .flow-zone-edge { fill: none; stroke: ${rgba(night, 0.6)}; stroke-width: 1.2; stroke-linecap: round; }
.flow-zone-box .flow-zone-fill { fill: ${rgba(box, 0.06)}; }
.flow-zone-box .flow-hachure { fill: none; stroke: ${rgba(box, 0.22)}; stroke-width: 1; stroke-linecap: round; }
.flow-zone-box .flow-zone-edge { fill: none; stroke: ${rgba(box, 0.6)}; stroke-width: 1.2; stroke-linecap: round; }
.flow-zone-label { font-size: 13px; font-weight: 600; }
text.flow-zone-night { fill: ${rgb(night)}; }
text.flow-zone-box { fill: ${rgb(box)}; }
.flow-knockout-box { fill: #f1f8f9; }
`.trim().replace(/\n/g, ' ');
const alt = 'How I work right now. Build the design context. The orchestrator takes a marked-up screenshot, makes the initial build and iterates on it, then tests it in the browser for bugs. Variations, one session each, in one lab. The ones we like each get a branch, a demo video and a PR, all on one page for everyone, built overnight on another computer or a caffeinated machine. Send to stakeholders. Feedback from a meeting transcript, a PR review and a feedback document narrows it to your pick. Your pick goes to an unmoderated study, user feedback and synthesis, and the next iteration goes back to the study. At the end, in parallel: the final version and its PR go to a developer, and the final video and research insights go to stakeholders.';
const svg = flowSvg({ esc, icons, alt, css });
const outs = [path.join(ROOT, 'work/how-i-work.svg'), ...process.argv.slice(2).map(p => path.resolve(p))];
for (const out of outs) {
	fs.mkdirSync(path.dirname(out), { recursive: true });
	fs.writeFileSync(out, svg);
	console.log(out);
}
