// Static enhancement layer: navigation, publication search/filter, counters,
// canvas research visuals, and subtle 3D tilt. Content remains usable without JS.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const canAnimate = () => !reducedMotion.matches;

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.setAttribute('rel', 'noopener noreferrer');
});

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: canAnimate() ? 'smooth' : 'auto', block: 'start' });
  });
});

const savedTheme = localStorage.getItem('theme');
const themeToggle = document.getElementById('themeToggle');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-menu a').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -58% 0px' });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';

    if (!canAnimate()) {
      el.textContent = `${target}${suffix}`;
      counterObserver.unobserve(el);
      return;
    }

    let value = 0;
    const steps = 34;
    const increment = Math.max(1, Math.ceil(target / steps));
    const timer = window.setInterval(() => {
      value = Math.min(target, value + increment);
      el.textContent = `${value}${suffix}`;
      if (value >= target) window.clearInterval(timer);
    }, 24);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });
document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

const publicationSearch = document.getElementById('publicationSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const publications = document.querySelectorAll('.pub-card');
const emptyState = document.getElementById('publicationEmpty');
let activeFilter = 'all';

function filterPublications() {
  const query = publicationSearch.value.trim().toLowerCase();
  let visible = 0;

  publications.forEach((card) => {
    const type = card.dataset.type;
    const year = card.dataset.year;
    const text = card.textContent.toLowerCase();
    const filterMatch = activeFilter === 'all' || type === activeFilter || year === activeFilter;
    const queryMatch = !query || text.includes(query);
    const show = filterMatch && queryMatch;

    card.hidden = !show;
    if (show) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

publicationSearch?.addEventListener('input', filterPublications);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    filterPublications();
  });
});

function enableTilt() {
  if (!finePointer.matches || !canAnimate()) return;
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 6;
      const tiltY = (x - 0.5) * 7;
      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}
enableTilt();

document.querySelectorAll('.magnetic').forEach((button) => {
  if (!finePointer.matches || !canAnimate()) return;
  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    button.style.translate = `${x}px ${y}px`;
  });
  button.addEventListener('pointerleave', () => {
    button.style.translate = '0 0';
  });
});

function setupParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || !canAnimate()) return;
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let particles = [];

  function resize() {
    width = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
    height = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
    const count = window.innerWidth < 700 ? 34 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.26 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.26 * devicePixelRatio
    }));
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX / window.innerWidth;
    pointer.y = event.clientY / window.innerHeight;
  }, { passive: true });
  resize();

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
    ctx.fillStyle = 'rgba(210, 232, 255, 0.5)';

    particles.forEach((p, index) => {
      p.x += p.vx + (pointer.x - 0.5) * 0.025;
      p.y += p.vy + (pointer.y - 0.5) * 0.025;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.35 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 120 * devicePixelRatio;
        if (dist < maxDist) {
          ctx.globalAlpha = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

function setupResearchOrb() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas || !canAnimate()) return;
  const ctx = canvas.getContext('2d');
  const nodes = Array.from({ length: 56 }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / 56);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return { phi, theta, label: i % 11 === 0 };
  });
  let angle = 0;
  const pointer = { x: 0, y: 0 };

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  }, { passive: true });

  function draw() {
    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.34;
    ctx.clearRect(0, 0, size, size);

    const projected = nodes.map((node) => {
      const theta = node.theta + angle + pointer.x * 0.4;
      const phi = node.phi + pointer.y * 0.18;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      const scale = 0.74 + z * 0.25;
      return {
        x: center + x * radius * scale,
        y: center + y * radius * scale,
        z,
        size: (node.label ? 3.4 : 2.2) * scale
      };
    });

    const gradient = ctx.createRadialGradient(center, center, 20, center, center, radius * 1.4);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
    gradient.addColorStop(0.55, 'rgba(34, 211, 238, 0.1)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.18)';
    projected.forEach((p, i) => {
      for (let j = i + 1; j < projected.length; j += 7) {
        const q = projected[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 115) {
          ctx.globalAlpha = Math.max(0, 1 - dist / 115) * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    projected.sort((a, b) => a.z - b.z).forEach((p) => {
      ctx.fillStyle = p.z > 0 ? 'rgba(238, 246, 255, 0.92)' : 'rgba(34, 211, 238, 0.42)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    angle += 0.0035;
    requestAnimationFrame(draw);
  }
  draw();
}

setupParticleBackground();
setupResearchOrb();
