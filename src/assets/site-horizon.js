// Mounts the Horizon kit (assets/horizon/, synced as is) on this site: the home page's hero gets the kit's
// continuous ambient loop and its intro, with a button to pause it; every inner page gets a thin still strip under
// the header. The hero's words never wait for the animation. Without the kit, nothing happens, and the pages read the
// same.
(() => {
	'use strict';

	const H = window.Horizon;
	if (!H || typeof H.mount !== 'function') {
		return;
	}
	document.documentElement.classList.add('has-horizon');

	const hero = document.querySelector('[data-horizon="hero"]');
	if (hero) {
		// The band rises toward the right, so its height follows the layout: for each line of the hero's words, the band
		// (with room for its swell and its dissolving top) stays under that line where the line ends. Phones get a
		// gentler slope. The kit draws the height H * level * (1 - t + t * (curve + 1) * u^curve) at u across, t = tilt.
		const words = [...hero.querySelectorAll('.hero-text > *, .hero-text > div > *')].filter(el => !el.matches('div'));
		const fit = curve => {
			const box = hero.getBoundingClientRect();
			const W = box.width;
			const Ht = box.height;
			const tilt = W < 720 ? 0.3 : 0.55;
			let level = 0.34;
			for (const el of words) {
				const r = el.getBoundingClientRect();
				if (!r.width) {
					continue;
				}
				const u = Math.min(1, Math.max(0, (r.right - box.left) / W));
				const shape = 1 - tilt + tilt * (curve + 1) * Math.pow(u, curve);
				const room = box.bottom - r.bottom - 16;
				level = Math.min(level, Math.max(0.04, room / (Ht * shape * 1.25)));
			}
			return { level, tilt };
		};
		const first = fit((H.defaults && H.defaults.curve) || 1.6);
		const band = H.mount(hero, { ambient: true, intro: 'rise', level: first.level, tilt: first.tilt, cell: 6, glow: 0.6 });
		let last = `${first.level.toFixed(3)} ${first.tilt}`;
		const refit = () => {
			const next = fit((band.S && band.S.curve) || 1.6);
			const key = `${next.level.toFixed(3)} ${next.tilt}`;
			if (key !== last) {
				last = key;
				band.setLevel(next.level, { duration: 0 });
				band.setTilt(next.tilt, { duration: 0 });
			}
		};
		if (window.ResizeObserver) {
			new ResizeObserver(refit).observe(hero);
		}
		document.fonts?.ready.then(refit);
		// Kit 1.0.0 can start its intro with a negative time step, which leaves the band stuck before it rises. If that
		// happens, start the intro again: the loop is already running then, so the next step is positive.
		const unstick = () => {
			if (band && band.introT < 0 && band.S && band.S.rise < 1 && typeof band.replay === 'function') {
				band.replay();
			}
		};
		setTimeout(unstick, 300);
		setTimeout(unstick, 1200);
		// The loop keeps moving, so it gets a pause button (and keeps the choice for this visit).
		const button = hero.querySelector('.hero-pause');
		if (button && H.motionAllowed()) {
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
	}

	const strip = document.querySelector('[data-horizon="strip"]');
	if (strip) {
		H.mount(strip, { ambient: false, intro: 'none', edge: 'top', level: 0.85, tilt: 0.35, cell: 5, glow: 0.4 });
	}
})();
