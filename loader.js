(function initSiteLoader() {
  var LOADER_KEY = 'intro_seen';
  var loader = document.getElementById('site-loader');
  var main = document.getElementById('site-main');
  if (!loader || !main) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skipLoader = prefersReduced || sessionStorage.getItem(LOADER_KEY) === '1';

  function showMain() {
    document.body.classList.remove('is-loading');
    loader.classList.add('is-done');
    main.classList.add('is-ready');
    sessionStorage.setItem(LOADER_KEY, '1');
    window.setTimeout(function() {
      loader.classList.add('is-skipped');
    }, 600);
  }

  if (skipLoader) {
    loader.classList.add('is-skipped');
    document.body.classList.remove('is-loading');
    main.classList.add('is-ready');
    return;
  }

  document.body.classList.add('is-loading');
  window.setTimeout(showMain, 2000);
})();
