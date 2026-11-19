/* Title slide: the arrival loop. Knobs: ?speed= ?intensity= ?swell= ?moments= */
(function () {
  function go() {
    Horizon.mount(document.getElementById('band'), {
      level: 0.405, tilt: 0.66, cell: 7, intro: 'rise', ambient: true, interactive: true
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
})();
