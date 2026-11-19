/* print.html?w=3300&h=5100&level=.32&tilt=.12&cell=12&seed=7&edge=bottom&bg=%23ffffff
   Renders one still at exactly w by h pixels. Export with Playwright (see README). */
(function () {
  var q = new URLSearchParams(location.search);
  function n(k, d) { var v = parseFloat(q.get(k)); return isNaN(v) ? d : v; }
  var w = Math.round(n('w', 3300)), h = Math.round(n('h', 5100));
  var page = document.createElement('style');
  page.textContent = '@page { size: ' + w + 'px ' + h + 'px; margin: 0; } html, body { width: ' + w + 'px; height: ' + h + 'px; }';
  document.head.appendChild(page);
  var cv = document.getElementById('c');
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  Horizon.renderStill(cv, {
    width: w, height: h, level: n('level', 0.32), tilt: n('tilt', 0.12), curve: n('curve', 1.6),
    cell: n('cell', 0) || undefined, seed: n('seed', 7), swell: n('swell', 1), glow: n('glow', 0.6),
    edge: q.get('edge') || 'bottom', background: q.get('bg') || '#ffffff'
  });
  document.documentElement.setAttribute('data-ready', '1');
})();
