/* Landing hero: ambient, interactive, rises a little with scroll. */
(function () {
  function shape() {
    return window.innerWidth < 720
      ? { level: 0.13, tilt: 0.3, curve: 1.6, swell: 0.55, cell: 5 }
      : { level: 0.31, tilt: 0.58, curve: 2.4, swell: 1, cell: 6 };
  }
  function go() {
    var s = shape(), phone = window.innerWidth < 720;
    var hz = Horizon.mount(document.getElementById('hero'), {
      level: s.level, tilt: s.tilt, curve: s.curve, swell: s.swell, cell: s.cell,
      intro: 'rise', ambient: true, interactive: true, scrollLift: 0.25
    });
    window.addEventListener('resize', function () {
      var p = window.innerWidth < 720;
      if (p === phone) return;
      phone = p; var n = shape();
      hz.set({ curve: n.curve, swell: n.swell, cell: n.cell });
      hz.setLevel(n.level, { duration: 0 }); hz.setTilt(n.tilt, { duration: 0 });
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();

  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  function close() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () { var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); } });
})();
