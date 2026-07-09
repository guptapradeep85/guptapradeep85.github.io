// Core interaction layer for the static GitHub Pages portfolio.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canAnimate = () => !prefersReducedMotion.matches;
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Navbar depth changes gently after scrolling.
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(5, 8, 22, 0.95)'
    : 'rgba(5, 8, 22, 0.72)';
}, { passive: true });

// Mobile navigation with accessible expanded state.
navToggle.setAttribute('aria-expanded', 'false');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Keep target=_blank links isolated for security and performance.
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.setAttribute('rel', 'noopener noreferrer');
});

// Counter animation for academic impact numbers.
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);

    if (!canAnimate()) {
      el.textContent = target;
      counterObserver.unobserve(el);
      return;
    }

    let count = 0;
    const step = Math.max(1, Math.floor(target / 45));
    const timer = window.setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        window.clearInterval(timer);
      }
      el.textContent = count;
    }, 24);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });
counters.forEach(counter => counterObserver.observe(counter));

// Reveal-on-scroll animation is intentionally subtle and observer-driven.
const revealEls = document.querySelectorAll(
  '.stat-card, .timeline-card, .pub-item, .research-card, .skill-block, .leadership-card, .contact-card, .info-card, .guided-item, .course-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;
    const delay = canAnimate() ? index * 45 : 0;
    window.setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Skill bar animation starts only when the skill area is visible.
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('animated');
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
bars.forEach(bar => barObserver.observe(bar));

// Publication tabs preserve the existing publication content and improve keyboard semantics.
const tabs = document.querySelectorAll('.pub-tab');
const panels = document.querySelectorAll('.pub-panel');
tabs.forEach(tab => {
  tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
  tab.addEventListener('click', () => {
    tabs.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    panels.forEach(panel => panel.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// CV page-style indicator follows major sections.
const sectionPageMap = {
  hero: 1,
  stats: 1,
  about: 1,
  experience: 2,
  publications: 3,
  research: 5,
  skills: 6,
  leadership: 6,
  contact: 7
};
const pageNum = document.getElementById('page-num');
const pageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && sectionPageMap[entry.target.id]) {
      pageNum.textContent = sectionPageMap[entry.target.id];
    }
  });
}, { rootMargin: '-30% 0px -65% 0px' });
document.querySelectorAll('section[id]').forEach(section => pageObserver.observe(section));

// Smooth scrolling keeps fixed navigation from covering headings.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: canAnimate() ? 'smooth' : 'auto'
    });
  });
});

// Vanilla 3D tilt for profile, publication, research, skill, and experience cards.
const tiltTargets = document.querySelectorAll(
  '[data-tilt], .pub-item, .research-card, .skill-block, .timeline-card, .stat-card, .leadership-card'
);

function enableTilt() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || !canAnimate()) return;

  tiltTargets.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 8;

      card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

enableTilt();

// Lightweight hero parallax is disabled on touch devices and for reduced motion.
window.addEventListener('mousemove', event => {
  const card = document.querySelector('.profile-card-3d');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!card || !finePointer || !canAnimate()) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  card.style.translate = `${x}px ${y}px`;
}, { passive: true });
