/* ============================================================
   ASH – Ashes Soaring High | Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll behavior ----
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Mobile hamburger menu ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ---- Active nav highlight on scroll ----
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ---- Fade-in on scroll (Intersection Observer) ----
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ---- Counter animation for stats ----
  function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      if (counter.dataset.animated) return;
      const target = parseFloat(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const decimal = counter.dataset.decimal ? parseInt(counter.dataset.decimal) : 0;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current >= target) {
          current = target;
          counter.textContent = prefix + current.toFixed(decimal) + suffix;
          counter.dataset.animated = 'true';
          return;
        }
        counter.textContent = prefix + current.toFixed(decimal) + suffix;
        requestAnimationFrame(update);
      };
      update();
    });
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const marketSection = document.querySelector('.market');
  if (marketSection) statObserver.observe(marketSection);

  // ---- Modal handling ----
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ---- Form handling (prevent default, show confirmation) ----
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submitted:', data);

      // Show a simple confirmation
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✓ Submitted Successfully';
      btn.style.background = '#4caf7d';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  // ---- Owl eyes glow on mouse move (hero) ----
  const heroOwl = document.querySelector('.hero-owl');
  if (heroOwl) {
    document.addEventListener('mousemove', (e) => {
      const eyes = heroOwl.querySelectorAll('.owl-eye');
      eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const pupilX = Math.cos(angle) * 2;
        const pupilY = Math.sin(angle) * 2;
        const pupil = eye.querySelector('.owl-pupil');
        if (pupil) {
          pupil.setAttribute('cx', parseFloat(pupil.dataset.cx) + pupilX);
          pupil.setAttribute('cy', parseFloat(pupil.dataset.cy) + pupilY);
        }
      });
    });
  }

  // ---- Tab switching for process triangles ----
  document.querySelectorAll('.process-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      document.querySelectorAll('.process-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.process-content').forEach(c => c.classList.remove('active'));
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });

});
