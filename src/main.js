import './styles.css';
import { gsap } from 'gsap';
import { createMotionSystem } from './motion.js';

const brandMark = '<img src="/marea-alta-mark.svg" width="40" height="40" alt="" />';
const gaugeTicks = Array.from({ length: 41 }, (_, index) => {
  const angle = (-180 + index * 4.5) * Math.PI / 180;
  const major = index % 10 === 0;
  const x1 = 180 + Math.cos(angle) * (major ? 126 : 132);
  const y1 = 180 + Math.sin(angle) * (major ? 126 : 132);
  const x2 = 180 + Math.cos(angle) * 145;
  const y2 = 180 + Math.sin(angle) * 145;
  return `<line class="gauge-tick${major ? ' is-major' : ''}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
}).join('');

document.querySelector('#main').innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Marea Alta, home">
      ${brandMark}<span class="brand-name">Marea Alta</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation">
      <span></span><span></span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Main navigation">
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

  <section class="wash-section roof-wash" id="house-roof" aria-labelledby="roof-title">
    <div class="wash-stage">
      <img class="wash-image wash-dirty" src="/images/placeholder-roof-dirty.svg" alt="A brick house roof with dark algae streaks before a soft wash" loading="lazy" decoding="async" />
      <img class="wash-image wash-clean" src="/images/placeholder-roof-clean.svg" alt="The same brick roof after the algae streaks have been treated" loading="lazy" decoding="async" />
      <div class="wash-shade" aria-hidden="true"></div>
      <div class="curb-score" aria-label="Curb appeal score: 41 out of 100">
        <svg class="score-ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="score-track" cx="32" cy="32" r="25"/><circle class="score-value-ring" cx="32" cy="32" r="25"/></svg>
        <span class="score-copy"><span class="score-label">Curb appeal</span><span><strong class="score-number">41</strong><span class="score-max"> / 100</span></span></span>
      </div>
      <div class="wash-copy">
        <p class="wash-kicker">The roof wash</p>
        <h2 id="roof-title">Those black streaks are alive.</h2>
        <p>The dark streaks are algae (<i>Gloeocapsa magma</i>) feeding on your shingles. We never pressure wash roofs. We soft wash them.</p>
      </div>
      <span class="wash-location">Santo Domingo · soft wash</span>
    </div>
  </section>

  <section class="wash-section siding-wash" id="siding-wash" aria-labelledby="siding-title">
    <div class="wash-stage">
      <img class="wash-image wash-dirty" src="/images/placeholder-siding-dirty.svg" alt="Green algae on white house siding before a low-pressure wash" loading="lazy" decoding="async" />
      <img class="wash-image wash-clean" src="/images/placeholder-siding-clean.svg" alt="Technician rinsing clean white siding with low pressure" loading="lazy" decoding="async" />
      <div class="wash-shade" aria-hidden="true"></div>
      <div class="curb-score" aria-label="Curb appeal score: 41 out of 100">
        <svg class="score-ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="score-track" cx="32" cy="32" r="25"/><circle class="score-value-ring" cx="32" cy="32" r="25"/></svg>
        <span class="score-copy"><span class="score-label">Curb appeal</span><span><strong class="score-number">41</strong><span class="score-max"> / 100</span></span></span>
      </div>
      <div class="wash-copy">
        <p class="wash-kicker">The right pressure</p>
        <h2 id="siding-title">Low pressure. Real chemistry.</h2>
        <p>We let the cleaning solution do the hard work, then rinse gently to lift algae without beating up your siding.</p>
      </div>
      <span class="wash-location">Santo Domingo · siding wash</span>
    </div>
  </section>

  <section class="comparison-section" id="before-after" aria-labelledby="comparison-title">
    <div class="comparison-heading">
      <div>
        <p class="comparison-kicker">The proof is in the rinse</p>
        <h2 id="comparison-title">Same house. One visit.</h2>
      </div>
      <p>Drag the line. Nothing was painted, replaced, or edited out. Just washed.</p>
    </div>
    <figure class="comparison-frame" id="comparison-frame" style="--split: 50%">
      <img class="comparison-image comparison-before" src="/images/placeholder-house-comparison-before.svg" alt="House with algae-stained light siding and a pressure-washing trailer in the driveway" loading="lazy" decoding="async" />
      <img class="comparison-image comparison-after" src="/images/placeholder-house-comparison-after.svg" alt="The same house with clean light siding and the same pressure-washing trailer in the driveway" loading="lazy" decoding="async" />
      <span class="comparison-tag tag-before" aria-hidden="true">Before</span>
      <span class="comparison-tag tag-after" aria-hidden="true">After</span>
      <span class="comparison-divider" aria-hidden="true"><span class="divider-grip"><i></i><i></i></span></span>
      <input class="compare-range" id="compare-range" type="range" min="0" max="100" value="50" aria-label="Before and after comparison. Drag to reveal the clean house." aria-valuetext="50% before, 50% after" />
      <figcaption class="sr-only">A before and after view of a home exterior cleaned in one visit. The trailer and equipment remain in the driveway in both images.</figcaption>
    </figure>
  </section>

  <section class="pressure-section" id="pressure-gauge" aria-labelledby="pressure-title">
    <div class="pressure-copy">
      <p class="section-eyebrow">Not everything gets blasted</p>
      <h2 id="pressure-title">The right pressure for every surface.</h2>
      <p>Damage comes from using one setting on everything. We match the pressure, chemistry, and tool to what we’re cleaning.</p>
      <div class="surface-picker" role="group" aria-label="Choose a surface">
        <button type="button" class="surface-chip" data-surface="siding" aria-pressed="false">Siding</button>
        <button type="button" class="surface-chip" data-surface="roof" aria-pressed="false">Roof</button>
        <button type="button" class="surface-chip is-selected" data-surface="driveway" aria-pressed="true">Driveway</button>
        <button type="button" class="surface-chip" data-surface="deck" aria-pressed="false">Deck</button>
        <button type="button" class="surface-chip" data-surface="gutters" aria-pressed="false">Gutters</button>
      </div>
    </div>
    <div class="gauge-card" aria-live="polite">
      <div class="gauge-card-top"><span class="gauge-status"><i></i> Surface matched</span><span class="gauge-units">PSI</span></div>
      <div class="gauge-wrap">
        <svg class="pressure-gauge" viewBox="0 0 360 220" role="img" aria-labelledby="gauge-svg-title gauge-svg-description">
          <title id="gauge-svg-title">Cleaning pressure gauge</title>
          <desc id="gauge-svg-description">Needle shows the selected surface's recommended pressure.</desc>
          <path class="gauge-arc-track" d="M 35 180 A 145 145 0 0 1 325 180" />
          <path class="gauge-arc-value" id="gauge-arc" d="M 35 180 A 145 145 0 0 1 325 180" />
          ${gaugeTicks}
          <text class="gauge-label" x="35" y="202">0k</text><text class="gauge-label" x="78" y="86">1k</text>
          <text class="gauge-label" x="174" y="45">2k</text><text class="gauge-label" x="275" y="86">3k</text>
          <text class="gauge-label" x="315" y="202">4k</text>
          <g class="gauge-needle" id="gauge-needle"><path d="M 176 181 L 180 67 L 184 181 Z"/><circle cx="180" cy="180" r="9"/></g>
        </svg>
      </div>
      <div class="gauge-reading"><strong id="pressure-reading">3,000–4,000 PSI</strong><span>at the surface</span></div>
      <div class="gauge-method"><div><span>Method</span><strong id="pressure-method">Pressure wash</strong></div><div><span>Tool</span><strong id="pressure-tool">20-inch surface cleaner + wand edges</strong></div></div>
    </div>
  </section>

  <section class="care-section" aria-labelledby="care-title">
    <div class="care-heading"><p class="section-eyebrow">Care comes standard</p><h2 id="care-title">Clean, not damaged.</h2><p>We take the time to choose a method that respects the material and the people around it.</p></div>
    <div class="care-cards">
      <article class="care-card"><span class="care-icon" aria-hidden="true">✓</span><div><h3>Fully insured</h3><p>Your home is protected while our crew is on site.</p></div></article>
      <article class="care-card"><span class="care-icon care-icon-shield" aria-hidden="true">⌂</span><div><h3>Safe for your surfaces</h3><p>Soft wash protects shingles, paint, and wood.</p></div></article>
      <article class="care-card"><span class="care-icon care-icon-drop" aria-hidden="true">✳</span><div><h3>Thoughtful rinse</h3><p>Plant-conscious products and a careful rinse around your home.</p></div></article>
    </div>
  </section>

  <section class="quote-section" id="instant-quote" aria-labelledby="quote-title">
    <div class="quote-heading"><p class="section-eyebrow">A clear place to start</p><h2 id="quote-title">Price your house in 20 seconds.</h2><p>Build a quick estimate around your home and the surfaces you’d like us to clean.</p></div>
    <div class="quote-layout">
      <div class="calculator-card">
        <div class="calculator-header"><h3>Your project</h3><span class="estimate-time"><span aria-hidden="true">◷</span> About 20 seconds</span></div>
        <div class="calculator-field size-field"><div class="field-heading"><label for="home-size">Home size</label><output id="home-size-output" for="home-size">2,200 sq ft</output></div><input id="home-size" type="range" min="700" max="5000" step="100" value="2200" aria-describedby="size-help"><div class="range-ends"><span>700 sq ft</span><span>5,000 sq ft</span></div><span class="sr-only" id="size-help">Choose an approximate home size.</span></div>
        <fieldset class="calculator-field"><legend>What should we clean?</legend><div class="quote-surface-picker" role="group" aria-label="Select the surfaces to clean">
          <button type="button" class="quote-chip is-selected" data-quote-surface="house" aria-pressed="true">House</button><button type="button" class="quote-chip is-selected" data-quote-surface="roof" aria-pressed="true">Roof</button><button type="button" class="quote-chip is-selected" data-quote-surface="driveway" aria-pressed="true">Driveway</button><button type="button" class="quote-chip" data-quote-surface="deck" aria-pressed="false">Deck</button><button type="button" class="quote-chip" data-quote-surface="gutters" aria-pressed="false">Gutters</button>
        </div></fieldset>
        <div class="calculator-field condition-field"><label for="condition">Current condition</label><select id="condition"><option value="light">Light buildup</option><option value="typical" selected>Typical buildup</option><option value="heavy">Heavy buildup</option></select></div>
        <div class="estimate-panel" aria-live="polite"><span class="estimate-label">Your planning range</span><strong id="quote-price">$725–$1,235</strong><span id="estimate-note">Final price confirmed after a quick review.</span></div>
      </div>
      <form class="lead-card" id="quote-form" novalidate>
        <h3>Get your exact price</h3><p class="lead-intro">Leave a few details and we’ll follow up with a precise quote.</p>
        <div class="form-field"><label for="lead-name">Your name</label><input id="lead-name" name="name" autocomplete="name" required placeholder="Jordan Lee"></div>
        <div class="form-field"><label for="lead-email">Email <span>(optional)</span></label><input id="lead-email" name="email" type="email" autocomplete="email" placeholder="jordan@example.com"></div>
        <div class="form-field"><label for="lead-phone">Phone <span>(optional)</span></label><input id="lead-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(809) 555-0142"></div>
        <p class="contact-help" id="contact-help">Add an email or phone so we know where to reply.</p>
        <div class="form-field"><label for="lead-address">Service address</label><input id="lead-address" name="address" autocomplete="street-address" required placeholder="Street, neighborhood, city"></div>
        <p class="form-error" id="form-error" role="alert" hidden></p>
        <button class="submit-quote" type="submit">Get my exact price <span aria-hidden="true">→</span></button>
        <p class="privacy-note"><span aria-hidden="true">♢</span> Your details stay private. No spam, just your quote.</p>
        <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
        <input type="hidden" name="quote_range" id="quote-range-hidden" value="$725–$1,235">
      </form>
    </div>
  </section>

  <!-- Keep package starting prices aligned with index.html LocalBusiness offers. -->
  <section class="packages-section" id="packages" aria-labelledby="packages-title">
    <div class="packages-heading"><p class="section-eyebrow">Straightforward starting points</p><h2 id="packages-title">Pick the clean you need.</h2><p>Every home is different. These packages give you a clear place to start, then we confirm the price for your property.</p></div>
    <div class="package-grid">
      <article class="package-card">
        <p class="package-label">A front-of-house refresh</p><h3>Curb Refresh</h3>
        <p class="package-price"><span>Starting at</span><strong>$189</strong></p>
        <p class="package-description">Clean the hard surfaces guests and neighbors notice first.</p>
        <ul><li>Driveway pressure wash</li><li>Front walk and entry</li><li>Spot treatment for common stains</li></ul>
        <a class="package-button" href="#instant-quote">Price my curb refresh <span aria-hidden="true">→</span></a>
      </article>
      <article class="package-card package-featured">
        <span class="package-badge">Most chosen</span><p class="package-label">The complete outside clean</p><h3>Full Exterior</h3>
        <p class="package-price"><span>Starting at</span><strong>$725</strong></p>
        <p class="package-description">Refresh the main surfaces around your home in one visit.</p>
        <ul><li>House siding soft wash</li><li>Roof soft wash</li><li>Driveway and front walk</li><li>Exterior gutter face rinse</li></ul>
        <a class="package-button" href="#instant-quote">Price my full exterior <span aria-hidden="true">→</span></a>
      </article>
      <article class="package-card">
        <p class="package-label">A clean slate outdoors</p><h3>Total Reset</h3>
        <p class="package-price"><span>Starting at</span><strong>$1,195</strong></p>
        <p class="package-description">Take care of the house and the outdoor areas all at once.</p>
        <ul><li>Everything in Full Exterior</li><li>Deck or patio wash</li><li>Fence wash</li><li>Detailed perimeter rinse</li></ul>
        <a class="package-button" href="#instant-quote">Price my total reset <span aria-hidden="true">→</span></a>
      </article>
    </div>
    <p class="package-note">Starting prices are examples in US dollars. Final pricing depends on home size, access, and buildup.</p>
  </section>
`;

document.querySelector('#main').insertAdjacentHTML('afterend', `
  <footer class="site-footer" aria-labelledby="footer-title">
    <div class="footer-top">
      <div class="footer-brand-block">
        <a class="brand footer-brand" href="#top" aria-label="Marea Alta, back to top">${brandMark}<span class="brand-name">Marea Alta</span></a>
        <p>Exterior cleaning with a lighter touch.</p>
        <a class="footer-phone" href="tel:+18095550142">+1 (809) 555-0142</a>
      </div>
      <div class="footer-service-area"><h2 id="footer-title">Serving Santo Domingo</h2><p>Residential exterior cleaning across the Distrito Nacional, including Piantini, Naco, Bella Vista, and nearby neighborhoods.</p><p class="footer-insurance">Insured exterior cleaning · Santo Domingo, D.N.</p></div>
      <div class="footer-social"><span>Keep in touch</span><div class="social-links">
        <a href="https://www.instagram.com/mareaalta.do/" target="_blank" rel="noopener noreferrer" aria-label="Marea Alta on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-dot" cx="17.5" cy="6.7" r=".8"/></svg></a>
        <a href="https://www.facebook.com/mareaalta.do/" target="_blank" rel="noopener noreferrer" aria-label="Marea Alta on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.1 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.3v2.2H8.2V13h2.7v8z"/></svg></a>
      </div></div>
    </div>
    <div class="footer-bottom"><span>© <span id="copyright-year">2026</span> Marea Alta. Made for a cleaner first impression.</span><a class="footer-cta" href="#instant-quote">Free quote <span aria-hidden="true">↗</span></a></div>
  </footer>
`);
document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());

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
  navToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !expanded);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
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
const scoreState = { value: 41 };
const scoreCircumference = 2 * Math.PI * 25;
const scoreRings = document.querySelectorAll('.score-value-ring');
const scoreCards = document.querySelectorAll('.curb-score');

function updateCurbScore(value) {
  const score = Math.round(value);
  scoreRings.forEach((ring) => {
    ring.style.strokeDasharray = `${scoreCircumference}`;
    ring.style.strokeDashoffset = `${scoreCircumference * (1 - score / 100)}`;
  });
  scoreCards.forEach((card) => {
    card.setAttribute('aria-label', `Curb appeal score: ${score} out of 100`);
    card.querySelector('.score-number').textContent = String(score);
  });
}

const scrollAnimations = gsap.matchMedia();
scrollAnimations.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('.wash-section').forEach((section) => {
    const cleanLayer = section.querySelector('.wash-clean');
    gsap.fromTo(cleanLayer, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 78%', end: 'bottom 27%', scrub: true },
    });
  });

  gsap.to(scoreState, {
    value: 87,
    ease: 'none',
    onUpdate: () => updateCurbScore(scoreState.value),
    scrollTrigger: {
      trigger: '#house-roof',
      start: 'top 78%',
      endTrigger: '#siding-wash',
      end: 'bottom 27%',
      scrub: true,
    },
  });
});

const onReducedMotionChange = (event) => updateCurbScore(event.matches ? 87 : 41);
reducedMotion.addEventListener('change', onReducedMotionChange);
if (reducedMotion.matches) updateCurbScore(87);

const comparison = document.querySelector('#comparison-frame');
const comparisonRange = document.querySelector('#compare-range');
function updateComparison() {
  const split = Number(comparisonRange.value);
  comparison.style.setProperty('--split', `${split}%`);
  comparisonRange.setAttribute('aria-valuetext', `${split}% before, ${100 - split}% after`);
}
comparisonRange.addEventListener('input', updateComparison);
comparisonRange.addEventListener('change', updateComparison);

const pressureData = {
  siding: { value: 200, range: '100–300 PSI', method: 'Soft wash', tool: 'Low-pressure rinse + detergent' },
  roof: { value: 180, range: 'Under 300 PSI', method: 'Soft wash', tool: 'Low-pressure application + rinse' },
  driveway: { value: 3500, range: '3,000–4,000 PSI', method: 'Pressure wash', tool: '20-inch surface cleaner + wand edges' },
  deck: { value: 950, range: '500–1,500 PSI', method: 'Controlled pressure wash', tool: 'Fan tip + grain-aware passes' },
  gutters: { value: 450, range: 'Under 1,000 PSI', method: 'Soft wash', tool: 'Low-pressure rinse + gutter brightener' },
};
const gaugeNeedle = document.querySelector('#gauge-needle');
const gaugeArc = document.querySelector('#gauge-arc');
const pressureReading = document.querySelector('#pressure-reading');
const pressureMethod = document.querySelector('#pressure-method');
const pressureTool = document.querySelector('#pressure-tool');
let gaugeAnimation;
const gaugeAngle = { value: 67.5 };
function selectPressureSurface(surface) {
  const data = pressureData[surface];
  document.querySelectorAll('.surface-chip').forEach((chip) => {
    const selected = chip.dataset.surface === surface;
    chip.classList.toggle('is-selected', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  pressureReading.textContent = data.range;
  pressureMethod.textContent = data.method;
  pressureTool.textContent = data.tool;
  const targetRotation = -90 + (data.value / 4000) * 180;
  const circumference = 2 * Math.PI * 145;
  gaugeArc.style.strokeDashoffset = String(circumference * (1 - data.value / 4000));
  gaugeAnimation?.kill();
  gaugeAnimation = gsap.to(gaugeAngle, {
    value: targetRotation,
    duration: reducedMotion.matches ? 0 : 0.9,
    ease: reducedMotion.matches ? 'none' : 'elastic.out(1, 0.48)',
    onUpdate: () => gaugeNeedle.setAttribute('transform', `rotate(${gaugeAngle.value} 180 180)`),
  });
}
document.querySelectorAll('.surface-chip').forEach((chip) => chip.addEventListener('click', () => selectPressureSurface(chip.dataset.surface)));
selectPressureSurface('driveway');

const quoteForm = document.querySelector('#quote-form');
const homeSize = document.querySelector('#home-size');
const homeSizeOutput = document.querySelector('#home-size-output');
const conditionSelect = document.querySelector('#condition');
const quotePrice = document.querySelector('#quote-price');
const estimateNote = document.querySelector('#estimate-note');
const quoteRangeHidden = document.querySelector('#quote-range-hidden');
const formError = document.querySelector('#form-error');
const formStatus = document.querySelector('#form-status');
const quotePriceState = { low: 725, high: 1235 };
let priceAnimation;
function selectedQuoteSurfaces() {
  return [...document.querySelectorAll('.quote-chip.is-selected')].map((chip) => chip.dataset.quoteSurface);
}
function roundToFive(value) { return Math.round(value / 5) * 5; }
function formatCurrency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }
function updateQuote() {
  const size = Number(homeSize.value);
  const selected = selectedQuoteSurfaces();
  const scale = size / 2200;
  // Example USD rates only; replace these with the business's approved pricing model.
  const surfaceCosts = { house: 300 * scale, roof: 340 * scale, driveway: 265 * Math.sqrt(scale), deck: 250 * Math.sqrt(scale), gutters: 180 * Math.sqrt(scale) };
  const base = selected.reduce((sum, surface) => sum + surfaceCosts[surface], 0);
  const conditionMultiplier = { light: .9, typical: 1, heavy: 1.25 }[conditionSelect.value];
  const low = base ? roundToFive(base * conditionMultiplier * .8) : 0;
  const high = base ? roundToFive(base * conditionMultiplier * 1.365) : 0;
  homeSizeOutput.textContent = `${new Intl.NumberFormat('en-US').format(size)} sq ft`;
  const progress = ((size - Number(homeSize.min)) / (Number(homeSize.max) - Number(homeSize.min))) * 100;
  homeSize.style.setProperty('--range-progress', `${progress}%`);
  estimateNote.textContent = selected.length ? 'Final price confirmed after a quick review.' : 'Choose at least one surface to see your range.';
  priceAnimation?.kill();
  priceAnimation = gsap.to(quotePriceState, {
    low, high,
    duration: reducedMotion.matches ? 0 : .45,
    ease: 'power2.out',
    onUpdate: () => {
      const rangeText = `${formatCurrency(Math.round(quotePriceState.low / 5) * 5)}–${formatCurrency(Math.round(quotePriceState.high / 5) * 5)}`;
      quotePrice.textContent = rangeText;
      quoteRangeHidden.value = rangeText;
    },
  });
}
document.querySelectorAll('.quote-chip').forEach((chip) => chip.addEventListener('click', () => {
  const selected = !chip.classList.contains('is-selected');
  chip.classList.toggle('is-selected', selected);
  chip.setAttribute('aria-pressed', String(selected));
  updateQuote();
}));
homeSize.addEventListener('input', updateQuote);
conditionSelect.addEventListener('change', updateQuote);
updateQuote();

quoteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.hidden = true;
  formStatus.replaceChildren();
  const email = quoteForm.elements.email.value.trim();
  const phone = quoteForm.elements.phone.value.trim();
  const contactHelp = document.querySelector('#contact-help');
  if (!quoteForm.elements.name.value.trim() || !quoteForm.elements.address.value.trim()) {
    formError.textContent = 'Add your name and service address to continue.';
    formError.hidden = false;
    (!quoteForm.elements.name.value.trim() ? quoteForm.elements.name : quoteForm.elements.address).focus();
    return;
  }
  if (!email && !phone) {
    formError.textContent = 'Add an email or phone number so we can send your quote.';
    formError.hidden = false;
    quoteForm.elements.email.focus();
    contactHelp.textContent = 'Please add at least one way for us to reply.';
    contactHelp.classList.add('has-error');
    return;
  }
  if (email && !quoteForm.elements.email.validity.valid) {
    contactHelp.classList.remove('has-error');
    formError.textContent = 'Check the email address and try again.';
    formError.hidden = false;
    quoteForm.elements.email.focus();
    return;
  }
  contactHelp.textContent = 'Add an email or phone so we know where to reply.';
  contactHelp.classList.remove('has-error');
  if (!selectedQuoteSurfaces().length) {
    formError.textContent = 'Choose at least one surface before requesting a quote.';
    formError.hidden = false;
    document.querySelector('.quote-surface-picker').scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    return;
  }
  const button = quoteForm.querySelector('.submit-quote');
  button.disabled = true;
  button.textContent = 'Sending your request…';
  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT;
  try {
    if (endpoint) {
      const formData = new FormData(quoteForm);
      formData.set('home_size_sq_ft', homeSize.value);
      formData.set('surfaces', selectedQuoteSurfaces().join(', '));
      formData.set('condition', conditionSelect.options[conditionSelect.selectedIndex].text);
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: formData });
      if (!response.ok) throw new Error('Quote request failed');
      formStatus.textContent = 'Your request is in. We’ll follow up with your exact price shortly.';
    } else {
      const recipient = import.meta.env.VITE_LEAD_EMAIL || 'hello@example.com';
      const subject = encodeURIComponent(`Quote request from ${quoteForm.elements.name.value.trim()}`);
      const body = encodeURIComponent([
        `Name: ${quoteForm.elements.name.value.trim()}`,
        `Email: ${email || 'Not provided'}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service address: ${quoteForm.elements.address.value.trim()}`,
        `Home size: ${homeSizeOutput.textContent}`,
        `Surfaces: ${selectedQuoteSurfaces().join(', ')}`,
        `Condition: ${conditionSelect.options[conditionSelect.selectedIndex].text}`,
        `Planning range: ${quoteRangeHidden.value}`,
      ].join('\n'));
      const link = document.createElement('a');
      link.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      link.textContent = `Open your email app to send your request to ${recipient}`;
      formStatus.append('Your quote details are ready. ', link);
    }
  } catch {
    formError.textContent = 'We couldn’t send that just now. Please try again in a moment.';
    formError.hidden = false;
  } finally {
    button.disabled = false;
    button.innerHTML = 'Get my exact price <span aria-hidden="true">→</span>';
  }
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    motion.destroy();
    scrollAnimations.revert();
    gaugeAnimation?.kill();
    priceAnimation?.kill();
    reducedMotion.removeEventListener('change', onReducedMotionChange);
    resizeObserver?.disconnect();
    if (particleFrame) cancelAnimationFrame(particleFrame);
    if (automation) automation.kill();
    window.clearInterval(timerId);
  });
}
