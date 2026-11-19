/* One horizon for the whole deck. Each slide sets data-level, data-tilt and data-motion; the band eases between them.
   Keys: Right, Space or Page Down for next; Left or Page Up for back; Home and End. Open at a slide with ?slide=2. */
(function () {
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  var count = document.getElementById('count');
  var q = parseInt(new URLSearchParams(location.search).get('slide'), 10);
  var index = isNaN(q) ? 0 : Math.max(0, Math.min(slides.length - 1, q - 1));
  var hz, card;
  function num(el, k, d) { var v = parseFloat(el.getAttribute('data-' + k)); return isNaN(v) ? d : v; }
  function show(i, animate) {
    index = i;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    count.textContent = (i + 1) + ' / ' + slides.length;
    var s = slides[i], d = animate ? 1400 : 0;
    hz.setLevel(num(s, 'level', 0.3), { duration: d, easing: 'inOut' });
    hz.setTilt(num(s, 'tilt', 0.5), { duration: d, easing: 'inOut' });
    hz.setMotion(num(s, 'motion', 0), { duration: animate ? 1600 : 0 });
  }
  function go() {
    var s = slides[index];
    hz = Horizon.mount(deck, {
      level: num(s, 'level', 0.3), tilt: num(s, 'tilt', 0.5), cell: 7,
      intro: index === 0 ? 'rise' : 'none', ambient: num(s, 'motion', 0) > 0, interactive: true,
      condense: index === 0 ? slides[0].querySelectorAll('[data-hz-condense]') : []
    });
    card = Horizon.mount(document.getElementById('main-card'), { level: 0.36, tilt: 0.26, cell: 6, glow: 0.3, intro: 'none' });
    show(index, false);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); if (index < slides.length - 1) show(index + 1, true); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); if (index > 0) show(index - 1, true); }
      else if (e.key === 'Home') show(0, true);
      else if (e.key === 'End') show(slides.length - 1, true);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
})();
