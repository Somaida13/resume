// scripts.js — Interactivity & Animations (updated to keep header fixed and handle offsets)
document.addEventListener('DOMContentLoaded', function () {
  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Helper: set CSS variable for header height so layout & scrolling offsets are correct
  const header = document.getElementById('site-header');
  function updateHeaderHeight() {
    if (!header) return;
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
    // Also ensure body padding-top matches (in case some browsers don't pick up CSS var immediately)
    document.body.style.paddingTop = h + 'px';
  }

  // Initial measurement and on resize/orientationchange
  updateHeaderHeight();
  window.addEventListener('resize', () => {
    // debounce quickly
    clearTimeout(window.__headerResizeTimer);
    window.__headerResizeTimer = setTimeout(updateHeaderHeight, 80);
  });
  window.addEventListener('orientationchange', updateHeaderHeight);

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('nav-open');
  });

  // Smooth scroll for internal links (account for fixed header height)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        // Recompute header height to get accurate offset
        const headerHeight = header ? header.offsetHeight : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
        const offset = headerHeight + 12; // small extra spacing
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // close mobile nav after click
        if (document.body.classList.contains('nav-open')) {
          document.body.classList.remove('nav-open');
          document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Reveal on scroll + animated skill bars
  const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
  const revealCallback = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // If reveal contains skill bars, animate them
        entry.target.querySelectorAll?.('[data-skill]').forEach(bar => {
          const value = parseInt(bar.getAttribute('data-skill')) || 0;
          const inner = bar.querySelector('span');
          if (inner) {
            // Staggered animation
            setTimeout(() => {
              inner.style.width = value + '%';
            }, 120);
          }
        });

        obs.unobserve(entry.target);
      }
    });
  };
  const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Contact form basic behaviour (no backend) — simulate send & UX
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const status = document.getElementById('form-status');

  form?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!sendBtn) return;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Mengirim...';
    status.textContent = '';

    // Simple validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Lengkapi semua bidang sebelum mengirim.';
      sendBtn.disabled = false;
      sendBtn.textContent = 'Kirim Pesan';
      return;
    }

    // Simulate network
    setTimeout(() => {
      sendBtn.textContent = 'Terkirim ✓';
      status.textContent = 'Terima kasih — pesan Anda telah diterima. Saya akan menghubungi Anda segera.';
      // reset after delay
      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Kirim Pesan';
        form.reset();
        status.textContent = '';
      }, 3000);
    }, 1200);
  });

  // Small accessibility improvement: focus visible outline only on keyboard nav
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
});