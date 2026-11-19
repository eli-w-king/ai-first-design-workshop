// Copy buttons, the phone menu, links into closed sections and the wall's clips. The hero's glow is glow.js.
(() => {
	'use strict';

	const live = document.getElementById('live');
	const announce = text => {
		if (!live) {
			return;
		}
		live.textContent = '';
		setTimeout(() => { live.textContent = text; }, 30);
	};

	// ------------------------------------------------------------ copy

	async function copyText(text) {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return;
		}
		const area = document.createElement('textarea');
		area.value = text;
		area.setAttribute('readonly', '');
		area.style.position = 'fixed';
		area.style.opacity = '0';
		document.body.append(area);
		area.select();
		const ok = document.execCommand('copy');
		area.remove();
		if (!ok) {
			throw new Error('copy failed');
		}
	}

	document.addEventListener('click', async event => {
		const button = event.target.closest('[data-copy]');
		if (!button) {
			return;
		}
		const code = button.closest('.block')?.querySelector('code');
		if (!code) {
			return;
		}
		const label = button.querySelector('.copy-text');
		clearTimeout(button._reset);
		try {
			await copyText(code.textContent);
			button.dataset.state = 'copied';
			if (label) {
				label.textContent = 'Copied';
			}
			announce('Copied to the clipboard');
		} catch {
			button.dataset.state = 'failed';
			if (label) {
				label.textContent = 'Select and copy';
			}
			const range = document.createRange();
			range.selectNodeContents(code);
			const selection = getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
			announce('Copy did not work here. The text is selected, so you can copy it yourself.');
		}
		button._reset = setTimeout(() => {
			delete button.dataset.state;
			if (label) {
				label.textContent = 'Copy';
			}
		}, 2400);
	});

	// ------------------------------------------------------------ links into closed sections

	// A link to something inside a closed section (setup.html#composer) opens it first.
	const openTarget = () => {
		if (!location.hash) {
			return;
		}
		let target = null;
		try {
			target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
		} catch {
			return;
		}
		let details = target && target.closest('details');
		let opened = false;
		while (details) {
			if (!details.open) {
				details.open = true;
				opened = true;
			}
			details = details.parentElement && details.parentElement.closest('details');
		}
		if (opened) {
			target.scrollIntoView();
		}
	};
	openTarget();
	window.addEventListener('hashchange', openTarget);
	// A second click on the same link (Transcript, after closing it) doesn't change the hash, so open it here too.
	document.addEventListener('click', event => {
		const link = event.target.closest && event.target.closest('a[href^="#"]');
		if (!link || link.getAttribute('href').length < 2 || location.hash !== link.getAttribute('href')) {
			return;
		}
		openTarget();
	});

	// ------------------------------------------------------------ the wall (the Intro)

	// Each loop is muted and loads nothing until it plays. It plays while it's on screen and its button pauses it.
	// With reduced motion, or ?motion=off, nothing plays until someone presses Play.
	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
	const motionOff = () => reduceMotion.matches || document.documentElement.dataset.motion === 'off';
	const wallTiles = new Set();
	const wallPlay = video => video.play().catch(() => {});
	const wallView = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
		for (const { target, isIntersecting } of entries) {
			const video = target.querySelector('video');
			if (isIntersecting && !motionOff() && !target.wallHeld) {
				wallPlay(video);
			} else if (!isIntersecting) {
				video.pause();
			}
		}
	}, { threshold: 0.35 }) : null;
	const wallSync = tile => {
		const playing = !tile.querySelector('video').paused;
		const button = tile.querySelector('.wall-play');
		tile.dataset.state = playing ? 'playing' : 'paused';
		button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} the clip: ${button.dataset.label}`);
	};
	for (const tile of document.querySelectorAll('.wall-has-loop')) {
		const video = tile.querySelector('video');
		const button = tile.querySelector('.wall-play');
		if (!video || !button) {
			continue;
		}
		tile.dataset.state = 'paused';
		video.addEventListener('play', () => wallSync(tile));
		video.addEventListener('pause', () => wallSync(tile));
		video.addEventListener('playing', () => tile.classList.add('is-live'));
		button.addEventListener('click', () => {
			tile.wallHeld = !video.paused;
			if (video.paused) {
				wallPlay(video);
			} else {
				video.pause();
			}
		});
		wallTiles.add(tile);
		wallView?.observe(tile);
	}
	reduceMotion.addEventListener?.('change', () => {
		if (motionOff()) {
			wallTiles.forEach(tile => tile.querySelector('video').pause());
		}
	});

	// ------------------------------------------------------------ phone menu

	const toggle = document.querySelector('.menu-toggle');
	const nav = document.getElementById('site-nav');
	if (toggle && nav) {
		const set = open => {
			toggle.setAttribute('aria-expanded', String(open));
			nav.classList.toggle('open', open);
		};
		toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
				set(false);
				toggle.focus();
			}
		});
		nav.addEventListener('click', event => {
			if (event.target.closest('a')) {
				set(false);
			}
		});
	}
})();
