// The background field: a generative swarm behind the site's text. WebGL2, no libraries, nothing from the network.
// The swarm (version 3) is the site's look: thousands of points flowing in streams that gather into dithered spheres
// lit teal (the poster's Bayer 8 by 8 on a form), hold, and flow on. It never starts, ends or repeats: one shared
// clock drives it on every page, so each page shows the same swarm at "now", and a new form begins every 15 seconds
// with its own place, size and light. The home banner and the password screen show it full bleed; every other page
// shows the top of the same field in a band above its title. ?v=1 (night horizon) and ?v=2 (glyph field) are hidden
// switches for comparing, kept for the rest of the visit in that tab.
// It draws only while it's on screen and the tab is visible. Pause stops it on every page and holds the exact moment
// until Play (localStorage). Reduced motion, or ?motion=off, draws one complete still frame and hides Pause. The
// field dims behind the text it sits under, so titles keep their contrast in every frame. Light mode has its own
// palette: dark points on the light ground, teal accents.
(() => {
	'use strict';

	const root = document.documentElement;
	const hosts = [...document.querySelectorAll('[data-field]')];
	if (!hosts.length) {
		return;
	}
	const STORE = 'ai-first-design-workshop:motion';
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');
	const lightScheme = matchMedia('(prefers-color-scheme: light)');
	const still = () => reduce.matches || root.dataset.motion === 'off';
	const readPaused = () => {
		try {
			return localStorage.getItem(STORE) === 'paused';
		} catch {
			return false;
		}
	};
	const writePaused = on => {
		try {
			if (on) {
				localStorage.setItem(STORE, 'paused');
			} else {
				localStorage.removeItem(STORE);
			}
		} catch {
			// Private windows may refuse storage; the choice still holds on this page.
		}
	};
	let paused = readPaused();

	// The swarm's clock, shared by every page and tab: seconds since a fixed day, less any time spent paused. Every
	// page shows the swarm at "now", and Pause holds the exact moment everywhere until Play continues from it.
	const EPOCH = Date.UTC(2026, 10, 11);
	const CLOCK = 'ai-first-design-workshop:clock';
	const readClock = () => {
		try {
			const c = JSON.parse(localStorage.getItem(CLOCK) || 'null');
			if (c && Number.isFinite(c.offset)) {
				return { offset: c.offset, pausedAt: Number.isFinite(c.pausedAt) ? c.pausedAt : null };
			}
		} catch {
			// Unreadable or no storage: a fresh clock.
		}
		return { offset: 0, pausedAt: null };
	};
	let clock = readClock();
	const writeClock = () => {
		try {
			localStorage.setItem(CLOCK, JSON.stringify(clock));
		} catch {
			// Private windows may refuse storage; this page keeps its own clock.
		}
	};
	// Keep the clock in step with the Pause choice (a page from before the clock may have paused without it).
	const settle = () => {
		if (paused && clock.pausedAt === null) {
			clock.pausedAt = Date.now();
			writeClock();
		} else if (!paused && clock.pausedAt !== null) {
			clock.offset += Date.now() - clock.pausedAt;
			clock.pausedAt = null;
			writeClock();
		}
	};
	settle();
	const clockNow = () => ((clock.pausedAt ?? Date.now()) - EPOCH - clock.offset) / 1000;

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
		12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
		3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
		15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
	];
	const rgb = (r, g, b) => [r / 255, g / 255, b / 255];
	// The poster's colors. Dark: light points on the near-black ground, the dither from deep ocean to cyan.
	// Light: dark points on the light ground, the dither from pale teal to ocean, darker teal for small marks.
	const PALETTES = {
		dark: {
			ink: rgb(226, 230, 234), teal: rgb(117, 226, 225), ocean: rgb(30, 135, 168),
			ramp: [rgb(10, 52, 72), rgb(30, 135, 168), rgb(72, 194, 205), rgb(117, 226, 225)],
			floor: 0.1, additive: true,
		},
		light: {
			ink: rgb(13, 16, 20), teal: rgb(0, 119, 122), ocean: rgb(30, 135, 168),
			ramp: [rgb(206, 241, 241), rgb(117, 226, 225), rgb(56, 172, 194), rgb(30, 135, 168)],
			floor: 0.07, additive: false,
		},
	};

	// ------------------------------------------------------------ shaders

	const HEAD = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uSeed;
uniform vec4 uBox;
uniform float uFeather;
uniform float uFloor;
uniform float uLight;
uniform float uGain;
uniform vec3 uInk;
uniform vec3 uTeal;
uniform vec3 uOcean;
uniform vec3 uRamp[4];

uint hashu(uint x) {
	x ^= x >> 16u;
	x *= 0x7feb352du;
	x ^= x >> 15u;
	x *= 0x846ca68bu;
	x ^= x >> 16u;
	return x;
}
float rnd(uint x) { return float(hashu(x)) / 4294967296.0; }
// Squares, never pow(x, 2.0): GLSL leaves pow undefined below zero, and some GPUs return NaN there.
float sq(float v) { return v * v; }
uint seedU() { return uint(uSeed) * 0x9e3779b9u + 0x632be5abu; }
float h2(ivec2 i) { return rnd(uint(i.x) * 0x8da6b343u ^ hashu(uint(i.y) ^ seedU())); }
float vnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = p - i;
	vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
	ivec2 c = ivec2(i);
	return mix(mix(h2(c), h2(c + ivec2(1, 0)), u.x), mix(h2(c + ivec2(0, 1)), h2(c + ivec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float s = 0.0;
	float a = 0.5;
	for (int k = 0; k < 4; k++) {
		s += a * vnoise(p);
		p = p * 2.03 + vec2(5.3, 1.7);
		a *= 0.5;
	}
	return s / 0.9375;
}
float ridged(vec2 p) {
	float s = 0.0;
	float a = 0.5;
	float w = 1.0;
	for (int k = 0; k < 4; k++) {
		float n = 1.0 - abs(vnoise(p) * 2.0 - 1.0);
		n *= n * w;
		s += a * n;
		w = clamp(n * 1.8, 0.0, 1.0);
		p = p * 2.07 + vec2(1.7, 9.2);
		a *= 0.5;
	}
	return s / 0.9375;
}
const int BAYER[64] = int[64](${BAYER.join(', ')});
float bayer(ivec2 c) { return (float(BAYER[(c.y & 7) * 8 + (c.x & 7)]) + 0.5) / 64.0; }
// 1 away from the text block, uFloor behind it, with a soft edge: the field dims where the page's text sits.
uniform vec4 uClear;
float keep(vec2 p) {
	float dist = 1e6;
	if (uBox.z > uBox.x) {
		vec2 c = 0.5 * (uBox.xy + uBox.zw);
		vec2 d = abs(p - c) - 0.5 * (uBox.zw - uBox.xy);
		dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
	}
	float k = mix(uFloor, 1.0, smoothstep(0.0, uFeather, dist));
	if (uClear.z > uClear.x) {
		vec2 c2 = 0.5 * (uClear.xy + uClear.zw);
		vec2 d2 = abs(p - c2) - 0.5 * (uClear.zw - uClear.xy);
		float dist2 = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0);
		k *= smoothstep(0.0, uFeather * 0.6, dist2);
	}
	return k;
}
uniform float uUntil;
uniform float uFadeLen;
// Bands fade into the page's ground before the reading content: 1 above the fade, 0 from uUntil down.
float fadeOut(float y) { return 1.0 - smoothstep(uUntil - uFadeLen, uUntil, y); }
vec4 clip(vec2 px) {
	vec2 c = px / uRes * 2.0 - 1.0;
	return vec4(c.x, -c.y, 0.0, 1.0);
}
const vec4 OFF = vec4(2.0, 2.0, 2.0, 1.0);
vec3 ramp(float s) {
	s = clamp(s, 0.0, 1.0);
	if (s < 0.4) {
		return mix(uRamp[0], uRamp[1], s / 0.4);
	}
	if (s < 0.72) {
		return mix(uRamp[1], uRamp[2], (s - 0.4) / 0.32);
	}
	return mix(uRamp[2], uRamp[3], (s - 0.72) / 0.28);
}
`;

	const POINT_FS = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 o;
void main() {
	o = vColor;
}
`;

	const ROUND_FS = `#version 300 es
precision highp float;
in vec4 vColor;
in float vRound;
out vec4 o;
void main() {
	if (vRound > 0.5) {
		vec2 d = gl_PointCoord - 0.5;
		if (dot(d, d) > 0.25) {
			discard;
		}
	}
	o = vColor;
}
`;

	const FULL_VS = `#version 300 es
void main() {
	vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

	// 1. Night horizon: ranges of hills in fine stipple, far to near. Each is brightest along its crest and fades into
	// the valley mist below it; the far ones take the dawn's blue. The dawn is a dithered dome behind the far skyline.
	const RANGES = `
uniform float uBase;
uniform float uSpan;
uniform float uDrift;
float ridge(vec2 q) {
	float s = 0.0;
	float a = 0.5;
	float wt = 1.0;
	for (int k = 0; k < 3; k++) {
		float n = 1.0 - abs(vnoise(q) * 2.0 - 1.0);
		n *= n * wt;
		s += a * n;
		wt = clamp(n * 1.8, 0.0, 1.0);
		q = q * 2.05 + vec2(1.7, 9.2);
		a *= 0.5;
	}
	return s / 0.875;
}
// Where range k's crest is at x (device px), in device px from the top. Range 0 is the farthest; nearer ones
// drift past a little faster, so the night moves slowly sideways.
float crest(float x, float k) {
	float xs = x / (uDpr * 1000.0) + uTime * uDrift * (0.002 + 0.003 * k);
	float east = smoothstep(0.05, 0.95, x / uRes.x);
	float n = ridge(vec2(xs * (1.6 + 1.1 * k) + k * 17.3 + uSeed * 0.71, k * 5.1 + uSeed * 0.37));
	float rise = n * mix(0.32, 1.0, east) * (1.0 - 0.16 * k);
	return (uBase + k * uSpan * 0.26 - rise * uSpan * 0.5) * uRes.y;
}
`;

	// The crests change only along x, so one small pass writes them into a texture (a column per two device px, a row
	// per range, 16 bits in red and green) and the points, stars, dawn and travellers read them back.
	const CREST_FS = `${HEAD}${RANGES}
uniform float uCrestStep;
out vec4 o;
void main() {
	float y = crest((gl_FragCoord.x - 0.5) * uCrestStep, floor(gl_FragCoord.y));
	float n = clamp((y / uRes.y + 0.5) * 0.5, 0.0, 1.0) * 65535.0;
	o = vec4(floor(n / 256.0) / 255.0, mod(floor(n), 256.0) / 255.0, 0.0, 1.0);
}
`;

	const LOOKUP = `
uniform sampler2D uCrest;
uniform float uCrestStep;
float crestRead(int i, int k) {
	vec4 c = texelFetch(uCrest, ivec2(clamp(i, 0, textureSize(uCrest, 0).x - 1), k), 0);
	float n = (floor(c.r * 255.0 + 0.5) * 256.0 + floor(c.g * 255.0 + 0.5)) / 65535.0;
	return (n * 2.0 - 0.5) * uRes.y;
}
float crestAt(float x, float k) {
	float t = x / uCrestStep;
	float i = floor(t);
	return mix(crestRead(int(i), int(k)), crestRead(int(i) + 1, int(k)), t - i);
}
`;

	const LAND_VS = `${HEAD}${RANGES}${LOOKUP}
uniform int uCols;
uniform float uTop;
uniform float uCell;
out vec4 vColor;
void main() {
	int id = gl_VertexID;
	int col = id % uCols;
	int row = id / uCols;
	uint h = hashu(uint(id) ^ seedU());
	vec2 px = vec2((float(col) + rnd(h ^ 0x68e31da4u)) * uCell, uTop + (float(row) + rnd(h ^ 0xb5297a4du)) * uCell);
	float r = rnd(h ^ 0x1b56c4e9u);
	float kp = keep(px);
	if (px.y > uRes.y || (kp < uFloor + 0.01 && r > 0.3)) {
		gl_Position = OFF;
		gl_PointSize = 1.0;
		vColor = vec4(0.0);
		return;
	}
	float k = -1.0;
	float d = 0.0;
	for (int i = 3; i >= 0; i--) {
		float c = crestAt(px.x, float(i));
		if (px.y >= c) {
			k = float(i);
			d = (px.y - c) / uDpr;
			break;
		}
	}
	float near = k / 3.0;
	float ridgeLine = d < 1.7 ? 1.0 : 0.0;
	float dens = max(ridgeLine, exp(-d / mix(16.0, 46.0, near)) * 0.8 + 0.03);
	float a = k < 0.0 ? 0.0 : smoothstep(r - 0.05, r + 0.05, dens) * kp * fadeOut(px.y) * uGain;
	if (a < 0.004) {
		gl_Position = OFF;
		gl_PointSize = 1.0;
		vColor = vec4(0.0);
		return;
	}
	vec3 tint = mix(mix(uOcean, uTeal, 0.45 * ridgeLine), uInk, smoothstep(0.15, 0.9, near));
	float b = uLight > 0.5 ? mix(0.62, 0.9, ridgeLine) : mix(0.55, 1.0, ridgeLine) * mix(0.62, 1.0, near);
	vColor = vec4(tint * a * b, a * b);
	gl_PointSize = (ridgeLine > 0.5 ? 1.5 : mix(1.0, 1.4, near)) * uDpr;
	gl_Position = clip(px);
}
`;

	const STAR_VS = `${HEAD}${RANGES}${LOOKUP}
out vec4 vColor;
void main() {
	uint h = hashu(uint(gl_VertexID) * 0x2c1b3c6du ^ seedU());
	float x = rnd(h) * uRes.x;
	float sky = crestAt(x, 0.0);
	float y = rnd(h ^ 0x297a2d39u) * uRes.y;
	float b = pow(rnd(h ^ 0x47c6a7e1u), 3.0);
	float tw = 0.7 + 0.3 * sin(uTime * (0.3 + 1.1 * rnd(h ^ 0x5bd1e995u)) + 6.283 * rnd(h ^ 0x6c8e9cf5u));
	float a = (0.12 + 0.88 * b) * tw * smoothstep(0.0, 40.0 * uDpr, sky - y) * keep(vec2(x, y)) * fadeOut(y) * (1.0 - uLight) * uGain;
	vColor = vec4(uInk * a, a);
	gl_PointSize = (b > 0.55 ? 2.0 : 1.0) * uDpr;
	gl_Position = a < 0.004 ? OFF : clip(vec2(x, y));
}
`;

	const GLOW_FS = `${HEAD}${RANGES}${LOOKUP}
uniform float uCellPx;
out vec4 o;
void main() {
	vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
	ivec2 cell = ivec2(floor(p / uCellPx));
	vec2 c = (vec2(cell) + 0.5) * uCellPx;
	float horizon = (uBase + 0.02) * uRes.y;
	float above = horizon - c.y;
	float sunX = uRes.x * (0.74 + 0.01 * sin(uTime * 0.045));
	float horiz = exp(-sq((c.x - sunX) / (uRes.x * 0.22)));
	float tall = uRes.y * mix(0.02, 0.1, horiz) * (1.0 + 0.06 * sin(uTime * 0.11));
	float g = above > 0.0 ? exp(-pow(above / tall, 1.4)) * horiz * 0.68 : horiz * 0.68;
	if (g < 0.012 || c.y > crestAt(c.x, 0.0) + uCellPx) {
		discard;
	}
	g *= 0.8 + 0.2 * vnoise(vec2(c.x / (36.0 * uDpr) - uTime * 0.05, c.y / (14.0 * uDpr)));
	g *= clamp((keep(c) - uFloor) / (1.0 - uFloor), 0.0, 1.0) * fadeOut(c.y) * uGain;
	if (g <= bayer(cell)) {
		discard;
	}
	o = vec4(ramp(g), 1.0);
}
`;

	// Sessions at work: a few brighter points travelling along the crests, each with a short trail.
	const WALK_VS = `${HEAD}${RANGES}${LOOKUP}
uniform int uTrail;
out vec4 vColor;
out float vRound;
void main() {
	int k = gl_VertexID / uTrail;
	int j = gl_VertexID % uTrail;
	uint h = hashu(uint(k) * 0x27d4eb2du ^ seedU() ^ 0x5f356495u);
	float period = 12.0 + 6.0 * rnd(h);
	float cyc = (uTime + rnd(h ^ 1u) * period) / period;
	float n = floor(cyc);
	float life = cyc - n;
	uint hn = hashu(h ^ (uint(int(n) + 4096) * 0x165667b1u));
	float range = 1.0 + floor(rnd(hn) * 2.99);
	float dir = rnd(hn ^ 3u) < 0.5 ? -1.0 : 1.0;
	float speed = (22.0 + 16.0 * rnd(hn ^ 4u)) * uDpr;
	float x0 = uRes.x * mix(0.48, 0.92, rnd(hn ^ 2u));
	float x = x0 + dir * speed * (life * period - float(j) * 0.09);
	float y = crestAt(x, range) - 1.5 * uDpr;
	float head = j == 0 ? 1.0 : 0.0;
	float a = smoothstep(0.0, 0.08, life) * smoothstep(1.0, 0.86, life);
	a *= pow(1.0 - float(j) / float(uTrail), 1.3) * (head > 0.5 ? 1.0 : 0.6);
	a *= keep(vec2(x, y)) * fadeOut(y) * uGain;
	vColor = vec4(uTeal * a, a);
	vRound = head;
	gl_PointSize = (head > 0.5 ? 3.0 : 1.5) * uDpr;
	gl_Position = a < 0.004 ? OFF : clip(vec2(x, y));
}
`;

	// 2. Glyph field: one point sprite per character cell, the glyph read from an atlas drawn in the monospace font.
	const GLYPHS = [' ', '.', ':', '-', '=', '+', '*', '#', '/', '\\', '_', '^'];
	const GLYPH_VS = `${HEAD}
uniform int uCols;
uniform vec2 uCell;
uniform float uBase;
uniform float uSpan;
out vec4 vColor;
out float vGlyph;
// Where range k's crest is at x, as a fraction of the height from the top (0 the far range, 2 the near one).
float crest(float x, float k) {
	float drift = uTime * (0.002 + 0.0035 * k);
	float east = smoothstep(0.15, 1.0, x);
	float n = ridged(vec2(x * (2.2 + 1.5 * k) + drift + uSeed * 0.37 + k * 7.1, 3.3 * k + uSeed));
	float ripple = 0.007 * sin(x * 44.0 - uTime * 0.7 + k * 2.1) * (0.6 + 0.4 * sin(x * 5.0 + uTime * 0.13 + k));
	return uBase + k * uSpan * 0.34 - n * uSpan * mix(0.3, 1.0, east) * (1.0 - 0.22 * k) + ripple;
}
void main() {
	int col = gl_VertexID % uCols;
	int row = gl_VertexID / uCols;
	ivec2 ci = ivec2(col, row);
	vec2 px = (vec2(ci) + 0.5) * uCell;
	float x = px.x / uRes.x;
	float y = px.y / uRes.y;
	float rowH = uCell.y / uRes.y;
	float dx = uCell.x / uRes.x;
	float g = 0.0;
	float a = 0.0;
	vec3 c = uInk;
	bool land = false;
	for (int i = 2; i >= 0; i--) {
		float k = float(i);
		float cy = crest(x, k);
		float d = (y - cy) / rowH;
		if (d < -0.5) {
			continue;
		}
		land = true;
		float far = k < 0.5 ? 1.0 : (k < 1.5 ? 0.4 : 0.0);
		if (d < 0.5) {
			float l = crest(x - dx, k);
			float r = crest(x + dx, k);
			float s = (r - l) / rowH;
			if (l > cy + rowH * 0.3 && r > cy + rowH * 0.3) {
				g = 11.0;
			} else if (s < -0.7) {
				g = 8.0;
			} else if (s > 0.7) {
				g = 9.0;
			} else {
				g = 3.0;
			}
			c = mix(uTeal, uOcean, far);
			a = 1.0;
		} else {
			float dens = exp(-(d - 0.5) * (0.3 + 0.1 * k)) * (0.5 + 0.14 * k);
			dens += 0.1 * (vnoise(vec2(float(col) * 0.31 + uTime * 0.22, float(row) * 0.47 - uTime * 0.09)) - 0.5);
			g = clamp(floor(clamp(dens, 0.0, 1.0) * 6.0 + bayer(ci)), 0.0, 6.0);
			c = mix(uInk, uOcean, far * 0.75);
			a = 0.45 + 0.55 * clamp(dens, 0.0, 1.0);
		}
		break;
	}
	if (!land) {
		float s = h2(ci + ivec2(17, 9));
		if (s < 0.012) {
			g = s < 0.0025 ? 5.0 : 1.0;
			a = (0.35 + 0.25 * sin(uTime * 0.6 + s * 900.0)) * (1.0 - uLight);
		}
	}
	a *= keep(px) * uGain;
	if (g < 0.5 || a < 0.01) {
		gl_Position = OFF;
		gl_PointSize = 1.0;
		vColor = vec4(0.0);
		vGlyph = 0.0;
		return;
	}
	vGlyph = g;
	vColor = vec4(c * a, a);
	gl_PointSize = max(uCell.x, uCell.y);
	gl_Position = clip(px);
}
`;

	const GLYPH_FS = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uCell;
uniform float uCount;
in vec4 vColor;
in float vGlyph;
out vec4 o;
void main() {
	float s = max(uCell.x, uCell.y);
	vec2 q = (gl_PointCoord - 0.5) * s / uCell + 0.5;
	if (q.x < 0.0 || q.x >= 1.0 || q.y < 0.0 || q.y >= 1.0) {
		discard;
	}
	float m = texture(uAtlas, vec2((vGlyph + q.x) / uCount, q.y)).r;
	o = vColor * m;
}
`;

	// 3. Swarm, endless. One world on every page: CSS px from the field's top left (every field starts under the site
	// header and spans the window), with the banner's height as the stage. Streamers flow left to right forever, their
	// wrap hidden at the faded edges. Every 15 s an episode begins and lasts 30 s: its own points (a slot of the
	// buffer, alternating) fade in upstream, flow with the streams, gather into a dithered sphere, one point per lit
	// cell, hold, flow on and fade out. Even episodes are small forms high up (inner pages' bands show them), odd ones
	// big forms in the banner. Each episode's place, size and light come from its number, so nothing repeats. Times
	// arrive split (episode number and age, whole seconds mod Q and the rest, the clock mod 4096 s), so the shader's
	// floats stay exact however long the clock has run.
	const SWARM_VS = `${HEAD}
uniform vec2 uStage;
uniform int uEpisode;
uniform float uEpAge;
uniform int uSecMod;
uniform float uSubSec;
uniform float uTm;
uniform int uSlot0;
uniform int uSlot1;
uniform float uStacked;
uniform sampler2D uCells;
uniform float uCellSize;
out vec4 vColor;
const float P = 15.0;
const float D = 30.0;
const int Q = 7919;
const float S = 6.0;
float S1(float x) { return x * x * x - 0.5 * x * x * x * x; }
// How far the stream has carried a point by moment c of its episode: the stream waits while the point is in the form.
float flowAt(float c, float a, float b, float c1, float d) {
	float ie;
	if (c < a) {
		ie = 0.0;
	} else if (c < b) {
		ie = (b - a) * S1((c - a) / (b - a));
	} else if (c < c1) {
		ie = 0.5 * (b - a) + (c - b);
	} else if (c < d) {
		float x = (c - c1) / (d - c1);
		ie = 0.5 * (b - a) + (c1 - b) + (d - c1) * (x - S1(x));
	} else {
		ie = 0.5 * (b - a) + (c1 - b) + 0.5 * (d - c1);
	}
	return c - ie;
}
// Value noise that repeats every 128 steps in y, so the clock's slow drift wraps at 4096 s without a seam.
float h2p(ivec2 i) { return h2(ivec2(i.x, i.y & 127)); }
float tnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = p - i;
	vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
	ivec2 c = ivec2(i);
	return mix(mix(h2p(c), h2p(c + ivec2(1, 0)), u.x), mix(h2p(c + ivec2(0, 1)), h2p(c + ivec2(1, 1)), u.x), u.y);
}
float laneBase(float s) { return mix(0.12, 0.88, (s + 0.5) / S) * uStage.y; }
// A stream's centre line at x: a slow wave and a slower drift, both whole cycles of the clock's 4096 s.
float lane(float s, float x) {
	uint hs = hashu(uint(s) * 0x7feb352du ^ seedU() ^ 0x3c6ef372u);
	float turns = floor(9.0 + 14.0 * rnd(hs ^ 9u));
	float y = laneBase(s);
	y += uStage.y * 0.055 * sin(x / uStage.x * 6.2832 * (0.6 + 0.5 * rnd(hs)) + 6.2832 * (rnd(hs ^ 7u) + turns * uTm / 4096.0));
	y += uStage.y * 0.06 * (tnoise(vec2(x / uStage.x * 2.3 + s * 7.1, uTm / 32.0)) - 0.5);
	return y;
}
struct Form { vec2 c; float R; vec3 L; };
Form formOf(int n) {
	uint h = hashu(uint(n) * 0x9e3779b9u ^ seedU() ^ 0x51ed270bu);
	float h1 = rnd(h);
	float h2 = rnd(h ^ 0x85ebca6bu);
	float h3 = rnd(h ^ 0xc2b2ae35u);
	float h4 = rnd(h ^ 0x27d4eb2fu);
	float h5 = rnd(h ^ 0x165667b1u);
	float W = uStage.x;
	float H = uStage.y;
	bool high = (n & 1) == 0;
	Form f;
	if (uStacked > 0.5) {
		f.R = high ? W * (0.1 + 0.06 * h1) : W * (0.22 + 0.08 * h1);
		f.c = high ? vec2(W * (0.55 + 0.3 * h2), H * (0.06 + 0.05 * h3)) : vec2(W * (0.35 + 0.3 * h2), H * (0.72 + 0.1 * h3));
	} else {
		f.R = high ? H * (0.07 + 0.05 * h1) : H * (0.2 + 0.13 * h1);
		f.c = high ? vec2(W * (0.66 + 0.24 * h2), H * (0.1 + 0.08 * h3)) : vec2(W * (0.6 + 0.22 * h2), H * (0.42 + 0.2 * h3));
	}
	f.R = min(f.R, W * 0.5 - 20.0);
	f.c.x = clamp(f.c.x, f.R + 16.0, W - f.R - 16.0);
	// Light from below right, give or take; a low light leaves a crescent, a high one a full face.
	float ang = 0.785 + (h4 - 0.5) * 1.7;
	float up = mix(0.3, 0.85, h5);
	f.L = normalize(vec3(cos(ang) * (1.0 - up), sin(ang) * (1.0 - up), up));
	return f;
}
// How gathered an episode is at age a: the streams bend toward a form while it holds.
float held(float a) {
	float c = a / D;
	return smoothstep(0.2, 0.42, c) * (1.0 - smoothstep(0.66, 0.88, c));
}
float bend(Form f, float g, float s, float x) {
	return g * exp(-sq((x - f.c.x) / (f.R * 1.9))) * exp(-sq((laneBase(s) - f.c.y) / (uStage.y * 0.3)));
}
void main() {
	int id = gl_VertexID;
	uint h = hashu(uint(id) * 0x9e3779b9u ^ seedU());
	float r0 = rnd(h ^ 0x85ebca6bu);
	float r1 = rnd(h ^ 0xc2b2ae35u);
	float r2 = rnd(h ^ 0x27d4eb2fu);
	float r3 = rnd(h ^ 0x165667b1u);
	float r4 = rnd(h ^ 0xd3a2646cu);
	float W = uStage.x;
	float H = uStage.y;
	float m = 0.1 * W;
	float span = W + 2.0 * m;
	// The two episodes under way: the newest, and the one 15 s older.
	int nA = uEpisode;
	int nB = uEpisode - 1;
	float ageA = uEpAge;
	float ageB = uEpAge + P;
	int slot = id < uSlot0 ? 0 : (id < uSlot0 + uSlot1 ? 1 : 2);
	vec2 p;
	vec3 col;
	float a;
	float size;
	if (slot < 2) {
		bool mine = (nA & 1) == slot;
		int n = mine ? nA : nB;
		float age = mine ? ageA : ageB;
		Form F = formOf(n);
		int M = slot == 0 ? uSlot0 : uSlot1;
		int j = slot == 0 ? id : id - uSlot0;
		// Which cell this point takes in this episode's form: a different shuffle every episode.
		uint hn = hashu(uint(n) * 0x2c1b3c6du ^ seedU());
		int k = (j * int((hn | 1u) & uint(M - 1)) + int(hashu(hn) & uint(M - 1))) & (M - 1);
		vec2 off = floor(texelFetch(uCells, ivec2(k & 255, k >> 8), 0).xy * 255.0 + 0.5) - 128.0;
		vec2 gc = floor(F.c / uCellSize) + off;
		vec2 target = (gc + 0.5) * uCellSize;
		vec2 rel = off * uCellSize / F.R;
		float rr = dot(rel, rel);
		float lit = -1.0;
		if (rr <= 1.0) {
			float nz = sqrt(1.0 - rr);
			float lam = max(0.0, dot(vec3(rel, nz), F.L));
			float rim = pow(1.0 - nz, 3.0) * 0.4 * max(0.0, dot(rel, normalize(F.L.xy)));
			float I = min(1.0, (pow(lam, 1.3) + rim) * (0.25 + 0.75 * pow(nz, 0.6)));
			if (I > bayer(ivec2(gc))) {
				lit = I;
			}
		}
		bool gathers = lit >= 0.0;
		float c = age / D;
		float delay = 0.05 * clamp((target.x - (F.c.x - F.R)) / (2.0 * F.R), 0.0, 1.0) + 0.025 * r3;
		float a0 = 0.24 + delay;
		float b0 = 0.42 + delay;
		float c1 = 0.66 + delay;
		float d0 = 0.84 + delay;
		float e = gathers ? smoothstep(a0, b0, c) * (1.0 - smoothstep(c1, d0, c)) : 0.0;
		float flow = gathers ? flowAt(c, a0, b0, c1, d0) : c;
		float flowMid = gathers ? flowAt(0.5 * (a0 + b0), a0, b0, c1, d0) : 0.5 * (a0 + b0);
		float x = target.x - 24.0 + (flow - flowMid) * D * span * (0.034 + 0.016 * r1);
		// High forms draw from the upper streams, big ones from the middle.
		float t01 = clamp((target.y - (F.c.y - F.R)) / (2.0 * F.R), 0.0, 0.999);
		float s = (n & 1) == 0 ? floor(t01 * 2.0) : 1.0 + floor(t01 * 4.0);
		float mid = (s + 0.5) / S;
		float pull = exp(-sq((x - F.c.x) / (F.R * 1.9)));
		float y = mix(lane(s, x), F.c.y + (t01 - 0.5) * F.R * 1.6, pull);
		float spread = r2 * 2.0 - 1.0;
		y += spread * abs(spread) * mix(H * 0.022, F.R * 0.1, pull);
		p = mix(vec2(x, y), target, e);
		float edge = smoothstep(-m, 0.0, x) * smoothstep(W + m, W, x);
		float life = smoothstep(0.0, 0.07, c) * (1.0 - smoothstep(0.86, 1.0, c));
		float shimmer = 0.82 + 0.18 * vnoise(target / 14.0 + vec2(age * 0.5, -age * 0.35));
		a = mix((gathers ? 0.62 : 0.42) * edge, shimmer, e) * life;
		col = mix(uInk, ramp(max(lit, 0.0)), e);
		size = mix(1.5, uCellSize * mix(0.55, 1.0, max(lit, 0.0)), e);
	} else {
		// Streamers: speed q / Q of the span per second, so the phase is exact integer arithmetic on the clock.
		float s = floor(r0 * S);
		int q = 206 + int(r1 * 229.0);
		float ph = float((q * uSecMod) % Q) / float(Q) + float(q) * uSubSec / float(Q);
		float x = fract(r4 + ph) * span - m;
		Form fA = formOf(nA);
		Form fB = formOf(nB);
		float y = lane(s, x);
		y = mix(y, fA.c.y + (((s + 0.5) / S) - 0.5) * fA.R * 1.6, 0.75 * bend(fA, held(ageA), s, x));
		y = mix(y, fB.c.y + (((s + 0.5) / S) - 0.5) * fB.R * 1.6, 0.75 * bend(fB, held(ageB), s, x));
		float spread = r2 * 2.0 - 1.0;
		y += spread * abs(spread) * H * 0.022;
		p = vec2(x, y);
		a = (0.4 + 0.32 * r3) * smoothstep(-m, 0.0, x) * smoothstep(W + m, W, x);
		col = uInk;
		size = 1.5;
	}
	a *= keep(p * uDpr) * fadeOut(p.y * uDpr) * uGain;
	vColor = vec4(col * a, a);
	gl_PointSize = size * uDpr;
	gl_Position = a < 0.004 ? OFF : clip(p * uDpr);
}
`;

	// ------------------------------------------------------------ the kit

	function program(gl, vs, fs) {
		const compile = (type, src) => {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, src);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
				throw new Error(gl.getShaderInfoLog(shader) || 'shader');
			}
			return shader;
		};
		const p = gl.createProgram();
		const shaders = [compile(gl.VERTEX_SHADER, vs), compile(gl.FRAGMENT_SHADER, fs)];
		shaders.forEach(s => gl.attachShader(p, s));
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) {
			throw new Error(gl.getProgramInfoLog(p) || 'link');
		}
		shaders.forEach(s => gl.deleteShader(s));
		const loc = {};
		const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) || 0;
		for (let i = 0; i < n; i++) {
			const info = gl.getActiveUniform(p, i);
			loc[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, info.name);
		}
		return { p, loc };
	}

	// The uniforms every program shares; then each version sets its own.
	function use(gl, prog, f, t) {
		const L = prog.loc;
		const pal = f.palette;
		gl.useProgram(prog.p);
		const set = (name, fn, ...v) => {
			if (L[name]) {
				gl[fn](L[name], ...v);
			}
		};
		set('uRes', 'uniform2f', f.canvas.width, f.canvas.height);
		set('uDpr', 'uniform1f', f.dpr);
		set('uTime', 'uniform1f', t);
		set('uSeed', 'uniform1f', f.seed);
		set('uBox', 'uniform4f', ...f.box);
		set('uClear', 'uniform4f', ...f.clear);
		set('uFeather', 'uniform1f', f.feather);
		set('uFloor', 'uniform1f', pal.floor);
		set('uLight', 'uniform1f', f.light ? 1 : 0);
		set('uGain', 'uniform1f', f.gain);
		set('uUntil', 'uniform1f', f.until);
		set('uFadeLen', 'uniform1f', f.fadeLen);
		set('uInk', 'uniform3f', ...pal.ink);
		set('uTeal', 'uniform3f', ...pal.teal);
		set('uOcean', 'uniform3f', ...pal.ocean);
		pal.rampF = pal.rampF || new Float32Array(pal.ramp.flat());
		set('uRamp', 'uniform3fv', pal.rampF);
		return (name, fn, ...v) => set(name, fn, ...v);
	}

	// The cells of a form, nearest the centre first (offsets in cells, 128 added), so the first k cells of the list
	// always make a disc: an episode's points take cells by index and the ones past its radius flow on.
	let cellList = null;
	const swarmCells = () => {
		if (!cellList) {
			const all = [];
			for (let dy = -76; dy <= 76; dy++) {
				for (let dx = -76; dx <= 76; dx++) {
					all.push([dx * dx + dy * dy, Math.atan2(dy, dx), dx, dy]);
				}
			}
			all.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
			cellList = new Uint8Array(16384 * 4);
			for (let i = 0; i < 16384; i++) {
				cellList[i * 4] = all[i][2] + 128;
				cellList[i * 4 + 1] = all[i][3] + 128;
				cellList[i * 4 + 3] = 255;
			}
		}
		return cellList;
	};
	// The swarm's stage depends only on the window, never the page: the width, and the home banner's height.
	const swarmStage = f => {
		const top = document.querySelector('.top');
		const header = top ? top.getBoundingClientRect().height : 57;
		const w = f.css.w;
		const stacked = w < 720;
		const room = window.innerHeight - header;
		const h = stacked ? Math.max(480, room) : Math.min(Math.max(420, room), 760);
		const cell = stacked ? 3.5 : 4;
		const pow2 = r => 2 ** Math.ceil(Math.log2(Math.PI * (r / cell + 1.5) ** 2));
		const high = stacked ? w * 0.16 : h * 0.12;
		const big = Math.min(stacked ? w * 0.3 : h * 0.33, w * 0.5 - 20);
		return { w, h, stacked, cell, slot0: Math.min(16384, pow2(high)), slot1: Math.min(16384, pow2(big)), streamers: Math.round(Math.min(9000, Math.max(1500, (w * h) / 160))) };
	};

	const VERSIONS = {
		1: {
			name: 'Night horizon',
			idea: 'Stippled terrain under a starfield, a teal dawn along the horizon, sessions travelling the ridgelines.',
			start: 30,
			still: 46,
			create(f) {
				const gl = f.gl;
				const glow = program(gl, FULL_VS, GLOW_FS);
				const stars = program(gl, STAR_VS, POINT_FS);
				const land = program(gl, LAND_VS, POINT_FS);
				const walk = program(gl, WALK_VS, ROUND_FS);
				const crests = program(gl, FULL_VS, CREST_FS);
				const tex = gl.createTexture();
				const fbo = gl.createFramebuffer();
				let texW = 0;
				return {
					draw(t) {
						const H = f.canvas.height;
						const base = f.band ? 0.6 * f.stripFrac : f.stacked ? 0.66 : 0.47;
						const span = f.band ? 0.85 * f.stripFrac : f.stacked ? 0.34 : 0.5;
						const cell = Math.max(2, 2.7 * f.dpr);
						const top = Math.max(0, (base - 0.27 * span) * H);
						const cols = Math.ceil(f.canvas.width / cell);
						const rows = Math.ceil((Math.min(H, f.until) - top) / cell);
						const step = Math.max(1, Math.round(f.dpr));
						const ranges = set => {
							set('uBase', 'uniform1f', base);
							set('uSpan', 'uniform1f', span);
							set('uDrift', 'uniform1f', f.band ? 0.6 : 1);
							set('uCrestStep', 'uniform1f', step);
							set('uCrest', 'uniform1i', 0);
						};
						// The crests for this frame.
						const w = Math.ceil(f.canvas.width / step) + 2;
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, tex);
						if (w !== texW) {
							texW = w;
							gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
							gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
							gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
						}
						gl.bindTexture(gl.TEXTURE_2D, null);
						gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
						gl.viewport(0, 0, w, 4);
						gl.disable(gl.BLEND);
						let set = use(gl, crests, f, t);
						ranges(set);
						gl.drawArrays(gl.TRIANGLES, 0, 3);
						gl.bindFramebuffer(gl.FRAMEBUFFER, null);
						gl.viewport(0, 0, f.canvas.width, f.canvas.height);
						gl.enable(gl.BLEND);
						gl.bindTexture(gl.TEXTURE_2D, tex);
						set = use(gl, glow, f, t);
						ranges(set);
						set('uCellPx', 'uniform1f', Math.max(2, Math.round(3 * f.dpr)));
						gl.drawArrays(gl.TRIANGLES, 0, 3);
						set = use(gl, stars, f, t);
						ranges(set);
						gl.drawArrays(gl.POINTS, 0, Math.round(f.css.w * f.css.h * base / 1500));
						set = use(gl, land, f, t);
						ranges(set);
						set('uCols', 'uniform1i', cols);
						set('uTop', 'uniform1f', top);
						set('uCell', 'uniform1f', cell);
						gl.drawArrays(gl.POINTS, 0, cols * Math.max(0, rows));
						set = use(gl, walk, f, t);
						ranges(set);
						set('uTrail', 'uniform1i', 24);
						gl.drawArrays(gl.POINTS, 0, 24 * (f.stacked ? 3 : f.band ? 3 : 6));
					},
					destroy() {
						[glow, stars, land, walk, crests].forEach(p => gl.deleteProgram(p.p));
						gl.deleteTexture(tex);
						gl.deleteFramebuffer(fbo);
					},
				};
			},
		},
		2: {
			name: 'Glyph field',
			idea: 'Mountain ranges in rows of monospace glyphs that ripple, teal at the crests.',
			start: 12,
			still: 20,
			create(f) {
				const gl = f.gl;
				const prog = program(gl, GLYPH_VS, GLYPH_FS);
				const tex = gl.createTexture();
				let atlas = '';
				const cellSize = () => [2 * Math.round(4 * f.dpr), 2 * Math.round(6.5 * f.dpr)];
				const drawAtlas = (cw, ch) => {
					const c = document.createElement('canvas');
					c.width = cw * GLYPHS.length;
					c.height = ch;
					// A CPU-backed canvas, uploaded as bytes: no GPU readback.
					const x = c.getContext('2d', { willReadFrequently: true });
					x.fillStyle = '#000';
					x.fillRect(0, 0, c.width, c.height);
					x.fillStyle = '#fff';
					x.textAlign = 'center';
					x.textBaseline = 'middle';
					x.font = `${Math.round(ch * 0.8)}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`;
					GLYPHS.forEach((g, i) => x.fillText(g, (i + 0.5) * cw, ch * 0.52));
					const rgba = x.getImageData(0, 0, c.width, c.height).data;
					const red = new Uint8Array(c.width * c.height);
					for (let i = 0; i < red.length; i++) {
						red[i] = rgba[i * 4];
					}
					gl.bindTexture(gl.TEXTURE_2D, tex);
					gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, c.width, c.height, 0, gl.RED, gl.UNSIGNED_BYTE, red);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				};
				return {
					draw(t) {
						const [cw, ch] = cellSize();
						if (atlas !== `${cw}x${ch}`) {
							atlas = `${cw}x${ch}`;
							drawAtlas(cw, ch);
						}
						const cols = Math.ceil(f.canvas.width / cw);
						const rows = Math.ceil(f.canvas.height / ch);
						const set = use(gl, prog, f, t);
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, tex);
						set('uAtlas', 'uniform1i', 0);
						set('uCount', 'uniform1f', GLYPHS.length);
						set('uCell', 'uniform2f', cw, ch);
						set('uCols', 'uniform1i', cols);
						set('uBase', 'uniform1f', f.band ? 0.5 * f.untilFrac : f.stacked ? 0.66 : 0.42);
						set('uSpan', 'uniform1f', f.band ? 0.5 * f.untilFrac : f.stacked ? 0.2 : 0.3);
						gl.drawArrays(gl.POINTS, 0, cols * rows);
					},
					destroy() {
						gl.deleteProgram(prog.p);
						gl.deleteTexture(tex);
					},
				};
			},
		},
		3: {
			name: 'Swarm',
			idea: 'Thousands of points flowing in streams that gather into dithered spheres and flow on, endlessly.',
			clocked: true,
			// Each pixel shows its strongest point: dense streams can't add up to a glow behind the text they pass.
			blend: 'max',
			start: 0,
			// Reduced motion: the middle of the latest form's hold (a big one in banners, a high one in bands).
			stillAt(now, band) {
				let n = Math.floor((now - 0.55 * 30) / 15);
				if (((n % 2) + 2) % 2 !== (band ? 0 : 1)) {
					n -= 1;
				}
				return n * 15 + 0.55 * 30;
			},
			create(f) {
				const gl = f.gl;
				const prog = program(gl, SWARM_VS, POINT_FS);
				const cells = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, cells);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, swarmCells());
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_2D, null);
				return {
					draw(t) {
						// Read on resize, never per frame (it measures the header).
						const st = f.stage || (f.stage = swarmStage(f));
						const n = Math.floor(t / 15);
						const sec = Math.floor(t);
						const set = use(gl, prog, f, 0);
						set('uStage', 'uniform2f', st.w, st.h);
						set('uEpisode', 'uniform1i', n);
						set('uEpAge', 'uniform1f', t - n * 15);
						set('uSecMod', 'uniform1i', ((sec % 7919) + 7919) % 7919);
						set('uSubSec', 'uniform1f', t - sec);
						set('uTm', 'uniform1f', ((t % 4096) + 4096) % 4096);
						set('uSlot0', 'uniform1i', st.slot0);
						set('uSlot1', 'uniform1i', st.slot1);
						set('uStacked', 'uniform1f', st.stacked ? 1 : 0);
						set('uCellSize', 'uniform1f', st.cell);
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, cells);
						set('uCells', 'uniform1i', 0);
						gl.drawArrays(gl.POINTS, 0, st.slot0 + st.slot1 + st.streamers);
					},
					destroy() {
						gl.deleteProgram(prog.p);
						gl.deleteTexture(cells);
					},
				};
			},
		},
	};

	// The swarm (3) is the look. ?v=1 or ?v=2 on any page switches for the rest of the visit in this tab, for
	// comparing; ?v=3 goes back. Links never carry it.
	const VKEY = 'ai-first-design-workshop:field-version';
	const DEFAULT = '3';
	const params = new URLSearchParams(location.search);
	let version = DEFAULT;
	try {
		const asked = params.get('v');
		if (VERSIONS[asked]) {
			version = asked;
			if (asked === DEFAULT) {
				sessionStorage.removeItem(VKEY);
			} else {
				sessionStorage.setItem(VKEY, asked);
			}
		} else if (VERSIONS[sessionStorage.getItem(VKEY)]) {
			version = sessionStorage.getItem(VKEY);
		}
	} catch {
		version = VERSIONS[params.get('v')] ? params.get('v') : DEFAULT;
	}
	root.dataset.fieldVersion = version;

	// The swarm is one field with one seed on every page. The other versions show each page its own slice:
	// modules by number, other pages by name.
	const SWARM_SEED = 7;
	const pageSeed = () => {
		const file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '') || 'index';
		const n = file.match(/^module-(\d+)$/);
		if (n) {
			return Number(n[1]);
		}
		let h = 0;
		for (const ch of file) {
			h = (h * 31 + ch.charCodeAt(0)) >>> 0;
		}
		return 20 + (h % 977);
	};

	const union = (selector, tight) => {
		let l = Infinity;
		let t = Infinity;
		let r = -Infinity;
		let b = -Infinity;
		const add = e => {
			if (!e.width || !e.height) {
				return;
			}
			l = Math.min(l, e.left);
			t = Math.min(t, e.top);
			r = Math.max(r, e.right);
			b = Math.max(b, e.bottom);
		};
		for (const el of selector ? document.querySelectorAll(selector) : []) {
			if (el.closest('[hidden]') || getComputedStyle(el).display === 'none') {
				continue;
			}
			if (tight) {
				// The text itself, line by line, not the block's full width.
				const range = document.createRange();
				range.selectNodeContents(el);
				[...range.getClientRects()].forEach(add);
			} else {
				add(el.getBoundingClientRect());
			}
		}
		return r > l ? { l, t, r, b } : null;
	};

	// Where a band's title will end before it's on the page (a course page still opening), so the band draws from
	// the first frame and settles when the title arrives.
	const bandGuess = host => {
		const space = parseFloat(getComputedStyle(root).getPropertyValue('--band-space')) || 112;
		const strip = space + (host.width >= 1024 ? 48 : 28 + 76);
		return { strip, until: strip + 104 };
	};

	class Field {
		constructor(host) {
			this.host = host;
			this.band = host.dataset.field === 'band';
			this.onScreen = true;
			this.raf = 0;
			this.last = 0;
			this.frames = 0;
			this.draws = 0;
			this.times = [];
			this.box = [0, 0, 0, 0];
			this.clear = [0, 0, 0, 0];
			this.geometry = '';
			this.dirty = true;
			this.lastT = NaN;
			this.canvas = document.createElement('canvas');
			host.appendChild(this.canvas);
			this.gl = this.canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
			this.ok = Boolean(this.gl);
			host.fieldStats = () => this.stats();
			host.fieldFrames = 0;
			host.fieldDraws = 0;
			host.fieldTime = null;
			// For recordings: draw the moment t (seconds on the field's clock) exactly, without the loop.
			host.fieldSeek = t => {
				this.seekT = t;
				this.time = t;
				this.render(true);
			};
			this.canvas.addEventListener('webglcontextlost', e => {
				e.preventDefault();
				this.ok = false;
				cancelAnimationFrame(this.raf);
				this.raf = 0;
				this.state();
			});
			this.canvas.addEventListener('webglcontextrestored', () => {
				this.ok = true;
				this.scene = null;
				this.setVersion(this.version, false);
				this.start();
			});
			if (this.ok) {
				this.setVersion(version, true);
			}
			this.state();
		}

		setVersion(v, fresh) {
			if (this.scene) {
				this.scene.destroy();
				this.scene = null;
			}
			this.version = v;
			const spec = VERSIONS[v];
			this.seed = spec.clocked ? SWARM_SEED : this.host.dataset.seed ? Number(this.host.dataset.seed) : pageSeed();
			try {
				this.scene = spec.create(this);
				this.ok = true;
			} catch (err) {
				this.ok = false;
				this.host.dataset.fieldError = String((err && err.message) || err).slice(0, 300);
				this.state();
				return;
			}
			if (fresh || this.time === undefined) {
				this.time = spec.start;
			}
			this.stillT = undefined;
			this.dirty = true;
			this.resize();
		}

		// The moment to draw: the shared clock for the swarm, so every page shows it at "now"; the field's own time
		// for the others. Reduced motion holds one chosen moment for the life of the page.
		simTime() {
			const spec = VERSIONS[this.version];
			if (this.seekT !== undefined) {
				return this.seekT;
			}
			if (still()) {
				if (this.stillT === undefined) {
					this.stillT = spec.clocked ? spec.stillAt(clockNow(), this.band) : spec.still;
				}
				return this.stillT;
			}
			return spec.clocked ? clockNow() : this.time;
		}

		resize() {
			if (!this.ok || !this.host.isConnected) {
				return;
			}
			const box = this.host.getBoundingClientRect();
			if (!box.width || !box.height) {
				this.ready = false;
				return;
			}
			const dpr = Math.min(window.devicePixelRatio || 1, this.band ? 1.5 : 2);
			const w = Math.max(1, Math.round(box.width * dpr));
			const h = Math.max(1, Math.round(box.height * dpr));
			if (w !== this.canvas.width || h !== this.canvas.height) {
				this.canvas.width = w;
				this.canvas.height = h;
			}
			this.dpr = dpr;
			this.css = { w: box.width, h: box.height };
			this.stage = null;
			this.stacked = box.width < 720;
			this.gain = this.band ? 0.8 : 1;
			this.feather = (this.band ? 56 : this.stacked ? 60 : 150) * dpr;
			this.measure(box);
			// Only a real change draws again: a still frame drawn twice is wasted work and must never look like motion.
			const key = [w, h, dpr, window.innerHeight, ...this.box, ...this.clear, this.until, this.fadeLen, this.stripFrac, this.ready ? 1 : 0].map(v => Math.round(v)).join(',');
			if (key !== this.geometry) {
				this.geometry = key;
				this.dirty = true;
			}
			this.render();
		}

		// What to keep clear, in device px from the host's top left: the text block (dimmed), anything that must sit
		// on the plain ground (cleared), and for bands, where the field has faded out (the title's bottom).
		measure(host) {
			const d = this.host.dataset;
			const toBox = (u, pad) => [(u.l - pad - host.left) * this.dpr, (u.t - pad - host.top) * this.dpr, (u.r + pad - host.left) * this.dpr, (u.b + pad - host.top) * this.dpr];
			const text = union(d.fieldAvoid, this.band);
			if (text && !this.band) {
				// The banner's text runs down the left side: keep the whole left side calm, and the top.
				if (text.l - host.left < host.width * 0.25) {
					text.l = host.left - 400;
				}
				if (text.t - host.top < 160) {
					text.t = host.top - 400;
				}
			}
			this.box = text ? toBox(text, this.band ? 14 : 20) : [0, 0, 0, 0];
			const clear = union(d.fieldClear, false);
			this.clear = clear ? toBox(clear, 12) : [0, 0, 0, 0];
			this.ready = true;
			this.until = this.canvas.height * 4;
			this.untilFrac = 1;
			this.stripFrac = 0.5;
			this.fadeLen = 1;
			if (d.fieldUntil) {
				const end = union(d.fieldUntil, false);
				const first = union(d.fieldTop, false);
				const guess = bandGuess(host);
				const until = end ? end.b - host.top + 8 : guess.until;
				const strip = end ? (first ? Math.max(48, first.t - host.top) : until * 0.5) : guess.strip;
				this.until = Math.min(this.canvas.height, until * this.dpr);
				this.untilFrac = this.until / this.canvas.height;
				// The strip above the page's first content is the band's own room.
				this.stripFrac = Math.min(strip * this.dpr, this.until) / this.canvas.height;
				this.fadeLen = Math.max(40, until - Math.max(48, strip - 24)) * this.dpr;
			} else if (!this.band) {
				this.until = this.canvas.height + 2;
				this.fadeLen = this.canvas.height * (this.stacked ? 0.12 : 0.16);
			}
		}

		get light() {
			return false;
		}

		get palette() {
			return PALETTES[this.light ? 'light' : 'dark'];
		}

		// Draws when the moment or the geometry changed (or when asked); counts only frames that moved the field.
		render(force) {
			if (!this.ok || !this.scene || !this.css || this.gl.isContextLost()) {
				return;
			}
			const t = this.simTime();
			if (!force && !this.dirty && t === this.lastT) {
				return;
			}
			const gl = this.gl;
			const t0 = performance.now();
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this.dirty = false;
			if (!this.ready) {
				this.lastT = NaN;
				this.host.classList.remove('is-on');
				return;
			}
			gl.enable(gl.BLEND);
			if (VERSIONS[this.version].blend === 'max') {
				gl.blendEquation(gl.MAX);
				gl.blendFunc(gl.ONE, gl.ONE);
			} else {
				gl.blendEquation(gl.FUNC_ADD);
				if (this.palette.additive) {
					gl.blendFunc(gl.ONE, gl.ONE);
				} else {
					gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				}
			}
			this.scene.draw(t);
			const spent = performance.now() - t0;
			this.times.push(spent);
			if (this.times.length > 600) {
				this.times.shift();
			}
			this.draws += 1;
			if (t !== this.lastT) {
				this.frames += 1;
			}
			this.lastT = t;
			this.host.fieldFrames = this.frames;
			this.host.fieldDraws = this.draws;
			this.host.fieldTime = t;
			this.host.classList.add('is-on');
		}

		stats() {
			const s = [...this.times].sort((a, b) => a - b);
			const at = q => s[Math.min(s.length - 1, Math.floor(q * s.length))] || 0;
			return { frames: this.frames, draws: this.draws, samples: s.length, mean: s.reduce((a, b) => a + b, 0) / (s.length || 1), p50: at(0.5), p95: at(0.95), max: s[s.length - 1] || 0, version: this.version, dpr: this.dpr, size: [this.canvas.width, this.canvas.height] };
		}

		running() {
			return this.ok && this.ready && this.onScreen && this.host.isConnected && !document.hidden && !still() && !paused && this.seekT === undefined;
		}

		state() {
			this.host.dataset.state = !this.ok ? 'off' : still() ? 'still' : paused ? 'paused' : 'running';
		}

		// A field whose host left the page (the password screen, once the course opens) lets its context go.
		dispose() {
			cancelAnimationFrame(this.raf);
			this.raf = 0;
			this.scene?.destroy();
			this.scene = null;
			this.ok = false;
			this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
		}

		frame(now) {
			this.raf = 0;
			if (!this.host.isConnected) {
				this.dispose();
				return;
			}
			if (!this.running()) {
				this.last = 0;
				return;
			}
			// The other versions' bands may run at 30 fps; the swarm keeps its motion smooth everywhere.
			const step = this.band && !VERSIONS[this.version].clocked ? 1000 / 30 - 3 : 0;
			if (this.last && now - this.last < step) {
				this.raf = requestAnimationFrame(n => this.frame(n));
				return;
			}
			const dt = this.last ? Math.min(now - this.last, 100) : 16;
			this.last = now;
			this.time += dt / 1000;
			this.render();
			this.raf = requestAnimationFrame(n => this.frame(n));
		}

		start() {
			if (!this.host.isConnected) {
				if (this.ok) {
					this.dispose();
				}
				return;
			}
			this.state();
			if (!this.running()) {
				cancelAnimationFrame(this.raf);
				this.raf = 0;
				this.last = 0;
				this.render();
				return;
			}
			if (!this.raf) {
				this.last = 0;
				this.raf = requestAnimationFrame(n => this.frame(n));
			}
		}
	}

	// A page that opens with the course key already in this browser never shows its password screen, so its field
	// isn't worth a context.
	const opening = root.classList.contains('course-open');
	const fields = hosts.filter(h => !(opening && h.closest('#course-locked'))).map(host => new Field(host));
	const live = () => fields.filter(f => f.host.isConnected);
	const startAll = () => fields.forEach(f => f.start());
	const resizeAll = () => live().forEach(f => f.resize());

	// Pause: one quiet control per field, all in step. Shown only when there's something to stop.
	const syncPause = () => {
		const can = !still() && live().some(f => f.ok);
		root.toggleAttribute('data-paused', paused);
		for (const b of document.querySelectorAll('.field-pause')) {
			b.hidden = !can;
			b.dataset.state = paused ? 'paused' : 'playing';
			b.setAttribute('aria-label', paused ? 'Play the background animation' : 'Pause the background animation');
		}
	};
	// Its tooltip (site.css) shows on hover and keyboard focus; Esc hides it until the pointer or focus moves on.
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			document.querySelectorAll('.field-pause').forEach(b => {
				if (b.matches(':hover, :focus-visible')) {
					b.dataset.tip = 'off';
				}
			});
		}
	});
	const tipBack = e => {
		const b = e.target.closest?.('.field-pause');
		if (b && !b.contains(e.relatedTarget)) {
			delete b.dataset.tip;
		}
	};
	document.addEventListener('mouseout', tipBack);
	document.addEventListener('focusout', tipBack);
	document.addEventListener('click', e => {
		if (!e.target.closest?.('.field-pause')) {
			return;
		}
		paused = !paused;
		writePaused(paused);
		settle();
		syncPause();
		startAll();
	});
	// Another tab or page paused or played: follow it.
	const reread = () => {
		paused = readPaused();
		clock = readClock();
		settle();
		syncPause();
		startAll();
	};
	window.addEventListener('storage', e => {
		if (e.key === STORE || e.key === CLOCK) {
			reread();
		}
	});
	// Back or forward from the page cache: pick up the shared clock again (other pages may have paused or played).
	window.addEventListener('pageshow', e => {
		if (e.persisted) {
			reread();
		}
	});
	// The course opened (site.js): its title is on the page now, and the password screen is gone.
	document.addEventListener('course:open', () => {
		syncPause();
		resizeAll();
		startAll();
	});

	if ('ResizeObserver' in window) {
		const sizes = new ResizeObserver(() => resizeAll());
		fields.forEach(f => sizes.observe(f.host));
		document.querySelectorAll('.hero-text, .lock-body, .page-head').forEach(el => sizes.observe(el));
	} else {
		window.addEventListener('resize', resizeAll);
	}
	if ('IntersectionObserver' in window) {
		const seen = new IntersectionObserver(entries => entries.forEach(e => {
			const field = fields.find(f => f.host === e.target);
			if (field) {
				field.onScreen = e.isIntersecting;
				field.start();
			}
		}));
		fields.forEach(f => seen.observe(f.host));
	}
	document.addEventListener('visibilitychange', startAll);
	reduce.addEventListener?.('change', () => {
		live().forEach(f => {
			f.stillT = undefined;
			f.dirty = true;
		});
		syncPause();
		startAll();
	});
	lightScheme.addEventListener?.('change', () => live().forEach(f => {
		f.dirty = true;
		f.render();
	}));
	document.fonts?.ready.then(resizeAll);
	syncPause();
	startAll();
})();
