// The one dithered moment on a page: an ordered (Bayer 8 by 8) dither of a teal-to-black gradient along a
// diagonal, like the UXPA poster. Each canvas pixel is one cell, scaled up crisp, so the squares show at the
// edge and the light is smooth at the corner. It rises in over about three seconds, then settles and stays
// still. With reduced motion or ?motion=off, it draws the final still frame right away. It only animates
// while it's on screen.
(() => {
	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42,
		48, 16, 56, 24, 50, 18, 58, 26,
		12, 44, 4, 36, 14, 46, 6, 38,
		60, 28, 52, 20, 62, 30, 54, 22,
		3, 35, 11, 43, 1, 33, 9, 41,
		51, 19, 59, 27, 49, 17, 57, 25,
		15, 47, 7, 39, 13, 45, 5, 37,
		63, 31, 55, 23, 61, 29, 53, 21,
	].map(v => (v + 0.5) / 64);
	// Deep ocean, ocean blue (#1e87a8), teal and cyan (#75e2e1). Cells that are off show the dark ground.
	const STOPS = [[0, [10, 52, 72]], [0.4, [30, 135, 168]], [0.72, [72, 194, 205]], [1, [117, 226, 225]]];
	const RISE = 3200;
	const FRAME = 50;

	const shade = s => {
		for (let i = 1; i < STOPS.length; i++) {
			const [b, cb] = STOPS[i];
			const [a, ca] = STOPS[i - 1];
			if (s <= b) {
				const k = (s - a) / (b - a);
				return [0, 1, 2].map(c => Math.round(ca[c] + (cb[c] - ca[c]) * k));
			}
		}
		return STOPS[STOPS.length - 1][1];
	};
	const PALETTE = Array.from({ length: 256 }, (_, i) => shade(i / 255));

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	const still = () => reduce.matches || document.documentElement.dataset.motion === 'off';
	const ease = p => 1 - Math.pow(1 - p, 3);

	class Field {
		constructor(host) {
			this.host = host;
			// How far the glow reaches from the bottom right corner, as a share of the diagonal.
			this.reach = Number(host.dataset.reach) || 0.62;
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			host.appendChild(this.canvas);
			this.onScreen = true;
			this.started = null;
			this.done = false;
			this.raf = 0;
			this.last = 0;
			this.resize();
		}

		resize() {
			const box = this.host.getBoundingClientRect();
			if (!box.width || !box.height) {
				return;
			}
			const cell = box.width < 480 ? 5 : 6;
			const cols = Math.ceil(box.width / cell);
			const rows = Math.ceil(box.height / cell);
			if (cols !== this.cols || rows !== this.rows) {
				Object.assign(this, { cols, rows });
				this.canvas.width = cols;
				this.canvas.height = rows;
				this.canvas.style.width = `${cols * cell}px`;
				this.canvas.style.height = `${rows * cell}px`;
				this.image = this.ctx.createImageData(cols, rows);
				// How far each cell is from the bottom right corner: mostly along the diagonal, a little round.
				// Edges that sit inside the page (next to text, not at the window's edge) thin out softly, so the
				// field never ends in a hard cut.
				this.base = new Float32Array(cols * rows);
				const w = cols * cell;
				const h = rows * cell;
				const doc = document.documentElement;
				const top = box.top + window.scrollY;
				const left = box.left + window.scrollX;
				const inside = {
					left: left > 0.5,
					top: top > 0.5,
					right: left + box.width < doc.clientWidth - 0.5,
					bottom: top + box.height < doc.scrollHeight - 0.5,
				};
				const band = Math.min(220, Math.max(80, Math.min(w, h) * 0.3));
				const smooth = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
				for (let y = 0; y < rows; y++) {
					for (let x = 0; x < cols; x++) {
						const dx = (w - x * cell) / (w + h);
						const dy = (h - y * cell) / (w + h);
						const d = 0.75 * (dx + dy) + 0.25 * Math.hypot(dx, dy) * Math.SQRT2;
						let fade = 1;
						if (inside.left) fade *= smooth((x * cell) / band);
						if (inside.top) fade *= smooth((y * cell) / band);
						if (inside.right) fade *= smooth((w - x * cell) / band);
						if (inside.bottom) fade *= smooth((h - y * cell) / band);
						this.base[y * cols + x] = (1 - d / this.reach) * fade;
					}
				}
			}
			if (this.started === null) {
				// Not started yet: the final still frame with reduced motion, otherwise the dark first frame.
				this.draw(still() ? 1 : 0);
			} else {
				this.paint(this.done ? null : performance.now());
			}
		}

		// rise: 0 to 1 as the glow comes in. A soft wave moves through it while it rises and is gone at the end,
		// so the still frame is the same with or without motion.
		draw(rise) {
			const { cols, rows, base, image } = this;
			const data = image.data;
			const t = rise * 3.2;
			const sway = 1 - rise;
			const fx = new Float32Array(cols);
			const fy = new Float32Array(rows);
			for (let x = 0; x < cols; x++) {
				fx[x] = Math.sin((x / cols) * 5.1 + t * 0.9);
			}
			for (let y = 0; y < rows; y++) {
				fy[y] = Math.cos((y / rows) * 4.3 - t * 0.7);
			}
			const lift = (1 - rise) * 0.7;
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const i = y * cols + x;
					const wave = 0.07 * fx[x] * fy[y] + 0.04 * Math.sin((x / cols + y / rows) * 7.7 - t);
					const s = base[i] - lift + wave * sway;
					const o = i * 4;
					if (s > BAYER[(y & 7) * 8 + (x & 7)]) {
						const c = PALETTE[Math.max(0, Math.min(255, Math.round((0.3 + 0.7 * s) * 255)))];
						data[o] = c[0];
						data[o + 1] = c[1];
						data[o + 2] = c[2];
						data[o + 3] = 255;
					} else {
						data[o + 3] = 0;
					}
				}
			}
			this.ctx.putImageData(image, 0, 0);
		}

		paint(now) {
			if (!this.image) {
				return;
			}
			if (now === null || still()) {
				this.draw(1);
				return;
			}
			this.draw(ease(Math.min(1, (now - this.started) / RISE)));
		}

		frame(now) {
			this.raf = 0;
			if (!this.onScreen || document.hidden || still()) {
				return;
			}
			if (now - this.last >= FRAME) {
				this.last = now;
				this.paint(now);
			}
			if (now - this.started < RISE) {
				this.raf = requestAnimationFrame(n => this.frame(n));
			} else {
				this.done = true;
				this.paint(null);
			}
		}

		start() {
			if (still() || this.done) {
				this.paint(null);
				return;
			}
			if (this.started === null) {
				this.started = performance.now();
			}
			if (!this.raf && this.onScreen && !document.hidden) {
				this.raf = requestAnimationFrame(n => this.frame(n));
			}
		}
	}

	const fields = [...document.querySelectorAll('[data-dither]')].map(host => new Field(host));
	if (!fields.length) {
		return;
	}
	if ('ResizeObserver' in window) {
		const sizes = new ResizeObserver(entries => entries.forEach(e => fields.find(f => f.host === e.target)?.resize()));
		fields.forEach(f => sizes.observe(f.host));
	}
	if ('IntersectionObserver' in window) {
		const seen = new IntersectionObserver(entries => entries.forEach(e => {
			const field = fields.find(f => f.host === e.target);
			if (field) {
				field.onScreen = e.isIntersecting;
				if (field.onScreen) {
					field.start();
				}
			}
		}));
		fields.forEach(f => seen.observe(f.host));
	} else {
		fields.forEach(f => f.start());
	}
	document.addEventListener('visibilitychange', () => fields.forEach(f => f.start()));
	reduce.addEventListener?.('change', () => fields.forEach(f => f.start()));
})();
