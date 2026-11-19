/* Setup canvas welcome. No inline script or style, so it runs under a strict webview CSP. */
(function () {
  function go() {
    Horizon.mount(document.getElementById('panel'), {
      level: 0.5, tilt: 0.34, cell: 5, intro: 'rise', ambient: true, interactive: true,
      speed: 0.6, intensity: 0.7, swell: 0.6, moments: 0
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  var btn = document.getElementById('continue');
  var inputs = document.querySelectorAll('input[name="workshop"]');
  function sync() { var any = false; for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) any = true; btn.disabled = !any; }
  for (var i = 0; i < inputs.length; i++) inputs[i].addEventListener('change', sync);
  sync();
})();
