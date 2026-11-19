// Mounts the Horizon kit (assets/horizon/, the kit as is) on this site, after the fonts are ready, the way the kit's
// demo does: the home page's hero gets the rise, the continuous arrival loop, the cursor swell and a little lift with
// scroll; inner pages get a thin, still strip at the top. Reading text never sits on the moving band: the band's
// height is capped so it stays under every line of the hero's words. The loop has a pause button. Without the kit,
// nothing happens, and the pages read the same.
(() => {
	'use strict';

	const H = window.Horizon;
	if (!H || typeof H.mount !== 'function') {
		return;
	}
	document.documentElement.classList.add('has-horizon');

	// The kit's site demo values, per width. The band's height at u across is H * level * (1 - t + t * (curve + 1) *
	// u^curve), with t = tilt. Under 720px the band is flatter and lower.
	const SHAPES = {
		wide: { level: 0.31, tilt: 0.58, curve: 2.4, swell: 1, cell: 6 },
		phone: { level: 0.13, tilt: 0.3, curve: 1.6, swell: 0.55, cell: 5 },
	};
	const phone = () => window.innerWidth < 720;

	function mountHero(hero) {
		const words = [...hero.querySelectorAll('.hero-text > *, .hero-text > div > *')].filter(el => !el.matches('div'));
		// The level, capped so the band (with room for its swell, its dissolving top and the scroll lift) stays under
		// each line of words where that line ends.
		const fit = shape => {
			const box = hero.getBoundingClientRect();
			let level = shape.level;
			for (const el of words) {
				const r = el.getBoundingClientRect();
				if (!r.width) {
					continue;
				}
				const u = Math.min(1, Math.max(0, (r.right - box.left) / box.width));
				const rise = 1 - shape.tilt + shape.tilt * (shape.curve + 1) * Math.pow(u, shape.curve);
				const room = box.bottom - r.bottom - 16;
				level = Math.min(level, Math.max(0.04, room / (box.height * rise * 1.3)));
			}
			return level;
		};
		let mode = phone() ? 'phone' : 'wide';
		let shape = SHAPES[mode];
		let level = fit(shape);
		const band = H.mount(hero, {
			level, tilt: shape.tilt, curve: shape.curve, swell: shape.swell, cell: shape.cell,
			intro: 'rise', ambient: true, interactive: true, scrollLift: 0.25,
		});
		const refit = () => {
			const next = phone() ? 'phone' : 'wide';
			if (next !== mode) {
				mode = next;
				shape = SHAPES[mode];
				band.set({ curve: shape.curve, swell: shape.swell, cell: shape.cell });
				band.setTilt(shape.tilt, { duration: 0 });
			}
			const l = fit(shape);
			if (Math.abs(l - level) > 0.002) {
				level = l;
				band.setLevel(level, { duration: 0 });
			}
		};
		let pending = 0;
		const later = () => {
			cancelAnimationFrame(pending);
			pending = requestAnimationFrame(refit);
		};
		window.addEventListener('resize', later);
		if (window.ResizeObserver) {
			new ResizeObserver(later).observe(hero);
		}

		// The loop keeps moving, so it gets a pause button, and the choice holds for this visit.
		const button = hero.querySelector('.hero-pause');
		if (!button || !H.motionAllowed()) {
			return;
		}
		const KEY = 'ai-first:hero-paused';
		const label = button.querySelector('.hero-pause-label');
		const set = paused => {
			if (paused) {
				band.pause();
			} else {
				band.resume();
			}
			button.dataset.state = paused ? 'paused' : 'playing';
			if (label) {
				label.textContent = paused ? 'Play the animation' : 'Pause the animation';
			}
		};
		let paused = false;
		try {
			paused = sessionStorage.getItem(KEY) === '1';
		} catch {
			paused = false;
		}
		button.hidden = false;
		set(paused);
		button.addEventListener('click', () => {
			paused = !paused;
			set(paused);
			try {
				sessionStorage.setItem(KEY, paused ? '1' : '0');
			} catch {
				// private windows may refuse storage; the button still works
			}
		});
	}

	function go() {
		const hero = document.querySelector('[data-horizon="hero"]');
		if (hero) {
			mountHero(hero);
		}
		const strip = document.querySelector('[data-horizon="strip"]');
		if (strip) {
			H.mount(strip, { edge: 'top', level: 0.62, tilt: 0.45, cell: 4, glow: 0.2, swell: 0.5, intro: 'none' });
		}
	}

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(go);
	} else {
		go();
	}
})();
