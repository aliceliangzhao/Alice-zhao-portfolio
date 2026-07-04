"use client";

import { useEffect, useRef } from "react";

/* DotGridBackground — a canvas grid of dots that orbit continuously and react
   to the cursor (dots near the pointer scale up and brighten). Our own
   implementation: plain canvas + requestAnimationFrame, no animation library,
   matching the project's existing halftone-canvas approach.

   Behavior is tuned by the constants below. Dot color comes from the
   --color-dot-grid token so the palette stays single-sourced.

   Accessibility / rules:
   - prefers-reduced-motion → renders a single static grid, no animation.
   - IntersectionObserver pauses the loop while the canvas is offscreen.
   - The hover effect is a desktop enhancement; on touch the canvas is hidden by
     CSS (≤900px), so the layout is complete without it.

   The canvas is positioned by the caller's className and sits behind the hero
   text (pointer-events: none), so the cursor is tracked on window, not the
   canvas itself. */

const SPACING = 26;        // px between dot centers
const DOT_RADIUS = 1.6;    // base dot radius (px)
const BASE_ALPHA = 0.35;   // resting opacity (the static grid)
const ORBIT_RADIUS = 12;   // px a dot travels around its rest point at full energy
const ORBIT_SPEED = 4;     // angular speed while orbiting (rad/sec)
const VERTICAL_SQUASH = 0.6; // flatten the orbit's Y so it reads as a tilted plane
const IMPACT_RADIUS = 120; // px cursor influence radius
const HOVER_SCALE = 1.9;   // max dot scale at the cursor
const HOVER_ALPHA = 0.9;   // dot opacity at the cursor
const SETTLE = 0.18;       // energy ease time constant (~0.6s to ramp up / settle)

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function DotGridBackground({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const styles = getComputedStyle(canvas);
    const rgb = hexToRgb(styles.getPropertyValue("--color-dot-grid") || "#b4b0a6");
    // dots shift toward this ink color as they get closer to the cursor
    const ink = hexToRgb(styles.getPropertyValue("--color-fg") || "#111");

    let width = 0;
    let height = 0;
    let dots = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let visible = false;
    let raf = null;
    let last = 0;

    /* (re)build the grid to fill the canvas box */
    function build() {
      const rect = canvas.getBoundingClientRect();
      // Bail if the canvas has no layout size yet (pre-layout, or hidden via
      // display:none on tablet/mobile). Sizing a 0-px canvas throws in Firefox.
      // The ResizeObserver re-runs build() once the box has real dimensions.
      if (rect.width < 1 || rect.height < 1) {
        width = 0;
        height = 0;
        dots = [];
        return;
      }
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // clamp the bitmap so a stray measurement can never exceed the canvas max
      const MAX = 8192;
      canvas.width = Math.min(Math.round(width * dpr), MAX);
      canvas.height = Math.min(Math.round(height * dpr), MAX);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: offsetX + c * SPACING,
            y: offsetY + r * SPACING,
            phase: Math.random() * Math.PI * 2,
            tilt: Math.random() * Math.PI,
            energy: 0, // 0 = at rest; ramps toward 1 near the cursor
          });
        }
      }
    }

    function fill(x, y, radius, r, g, b, alpha) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha, 1)})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function renderStatic() {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) fill(d.x, d.y, DOT_RADIUS, rgb.r, rgb.g, rgb.b, BASE_ALPHA);
    }

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const ease = 1 - Math.exp(-dt / SETTLE);
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      let maxEnergy = 0;
      for (const d of dots) {
        // target energy from the dot's REST distance to the cursor
        let target = 0;
        if (pointer.active) {
          const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
          if (dist < IMPACT_RADIUS) {
            const f = 1 - dist / IMPACT_RADIUS;
            target = f * f; // ease-in so the falloff feels soft at the edge
          }
        }
        d.energy += (target - d.energy) * ease;
        const e = d.energy;
        if (e > maxEnergy) maxEnergy = e;

        let cx = d.x;
        let cy = d.y;
        if (e > 0.001) {
          // orbit on a tilted plane, amplitude scaled by energy
          const a = t * ORBIT_SPEED + d.phase;
          const ox = Math.cos(a) * ORBIT_RADIUS * e;
          const oy = Math.sin(a) * ORBIT_RADIUS * e;
          const ct = Math.cos(d.tilt);
          const st = Math.sin(d.tilt);
          cx += ox * ct - oy * st;
          cy += (ox * st + oy * ct) * VERTICAL_SQUASH;
        }
        const scale = 1 + (HOVER_SCALE - 1) * e;
        const alpha = BASE_ALPHA + (HOVER_ALPHA - BASE_ALPHA) * e;
        // darken toward ink as the dot nears the cursor
        const r = rgb.r + (ink.r - rgb.r) * e;
        const g = rgb.g + (ink.g - rgb.g) * e;
        const b = rgb.b + (ink.b - rgb.b) * e;
        fill(cx, cy, DOT_RADIUS * scale, r, g, b, alpha);
      }

      // keep animating while the cursor is active or any dot is still settling;
      // otherwise drop back to the static grid and stop the loop.
      if (pointer.active || maxEnergy > 0.002) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = null;
        renderStatic();
      }
    }

    function start() {
      if (raf || reduce || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      if (pointer.active) start();
    }

    build();
    if (reduce) {
      renderStatic();
    } else {
      renderStatic(); // perfect grid at rest until the cursor approaches
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // only run while onscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // rebuild on resize; repaint the static grid if we're not mid-animation
    const ro = new ResizeObserver(() => {
      build();
      if (!raf) renderStatic();
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // The canvas fills a positioned wrapper at 100%. The wrapper's size is fixed
  // by CSS, so writing the canvas bitmap dimensions can never change layout —
  // this prevents a ResizeObserver feedback loop.
  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
