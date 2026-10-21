import './styles.css';
import { gsap } from 'gsap';
import { createMotionSystem } from './motion.js';

const brandMark = '<img src="/marea-alta-mark.svg" width="40" height="40" alt="" />';

document.querySelector('#main').innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Marea Alta, inicio">
      ${brandMark}<span class="brand-name">Marea Alta</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Abrir navegación">
      <span></span><span></span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Navegación principal">
      <a href="#try-the-wand">Try the wand</a>
      <a href="#house-roof">House &amp; roof</a>
      <a href="#before-after">Before / after</a>
      <a href="#instant-quote">Instant quote</a>
      <a href="#packages">Packages</a>
    </nav>
    <a class="quote-button" href="#instant-quote">Free quote</a>
  </header>

  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-copy">
      <div class="hero-heading-wrap">
        <h1 id="hero-title">Clean this driveway<span class="heading-period">.</span></h1>
        <p class="hero-instruction">Press and hold (or touch with a finger) to spray.</p>
      </div>
      <div class="tool-picker" role="group" aria-label="Choose a cleaning tool">
        <button class="tool-chip is-active" type="button" data-tool="surface" aria-pressed="true">
          <span class="tool-icon tool-icon-wide" aria-hidden="true"></span>
          <span><strong>Surface cleaner · 20-inch</strong><small>Wide clean lanes</small></span>
        </button>
        <button class="tool-chip" type="button" data-tool="wand" aria-pressed="false">
          <span class="tool-icon tool-icon-wand" aria-hidden="true"></span>
          <span><strong>Wand · 25° tip</strong><small>Narrow, precise</small></span>
        </button>
      </div>
    </div>

    <div class="driveway-frame" id="try-the-wand">
      <div class="driveway-canvas" id="driveway" aria-label="Interactive driveway cleaning demo" aria-describedby="keyboard-help" role="application" tabindex="0">
        <span class="sr-only" id="keyboard-help">Use the arrow keys to spray clean areas.</span>
        <canvas class="driveway-layer" id="driveway-base" aria-hidden="true"></canvas>
        <canvas class="driveway-layer driveway-dirty" id="driveway-dirty" aria-hidden="true"></canvas>
        <canvas class="driveway-layer driveway-effects" id="driveway-effects" aria-hidden="true"></canvas>
        <canvas class="driveway-layer driveway-particles" id="driveway-particles" aria-hidden="true"></canvas>
        <div class="driveway-shade" aria-hidden="true"></div>
        <div class="cleaning-hud" aria-live="polite">
          <div class="hud-clean"><span class="hud-label">Clean</span><strong id="clean-percent">0%</strong></div>
          <span class="hud-divider"></span>
          <div class="hud-timer"><span class="hud-label">Time</span><strong id="timer">0:00</strong></div>
        </div>
        <div class="stain-pins" aria-hidden="true">
          <span class="stain-pin pin-oil">Oil drip</span>
          <span class="stain-pin pin-tires">Tire tracks</span>
          <span class="stain-pin pin-mildew">Black mildew</span>
          <span class="stain-pin pin-rust">Rust fan</span>
          <span class="stain-pin pin-weeds">Weeds in joints</span>
        </div>
        <div class="canvas-bottom-row">
          <span class="canvas-hint"><span class="hint-spark" aria-hidden="true">✳</span> Hold and move to clean</span>
          <button class="pro-button" type="button" id="pro-pass"><span class="play-icon" aria-hidden="true">▶</span> Watch a pro do it</button>
        </div>
        <div class="complete-card" id="complete-card" hidden>
          <span class="complete-spark" aria-hidden="true">✳</span>
          <strong>That’s a clean sweep.</strong>
          <a href="#instant-quote">Get your free quote</a>
        </div>
      </div>
      <div class="canvas-caption"><span>Top-down driveway simulation</span><span>Drag to reveal the clean surface</span></div>
    </div>

    <div class="stain-guide" aria-label="How we treat common driveway stains">
      <article class="stain-card"><span class="stain-swatch swatch-oil"></span><div><h2>Oil drips</h2><p>Pre-treated, then lifted with a focused rinse.</p></div></article>
      <article class="stain-card"><span class="stain-swatch swatch-tire"></span><div><h2>Tire tracks</h2><p>Even passes break up heat-baked rubber.</p></div></article>
      <article class="stain-card"><span class="stain-swatch swatch-mildew"></span><div><h2>Black mildew</h2><p>Surface-safe wash clears organic buildup.</p></div></article>
      <article class="stain-card"><span class="stain-swatch swatch-rust"></span><div><h2>Rust fan</h2><p>Spot treatment helps dissolve iron stains.</p></div></article>
      <article class="stain-card"><span class="stain-swatch swatch-weeds"></span><div><h2>Joint weeds</h2><p>Edges are cleaned carefully, joint by joint.</p></div></article>
    </div>
  </section>
`;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const driveway = document.querySelector('#driveway');
const baseCanvas = document.querySelector('#driveway-base');
const dirtyCanvas = document.querySelector('#driveway-dirty');
const effectsCanvas = document.querySelector('#driveway-effects');
const particlesCanvas = document.querySelector('#driveway-particles');
const baseCtx = baseCanvas.getContext('2d');
const dirtyCtx = dirtyCanvas.getContext('2d', { willReadFrequently: true });
const effectsCtx = effectsCanvas.getContext('2d');
const particlesCtx = particlesCanvas.getContext('2d');
const dirtyImage = new Image();
const cleanImage = new Image();
const cleanPercent = document.querySelector('#clean-percent');
const timer = document.querySelector('#timer');
const proButton = document.querySelector('#pro-pass');
const completeCard = document.querySelector('#complete-card');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
let brushRadius = 65;
let isDrawing = false;
let startedAt = null;
let timerId = 0;
let lastPercent = -1;
let canvasDrawn = false;
let activePointer = null;
let lastPoint = null;
let automation = null;
let resizeObserver;
const particles = [];
let particleFrame = 0;

function setCanvasSize() {
  const rect = driveway.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  let cleanedMask = null;
  if (canvasDrawn && dirtyCanvas.width && dirtyCanvas.height) {
    cleanedMask = document.createElement('canvas');
    cleanedMask.width = dirtyCanvas.width;
    cleanedMask.height = dirtyCanvas.height;
    const maskCtx = cleanedMask.getContext('2d');
    maskCtx.fillStyle = '#fff';
    maskCtx.fillRect(0, 0, cleanedMask.width, cleanedMask.height);
    maskCtx.globalCompositeOperation = 'destination-out';
    maskCtx.drawImage(dirtyCanvas, 0, 0);
  }
  const scale = dpr();
  for (const canvas of [baseCanvas, dirtyCanvas, effectsCanvas, particlesCanvas]) {
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }
  baseCtx.setTransform(scale, 0, 0, scale, 0, 0);
  dirtyCtx.setTransform(scale, 0, 0, scale, 0, 0);
  effectsCtx.setTransform(scale, 0, 0, scale, 0, 0);
  drawCover(baseCtx, cleanImage, rect.width, rect.height);
  dirtyCtx.globalCompositeOperation = 'source-over';
  drawCover(dirtyCtx, dirtyImage, rect.width, rect.height);
  if (cleanedMask) {
    dirtyCtx.globalCompositeOperation = 'destination-out';
    dirtyCtx.drawImage(cleanedMask, 0, 0, rect.width, rect.height);
    dirtyCtx.globalCompositeOperation = 'source-over';
  }
  canvasDrawn = true;
  updateProgress(true);
}

function drawCover(ctx, image, width, height) {
  if (!image.complete || !image.naturalWidth) return;
  const ratio = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * ratio;
  const drawHeight = image.naturalHeight * ratio;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function pointFromEvent(event) {
  const rect = driveway.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function beginTimer() {
  if (startedAt !== null) return;
  startedAt = Date.now();
  timerId = window.setInterval(() => {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }, 250);
}

function sprayAt(x, y, emit = true, measure = true, wet = true) {
  const rect = driveway.getBoundingClientRect();
  dirtyCtx.save();
  dirtyCtx.globalCompositeOperation = 'destination-out';
  const brush = dirtyCtx.createRadialGradient(x, y, brushRadius * 0.45, x, y, brushRadius);
  brush.addColorStop(0, 'rgba(0, 0, 0, 1)');
  brush.addColorStop(0.78, 'rgba(0, 0, 0, 0.92)');
  brush.addColorStop(1, 'rgba(0, 0, 0, 0)');
  dirtyCtx.fillStyle = brush;
  dirtyCtx.beginPath();
  dirtyCtx.arc(x, y, brushRadius, 0, Math.PI * 2);
  dirtyCtx.fill();
  dirtyCtx.restore();
  if (emit) addParticles(x, y);
  if (measure) updateProgress();
  if (wet && rect.width && rect.height) drawWetTrail(x, y);
}

function spraySegment(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / Math.max(4, brushRadius * 0.35)));
  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;
    sprayAt(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress, false, false, false);
  }
  drawWetSegment(from, to);
  addParticles(to.x, to.y);
  updateProgress();
}

function drawWetSegment(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  if (distance < 3) return drawWetTrail(to.x, to.y);
  const wash = effectsCtx.createLinearGradient(from.x, from.y, to.x, to.y);
  wash.addColorStop(0, 'rgba(132, 182, 194, 0)');
  wash.addColorStop(0.16, 'rgba(132, 182, 194, 0.13)');
  wash.addColorStop(0.84, 'rgba(132, 182, 194, 0.13)');
  wash.addColorStop(1, 'rgba(132, 182, 194, 0)');
  effectsCtx.strokeStyle = wash;
  effectsCtx.lineWidth = brushRadius * 2.1;
  effectsCtx.lineCap = 'round';
  effectsCtx.beginPath();
  effectsCtx.moveTo(from.x, from.y);
  effectsCtx.lineTo(to.x, to.y);
  effectsCtx.stroke();
}

function drawWetTrail(x, y) {
  const glow = effectsCtx.createRadialGradient(x, y, brushRadius * 0.22, x, y, brushRadius * 1.45);
  glow.addColorStop(0, 'rgba(218, 238, 239, 0.22)');
  glow.addColorStop(0.58, 'rgba(132, 182, 194, 0.12)');
  glow.addColorStop(1, 'rgba(132, 182, 194, 0)');
  effectsCtx.fillStyle = glow;
  effectsCtx.beginPath();
  effectsCtx.arc(x, y, brushRadius * 1.45, 0, Math.PI * 2);
  effectsCtx.fill();
  // A fine cool edge reads as a damp trail without hiding the clean result.
  effectsCtx.beginPath();
  effectsCtx.arc(x, y, brushRadius * 0.9, 0, Math.PI * 2);
  effectsCtx.strokeStyle = 'rgba(226, 243, 241, 0.12)';
  effectsCtx.lineWidth = 2;
  effectsCtx.stroke();
}

function addParticles(x, y) {
  if (reducedMotion.matches) return;
  for (let i = 0; i < 4; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 1.1;
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.7, life: 1, size: 1.2 + Math.random() * 2.3 });
  }
  if (!particleFrame) particleFrame = requestAnimationFrame(drawParticles);
}

function drawParticles() {
  const rect = driveway.getBoundingClientRect();
  particlesCtx.clearRect(0, 0, rect.width, rect.height);
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 0.035;
    particlesCtx.globalAlpha = Math.max(0, particle.life) * 0.42;
    particlesCtx.fillStyle = '#d8edf0';
    particlesCtx.beginPath();
    particlesCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    particlesCtx.fill();
  }
  particlesCtx.globalAlpha = 1;
  for (let i = particles.length - 1; i >= 0; i -= 1) if (particles[i].life <= 0) particles.splice(i, 1);
  particleFrame = particles.length ? requestAnimationFrame(drawParticles) : 0;
}

function updateProgress(force = false) {
  if (!dirtyCanvas.width || !dirtyCanvas.height) return;
  const pixels = dirtyCtx.getImageData(0, 0, dirtyCanvas.width, dirtyCanvas.height).data;
  let cleared = 0;
  const total = pixels.length / 4;
  // Sample alpha at a regular interval for responsive live feedback.
  for (let i = 3; i < pixels.length; i += 4 * 80) if (pixels[i] < 100) cleared += 1;
  const sampledTotal = Math.ceil(total / 80);
  const percent = Math.min(100, Math.round((cleared / sampledTotal) * 100));
  if (!force && percent === lastPercent) return;
  lastPercent = percent;
  cleanPercent.textContent = `${percent}%`;
  driveway.style.setProperty('--clean-progress', `${percent}%`);
  if (percent >= 100) finishCleaning();
}

function finishCleaning() {
  if (completeCard.hidden) {
    completeCard.hidden = false;
    proButton.disabled = true;
    window.clearInterval(timerId);
    gsap.fromTo(completeCard, { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: reducedMotion.matches ? 0 : 0.35, ease: 'power2.out' });
  }
}

function startSpray(event) {
  if (event.target.closest('button, a, input, select, textarea')) return;
  if (event.button !== undefined && event.button !== 0) return;
  if (completeCard.hidden === false) return;
  event.preventDefault();
  if (automation) automation.kill();
  isDrawing = true;
  activePointer = event.pointerId;
  driveway.setPointerCapture?.(event.pointerId);
  beginTimer();
  const point = pointFromEvent(event);
  lastPoint = point;
  sprayAt(point.x, point.y);
}

function moveSpray(event) {
  if (!isDrawing || event.pointerId !== activePointer) return;
  const point = pointFromEvent(event);
  spraySegment(lastPoint ?? point, point);
  lastPoint = point;
}

function stopSpray(event) {
  if (event.pointerId !== activePointer) return;
  isDrawing = false;
  activePointer = null;
  lastPoint = null;
}

driveway.addEventListener('pointerdown', startSpray);
driveway.addEventListener('pointermove', moveSpray);
driveway.addEventListener('pointerup', stopSpray);
driveway.addEventListener('pointercancel', stopSpray);
driveway.addEventListener('lostpointercapture', () => { isDrawing = false; activePointer = null; lastPoint = null; });
let keyboardPoint = null;
driveway.addEventListener('keydown', (event) => {
  const directions = { ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowDown: [0, 1], ArrowLeft: [-1, 0] };
  if (!directions[event.key] && event.key !== ' ') return;
  event.preventDefault();
  beginTimer();
  const bounds = driveway.getBoundingClientRect();
  keyboardPoint ??= { x: bounds.width / 2, y: bounds.height / 2 };
  if (directions[event.key]) {
    keyboardPoint.x = Math.max(0, Math.min(bounds.width, keyboardPoint.x + directions[event.key][0] * 36));
    keyboardPoint.y = Math.max(0, Math.min(bounds.height, keyboardPoint.y + directions[event.key][1] * 36));
  }
  sprayAt(keyboardPoint.x, keyboardPoint.y);
});

for (const chip of document.querySelectorAll('.tool-chip')) {
  chip.addEventListener('click', () => {
    const surfaceTool = chip.dataset.tool === 'surface';
    brushRadius = surfaceTool ? 65 : 25;
    document.querySelectorAll('.tool-chip').forEach((button) => {
      const selected = button === chip;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  });
}

function runProPass() {
  if (!startedAt) beginTimer();
  if (automation) automation.kill();
  proButton.classList.add('is-running');
  const rect = driveway.getBoundingClientRect();
  const currentRadius = brushRadius;
  brushRadius = 70;
  const progress = { x: rect.width * 0.1, y: rect.height * 0.32 };
  automation = gsap.timeline({
    paused: true,
    onUpdate: () => sprayAt(progress.x, progress.y, false),
    onComplete: () => {
      brushRadius = currentRadius;
      proButton.classList.remove('is-running');
      automation = null;
      // Add a final gentle pass across remaining specks, then finish deterministically.
      dirtyCtx.setTransform(1, 0, 0, 1, 0, 0);
      dirtyCtx.clearRect(0, 0, dirtyCanvas.width, dirtyCanvas.height);
      dirtyCtx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      updateProgress(true);
    },
  });
  automation.to(progress, { x: rect.width * 0.9, duration: reducedMotion.matches ? 0 : 1.35, ease: 'none' });
  automation.to(progress, { y: rect.height * 0.52, duration: 0.12, ease: 'none' });
  automation.to(progress, { x: rect.width * 0.1, duration: reducedMotion.matches ? 0 : 1.35, ease: 'none' });
  automation.to(progress, { y: rect.height * 0.72, duration: 0.12, ease: 'none' });
  automation.to(progress, { x: rect.width * 0.9, duration: reducedMotion.matches ? 0 : 1.35, ease: 'none' });
  automation.to(progress, { y: rect.height * 0.92, duration: 0.12, ease: 'none' });
  automation.to(progress, { x: rect.width * 0.08, duration: reducedMotion.matches ? 0 : 1.35, ease: 'none' });
  automation.play();
}
proButton.addEventListener('click', runProPass);

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.setAttribute('aria-label', expanded ? 'Abrir navegación' : 'Cerrar navegación');
  nav.classList.toggle('is-open', !expanded);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir navegación');
  }
});

cleanImage.src = '/images/placeholder-driveway-clean.svg';
dirtyImage.src = '/images/placeholder-driveway-dirty.svg';
Promise.all([new Promise((resolve) => { cleanImage.onload = resolve; }), new Promise((resolve) => { dirtyImage.onload = resolve; })]).then(() => {
  setCanvasSize();
  resizeObserver = new ResizeObserver(setCanvasSize);
  resizeObserver.observe(driveway);
});

const motion = createMotionSystem();
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    motion.destroy();
    resizeObserver?.disconnect();
    if (particleFrame) cancelAnimationFrame(particleFrame);
    if (automation) automation.kill();
    window.clearInterval(timerId);
  });
}
