/* ============================================================
   PORTFOLIO JS — Alex Mercer
   ============================================================ */

/* ---- Custom Cursor ---- */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
});
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='54px'; ring.style.height='54px'; ring.style.borderColor='rgba(6,182,212,0.8)'; dot.style.background='#22d3ee'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(124,58,237,0.6)'; dot.style.background='#9d5cf6'; });
});

/* ---- Particles Canvas ---- */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist/120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---- Navbar Scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- Active Nav Link ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ---- Hamburger / Mobile Menu ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Typing Effect ---- */
const phrases  = ['Web Apps.', 'REST APIs.', 'Mobile Apps.', 'Fast UIs.', 'Clean Code.'];
let pIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const phrase = phrases[pIdx];
  typingEl.textContent = deleting
    ? phrase.substring(0, --cIdx)
    : phrase.substring(0, ++cIdx);

  let delay = deleting ? 60 : 110;
  if (!deleting && cIdx === phrase.length) { delay = 1800; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ---- Counter Animation ---- */
function animateCounter(el) {
  if (!el.dataset.target || isNaN(Number(el.dataset.target))) return;
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- Skills Data ---- */
const skillsData = {
  frontend: [
    { name: 'Javascript', icon: '🟨', pct: 88 },
    { name: 'HTML5',      icon: '🌐', pct: 97 },
    { name: 'CSS3',       icon: '🎨', pct: 94 },
  ],
  backend: [
    { name: 'Node.js',    icon: '🟩', pct: 90 },
    { name: 'Python',     icon: '🐍', pct: 85 },
    { name: 'PostgreSQL', icon: '🐘', pct: 83 },
  ],
  tools: [
    { name: 'Git / GitHub', icon: '🐙', pct: 95 },
    { name: 'Linux',        icon: '🐧', pct: 88 },
  ],
};

let currentTab = 'frontend';
const skillsGrid = document.getElementById('skillsGrid');

function renderSkills(tab) {
  currentTab = tab;
  skillsGrid.innerHTML = '';
  skillsData[tab].forEach((skill, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <span class="skill-icon">${skill.icon}</span>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bar-wrap">
        <div class="skill-bar" data-pct="${skill.pct}"></div>
      </div>`;
    skillsGrid.appendChild(card);
  });
  // Animate bars after render
  setTimeout(() => {
    skillsGrid.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 50);
}

document.querySelectorAll('.skill-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkills(btn.dataset.tab);
  });
});
renderSkills('frontend');

/* ---- Project Filter ---- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- Contact Form ---- */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const message = document.getElementById('formMessage').value.trim();
  formStatus.className = 'form-status';
  formStatus.style.display = 'none';

  if (!name || !email || !message) {
    formStatus.textContent  = '⚠️ Please fill in all required fields.';
    formStatus.className = 'form-status error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = '⚠️ Please enter a valid email address.';
    formStatus.className = 'form-status error';
    return;
  }

  // Simulate send
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    form.reset();
    formStatus.textContent = '✅ Message sent! I\'ll get back to you within 24 hours.';
    formStatus.className = 'form-status success';
    setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
  }, 1800);
});

/* ---- Footer Year ---- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
