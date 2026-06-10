"use client";

import { useEffect, useRef } from "react";
import styles from "./HalftoneName.module.css";

/* Halftone dot-name engine, ported from the redesign mockup. Samples Satoshi
   Black glyphs of `text` into a dot lattice and animates them between an airy
   field and solid letterforms. Two modes:
     playIntro = true  — hero: seed -> fill -> merge load intro, then breathe.
     playIntro = false — footer: rest solid, breathe only while on-screen.
   Returns { build, destroy }; destroy() tears down every timer/loop/listener
   (React mounts/unmounts and StrictMode double-invokes, so this matters). */
function createDotName(canvas, opts) {
  opts = opts || {};
  const TEXT = opts.text || "Alice Zhao";
  const PLAY_INTRO = opts.playIntro !== false;
  const onReveal = typeof opts.onReveal === "function" ? opts.onReveal : null;
  // The dot name is always Satoshi Black; do NOT use --font-display (serif here).
  const FAMILY = opts.family || '"Satoshi", "Arial Black", Arial, sans-serif';
  const WEIGHT = opts.weight || "900";

  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d", { willReadFrequently: true });

  const cssVars = getComputedStyle(document.documentElement);
  const tok = (name, fallback) => (cssVars.getPropertyValue(name).trim() || fallback);
  const num = (name, fallback) => {
    const v = parseFloat(cssVars.getPropertyValue(name));
    return Number.isFinite(v) && v > 0 ? v : fallback;
  };
  const CELL = num("--hero-cell", 12);
  const TRACKING = tok("--tracking-display", "-0.08em");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let dots = [];
  let seedCount = 0;
  let cssW = 0, cssH = 0;
  let glyph = null;
  const OPEN_DILATE_K = 1.25;

  let started = false, revealed = false, finished = false, idleRunning = false;
  let idleVisible = PLAY_INTRO;
  let idleRAF = 0, introRAF = 0;
  let introStart = null;
  let destroyed = false;
  const timers = [];
  let io = null;
  let rt = 0;
  const prefersReduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mask = document.createElement("canvas");
  const maskCtx = mask.getContext("2d");

  // ---- build the dot lattice by sampling rendered glyphs ----
  function build() {
    cssW = canvas.clientWidth;
    if (!cssW) return;

    const MARGIN = Math.ceil(CELL * 1.25) + 1;

    if ("letterSpacing" in offCtx) offCtx.letterSpacing = TRACKING;
    const REF = 200;
    offCtx.font = `${WEIGHT} ${REF}px ${FAMILY}`;
    const m = offCtx.measureText(TEXT);
    const refW = (m.actualBoundingBoxRight !== undefined)
      ? Math.max(m.width, m.actualBoundingBoxRight)
      : m.width;
    const availW = cssW - 2 * MARGIN;
    const size = REF * (availW / refW);

    offCtx.font = `${WEIGHT} ${size}px ${FAMILY}`;
    const mm = offCtx.measureText(TEXT);
    const ascent = (mm.actualBoundingBoxAscent > 0) ? mm.actualBoundingBoxAscent : size * 0.80;
    const descent = (mm.actualBoundingBoxDescent > 0) ? mm.actualBoundingBoxDescent : 0;

    const capH = ascent + descent;
    cssH = Math.round(MARGIN + capH + MARGIN);

    canvas.width = cssW * DPR;
    canvas.height = cssH * DPR;
    canvas.style.height = cssH + "px";
    off.width = canvas.width;
    off.height = canvas.height;

    offCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    offCtx.clearRect(0, 0, cssW, cssH);
    offCtx.fillStyle = "#000";
    offCtx.textBaseline = "alphabetic";
    offCtx.textAlign = "left";
    if ("letterSpacing" in offCtx) offCtx.letterSpacing = TRACKING;
    offCtx.font = `${WEIGHT} ${size}px ${FAMILY}`;

    const x = MARGIN;
    const y = cssH - MARGIN;
    offCtx.fillText(TEXT, x, y);
    glyph = { font: offCtx.font, x, y };

    mask.width = off.width;
    mask.height = off.height;

    const img = offCtx.getImageData(0, 0, off.width, off.height).data;
    const W = off.width;
    dots = [];
    const maxR = CELL * 0.95;

    for (let gy = CELL / 2; gy < cssH; gy += CELL) {
      for (let gx = CELL / 2; gx < cssW; gx += CELL) {
        let cover = 0, n = 0;
        const px0 = Math.floor((gx - CELL / 2) * DPR);
        const py0 = Math.floor((gy - CELL / 2) * DPR);
        const span = Math.max(1, Math.floor(CELL * DPR));
        for (let yy = 0; yy < span; yy += 2) {
          for (let xx = 0; xx < span; xx += 2) {
            const px = px0 + xx, py = py0 + yy;
            if (px < 0 || py < 0 || px >= W || py >= off.height) continue;
            cover += img[(py * W + px) * 4 + 3] / 255;
            n++;
          }
        }
        if (!n) continue;
        const c = cover / n;
        if (c < 0.05) continue;
        const base = (CELL / 2) * 0.9;
        const sizes = [base * 0.5, base * 0.75, base * 1.0];
        const h = ((Math.imul(gx | 0, 73856093) ^ Math.imul(gy | 0, 19349663)) >>> 0) / 4294967295;
        const t = Math.min(1, c * (0.7 + 0.6 * h));
        const idx = t < 0.5 ? 0 : t < 0.82 ? 1 : 2;
        dots.push({ x: gx, y: gy, open: sizes[idx], full: maxR, seed: false, order: 0 });
      }
    }

    assignLetterSeeds();
  }

  function assignLetterSeeds() {
    seedCount = 0;
    for (const d of dots) { d.seed = false; d.order = 0; }
    if (!dots.length) return;

    const chars = TEXT.split("");
    const centres = [];
    let prevW = 0;
    for (let i = 0; i < chars.length; i++) {
      const upto = offCtx.measureText(TEXT.slice(0, i + 1)).width;
      if (chars[i].trim() !== "") {
        centres.push({ x: glyph.x + (prevW + upto) / 2, order: centres.length });
      }
      prevW = upto;
    }
    if (!centres.length) return;

    const buckets = centres.map(() => []);
    for (const d of dots) {
      let bi = 0, bd = Infinity;
      for (let k = 0; k < centres.length; k++) {
        const dx = Math.abs(d.x - centres[k].x);
        if (dx < bd) { bd = dx; bi = k; }
      }
      buckets[bi].push(d);
    }

    buckets.forEach((bucket, k) => {
      if (!bucket.length) return;
      let mx = 0, my = 0;
      for (const d of bucket) { mx += d.x; my += d.y; }
      mx /= bucket.length; my /= bucket.length;
      let best = null, bestD = Infinity;
      for (const d of bucket) {
        const dist = (d.x - mx) * (d.x - mx) + (d.y - my) * (d.y - my);
        if (dist < bestD) { bestD = dist; best = d; }
      }
      if (best) { best.seed = true; best.order = k; seedCount++; }
    });
  }

  function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function clipToGlyph(dilate) {
    maskCtx.setTransform(1, 0, 0, 1, 0, 0);
    maskCtx.clearRect(0, 0, mask.width, mask.height);
    maskCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    maskCtx.fillStyle = "#000";
    maskCtx.strokeStyle = "#000";
    maskCtx.lineJoin = "round";
    maskCtx.font = glyph.font;
    maskCtx.textAlign = "left";
    maskCtx.textBaseline = "alphabetic";
    if ("letterSpacing" in maskCtx) maskCtx.letterSpacing = TRACKING;
    maskCtx.fillText(TEXT, glyph.x, glyph.y);
    if (dilate > 0.1) {
      maskCtx.lineWidth = dilate * 2;
      maskCtx.strokeText(TEXT, glyph.x, glyph.y);
    }
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(mask, 0, 0);
    ctx.restore();
  }

  function draw(p, eased) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#111";
    const e = (eased || easeInOut)(p);
    ctx.beginPath();
    for (const d of dots) {
      const r = d.open + (d.full - d.open) * e;
      if (r <= 0.15) continue;
      ctx.moveTo(d.x + r, d.y);
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    }
    ctx.fill();
    clipToGlyph((1 - e) * CELL * OPEN_DILATE_K);
  }

  function paintOpenField(getR) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#111";
    ctx.beginPath();
    for (let i = 0; i < dots.length; i++) {
      const r = getR(dots[i]);
      if (r <= 0.15) continue;
      ctx.moveTo(dots[i].x + r, dots[i].y);
      ctx.arc(dots[i].x, dots[i].y, r, 0, Math.PI * 2);
    }
    ctx.fill();
    clipToGlyph(CELL * OPEN_DILATE_K);
  }

  // ---- idle loop: rest solid, breathe to dots and back ----
  let t0 = null;
  let lastNow = 0;
  const PERIOD = 1800;
  const HOLD_SOLID = 900;

  function frame(now) {
    if (destroyed) { idleRAF = 0; return; }
    if (t0 === null || now - lastNow > 250) t0 = now;
    lastNow = now;
    const elapsedRaw = now - t0;
    const elapsed = (elapsedRaw + HOLD_SOLID) % (HOLD_SOLID + PERIOD);
    let p;
    if (elapsed < HOLD_SOLID) {
      p = 1;
    } else {
      const t = (elapsed - HOLD_SOLID) / PERIOD;
      p = Math.abs(1 - 2 * t);
    }
    draw(p);
    if (idleVisible && !destroyed) idleRAF = requestAnimationFrame(frame);
    else idleRAF = 0;
  }
  function startIdleLoop() {
    if (idleRunning) return;
    idleRunning = true;
    t0 = null;
    if (idleVisible && !destroyed) idleRAF = requestAnimationFrame(frame);
  }

  // ---- load intro (hero only) ----
  const SEED_STAGGER = 150, SEED_POP = 260, FILL_DUR = 460, MERGE_DUR = 760;

  function reveal() {
    if (revealed) return;
    revealed = true;
    if (onReveal) onReveal();
  }

  function intro(now) {
    if (finished || destroyed) return;
    if (introStart === null) introStart = now;
    const t = now - introStart;

    const seedTotal = Math.max(1, seedCount) * SEED_STAGGER + SEED_POP;
    const fillStart = seedTotal;
    const mergeStart = fillStart + FILL_DUR;
    const mergeEnd = mergeStart + MERGE_DUR;

    if (t < mergeStart) {
      const fillP = t < fillStart ? 0 : easeOut(Math.min(1, (t - fillStart) / FILL_DUR));
      paintOpenField((d) => {
        if (d.seed) {
          const local = (t - d.order * SEED_STAGGER) / SEED_POP;
          if (local <= 0) return 0;
          return d.open * easeOut(Math.min(1, local));
        }
        return d.open * fillP;
      });
      if (t > fillStart + FILL_DUR * 0.35) reveal();
      introRAF = requestAnimationFrame(intro);
      return;
    }

    if (t < mergeEnd) {
      reveal();
      draw((t - mergeStart) / MERGE_DUR, easeOut);
      introRAF = requestAnimationFrame(intro);
      return;
    }

    draw(1);
    finished = true;
    startIdleLoop();
  }

  function showSolidImmediately() {
    if (dots.length) draw(1);
    reveal();
  }

  function forceFinish() {
    if (finished || destroyed) return;
    finished = true;
    if (!started) start();
    if (dots.length) draw(1);
    reveal();
    if (!prefersReduce) startIdleLoop();
  }

  // ---- boot ----
  function start() {
    if (started || destroyed) return;
    started = true;
    build();
    if (!PLAY_INTRO) {
      if (dots.length) draw(1);
      finished = true;
      if (!prefersReduce && dots.length) startIdleLoop();
      return;
    }
    if (prefersReduce || !dots.length) {
      showSolidImmediately();
    } else {
      introRAF = requestAnimationFrame(intro);
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!destroyed) start(); });
  }
  timers.push(setTimeout(() => { if (!destroyed) start(); }, 700));
  timers.push(setTimeout(() => { if (!destroyed) forceFinish(); }, 4000));

  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (destroyed) return;
      build();
      if (started && !finished) introStart = null;
    }, 120);
  };
  window.addEventListener("resize", onResize);

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      idleVisible = entries[0].isIntersecting;
      if (idleVisible && idleRunning && !idleRAF && !destroyed) {
        t0 = null;
        idleRAF = requestAnimationFrame(frame);
      }
    }, { threshold: 0 });
    io.observe(canvas);
  }

  function destroy() {
    destroyed = true;
    idleVisible = false;
    finished = true;
    cancelAnimationFrame(idleRAF);
    cancelAnimationFrame(introRAF);
    clearTimeout(rt);
    timers.forEach(clearTimeout);
    window.removeEventListener("resize", onResize);
    if (io) io.disconnect();
  }

  return { build, destroy };
}

export default function HalftoneName({ text = "Alice Zhao", playIntro = false, onReveal, className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const inst = createDotName(canvas, { text, playIntro, onReveal });
    return () => inst.destroy();
  }, [text, playIntro, onReveal]);

  return (
    <>
      <h2 className={styles.srOnly}>{text}</h2>
      <canvas ref={canvasRef} className={className} role="img" aria-label={text} />
    </>
  );
}
