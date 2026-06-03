(function initSteppedEnter() {
  var main = document.getElementById('site-main');
  if (!main) return;

  var steps = Array.prototype.slice.call(
    document.querySelectorAll('.enter-step[data-enter-order]')
  );
  steps.sort(function(a, b) {
    return Number(a.getAttribute('data-enter-order')) - Number(b.getAttribute('data-enter-order'));
  });

  if (!steps.length) {
    main.classList.add('is-ready');
    return;
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skipAnimation = prefersReduced || sessionStorage.getItem('intro_seen') === '1';

  function revealStep(el) {
    el.classList.remove('enter-pending');
    el.classList.add('is-entered');
  }

  function revealAll() {
    main.classList.add('is-ready');
    steps.forEach(revealStep);
  }

  if (skipAnimation) {
    revealAll();
    return;
  }

  main.classList.add('is-ready');
  steps.forEach(function(el) {
    el.classList.add('enter-pending');
  });

  var stepGap = 420;
  steps.forEach(function(el, index) {
    window.setTimeout(function() {
      revealStep(el);
    }, index * stepGap);
  });

  window.setTimeout(function() {
    sessionStorage.setItem('intro_seen', '1');
  }, steps.length * stepGap + 300);
})();
