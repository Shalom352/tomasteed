/* ============================================================
   TOMASTEED - Main JavaScript
   Refonte 2025 - Inspiration Blackstone
   ============================================================ */

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1100);
});

/* -- Navbar - transparent sur homepage, blanc sur pages intérieures -- */
const navbar = document.getElementById('navbar');
const isHomepage = document.body.classList.contains('homepage') ||
                   window.location.pathname.endsWith('index.html') ||
                   window.location.pathname === '/';

if (navbar) {
  /* Homepage hero : navbar transparente en haut */
  if (isHomepage) {
    navbar.classList.add('nav-transparent');
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ── Mobile menu ── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

burger && burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Nav Dropdowns - accessibility & click-outside ── */
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu   = dropdown.querySelector('.nav-dropdown-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.style.opacity === '1';
    // Close all others
    document.querySelectorAll('.nav-dropdown-menu').forEach(m => {
      m.style.opacity = '0';
      m.style.pointerEvents = 'none';
      m.style.transform = 'translateX(-50%) translateY(-6px)';
    });
    document.querySelectorAll('.nav-dropdown-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
    if (!isOpen) {
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'all';
      menu.style.transform = 'translateX(-50%) translateY(0)';
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close dropdowns on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown-menu').forEach(m => {
    m.style.opacity = '';
    m.style.pointerEvents = '';
    m.style.transform = '';
  });
  document.querySelectorAll('.nav-dropdown-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
});

/* ── Intersection Observer (scroll reveal) ── */
const revealElements = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ── Counter animation ── */
function animateCounter(el, target, suffix = '', duration = 1800) {
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

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(c => counterObserver.observe(c));

/* ── Hero bg subtle parallax ── */
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  // Trigger loaded class for Ken Burns
  setTimeout(() => heroBg.classList.add('loaded'), 100);
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── Smooth scroll anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}, { passive: true });

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
  setTimeout(() => {
    if (toast) {
      toast.textContent = 'Message envoyé avec succès !';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
    contactForm.reset();
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1200);
});

/* ── Scroll-to-top button ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
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
    <div class="cookie-text">Nous utilisons des cookies fonctionnels et analytiques pour améliorer votre expérience. Conformément au RGPD, vous pouvez gérer vos préférences.</div>
    <div class="cookie-actions">
      <button class="btn btn-primary cookie-accept" style="padding:10px 20px;font-size:.72rem;">Accepter tout</button>
      <button class="btn btn-outline cookie-essential" style="padding:10px 20px;font-size:.72rem;">Fonctionnels uniquement</button>
    </div>
  `;
  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('show'), 1800);

  function acceptCookies(analytics) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, ts: Date.now() }));
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }

  banner.querySelector('.cookie-accept').addEventListener('click', () => acceptCookies(true));
  banner.querySelector('.cookie-essential').addEventListener('click', () => acceptCookies(false));
})();
