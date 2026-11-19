/* Text slide: a low, still horizon, plus a small one inside the main block. */
(function () {
  function go() {
    Horizon.mount(document.getElementById('band'), { level: 0.207, tilt: 0.57, cell: 7, intro: 'none' });
    Horizon.mount(document.getElementById('main-card'), { level: 0.36, tilt: 0.26, cell: 6, glow: 0.3, intro: 'none' });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
})();
