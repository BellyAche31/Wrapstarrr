(function () {
  'use strict';

  /* Year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Sticky nav + mobile menu */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 12); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Reveal on scroll */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------
     Gallery — drop photos into assets/img/gallery/ named 01.jpg, 02.jpg …
     (.jpg, .jpeg, .png and .webp all work). Anything missing is simply
     skipped; if no photos exist yet, styled placeholders are shown.
     ------------------------------------------------------------------ */
  var grid = document.getElementById('gallery');
  if (!grid) return;

  var COUNT = 12;
  var EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function findImage(index) {
    return new Promise(function (resolve) {
      var i = 0;
      (function next() {
        if (i >= EXTS.length) return resolve(null);
        var src = 'assets/img/gallery/' + pad(index) + '.' + EXTS[i++];
        var img = new Image();
        img.onload = function () { resolve(src); };
        img.onerror = next;
        img.src = src;
      })();
    });
  }

  function placeholder() {
    var d = document.createElement('div');
    d.className = 'shot';
    d.innerHTML =
      '<div class="shot__ph">' +
      '<span class="mark">WRAPST<span class="mark__star"></span>R<span class="mark__dot">.</span></span>' +
      '<span>Photo coming soon</span></div>';
    return d;
  }

  var jobs = [];
  for (var i = 1; i <= COUNT; i++) jobs.push(findImage(i));

  Promise.all(jobs).then(function (found) {
    var hits = found.filter(Boolean);

    if (!hits.length) {
      for (var k = 0; k < 6; k++) grid.appendChild(placeholder());
      return;
    }

    hits.forEach(function (src, idx) {
      var fig = document.createElement('figure');
      fig.className = 'shot';
      fig.style.margin = '0';
      var img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = 'Custom motorcycle wrap by Wrapstar — work sample ' + (idx + 1);
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  });
})();
