/* ============================================================
   TOMASTEED — Main JavaScript
   ============================================================ */

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* ── Mobile menu ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

burger && burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Language toggle géré par scripts/i18n.js ── */


/* ── Intersection Observer (scroll reveal) ── */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ── Counter animation (re-triggers every time KPI band enters viewport) ── */
function animateCounter(el, target, suffix = '', duration = 1600) {
  el.textContent = '0' + suffix;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

// Observer qui se déclenche à chaque passage (pas de unobserve)
const kpiBand = document.querySelector('.kpi-band');
if (kpiBand) {
  const kpiCounters = kpiBand.querySelectorAll('[data-counter]');
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        kpiCounters.forEach(el => {
          const target = parseInt(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.4 });
  kpiObserver.observe(kpiBand);
}

// Autres counters (hors KPI) — une seule fois
const otherCounters = document.querySelectorAll('[data-counter]:not(.kpi-band [data-counter])');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
otherCounters.forEach(c => counterObserver.observe(c));

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
  setTimeout(() => {
    toast.classList.add('show');
    contactForm.reset();
    btn.textContent = 'Envoyer';
    btn.disabled = false;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }, 1200);
});

/* ── Parallax on hero ── */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

/* ── Scroll-to-top button ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Cookie Consent Banner ── */
(function () {
  const COOKIE_KEY = 'tomasteed_cookie_consent';
  if (localStorage.getItem(COOKIE_KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-title">Ce site utilise des cookies</div>
    <div class="cookie-text">Nous utilisons des cookies fonctionnels (nécessaires) et des cookies analytiques (mesure d'audience anonymisée) pour améliorer votre expérience. Conformément au RGPD, vous pouvez gérer vos préférences.</div>
    <div class="cookie-actions">
      <button class="btn btn-primary cookie-accept" style="padding:10px 20px;font-size:.72rem;">Accepter tout</button>
      <button class="btn btn-outline cookie-essential" style="padding:10px 20px;font-size:.72rem;">Fonctionnels uniquement</button>
      <a href="legal.html" style="font-size:.72rem;color:var(--grey);display:flex;align-items:center;padding:10px;">En savoir plus</a>
    </div>
  `;
  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('show'), 1500);

  function acceptCookies(analytics) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, ts: Date.now() }));
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }

  banner.querySelector('.cookie-accept').addEventListener('click', () => acceptCookies(true));
  banner.querySelector('.cookie-essential').addEventListener('click', () => acceptCookies(false));
})();
