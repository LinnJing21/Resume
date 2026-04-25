document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageWrapper = document.querySelector('.page-wrapper');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  const sections = document.querySelectorAll('.section, .hero');
  let currentSection = 0;
  let isScrolling = false;
  let lastScrollTime = 0;
  const scrollThreshold = 1500;

  sections.forEach((section, index) => {
    section.setAttribute('data-index', index);
  });

  function animateSection(section, direction) {
    const content = section.querySelector('.section-content') || section.querySelector('.hero-content');
    if (!content) return;

    content.style.transition = 'none';
    if (direction === 'down') {
      content.style.transform = 'translateY(100px)';
      content.style.opacity = '0';
    } else {
      content.style.transform = 'translateY(-100px)';
      content.style.opacity = '0';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.transition = 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
        content.style.transform = 'translateY(0)';
        content.style.opacity = '1';
      });
    });
  }

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;

    isScrolling = true;
    const direction = index > currentSection ? 'down' : 'up';
    currentSection = index;

    const target = sections[index];
    const offsetTop = target.offsetTop;

    pageWrapper.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isScrolling = false;
    }, scrollThreshold);
  }

  pageWrapper.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastScrollTime < 800) return;

    const scrollTop = pageWrapper.scrollTop;
    const windowHeight = pageWrapper.clientHeight;
    const scrollMidpoint = windowHeight / 2;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;

      if (Math.abs(sectionCenter) < scrollMidpoint) {
        if (e.deltaY > 0 && index < sections.length - 1) {
          e.preventDefault();
          lastScrollTime = now;
          scrollToSection(index + 1);
        } else if (e.deltaY < 0 && index > 0) {
          e.preventDefault();
          lastScrollTime = now;
          scrollToSection(index - 1);
        }
      }
    });
  }, { passive: false });

  pageWrapper.addEventListener('touchstart', (e) => {
    window._touchStartY = e.touches[0].clientY;
  }, { passive: true });

  pageWrapper.addEventListener('touchend', (e) => {
    if (!window._touchStartY) return;

    const now = Date.now();
    if (now - lastScrollTime < 800) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = window._touchStartY - touchEndY;

    if (Math.abs(diff) < 50) return;

    const windowHeight = pageWrapper.clientHeight;
    const scrollMidpoint = windowHeight / 2;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;

      if (Math.abs(sectionCenter) < scrollMidpoint) {
        if (diff > 0 && index < sections.length - 1) {
          lastScrollTime = now;
          scrollToSection(index + 1);
        } else if (diff < 0 && index > 0) {
          lastScrollTime = now;
          scrollToSection(index - 1);
        }
      }
    });

    window._touchStartY = null;
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const targetSection = document.querySelector(href);
      if (targetSection) {
        const index = parseInt(targetSection.getAttribute('data-index'));
        if (!isNaN(index)) {
          scrollToSection(index);
        }
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.classList.contains('nav-link')) return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const index = parseInt(target.getAttribute('data-index'));
        if (!isNaN(index)) {
          scrollToSection(index);
        }
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.stat-item, .project-card, .skill-card, .award-item, .education-card, .course-tag, .contact-card'
  );

  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  pageWrapper.addEventListener('scroll', () => {
    const currentScroll = pageWrapper.scrollTop;

    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = 'translateY(0)';
    heroContent.style.opacity = '1';
  }
});
