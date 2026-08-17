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
     Gallery.

     Two ways to add photos, no code changes needed either way:

     1. Preferred — list them in assets/img/gallery/manifest.json. That file
        controls the order and the alt text, and lets a photo be marked
        "wide" (spans two columns) or "contain" (shown whole instead of
        cropped, for posters and flyers).

     2. Or just drop files named 01.jpg, 02.jpg ... 12.jpg into
        assets/img/gallery/ and they are picked up automatically.

     If neither turns up anything, styled placeholders are shown.
     ------------------------------------------------------------------ */
  var grid = document.getElementById('gallery');
  if (!grid) return;

  var DIR = 'assets/img/gallery/';
  var COUNT = 12;
  var EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function findNumbered(index) {
    return new Promise(function (resolve) {
      var i = 0;
      (function next() {
        if (i >= EXTS.length) return resolve(null);
        var src = DIR + pad(index) + '.' + EXTS[i++];
        var img = new Image();
        img.onload = function () { resolve({ file: src }); };
        img.onerror = next;
        img.src = src;
      })();
    });
  }

  function fromManifest() {
    return fetch(DIR + 'manifest.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.photos)) return [];
        return data.photos.filter(function (p) { return p && p.file; }).map(function (p) {
          return {
            file: encodeURI(/^(https?:)?\//.test(p.file) ? p.file : DIR + p.file),
            alt: p.alt,
            wide: !!p.wide,
            contain: !!p.contain
          };
        });
      })
      .catch(function () { return []; });
  }

  function fromNumbers() {
    var jobs = [];
    for (var i = 1; i <= COUNT; i++) jobs.push(findNumbered(i));
    return Promise.all(jobs).then(function (found) { return found.filter(Boolean); });
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

  /* Lightbox — click a photo to see it full size. */
  var box = null;
  function openLightbox(src, alt) {
    if (!box) {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.innerHTML = '<button class="lightbox__close" aria-label="Close">&times;</button><img alt="" />';
      box.addEventListener('click', function (e) {
        if (e.target === box || e.target.classList.contains('lightbox__close')) closeLightbox();
      });
      document.body.appendChild(box);
    }
    var img = box.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!box) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function render(photos) {
    if (!photos.length) {
      for (var k = 0; k < 6; k++) grid.appendChild(placeholder());
      return;
    }

    photos.forEach(function (photo, idx) {
      var fig = document.createElement('figure');
      fig.className = 'shot' + (photo.wide ? ' shot--wide' : '') + (photo.contain ? ' shot--contain' : '');

      var img = document.createElement('img');
      img.src = photo.file;
      img.loading = idx < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.alt = photo.alt || 'Custom wrap by Wrapstar — work sample ' + (idx + 1);

      fig.appendChild(img);
      fig.tabIndex = 0;
      fig.addEventListener('click', function () { openLightbox(photo.file, img.alt); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(photo.file, img.alt); }
      });

      grid.appendChild(fig);
    });
  }

  fromManifest().then(function (photos) {
    return photos.length ? photos : fromNumbers();
  }).then(render);
})();
