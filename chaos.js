/* Calm/Chaos mode, shared by every page.
 *
 * - One state, persisted in localStorage (same key the hero toggle always
 *   used), synced across every toggle on the page and across tabs.
 * - Compact nav switches: [data-chaos-toggle]. On a page with a hero toggle
 *   ([data-chaos-anchor]), the nav switch only appears once the hero toggle
 *   has scrolled out of view behind the sticky header.
 * - Pages without their own renderer get the default Chaos look: the
 *   data-hero-font attribute on <html> plus mixed-font words in any
 *   [data-chaos-words] heading. The home page renders itself (hero
 *   animation), so it opts out with <html data-chaos-custom>.
 */
(function () {
  var KEY = 'hero_newspaper_mode';
  var root = document.documentElement;
  var listeners = [];
  var on = read();

  function read() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function emit() {
    for (var i = 0; i < listeners.length; i++) listeners[i](on);
  }

  function set(next) {
    next = !!next;
    if (next === on) return;
    on = next;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    emit();
  }

  window.SiteChaos = {
    get: function () { return on; },
    set: set,
    subscribe: function (fn) { listeners.push(fn); }
  };

  // Another tab flipped the mode
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var next = e.newValue === '1';
    if (next !== on) { on = next; emit(); }
  });

  /* ---- Default renderer (case studies) ---- */
  var FONT_COUNT = 11;
  var custom = root.hasAttribute('data-chaos-custom');

  function renderWords(chaos) {
    var heads = document.querySelectorAll('[data-chaos-words]');
    for (var h = 0; h < heads.length; h++) {
      var el = heads[h];
      if (!el.hasAttribute('data-chaos-text')) el.setAttribute('data-chaos-text', el.textContent.trim());
      var text = el.getAttribute('data-chaos-text');
      if (!chaos) { el.textContent = text; continue; }
      el.innerHTML = text.split(/\s+/).map(function (word, i) {
        return '<span class="chaos-word hero-word--f' + ((i * 3 + h * 2 + 1) % FONT_COUNT) + '">' + word + '</span>';
      }).join(' ');
    }
  }

  function applyDefault(chaos) {
    if (chaos) root.setAttribute('data-hero-font', 'newspaper');
    else root.removeAttribute('data-hero-font');
    if (document.readyState !== 'loading') renderWords(chaos);
  }

  if (!custom) {
    // Set the attribute right away (this file loads in <head>) to avoid a
    // flash of Calm styling; headings are wrapped once the DOM exists.
    if (on) root.setAttribute('data-hero-font', 'newspaper');
    listeners.push(applyDefault);
  }

  /* ---- Nav switches ---- */
  function initSwitches() {
    var switches = document.querySelectorAll('[data-chaos-toggle]');

    function sync() {
      for (var i = 0; i < switches.length; i++) {
        switches[i].setAttribute('aria-checked', on ? 'true' : 'false');
      }
    }

    for (var i = 0; i < switches.length; i++) {
      switches[i].addEventListener('click', function (e) {
        var picked = e.target.closest && e.target.closest('[data-mode]');
        set(picked ? picked.getAttribute('data-mode') === 'chaos' : !on);
      });
    }
    listeners.push(sync);
    sync();

    // Show the nav switch only while the hero toggle is out of view
    var slots = document.querySelectorAll('.nav-switch-slot');
    var anchor = document.querySelector('[data-chaos-anchor]');
    if (!anchor || !('IntersectionObserver' in window)) {
      for (var s = 0; s < slots.length; s++) slots[s].classList.add('is-shown');
      return;
    }
    var header = document.querySelector('.site-header');
    var headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    new IntersectionObserver(function (entries) {
      var heroVisible = entries[entries.length - 1].isIntersecting;
      for (var j = 0; j < slots.length; j++) slots[j].classList.toggle('is-shown', !heroVisible);
    }, { rootMargin: '-' + headerH + 'px 0px 0px 0px' }).observe(anchor);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!custom) renderWords(on);
    initSwitches();
  });
})();
