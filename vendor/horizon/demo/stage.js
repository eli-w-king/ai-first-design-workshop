/* Fits a 1920x1080 .stage to the viewport. Load after horizon.js. */
(function () {
  function fit() {
    var stage = document.querySelector('.stage');
    if (!stage) return;
    var vw = window.innerWidth, vh = window.innerHeight, s = Math.min(vw / 1920, vh / 1080);
    stage.style.transform = 'translate(' + ((vw - 1920 * s) / 2) + 'px,' + ((vh - 1080 * s) / 2) + 'px) scale(' + s + ')';
  }
  fit();
  window.addEventListener('resize', fit);
  window.fitStage = fit;
})();
