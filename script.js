/* ═══════════════════════════════════════════════════════════
   HITESH GUPTA — PORTFOLIO INTERACTION SCRIPT
   Interactive features, scroll animations, counter, contact form
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navbar Scroll Effect ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link update based on scroll position
    updateActiveNavLink();
  });

  /* ── 2. Mobile Menu Toggle ── */
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', toggleMobileMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  /* ── 3. Scroll Active Link Highlight ── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  /* ── 4. Intersection Observer for Animations ── */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        // Trigger child animations if present
        const childAnimates = entry.target.querySelectorAll('[data-animate]');
        childAnimates.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-in');
          }, index * 100);
        });

        // Trigger Skill Bars & Counters if in skills or achievements section
        if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
          animateSkills();
        }

        if (entry.target.id === 'achievements' || entry.target.closest('#achievements')) {
          animateCounters();
        }

        // Unobserve once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Register all elements with data-animate attribute or main cards
  document.querySelectorAll('[data-animate], .about-image-wrapper, .about-content, .mv-card, .education-card, .project-left, .project-right, .outcome-box, .tech-pill, .skill-category, .cert-card, .achievement-card, .contact-form-wrapper, .contact-info').forEach(el => {
    animationObserver.observe(el);
  });

  /* ── 5. Skill Bars & Percent Counter Animation ── */
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillPercents = document.querySelectorAll('.skill-percent');

    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width + '%';
      bar.classList.add('animate-in');
    });

    skillPercents.forEach(percentEl => {
      const target = parseInt(percentEl.getAttribute('data-target'), 10);
      let current = 0;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / target));

      const timer = setInterval(() => {
        current += 1;
        percentEl.textContent = current + '%';
        if (current >= target) {
          clearInterval(timer);
        }
      }, stepTime);
    });
  }

  /* ── 6. Stat Counter Animation for Achievements ── */
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      let current = 0;
      const duration = 1500;
      const stepTime = Math.max(Math.floor(duration / target), 20);

      const timer = setInterval(() => {
        current += 1;
        stat.textContent = current + (target === 97 ? '%' : '+');
        if (current >= target) {
          clearInterval(timer);
          stat.textContent = target + (target === 97 ? '%' : '+');
        }
      }, stepTime);
    });
  }

  /* ── 7. Certificate Card Mouse-Follow 3D Tilt ── */
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* ── 8. Floating Particles Background in Hero ── */
  const heroSection = document.getElementById('hero');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${4 + Math.random() * 6}s`;
    heroSection.appendChild(particle);
  }

  /* ── 9. Form Sequential Underline Draw & AJAX Submission to Email ── */
  const contactForm = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  if (contactForm) {
    // Pulse send button after form animation
    setTimeout(() => {
      if (sendBtn) sendBtn.classList.add('pulse');
    }, 2000);

    contactForm.addEventListener('submit', function (e) {
      // If browsing locally as a file (file://), allow native POST directly
      if (window.location.protocol === 'file:') {
        return;
      }

      e.preventDefault();

      const originalBtnText = sendBtn.innerHTML;
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Sending Message...`;

      const formData = new FormData(contactForm);

      fetch('https://formsubmit.co/ajax/hg5594176@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === 'true' || data.success === true) {
          sendBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          sendBtn.style.color = '#ffffff';
          sendBtn.innerHTML = `✓ Message Sent Successfully!`;
          contactForm.reset();
          setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.style.background = '';
            sendBtn.style.color = '';
            sendBtn.innerHTML = originalBtnText;
          }, 5000);
        } else {
          // If first-time activation needed or unhandled state, fallback to direct submission
          contactForm.submit();
        }
      })
      .catch(() => {
        // Fallback standard submit if fetch is blocked
        contactForm.submit();
      });
    });
  }

  /* ── 10. Typewriter Effect for Highlights ── */
  const typewriterElements = document.querySelectorAll('[data-animate="typewriter"]');

  const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.5 });

  typewriterElements.forEach(el => typewriterObserver.observe(el));

  // Add initial loaded class
  document.body.classList.add('page-loaded');
});
