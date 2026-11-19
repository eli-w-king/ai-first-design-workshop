// The Intro page's map of how Eli works right now: a ```flow block in a page (renderFlowBlock in build.mjs).
//
// It's drawn the way Excalidraw draws: every line twice and a little loose, from a fixed seed per shape, so every
// build draws the same picture. Two layouts: wide from tablet width up, tall on phones (site.css, .flow). Colors come
// from the theme's tokens. The shading is the legend's: overnight, and another computer; the people parts (ovals)
// stay unshaded. Module numbers are HTML links placed over the drawing, so they're real links with real focus, and
// the drawing itself is one image with the block's alt text. tools/export-flow.mjs saves the wide one as an SVG.
//
// The words are in NODES (shared by both layouts), the places in wide() and tall(): [x, y, width, height] in the
// layout's own units, which are CSS pixels at full size, and optionally the node's own lines for that layout.

export const NODES = {
	context: { lines: ['Build the design context', 'sketches, a clear problem, success criteria'], module: 'case-study' },
	orch: { lines: ['The orchestrator', 'one main session'], module: 'open-on-localhost' },
	markup: { lines: ['Marked-up screenshot', 'your notes on the real app'], module: 'mark-up' },
	build: { lines: ['The initial build', 'iterate on the base design'], module: 'mark-up' },
	test: { lines: ['Browser testing', 'finds and fixes bugs'], module: 'test-in-the-browser' },
	vars: { lines: ['Variations', 'one session each'], module: 'parallel-sessions' },
	v1: { lines: ['Variation 1'] },
	v2: { lines: ['Variation 2'] },
	v3: { lines: ['Variation 3'] },
	v4: { lines: ['Variation 4'], style: 'dim' },
	page: { lines: ['A page for everyone', 'videos, branches, PRs'], module: 'page-for-everyone' },
	send: { lines: ['Send to stakeholders', 'one link to the page'] },
	transcript: { lines: ['Meeting transcript'], shape: 'oval' },
	review: { lines: ['PR review'], shape: 'oval' },
	doc: { lines: ['Feedback document'], shape: 'oval' },
	feedback: { lines: ['All the feedback', 'read in one place'] },
	pick: { lines: ['Your pick', 'narrowed to one'], style: 'pick' },
	study: { lines: ['Unmoderated study', 'your pick, tested'], module: 'automated-research' },
	users: { lines: ['User feedback'], shape: 'oval' },
	synth: { lines: ['Synthesis', 'findings, next steps'], module: 'synthesis' },
	next: { lines: ['Next iteration', 'with a PR'] },
	final: { lines: ['Final version', 'and its PR'] },
	insights: { lines: ['Final video', 'and research insights'] },
	dev: { lines: ['A developer'], shape: 'oval' },
	stake: { lines: ['Stakeholders'], shape: 'oval' },
};
export const ZONES = {
	night: { label: 'Overnight, on another computer or a caffeinated machine', module: 'overnight' },
	box: { label: 'On another computer or a caffeinated machine', module: 'another-computer' },
};
const WORDS = {
	lab: 'In one lab', branch: 'Branch', video: 'Video', pr: 'PR', notPicked: 'not picked',
	nextRound: 'Next round, narrowing to one', again: 'Test it again', parallel: 'In parallel',
};
const GLYPHS = ['git-branch', 'device-camera-video', 'git-pull-request'];

// ------------------------------------------------------------------ layouts

// Edges are lists of segments: ['M', x, y], ['L', x, y] or ['C', x1, y1, x2, y2, x, y]. They stop 3 units short of a
// shape, so the arrowhead shows whole.
function wide() {
	const rows = [244, 290, 336, 382];
	const cols = [396, 468, 540];
	const fb = [512, 562, 612];
	return {
		w: 760, h: 992,
		zones: [
			{ kind: 'night', box: [0, 186, 760, 272], label: [318, 178], badge: [728, 173] },
			{ kind: 'box', box: [164, 668, 470, 112], label: [168, 660], badge: [498, 655] },
		],
		nodes: {
			context: [16, 0, 300, 52],
			orch: [16, 84, 136, 52], markup: [184, 84, 172, 52], build: [388, 84, 180, 52], test: [600, 84, 146, 52],
			vars: [16, 285, 136, 56],
			v1: [204, rows[0] - 20, 140, 40], v2: [204, rows[1] - 20, 140, 40], v3: [204, rows[2] - 20, 140, 40], v4: [204, rows[3] - 20, 140, 40],
			page: [584, 262, 162, 64],
			send: [584, 500, 162, 52],
			transcript: [384, fb[0] - 20, 160, 40], review: [384, fb[1] - 20, 160, 40], doc: [384, fb[2] - 20, 160, 40],
			feedback: [184, 534, 164, 56],
			pick: [16, 538, 136, 48],
			study: [172, 704, 150, 52], synth: [342, 704, 132, 60], next: [494, 704, 132, 52],
			users: [262, 806, 148, 44],
			final: [440, 856, 146, 52], insights: [602, 856, 146, 52],
			dev: [453, 946, 120, 44], stake: [609, 946, 132, 44],
		},
		texts: [
			{ at: [274, 212], text: WORDS.lab, cls: 'flow-head', badge: [318, 207], module: 'variation-labs' },
			{ at: [cols[0], 212], text: WORDS.branch, cls: 'flow-head' },
			{ at: [cols[1], 212], text: WORDS.video, cls: 'flow-head', badge: [499, 207], module: 'demo-videos' },
			{ at: [cols[2], 212], text: WORDS.pr, cls: 'flow-head' },
			{ at: [362, rows[3] + 4], text: WORDS.notPicked, cls: 'flow-note', anchor: 'start' },
			{ at: [570, 806], text: WORDS.parallel, cls: 'flow-note', anchor: 'start' },
		],
		glyphs: rows.slice(0, 3).flatMap(cy => cols.map((x, i) => ({ at: [x, cy], name: GLYPHS[i] }))),
		edges: [
			{ d: [['M', 80, 52], ['L', 80, 81]], arrow: true },
			{ d: [['M', 152, 110], ['L', 181, 110]], arrow: true },
			{ d: [['M', 356, 110], ['L', 385, 110]], arrow: true },
			{ d: [['M', 568, 110], ['L', 597, 110]], arrow: true },
			// Browser testing comes back around to the variations.
			{ d: [['M', 673, 136], ['L', 673, 152], ['L', 84, 152], ['L', 84, 282]], arrow: true },
			...rows.map(cy => ({ d: [['M', 155, 313], ['C', 180, 313, 178, cy, 201, cy]], arrow: true })),
			...rows.slice(0, 3).flatMap(cy => [
				{ d: [['M', 347, cy], ['L', 384, cy]] },
				{ d: [['M', 408, cy], ['L', 456, cy]] },
				{ d: [['M', 480, cy], ['L', 528, cy]] },
				{ d: [['M', 552, cy], ['L', 556, cy], ['C', 566, cy, 562, 294, 572, 294]] },
			]),
			{ d: [['M', 572, 294], ['L', 581, 294]], arrow: true },
			{ d: [['M', 665, 326], ['L', 665, 497]], arrow: true },
			...fb.map(cy => ({ d: [['M', 581, 526], ['C', 560, 526, 564, cy, 547, cy]], arrow: true })),
			...fb.map(cy => ({ d: [['M', 381, cy], ['C', 368, cy, 370, 562, 362, 562]] })),
			{ d: [['M', 362, 562], ['L', 351, 562]], arrow: true },
			{ d: [['M', 266, 531], ['L', 266, 405]], arrow: true, label: { at: [266, 490], text: WORDS.nextRound } },
			{ d: [['M', 181, 562], ['L', 155, 562]], arrow: true },
			{ d: [['M', 84, 586], ['L', 84, 730], ['L', 169, 730]], arrow: true },
			{ d: [['M', 247, 756], ['L', 247, 828], ['L', 259, 828]], arrow: true },
			{ d: [['M', 410, 828], ['L', 426, 828], ['L', 426, 767]], arrow: true },
			{ d: [['M', 474, 730], ['L', 491, 730]], arrow: true },
			{ d: [['M', 560, 701], ['L', 560, 684], ['L', 247, 684], ['L', 247, 701]], arrow: true, label: { at: [404, 684], text: WORDS.again, zone: 'box' } },
			{ d: [['M', 560, 756], ['L', 560, 816]] },
			{ d: [['M', 560, 816], ['C', 560, 834, 513, 834, 513, 853]], arrow: true },
			{ d: [['M', 560, 816], ['C', 560, 834, 675, 834, 675, 853]], arrow: true },
			{ d: [['M', 513, 908], ['L', 513, 943]], arrow: true },
			{ d: [['M', 675, 908], ['L', 675, 943]], arrow: true },
		],
	};
}

function tall() {
	const rows = [549, 591, 633, 675];
	const cols = [188, 246, 314];
	return {
		w: 350, h: 1662,
		zones: [
			{ kind: 'night', box: [0, 380, 350, 400], label: [8, 398], lines: ['Overnight, on another computer', 'or a caffeinated machine'], badge: [194, 409] },
			{ kind: 'box', box: [36, 1110, 278, 112], label: [44, 1128], lines: ['On another computer or', 'a caffeinated machine'], badge: [208, 1139] },
			{ kind: 'box', box: [36, 1310, 278, 160] },
		],
		nodes: {
			context: [30, 0, 290, 52, ['Build the design context', 'sketches, a clear problem,', 'success criteria']],
			orch: [75, 80, 200, 52], markup: [75, 156, 200, 52], build: [75, 232, 200, 52], test: [75, 308, 200, 52],
			vars: [75, 440, 200, 52],
			v1: [28, rows[0] - 17, 124, 34], v2: [28, rows[1] - 17, 124, 34], v3: [28, rows[2] - 17, 124, 34], v4: [28, rows[3] - 17, 124, 34],
			page: [75, 712, 200, 52],
			send: [75, 810, 200, 52],
			transcript: [14, 890, 98, 44, ['Meeting', 'transcript']], review: [126, 890, 98, 44, ['PR', 'review']], doc: [238, 890, 98, 44, ['Feedback', 'document']],
			feedback: [75, 975, 200, 52],
			pick: [75, 1050, 200, 44],
			study: [75, 1156, 200, 52],
			users: [100, 1248, 150, 44],
			synth: [75, 1326, 200, 52],
			next: [75, 1400, 200, 52],
			final: [8, 1530, 162, 52], insights: [180, 1530, 162, 52],
			dev: [29, 1614, 120, 44], stake: [195, 1614, 132, 44],
		},
		texts: [
			{ at: [90, 522], text: WORDS.lab, cls: 'flow-head', badge: [134, 517], module: 'variation-labs' },
			{ at: [cols[0], 522], text: WORDS.branch, cls: 'flow-head' },
			{ at: [cols[1], 522], text: WORDS.video, cls: 'flow-head', badge: [275, 517], module: 'demo-videos' },
			{ at: [cols[2], 522], text: WORDS.pr, cls: 'flow-head' },
			{ at: [166, rows[3] + 4], text: WORDS.notPicked, cls: 'flow-note', anchor: 'start' },
			{ at: [13, 800], lines: ['Next round,', 'narrowing', 'to one'], cls: 'flow-note', anchor: 'start' },
			{ at: [324, 1240], text: WORDS.again, cls: 'flow-note', anchor: 'end' },
			{ at: [185, 1484], text: WORDS.parallel, cls: 'flow-note', anchor: 'start' },
		],
		glyphs: rows.slice(0, 3).flatMap(cy => cols.map((x, i) => ({ at: [x, cy], name: GLYPHS[i] }))),
		edges: [
			{ d: [['M', 175, 52], ['L', 175, 77]], arrow: true },
			{ d: [['M', 175, 132], ['L', 175, 153]], arrow: true },
			{ d: [['M', 175, 208], ['L', 175, 229]], arrow: true },
			{ d: [['M', 175, 284], ['L', 175, 305]], arrow: true },
			{ d: [['M', 240, 360], ['L', 240, 437]], arrow: true },
			{ d: [['M', 72, 466], ['L', 12, 466], ['L', 12, rows[3]]] },
			...rows.map(cy => ({ d: [['M', 12, cy], ['L', 25, cy]] })),
			...rows.slice(0, 3).flatMap(cy => [
				{ d: [['M', 155, cy], ['L', 176, cy]] },
				{ d: [['M', 200, cy], ['L', 234, cy]] },
				{ d: [['M', 258, cy], ['L', 302, cy]] },
				{ d: [['M', 326, cy], ['L', 340, cy]] },
			]),
			{ d: [['M', 340, rows[0]], ['L', 340, 738], ['L', 278, 738]], arrow: true },
			{ d: [['M', 175, 764], ['L', 175, 807]], arrow: true },
			...[[63], [175], [287]].map(([cx]) => ({ d: [['M', 175, 865], ['C', 175, 874, cx, 874, cx, 887]], arrow: true })),
			...[63, 175, 287].map(cx => ({ d: [['M', cx, 934], ['C', cx, 951, 175, 943, 175, 958]] })),
			{ d: [['M', 175, 958], ['L', 175, 972]], arrow: true },
			{ d: [['M', 72, 1001], ['L', 6, 1001], ['L', 6, 712], ['L', 40, 712], ['L', 40, 695]], arrow: true },
			{ d: [['M', 175, 1027], ['L', 175, 1047]], arrow: true },
			{ d: [['M', 240, 1094], ['L', 240, 1153]], arrow: true },
			{ d: [['M', 175, 1208], ['L', 175, 1245]], arrow: true },
			{ d: [['M', 175, 1292], ['L', 175, 1323]], arrow: true },
			{ d: [['M', 175, 1378], ['L', 175, 1397]], arrow: true },
			{ d: [['M', 278, 1426], ['L', 332, 1426], ['L', 332, 1182], ['L', 278, 1182]], arrow: true },
			{ d: [['M', 175, 1452], ['L', 175, 1490]] },
			{ d: [['M', 175, 1490], ['C', 175, 1508, 89, 1508, 89, 1527]], arrow: true },
			{ d: [['M', 175, 1490], ['C', 175, 1508, 261, 1508, 261, 1527]], arrow: true },
			{ d: [['M', 89, 1582], ['L', 89, 1611]], arrow: true },
			{ d: [['M', 261, 1582], ['L', 261, 1611]], arrow: true },
		],
	};
}

// ------------------------------------------------------------------ drawing

const f = n => String(Math.round(n * 10) / 10);

function seeded(text) {
	let h = 2166136261;
	for (const c of text) {
		h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	}
	let a = h >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// One line, drawn twice, each time a little bowed and a little off at the ends.
function line(x1, y1, x2, y2, r, { rough = 1, passes = 2, over = 0 } = {}) {
	const len = Math.hypot(x2 - x1, y2 - y1) || 1;
	const ux = (x2 - x1) / len;
	const uy = (y2 - y1) / len;
	const off = Math.min(1.2, len * 0.012) * rough;
	const bow = Math.min(2.4, len * 0.01) * rough;
	let d = '';
	for (let p = 0; p < passes; p++) {
		const j = () => r() * 2 - 1;
		const o1 = over * (0.4 + r() * 0.6);
		const o2 = over * (0.4 + r() * 0.6);
		const ax = x1 - ux * o1 + j() * off;
		const ay = y1 - uy * o1 + j() * off;
		const bx = x2 + ux * o2 + j() * off;
		const by = y2 + uy * o2 + j() * off;
		const b1 = j() * bow;
		const b2 = j() * bow;
		d += `M${f(ax)} ${f(ay)}C${f(ax + (bx - ax) / 3 - uy * b1)} ${f(ay + (by - ay) / 3 + ux * b1)} ${f(ax + (bx - ax) * 2 / 3 - uy * b2)} ${f(ay + (by - ay) * 2 / 3 + ux * b2)} ${f(bx)} ${f(by)}`;
	}
	return d;
}

function curve(x0, y0, x1, y1, x2, y2, x3, y3, r) {
	let d = '';
	for (let p = 0; p < 2; p++) {
		const j = (k = 1) => (r() * 2 - 1) * k;
		d += `M${f(x0 + j(0.6))} ${f(y0 + j(0.6))}C${f(x1 + j(2))} ${f(y1 + j(2))} ${f(x2 + j(2))} ${f(y2 + j(2))} ${f(x3 + j(0.6))} ${f(y3 + j(0.6))}`;
	}
	return d;
}

// A rounded rectangle: four bowed sides with their corners, drawn twice.
function rect(x, y, w, h, r, k = 7) {
	let d = '';
	for (let p = 0; p < 2; p++) {
		const j = (a = 0.9) => (r() * 2 - 1) * a;
		const side = (ax, ay, bx, by) => {
			const len = Math.hypot(bx - ax, by - ay) || 1;
			const nx = -(by - ay) / len;
			const ny = (bx - ax) / len;
			const b1 = j(Math.min(1.6, len * 0.008));
			const b2 = j(Math.min(1.6, len * 0.008));
			return `C${f(ax + (bx - ax) / 3 + nx * b1)} ${f(ay + (by - ay) / 3 + ny * b1)} ${f(ax + (bx - ax) * 2 / 3 + nx * b2)} ${f(ay + (by - ay) * 2 / 3 + ny * b2)} ${f(bx)} ${f(by)}`;
		};
		const pts = [
			[x + k + j(), y + j()], [x + w - k + j(), y + j()], [x + w + j(), y + k + j()], [x + w + j(), y + h - k + j()],
			[x + w - k + j(), y + h + j()], [x + k + j(), y + h + j()], [x + j(), y + h - k + j()], [x + j(), y + k + j()],
		];
		const corners = [[x + w, y], [x + w, y + h], [x, y + h], [x, y]];
		d += `M${f(pts[0][0])} ${f(pts[0][1])}`;
		for (let i = 0; i < 4; i++) {
			const a = pts[i * 2];
			const b = pts[i * 2 + 1];
			const c = corners[i];
			const n = pts[(i * 2 + 2) % 8];
			d += side(a[0], a[1], b[0], b[1]) + `Q${f(c[0] + j(0.6))} ${f(c[1] + j(0.6))} ${f(n[0] + (i === 3 ? j(1.5) : 0))} ${f(n[1])}`;
		}
	}
	return d;
}

// An ellipse: a loose closed curve through points around it, drawn twice, each overlapping its own start a little.
function oval(cx, cy, rx, ry, r) {
	let d = '';
	for (let p = 0; p < 2; p++) {
		const n = 12;
		const start = r() * Math.PI * 2;
		const pts = [];
		for (let i = 0; i <= n + 1; i++) {
			const t = start + (i / n) * Math.PI * 2 * 1.03;
			const k = 1 + (r() * 2 - 1) * 0.02;
			pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
		}
		d += `M${f(pts[0][0])} ${f(pts[0][1])}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[i - 1] || pts[i];
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p3 = pts[i + 2] || p2;
			d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
		}
	}
	return d;
}

function arrowhead(x, y, angle, r) {
	const len = 9;
	const spread = 0.45;
	return [-spread, spread].map(s => line(x, y, x - Math.cos(angle + s) * len, y - Math.sin(angle + s) * len, r, { rough: 0.5 })).join('');
}

function edgePath(edge, r) {
	let d = '';
	let at = null;
	let from = null;
	for (const [k, ...p] of edge.d) {
		if (k === 'M') {
			at = p;
		} else if (k === 'L') {
			d += line(at[0], at[1], p[0], p[1], r, { rough: 0.7 });
			from = at;
			at = p;
		} else if (k === 'C') {
			d += curve(at[0], at[1], p[0], p[1], p[2], p[3], p[4], p[5], r);
			from = [p[2], p[3]];
			at = [p[4], p[5]];
		}
	}
	if (edge.arrow && from) {
		d += arrowhead(at[0], at[1], Math.atan2(at[1] - from[1], at[0] - from[0]), r);
	}
	return d;
}

// Diagonal strokes across a zone, one pass each: / for overnight, \ for another computer.
function hachure(x, y, w, h, kind, r) {
	const gap = 9;
	const i = 4;
	const [x0, y0, x1, y1] = [x + i, y + i, x + w - i, y + h - i];
	let d = '';
	if (kind === 'night') {
		for (let k = x0 + y0 + gap; k < x1 + y1; k += gap) {
			const a = Math.max(x0, k - y1);
			const b = Math.min(x1, k - y0);
			if (b - a > 2) {
				d += line(a, k - a, b, k - b, r, { passes: 1, rough: 0.5 });
			}
		}
	} else {
		for (let k = y0 - x1 + gap; k < y1 - x0; k += gap) {
			const a = Math.max(x0, y0 - k);
			const b = Math.min(x1, y1 - k);
			if (b - a > 2) {
				d += line(a, a + k, b, b + k, r, { passes: 1, rough: 0.5 });
			}
		}
	}
	return d;
}

// ------------------------------------------------------------------ render

function textSpans(line, esc) {
	if (typeof line === 'string') {
		return esc(line);
	}
	return line.map(([t, cls]) => (cls ? `<tspan class="${cls}">${esc(t)}</tspan>` : `<tspan>${esc(t)}</tspan>`)).join('');
}

function drawLayout(name, L, { esc, icons, mod }) {
	const out = [];
	const badges = [];
	// A little room above the first shape, so its module number isn't cut off at the top.
	const TOP = 12;
	const H = L.h + TOP;
	const badge = (cx, cy, module) => {
		if (!mod) {
			return;
		}
		const m = mod(module);
		badges.push({ n: m.number, html: `<a class="flow-badge" href="${esc(m.href)}" style="left: ${f(cx / L.w * 100)}%; top: ${f((cy + TOP) / H * 100)}%" aria-label="Module ${m.number}: ${esc(m.short)}">${m.number}</a>` });
	};
	for (const [i, z] of L.zones.entries()) {
		const [x, y, w, h] = z.box;
		const r = seeded(`${name}:zone:${i}`);
		out.push(`<g class="flow-zone flow-zone-${z.kind}"><rect class="flow-zone-fill" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><path class="flow-hachure" d="${hachure(x, y, w, h, z.kind, r)}"/><path class="flow-zone-edge" d="${rect(x, y, w, h, r, 10)}"/></g>`);
		if (z.label) {
			const def = ZONES[z.kind];
			const lines = z.lines || [def.label];
			if (lines.join(' ') !== def.label) {
				throw new Error(`flow: the ${z.kind} shade's label lines don't make up its label, "${def.label}".`);
			}
			out.push(lines.map((ln, i) => `<text class="flow-zone-label flow-zone-${z.kind}" x="${z.label[0]}" y="${f(z.label[1] + i * 16)}"${z.anchor ? ` text-anchor="${z.anchor}"` : ''}>${esc(ln)}</text>`).join(''));
			badge(z.badge[0], z.badge[1], def.module);
		}
	}
	for (const [id, [x, y, w, h, own]] of Object.entries(L.nodes)) {
		const def = { ...NODES[id], ...(own ? { lines: own } : {}) };
		const r = seeded(`${name}:${id}`);
		const isOval = def.shape === 'oval';
		const cls = ['flow-node', isOval ? 'flow-person' : '', def.style ? `flow-${def.style}` : ''].filter(Boolean).join(' ');
		const fill = isOval
			? `<ellipse class="flow-fill" cx="${f(x + w / 2)}" cy="${f(y + h / 2)}" rx="${f(w / 2)}" ry="${f(h / 2)}"/>`
			: `<rect class="flow-fill" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>`;
		const ink = isOval ? oval(x + w / 2, y + h / 2, w / 2, h / 2, r) : rect(x, y, w, h, r);
		const cx = x + w / 2;
		const cy = y + h / 2;
		const n = def.lines.length;
		const texts = def.lines.map((ln, i) => {
			const ty = n === 1 ? cy + 5 : cy - 3 - (n - 2) * 7 + (i === 0 ? 0 : 16 + (i - 1) * 14);
			const cl = i === 0 || isOval ? 'flow-label' : 'flow-sub';
			return `<text class="${cl}" x="${f(cx)}" y="${f(ty)}" text-anchor="middle">${textSpans(ln, esc)}</text>`;
		}).join('');
		out.push(`<g class="${cls}">${fill}<path class="flow-ink" d="${ink}"/>${texts}</g>`);
		if (def.module) {
			badge(isOval ? cx + (w / 2) * 0.72 : x + w - 3, isOval ? cy - (h / 2) * 0.72 : y + 3, def.module);
		}
	}
	const labels = [];
	for (const [i, e] of L.edges.entries()) {
		const r = seeded(`${name}:edge:${i}`);
		out.push(`<path class="flow-ink flow-edge" d="${edgePath(e, r)}"/>`);
		if (e.label) {
			const [lx, ly] = e.label.at;
			const width = e.label.text.length * 6.4 + 14;
			labels.push(`<rect class="flow-knockout${e.label.zone ? ` flow-knockout-${e.label.zone}` : ''}" x="${f(lx - width / 2)}" y="${f(ly - 10)}" width="${f(width)}" height="20" rx="4"/><text class="flow-note" x="${lx}" y="${f(ly + 4)}" text-anchor="middle">${esc(e.label.text)}</text>`);
		}
	}
	out.push(...labels);
	for (const g of L.glyphs) {
		out.push(`<g class="flow-glyph" transform="translate(${f(g.at[0] - 8)} ${f(g.at[1] - 8)})">${icons[g.name]}</g>`);
	}
	for (const t of L.texts) {
		const lines = t.lines || [t.text];
		out.push(lines.map((ln, i) => `<text class="${t.cls}" x="${t.at[0]}" y="${t.at[1] + i * 14}" text-anchor="${t.anchor || 'middle'}">${esc(ln)}</text>`).join(''));
		if (t.module) {
			badge(t.badge[0], t.badge[1], t.module);
		}
	}
	// The links read and tab in the course's order, wherever they sit in the drawing.
	badges.sort((a, b) => a.n - b.n);
	return { inner: `<g transform="translate(0 ${TOP})">${out.join('')}</g>`, w: L.w, h: H, badges };
}

function renderLayout(name, L, { esc, icons, mod, alt }) {
	const d = drawLayout(name, L, { esc, icons, mod });
	const svg = `<svg class="flow-svg" viewBox="0 0 ${d.w} ${d.h}" width="${d.w}" height="${d.h}" role="img" aria-label="${esc(alt)}" focusable="false">${d.inner}</svg>`;
	return `<div class="flow-canvas flow-${name}">${svg}${d.badges.map(b => b.html).join('')}</div>`;
}

// The wide drawing as one standalone SVG file (for the slide deck): no module links, and its colors and type set
// inside it, from `css` (the flow's rules with the theme's values filled in).
export function flowSvg({ esc, icons, alt, css, layout = 'wide' }) {
	const d = drawLayout(layout, layout === 'tall' ? tall() : wide(), { esc, icons, mod: null });
	const pad = 16;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${d.w + pad * 2} ${d.h + pad * 2}" width="${d.w + pad * 2}" height="${d.h + pad * 2}" role="img" aria-label="${esc(alt)}">
<title>${esc(alt)}</title>
<style>${css}</style>
<rect class="flow-ground" x="${-pad}" y="${-pad}" width="${d.w + pad * 2}" height="${d.h + pad * 2}"/>
${d.inner}
</svg>
`;
}

// spec: { alt, legend: [{ kind, title, module, text }] }. mod(name) gives { number, href, short } for a module.
export function renderFlow(spec, { esc, icons, mod }) {
	const legend = spec.legend.map(item => {
		const m = item.module ? mod(item.module) : null;
		const title = m ? `<strong>${esc(item.title)}</strong> (<a href="${esc(m.href)}">Module ${m.number}</a>)` : `<strong>${esc(item.title)}</strong>`;
		return `<li><span class="flow-swatch${item.kind ? ` flow-swatch-${esc(item.kind)}` : ''}" aria-hidden="true"></span><span>${title}: ${esc(item.text)}</span></li>`;
	}).join('');
	return `<figure class="flow">${renderLayout('wide', wide(), { esc, icons, mod, alt: spec.alt })}${renderLayout('tall', tall(), { esc, icons, mod, alt: spec.alt })}<figcaption class="flow-legend"><ul>${legend}</ul></figcaption></figure>\n`;
}
