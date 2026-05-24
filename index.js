// ─────────── THEME TOGGLE ───────────
(function() {
  const saved = localStorage.getItem('nuvion-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ─────────── CUSTOM CURSOR ───────────
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .service-card, .tech-card, .about-card, input, textarea, select').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursorDot.classList.add('hover');
    cursorRing.classList.add('hover');
  });
  el.addEventListener('mouseleave', function() {
    cursorDot.classList.remove('hover');
    cursorRing.classList.remove('hover');
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', function() {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', function() {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '1';
});

document.getElementById('themeToggle').addEventListener('click', function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nuvion-theme', next);
  playSound('pop');
  spawnGraphic();
});

// ─────────── MOBILE NAV ───────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  if (mobileNav.classList.contains('open')) playSound('whoosh');
});

function closeMobileNav() {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────── .WAV AUDIO SYSTEM ───────────
const audioCache = {};
const audioFiles = {
  hero: 'audio/scroll-hero.wav',
  about: 'audio/scroll-about.wav',
  services: 'audio/scroll-services.wav',
  tech: 'audio/scroll-tech.wav',
  projects: 'audio/scroll-projects.wav',
  team: 'audio/scroll-team.wav',
  contact: 'audio/scroll-contact.wav',
  pop: 'audio/pop.wav',
  whoosh: 'audio/whoosh.wav',
  splash: 'audio/water-drop.wav',
};

function preloadAudio() {
  Object.keys(audioFiles).forEach(function(key) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = audioFiles[key];
    audioCache[key] = audio;
  });
}
preloadAudio();

let lastScrollSound = 0;
let soundEnabled = sessionStorage.getItem('nuvion-sound') !== 'off';

function getScrollSection() {
  const scrollY = window.scrollY + 100;
  const sections = ['hero','about','services','tech','projects','team','contact'];
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i]);
    if (el && el.offsetTop <= scrollY) return { name: sections[i], index: i };
  }
  return { name: 'hero', index: 0 };
}

function playSound(name) {
  if (!soundEnabled) return;
  try {
    const audio = audioCache[name];
    if (audio) {
      const clone = audio.cloneNode();
      clone.volume = 0.06;
      clone.play().catch(function(){});
    }
  } catch(e) { /* silent */ }
}

function playScrollSound() {
  if (!soundEnabled) return;
  const now = Date.now();
  if (now - lastScrollSound < 90) return;
  lastScrollSound = now;
  const section = getScrollSection();
  playSound(section.name);
}

// Toggle sound with S key
document.addEventListener('keydown', function(e) {
  if (e.key === 's' || e.key === 'S') {
    soundEnabled = !soundEnabled;
    sessionStorage.setItem('nuvion-sound', soundEnabled ? 'on' : 'off');
    spawnGraphic();
    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--bg-glass);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);padding:10px 22px;border-radius:60px;z-index:9999;font-weight:500;font-size:14px;color:var(--text);animation:fadeInUp 0.4s ease forwards;display:flex;align-items:center;gap:8px;';
    msg.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg> ' + (soundEnabled ? 'Sound On' : 'Sound Off');
    document.body.appendChild(msg);
    setTimeout(function() { msg.style.opacity = '0'; msg.style.transition = 'opacity 0.4s ease'; setTimeout(function() { msg.remove(); }, 500); }, 1800);
  }
});

// ─────────── BEST SCROLL ENGINE ───────────
let scrollTicking = false;
let lastScrollY = 0;

window.addEventListener('scroll', function() {
  if (!scrollTicking) {
    window.requestAnimationFrame(function() {
      handleScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

function handleScroll() {
  const scrolled = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrolled / Math.max(scrollable, 1);

  // Sound — gentle trigger
  if (Math.abs(scrolled - lastScrollY) > 8) playScrollSound();
  lastScrollY = scrolled;

  // Scroll progress
  document.getElementById('scroll-progress').style.width = (scrollPercent * 100) + '%';

  // Navbar
  const navbar = document.getElementById('navbar');
  navbar.style.boxShadow = scrolled > 100 ? '0 4px 30px rgba(0,0,0,0.1)' : 'none';

  // Parallax hero
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner && scrolled < window.innerHeight) {
    heroInner.style.transform = 'translateY(' + (scrolled * 0.06) + 'px)';
    heroInner.style.opacity = 1 - Math.min(scrolled / (window.innerHeight * 0.6), 0.5);
  }

  // TECH ORBITAL — rotate rings with scroll
  const orbital = document.getElementById('techOrbital');
  if (orbital) {
    const rotation = scrollPercent * 360;
    const rings = orbital.querySelectorAll('.orbital-ring');
    if (rings[0]) rings[0].style.transform = 'rotate(' + (rotation) + 'deg)';
    if (rings[1]) rings[1].style.transform = 'rotate(' + (-rotation * 0.7) + 'deg)';
    if (rings[2]) rings[2].style.transform = 'rotate(' + (rotation * 0.5) + 'deg)';
  }

  // FLOATING GRAPHIC — morphs smoothly, fixed at lower-left
  const graphic = document.getElementById('floatGraphic');
  if (graphic) {
    const section = getScrollSection();
    const prev = graphic.dataset.section || '';
    if (prev !== section.name) {
      graphic.dataset.section = section.name;
      const icons = {
        hero: 'M50,20 L75,60 L25,60 Z',
        about: 'M30,55 L50,25 L70,55 Z',
        services: 'M50,25 L70,60 L30,60 Z',
        tech: 'M50,25 L72,55 L65,72 L35,72 L28,55 Z',
        projects: 'M35,30 L65,30 L75,55 L50,75 L25,55 Z',
        team: 'M50,35 Q65,35 65,50 Q65,65 50,65 Q35,65 35,50 Q35,35 50,35 M30,75 Q50,60 70,75',
        contact: 'M20,40 L50,20 L80,40 M20,40 L20,75 L80,75 L80,40',
      };
      const icon = document.getElementById('fgIcon');
      if (icon && icons[section.name]) {
        icon.setAttribute('d', icons[section.name]);
      }
      graphic.classList.remove('revealed');
      void graphic.offsetWidth;
      graphic.classList.add('revealed');
    }
  }

  // Section indicator dots
  const section = getScrollSection();
  document.querySelectorAll('.section-dot').forEach(function(dot) {
    dot.classList.toggle('active', dot.dataset.section === section.name);
  });

  // Scroll reveal with IntersectionObserver-style
  document.querySelectorAll('.reveal').forEach(function(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60 && !el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
  document.querySelectorAll('.stagger-children').forEach(function(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60 && !el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
  document.querySelectorAll('.scale-reveal').forEach(function(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60 && !el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
}

// ─────────── HERO TEXT SPLIT ───────────
window.addEventListener('load', function() {
  const lines = document.querySelectorAll('.hero h1 .line span');
  lines.forEach(function(span, i) {
    setTimeout(function() {
      span.style.transform = 'translateY(0)';
      span.style.opacity = '1';
    }, 300 + i * 150);
  });
});

// ─────────── MAGNETIC BUTTONS ───────────
document.querySelectorAll('.magnetic-btn').forEach(function(btn) {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0)';
  });
});

// ─────────── 3D TILT ───────────
document.querySelectorAll('.service-card, .tech-card, .project-card, .about-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.transform = 'perspective(1200px) rotateX(' + ((y - rect.height/2) / 25) + 'deg) rotateY(' + ((rect.width/2 - x) / 25) + 'deg) scale3d(1.02,1.02,1.02)';
    this.style.transition = 'transform 0.1s ease-out';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});

// ─────────── CARD CLICK GRAPHIC ───────────
document.querySelectorAll('.service-card, .tech-card, .project-card').forEach(function(card) {
  card.addEventListener('click', function() {
    spawnGraphic();
    playSound('pop');
  });
});

// ─────────── COUNTER ───────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(function() {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 25);
}

const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const num = entry.target.querySelector('.counter-num');
      if (num && !num.dataset.counted) {
        num.dataset.counted = 'true';
        animateCounter(num);
        playSound('splash');
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-item').forEach(function(item) {
  counterObserver.observe(item);
});

// ─────────── GRAPHIC BURST ───────────
function spawnGraphic() {
  const count = 8;
  const colors = ['#3954A4','#5B7BD5','#8BA8F0','#C4D4FF','#00D4AA','#6BCB77','#A78BFA','#FF85A2'];
  const shapes = ['M0,0 L15,0 L7.5,15 Z','M0,0 L12,12 L0,12 Z','M7.5,0 L15,15 L0,15 Z','M0,0 Q7.5,-10 15,0 L7.5,10 Z'];
  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 15 15');
    svg.style.cssText = 'position:fixed;pointer-events:none;z-index:999;left:' + (20 + Math.random() * 60) + 'vw;top:' + (30 + Math.random() * 30) + 'vh;animation:graphicBurst 1.2s cubic-bezier(0.16,1,0.3,1) forwards;';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', shapes[Math.floor(Math.random() * shapes.length)]);
    path.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
    path.setAttribute('opacity', '0.6');
    svg.appendChild(path);
    document.body.appendChild(svg);
    setTimeout(function() { svg.remove(); }, 1400);
  }
}

// ─────────── TEAM SLIDER (Auto-scroll) ───────────
let teamIndex = 0;
let teamAutoTimer = null;
const teamCards = document.querySelectorAll('.team-card');
const dots = document.querySelectorAll('.dot');

function showTeam(index) {
  teamCards.forEach(function(card, i) {
    card.classList.remove('active');
    card.style.display = 'none';
  });
  dots.forEach(function(d) { d.classList.remove('active'); });
  teamIndex = (index + teamCards.length) % teamCards.length;
  teamCards[teamIndex].style.display = 'flex';
  setTimeout(function() { teamCards[teamIndex].classList.add('active'); }, 10);
  if (dots[teamIndex]) dots[teamIndex].classList.add('active');
}

function changeTeam(dir) {
  showTeam(teamIndex + dir);
  resetTeamAuto();
}
function goToTeam(index) {
  showTeam(index);
  resetTeamAuto();
}

function resetTeamAuto() {
  if (teamAutoTimer) clearInterval(teamAutoTimer);
  teamAutoTimer = setInterval(function() { showTeam(teamIndex + 1); }, 2200);
}

showTeam(0);
resetTeamAuto();

// Button event listeners
document.getElementById('teamPrev').addEventListener('click', function() { changeTeam(-1); });
document.getElementById('teamNext').addEventListener('click', function() { changeTeam(1); });
document.querySelectorAll('.dot').forEach(function(dot) {
  dot.addEventListener('click', function() { goToTeam(parseInt(this.dataset.index)); });
});

// Pause auto-scroll on hover, resume on leave
const teamWrap = document.querySelector('.team-slider-wrap');
if (teamWrap) {
  teamWrap.addEventListener('mouseenter', function() { if (teamAutoTimer) clearInterval(teamAutoTimer); teamAutoTimer = null; });
  teamWrap.addEventListener('mouseleave', function() { if (!teamAutoTimer) resetTeamAuto(); });
}

// ─────────── MOBILE INPUT ───────────
function validateMobile(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 10);
}

// ─────────── LOADER + SCROLL RESET ───────────
window.addEventListener('beforeunload', function() {
  window.scrollTo(0, 0);
});
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'flex';
    setTimeout(function() {
      loader.style.opacity = '0';
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(function() { loader.style.display = 'none'; }, 800);
    }, 1200);
  }
});

// ─────────── FORM → WHATSAPP ───────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fd = new FormData(this);
  const name = fd.get('name') || '';
  const email = fd.get('email') || '';
  const mobile = fd.get('mobile') || '';
  const company = fd.get('company') || '';
  const message = fd.get('message') || '';
  const webapp = fd.get('webapp') ? '✓ Web App ' : '';
  const app = fd.get('app') ? '✓ Mobile App ' : '';
  const other = fd.get('other') ? '✓ Other ' : '';
  const services = [webapp, app, other].filter(Boolean).join('| ') || 'Not specified';
  const text = 'Hi Nuvion! I\'m interested in your services.\n\n*Name:* ' + name + '\n*Email:* ' + email + '\n*Phone:* ' + mobile + '\n*Company:* ' + (company || 'N/A') + '\n*Interested in:* ' + services + '\n\n*Message:* ' + message;
  const btn = this.querySelector('button');
  btn.innerHTML = 'Redirecting... <i class="bi bi-whatsapp"></i>';
  btn.disabled = true;
  playSound('whoosh');
  spawnGraphic();
  setTimeout(function() {
    window.open('https://wa.me/919537531054?text=' + encodeURIComponent(text), '_blank');
    btn.innerHTML = 'Send Message <i class="bi bi-send-fill"></i>';
    btn.disabled = false;
  }, 600);
});

// ─────────── WATER RIPPLE ───────────
document.querySelectorAll('.hero, .about-section, .services-section').forEach(function(section) {
  section.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.style.cssText = 'position:fixed;pointer-events:none;width:20px;height:20px;border-radius:50%;background:rgba(57,84,164,0.12);left:' + (e.clientX - 10) + 'px;top:' + (e.clientY - 10) + 'px;z-index:9999;animation:ripple 0.8s ease-out forwards;';
    document.body.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 800);
  });
});

// ─────────── SMOOTH NAV ───────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    }
  });
});

// ─────────── SECTION INDICATOR ───────────
function buildSectionIndicator() {
  const sections = ['hero','about','services','tech','projects','team','contact'];
  const container = document.createElement('div');
  container.className = 'section-indicator';
  sections.forEach(function(id) {
    const dot = document.createElement('div');
    dot.className = 'section-dot';
    dot.dataset.section = id;
    dot.title = id.charAt(0).toUpperCase() + id.slice(1);
    dot.addEventListener('click', function() {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });
    container.appendChild(dot);
  });
  document.body.appendChild(container);
}
buildSectionIndicator();

// ─────────── GRAPHIC BURST ANIMATION ───────────
const styleSheet = document.createElement('style');
styleSheet.textContent = '@keyframes graphicBurst { 0% { opacity:0; transform:scale(0) rotate(0deg) translateY(0); } 30% { opacity:0.8; transform:scale(1.2) rotate(30deg) translateY(-10px); } 100% { opacity:0; transform:scale(0.4) rotate(60deg) translateY(-60px); } }';
document.head.appendChild(styleSheet);

// ─────────── OFFLINE DETECTION ───────────
window.addEventListener('offline', function() {
  const toast = document.createElement('div');
  toast.className = 'offline-toast';
  toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> You are offline — site still works!';
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s ease'; setTimeout(function() { toast.remove(); }, 600); }, 4000);
});
window.addEventListener('online', function() {
  const toast = document.createElement('div');
  toast.className = 'offline-toast';
  toast.style.background = 'rgba(0,212,170,0.9)';
  toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Back online!';
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s ease'; setTimeout(function() { toast.remove(); }, 600); }, 3000);
});

// ─────────── CONSOLE ───────────
console.log('%c Nuvion Technologies \uD83D\uDE80 ', 'background:#3954A4;color:white;font-size:18px;padding:12px 24px;border-radius:8px;font-weight:bold;');
console.log('%c WaterPark360 \u2014 Scroll sounds use .wav files | Press [S] to toggle', 'color:#5B7BD5;font-size:14px;');
