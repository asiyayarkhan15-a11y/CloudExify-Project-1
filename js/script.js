/* =========================================================
   Asiya Khan — Portfolio  ·  js/script.js
   Loaded before </body>, so the DOM is ready.

   Motion: Lenis (smooth scroll) + GSAP ScrollTrigger (scrubbed
   reveals, stagger, parallax, image-zoom). If those CDNs are
   unavailable, a vanilla IntersectionObserver fallback runs so
   the site always works.
   ========================================================= */

/* ---------- Elements ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');
const progressBar = document.getElementById('scrollProgress');
const parallaxEls = document.querySelectorAll('.parallax');
const root = document.documentElement;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Shared scroll state (used by the rail + scroll button) */
const sectionOrder = ['top', 'about', 'skills', 'work', 'contact'];
let currentIndex = 0;
let lenisInstance = null;
let atBottom = false;

function scrollToTarget(sel) {
  if (sel === '#top') {
    if (lenisInstance) lenisInstance.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.querySelector(sel);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/* ---------- 1. Responsive navbar ---------- */
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- 2. Signature Feature: theme switcher (dark default) ---------- */
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
  if (themeToggle) themeToggle.setAttribute('aria-label',
    theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
}
applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* ---------- 3. Right-rail scroll-spy (viewport-based, always on) ---------- */
const railDots = document.querySelectorAll('.rail-dot');
const spySections = [...railDots].map(d => document.getElementById(d.dataset.target)).filter(Boolean);
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      railDots.forEach(d => d.classList.toggle('is-active', d.dataset.target === entry.target.id));
      currentIndex = Math.max(0, sectionOrder.indexOf(entry.target.id));
      updateScrollBtn();
    }
  });
}, { threshold: 0.5 });
spySections.forEach(sec => spyObserver.observe(sec));

/* ---------- 3b. Scroll button + floating back-to-top ---------- */
const scrollBtn = document.getElementById('scrollBtn');
const scrollText = scrollBtn ? scrollBtn.querySelector('.rail-scroll-text') : null;
const toTop = document.getElementById('toTop');

function updateScrollBtn() {
  const nearBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 80);
  const onLastSection = currentIndex >= sectionOrder.length - 1;   // contact (04)
  const showTop = nearBottom || onLastSection;
  atBottom = showTop;
  if (scrollBtn) {
    scrollBtn.classList.toggle('is-top', showTop);
    if (scrollText) scrollText.textContent = showTop ? 'Back to Top' : 'Scroll Down';
    scrollBtn.setAttribute('aria-label', showTop ? 'Back to top' : 'Scroll down');
  }
  // Floating back-to-top button appears once you've scrolled down a bit
  if (toTop) toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
}

if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    if (atBottom) {
      scrollToTarget('#top');
    } else {
      const next = sectionOrder[Math.min(currentIndex + 1, sectionOrder.length - 1)];
      scrollToTarget(next === 'top' ? '#top' : '#' + next);
    }
  });
}
if (toTop) toTop.addEventListener('click', () => scrollToTarget('#top'));
updateScrollBtn();

/* ---------- 4. Contact form validation ---------- */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
function setNote(msg, type) { formNote.textContent = msg; formNote.className = 'form-note ' + type; }
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
  if (name === '' || !emailOK || message === '') {
    if (name === '') nameInput.closest('.field').classList.add('invalid');
    if (!emailOK) emailInput.closest('.field').classList.add('invalid');
    if (message === '') messageInput.closest('.field').classList.add('invalid');
    setNote('Please fill in all fields with a valid email address.', 'error');
    return;
  }
  setNote('Thank you, ' + name + '. Your message has been received.', 'success');
  form.reset();
});

/* ---------- 5. Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 5b. Hero illustration / fallback swap ----------
   Show the illustration if assets/hero-illustration.png loads;
   otherwise keep the code-window fallback. */
(function () {
  // Starts hidden; the code-window fallback shows by default.
  const img = document.getElementById('heroIllustration');
  const fallback = document.getElementById('heroFallback');
  if (!img) return;
  const useImage = () => { img.hidden = false; if (fallback) fallback.style.display = 'none'; };
  if (img.complete && img.naturalWidth > 0) useImage();
  else img.addEventListener('load', useImage);
})();

/* ---------- 6. Signature Feature: live project filter ---------- */
const filterBtns = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      card.classList.toggle('hide', !(f === 'all' || tags.includes(f)));
    });
  });
});

/* ---------- 7. Signature Feature: scroll-triggered skill bars ----------
   Fill to the target width when visible, reset when out of view so the
   animation replays every time you scroll back to Skills. */
const skillEls = document.querySelectorAll('.skill-bars .skill');
if (skillEls.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const fill = entry.target.querySelector('.fill');
      if (!fill) return;
      fill.style.width = entry.isIntersecting ? (entry.target.dataset.percent + '%') : '0%';
    });
  }, { threshold: 0.35 });
  skillEls.forEach(el => barObserver.observe(el));
}

/* ---------- 8. Signature Feature: hidden easter egg (Konami code) ---------- */
(function () {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const egg = document.getElementById('easterEgg');
  let i = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = (key === seq[i]) ? i + 1 : (key === seq[0] ? 1 : 0);
    if (i === seq.length) {
      i = 0;
      if (egg) {
        egg.classList.add('show');
        clearTimeout(egg._t);
        egg._t = setTimeout(() => egg.classList.remove('show'), 5000);
      }
    }
  });
})();

/* ---------- 9. Screenshot gallery lightbox ---------- */
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox || !lightboxImg) return;

  const open = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Screenshot';
    lightbox.classList.add('open');
    if (lenisInstance) lenisInstance.stop();
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    if (lenisInstance) lenisInstance.start();
  };

  document.querySelectorAll('.shot').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.full, btn.querySelector('img') && btn.querySelector('img').alt));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
})();

/* =========================================================
   6. MOTION — GSAP + Lenis, with vanilla fallback
   ========================================================= */
const hasGSAP = window.gsap && window.ScrollTrigger && window.Lenis;

if (hasGSAP && !prefersReduced) {
  try { initGSAP(); }
  catch (err) { console.warn('GSAP init failed, using fallback:', err); initFallback(); }
} else {
  initFallback();
}

/* ---------- GSAP + Lenis path ---------- */
function initGSAP() {
  const { gsap, ScrollTrigger, Lenis } = window;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('gsap-ready');

  // Buttery smooth scrolling
  const lenis = new Lenis({ duration: 1.2, smoothWheel: true, touchMultiplier: 2 });
  lenisInstance = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target !== null) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

  // Progress bar + nav condense (driven by Lenis)
  lenis.on('scroll', ({ scroll, limit }) => {
    const pct = limit > 0 ? (scroll / limit) * 100 : 0;
    progressBar.style.width = pct + '%';
    header.classList.toggle('scrolled', scroll > 12);
    updateScrollBtn();
  });

  const EASE = 'power3.out';

  // Generic fade-up reveals (every paragraph, heading, card) — not tiles/hero.
  // fromTo with an explicit visible end state so elements never stay hidden.
  const generic = gsap.utils.toArray('.reveal').filter(el =>
    !el.classList.contains('tech-tile') && !el.closest('.hero-copy'));
  generic.forEach(el => {
    const dir = el.dataset.dir;
    const fromVars = { opacity: 0 };
    const toVars = {
      opacity: 1, duration: 1.1, ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'restart none restart none' }
    };
    if (dir === 'left') { fromVars.x = -90; toVars.x = 0; }
    else if (dir === 'right') { fromVars.x = 90; toVars.x = 0; }
    else { fromVars.y = 80; fromVars.scale = 0.95; toVars.y = 0; toVars.scale = 1; }
    gsap.fromTo(el, fromVars, toVars);
  });

  // Hero copy — staggered on load
  gsap.fromTo('.hero-copy .reveal',
    { opacity: 0, y: 80, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: EASE, stagger: 0.16, delay: 0.15 });

  // Skill tiles — stagger in, replaying each time the section enters view
  gsap.fromTo('.tech-tile',
    { opacity: 0, y: 90, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: EASE, stagger: 0.12,
      scrollTrigger: { trigger: '.tech-grid', start: 'top 82%', toggleActions: 'restart none restart none' } });

  // Image zoom on project mockups (scrubbed 1.15 -> 1)
  gsap.utils.toArray('.browser-mock').forEach(mock => {
    gsap.fromTo(mock, { scale: 1.15 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: mock, start: 'top 90%', end: 'top 45%', scrub: true }
    });
  });

  // Parallax drift (scrubbed, each within its section)
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0;
    const section = el.closest('section') || document.body;
    gsap.fromTo(el, { y: -speed * 260 }, {
      y: speed * 260, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Recalculate once fonts/CDN icons settle
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Vanilla fallback (no GSAP/Lenis, or reduced motion) ---------- */
function initFallback() {
  // Stagger grouped children via CSS custom property delay
  const stagger = (selector, step) =>
    document.querySelectorAll(selector).forEach((el, i) =>
      el.style.setProperty('--reveal-delay', (i * step) + 'ms'));
  stagger('.tech-tile', 70);
  stagger('.hero-copy .reveal', 120);

  // Toggle (not unobserve) so the animation replays every time it enters view.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Scroll effects: progress bar, parallax, nav condense
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 12);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0;
      el.style.transform = 'translateY(' + (y * speed) + 'px)';
    });
    updateScrollBtn();
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking && !prefersReduced) { window.requestAnimationFrame(onScroll); ticking = true; }
  });
  onScroll();
}
