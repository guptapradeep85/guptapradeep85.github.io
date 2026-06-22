// ─── Navbar Scroll Effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(5,5,15,0.95)'
    : 'rgba(5,5,15,0.7)';
});

// ─── Mobile Nav Toggle ───
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ─── Counter Animation ───
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        el.textContent = count;
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ─── Scroll Reveal ───
const revealEls = document.querySelectorAll(
  '.stat-card, .timeline-card, .pub-item, .research-card, .skill-block, .leadership-card, .contact-card, .info-card, .guided-item, .course-item'
);
revealEls.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ─── Skill Bar Animation ───
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObserver.observe(b));

// ─── Publication Tabs ───
const tabs = document.querySelectorAll('.pub-tab');
const panels = document.querySelectorAll('.pub-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ─── CV Page Indicator ───
const sectionPageMap = {
  'hero': 1, 'stats': 1, 'about': 1,
  'experience': 2, 'publications': 3,
  'research': 5, 'skills': 6, 'leadership': 6, 'contact': 7
};
const pageNum = document.getElementById('page-num');
const pageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (sectionPageMap[id]) pageNum.textContent = sectionPageMap[id];
    }
  });
}, { rootMargin: '-30% 0px -65% 0px' });
document.querySelectorAll('section[id]').forEach(s => pageObserver.observe(s));

// ─── Smooth scroll with navbar offset ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ─── Parallax hero orbit on mouse move ───
window.addEventListener('mousemove', (e) => {
  const orbit = document.querySelector('.hero-orbit');
  if (!orbit) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbit.style.transform = `translate(${x}px, ${y}px)`;
});
