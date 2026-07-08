"use client";

import { useEffect, useRef } from "react";

/* ShapesGrid — a canvas lattice of tiny shapes (circles, pills, stars) that rest
   gray and reveal vivid color. Ported from the reference codepen effect into our
   React + canvas pattern (see DotGridBackground for the sibling implementation).

   Two variants share one render engine:
   - "fullscreen": fills a positioned wrapper behind the hero. Excludes any
     [data-grid-exclude] element inside the nearest [data-grid-root] ancestor;
     an element marked data-grid-exclude="lines" (the hero copy) is punched out
     line-by-line so shapes hug each text line, not one big box.
   - "decorative": a short full-width strip of exactly 4 rows, with a label sitting
     on the left of the last row (rows 1-3 span full width, row 4 clears the label).

   Rules matrix (CLAUDE.md 1,2,3,4):
   - Desktop (fine pointer): hover reveal + idle color flashes.
   - Touch (coarse pointer): idle flashes only, no hover.
   - prefers-reduced-motion: a single static gray frame, no loop.
   - IntersectionObserver pauses the loop while offscreen.
   Canvas + rAF only, no animation library. */

// Vivid reveal palette (kept as the effect's own language, per design decision).
const PALETTE = [
  { type: "solid", value: "#22c55e" },
  { type: "solid", value: "#06b6d4" },
  { type: "solid", value: "#f97316" },
  { type: "solid", value: "#ef4444" },
  { type: "solid", value: "#facc15" },
  { type: "solid", value: "#ec4899" },
  { type: "solid", value: "#a78bfa" },
  { type: "solid", value: "#60a5fa" },
  { type: "solid", value: "#34d399" },
  { type: "gradient", stops: ["#6366f1", "#3b82f6"] },
  { type: "gradient", stops: ["#06b6d4", "#6366f1"] },
  { type: "gradient", stops: ["#22c55e", "#06b6d4"] },
  { type: "gradient", stops: ["#f97316", "#ef4444"] },
  { type: "gradient", stops: ["#8b5cf6", "#06b6d4"] },
  { type: "gradient", stops: ["#3b82f6", "#8b5cf6"] },
  { type: "gradient", stops: ["#34d399", "#3b82f6"] },
];

const CONFIG = {
  gap: 40,
  shapeSize: 0.38,
  radiusVmin: 30,        // hover influence radius, % of min(w,h)
  activityDecay: 0.93,
  speedIn: 0.5,
  speedOut: 0.6,
  restScale: 0.09,
  minHoverScale: 1,
  maxHoverScale: 3,
  starPointsMin: 4,
  starPointsMax: 10,
  starInnerMin: 0.1,
  starInnerMax: 0.5,
  idle: {
    resumeDelay: 2000,
    strength: 0.78,
    pauseMin: 520,
    pauseMax: 1400,
    burstMin: 1,
    burstMax: 3,
    durMin: 760,
    durMax: 1080,
    stagMin: 140,
    stagMax: 260,
  },
};

const TYPES = ["circle", "pill", "star", "star"];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const smoothstep = (v) => {
  const t = clamp(v, 0, 1);
  return t * t * (3 - 2 * t);
};
// per-frame lerp rate that reaches ~95% in `seconds` at 60fps
const perFrameRate = (seconds) => (seconds <= 0 ? 1 : 1 - 0.05 ** (1 / (60 * seconds)));

function parseColor(value) {
  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  const m = value.match(/\d+/g);
  if (!m || m.length < 3) return { r: 128, g: 128, b: 128 };
  return { r: +m[0], g: +m[1], b: +m[2] };
}

function mixColor(from, to, amount) {
  const t = clamp(amount, 0, 1);
  const a = parseColor(from);
  const b = parseColor(to);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function randomStar() {
  return {
    points: randInt(CONFIG.starPointsMin, CONFIG.starPointsMax),
    innerRatio: rand(CONFIG.starInnerMin, CONFIG.starInnerMax),
  };
}

function createShape(x, y, type) {
  const shape = {
    x,
    y,
    type,
    color: pick(PALETTE),
    angle: rand(0, Math.PI * 2),
    size: CONFIG.gap * CONFIG.shapeSize,
    scale: CONFIG.restScale,
    maxScale: rand(CONFIG.minHoverScale, CONFIG.maxHoverScale),
    hovered: false,
  };
  if (type === "star") Object.assign(shape, randomStar());
  return shape;
}

function drawShape(ctx, shape) {
  if (shape.type === "circle") {
    const radius = shape.size / 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape.type === "pill") {
    const size = shape.size / 1.4;
    const hw = size * 0.48;
    const hh = size;
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, hw * 2, hh * 2, hw);
    ctx.fill();
  } else {
    const outer = shape.size;
    ctx.beginPath();
    for (let i = 0; i < shape.points * 2; i += 1) {
      const angle = (i * Math.PI) / shape.points - Math.PI / 2;
      const radius = i % 2 === 0 ? outer : outer * shape.innerRatio;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function makeFill(ctx, idleGray, color, size, mix) {
  if (color.type === "solid") return mixColor(idleGray, color.value, mix);
  const grad = ctx.createRadialGradient(0, -size * 0.3, 0, 0, size * 0.3, size * 1.5);
  grad.addColorStop(0, mixColor(idleGray, color.stops[0], mix));
  grad.addColorStop(1, mixColor(idleGray, color.stops[1], mix));
  return grad;
}

// --- exclusion helpers (fullscreen text/nav punch-out) --------------------
function toLocal(rect, canvasRect) {
  return {
    left: rect.left - canvasRect.left,
    right: rect.right - canvasRect.left,
    top: rect.top - canvasRect.top,
    bottom: rect.bottom - canvasRect.top,
  };
}
function expand(rect, px, py) {
  return { left: rect.left - px, right: rect.right + px, top: rect.top - py, bottom: rect.bottom + py };
}
function lineRects(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rects = Array.from(range.getClientRects()).filter((r) => r.width && r.height);
  if (typeof range.detach === "function") range.detach();
  if (!rects.length) return [];
  rects.sort((a, b) => a.top - b.top || a.left - b.left);
  const merged = [];
  for (const r of rects) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(r.top - last.top) < 2 && Math.abs(r.bottom - last.bottom) < 2) {
      last.left = Math.min(last.left, r.left);
      last.right = Math.max(last.right, r.right);
      last.top = Math.min(last.top, r.top);
      last.bottom = Math.max(last.bottom, r.bottom);
      continue;
    }
    merged.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
  }
  return merged;
}

function buildFullScreen(canvas, width, height) {
  const root = canvas.closest("[data-grid-root]") || document.body;
  const canvasRect = canvas.getBoundingClientRect();
  const exclusions = [];
  for (const el of root.querySelectorAll("[data-grid-exclude]")) {
    const px = 40;
    const py = 26;
    if (el.getAttribute("data-grid-exclude") === "lines") {
      for (const lr of lineRects(el)) exclusions.push(expand(toLocal(lr, canvasRect), px, py));
      continue;
    }
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    exclusions.push(expand(toLocal(r, canvasRect), 20, 16));
  }

  const gap = CONFIG.gap;
  const cols = Math.floor(width / gap);
  const rows = Math.floor(height / gap);
  const offsetX = (width - (cols - 1) * gap) / 2;
  const offsetY = (height - (rows - 1) * gap) / 2;
  const shapes = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = offsetX + col * gap;
      const y = offsetY + row * gap;
      if (exclusions.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)) continue;
      shapes.push(createShape(x, y, pick(TYPES)));
    }
  }
  return shapes;
}

function buildDecorative(wrapper, width, height) {
  const gap = CONFIG.gap;
  const label = wrapper.querySelector("[data-grid-label]");
  const rootRect = wrapper.getBoundingClientRect();
  const labelRect = label?.getBoundingClientRect();
  const labelWidth = labelRect?.width || 0;
  const labelLeft = labelRect ? labelRect.left - rootRect.left : 0;
  const labelGap = gap * 0.75;
  const inset = gap * 0.5;
  const vInset = Math.min(height * 0.18, gap * 1.1);
  const rows = 4;
  const rowStep = rows > 1 ? (height - vInset * 2) / (rows - 1) : 0;
  const lastRowY = vInset + rowStep * (rows - 1);
  wrapper.style.setProperty("--label-top", `${Math.round(lastRowY)}px`);

  const shapes = [];
  for (let row = 0; row < rows; row += 1) {
    const y = vInset + rowStep * row;
    const startX = row === rows - 1 ? Math.max(inset, labelLeft + labelWidth + labelGap) : inset;
    for (let x = startX; x <= width - inset; x += gap) shapes.push(createShape(x, y, pick(TYPES)));
  }
  return shapes;
}

export default function ShapesGrid({ variant = "fullscreen", label, className }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches; // touch: no hover
    const idleGray = (getComputedStyle(canvas).getPropertyValue("--color-dot-grid") || "#b4b0a6").trim();

    const state = {
      width: 0,
      height: 0,
      shapes: [],
      pointer: null,
      activity: 0,
      raf: null,
      visible: false,
      idle: { entries: [], nextAt: 0, lastHoverAt: 0 },
    };

    const build = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        state.width = 0;
        state.height = 0;
        state.shapes = [];
        return;
      }
      state.width = Math.round(rect.width);
      state.height = Math.round(rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const MAX = 8192;
      canvas.width = Math.min(Math.round(state.width * dpr), MAX);
      canvas.height = Math.min(Math.round(state.height * dpr), MAX);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.shapes =
        variant === "decorative"
          ? buildDecorative(wrapper, state.width, state.height)
          : buildFullScreen(canvas, state.width, state.height);
    };

    const scheduleIdle = (now) => {
      state.idle.entries = [];
      state.idle.nextAt = now + rand(CONFIG.idle.pauseMin, CONFIG.idle.pauseMax);
    };

    const startIdle = (now) => {
      if (!state.shapes.length) return;
      const burst = Math.min(randInt(CONFIG.idle.burstMin, CONFIG.idle.burstMax), state.shapes.length);
      const chosen = new Set();
      while (chosen.size < burst) chosen.add(randInt(0, state.shapes.length - 1));
      const baseDur = rand(CONFIG.idle.durMin, CONFIG.idle.durMax);
      const entries = [];
      let delay = 0;
      for (const index of chosen) {
        entries.push({ index, startTime: now + delay, duration: baseDur + rand(-90, 120) });
        delay += rand(CONFIG.idle.stagMin, CONFIG.idle.stagMax);
      }
      state.idle.entries = entries;
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, state.width, state.height);
      for (const shape of state.shapes) {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.angle);
        ctx.scale(shape.scale, shape.scale);
        ctx.fillStyle = idleGray;
        drawShape(ctx, shape);
        ctx.restore();
      }
    };

    const render = () => {
      const now = performance.now();
      const hoverRadius = (CONFIG.radiusVmin / 100) * Math.min(state.width, state.height);
      ctx.clearRect(0, 0, state.width, state.height);
      state.activity *= CONFIG.activityDecay;

      const hadIdle = state.idle.entries.length > 0;
      state.idle.entries = state.idle.entries.filter((e) => now < e.startTime + e.duration);
      let anyHover = false;

      for (let index = 0; index < state.shapes.length; index += 1) {
        const shape = state.shapes[index];
        let hoverActivity = 0;

        if (state.pointer && state.activity > 0.001) {
          const dist = Math.hypot(shape.x - state.pointer.x, shape.y - state.pointer.y);
          hoverActivity = smoothstep(1 - dist / hoverRadius) * state.activity;
          if (hoverActivity > 0.05) {
            anyHover = true;
            if (!shape.hovered) {
              shape.hovered = true;
              shape.maxScale = rand(CONFIG.minHoverScale, CONFIG.maxHoverScale);
              shape.angle = rand(0, Math.PI * 2);
              if (shape.type === "star") Object.assign(shape, randomStar());
            }
          } else {
            shape.hovered = false;
          }
        } else {
          shape.hovered = false;
        }

        let idleAmt = 0;
        for (const e of state.idle.entries) {
          if (e.index !== index || now < e.startTime) continue;
          const t = clamp((now - e.startTime) / e.duration, 0, 1);
          idleAmt = Math.max(idleAmt, Math.sin(Math.PI * t) * CONFIG.idle.strength);
        }

        const hoverTarget = CONFIG.restScale + hoverActivity * (shape.maxScale - CONFIG.restScale);
        const idleTarget = CONFIG.restScale + idleAmt * (shape.maxScale - CONFIG.restScale);
        const target = Math.max(hoverTarget, idleTarget);
        const rate = target > shape.scale ? perFrameRate(CONFIG.speedIn) : perFrameRate(CONFIG.speedOut);
        shape.scale += (target - shape.scale) * rate;
        if (shape.scale < CONFIG.restScale * 0.15) continue;

        const mix = Math.max(clamp(hoverActivity * 1.8, 0, 1), clamp(idleAmt * 1.1, 0, 1));
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.angle);
        ctx.scale(shape.scale, shape.scale);
        ctx.fillStyle = makeFill(ctx, idleGray, shape.color, shape.size, mix);
        drawShape(ctx, shape);
        ctx.restore();
      }

      if (anyHover) {
        state.idle.lastHoverAt = now;
        scheduleIdle(now);
      } else if (now - state.idle.lastHoverAt >= CONFIG.idle.resumeDelay) {
        if (hadIdle && state.idle.entries.length === 0) scheduleIdle(now);
        else if (state.idle.entries.length === 0 && now >= state.idle.nextAt) startIdle(now);
      }

      state.raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (state.raf || reduce || !state.visible) return;
      state.idle.lastHoverAt = performance.now();
      scheduleIdle(state.idle.lastHoverAt);
      state.raf = requestAnimationFrame(render);
    };
    const stop = () => {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = null;
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      state.pointer = { x, y };
      state.activity = 1;
    };

    build();
    renderStatic();
    if (!reduce && !coarse) window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(wrapper);

    const ro = new ResizeObserver(() => {
      build();
      if (!state.raf) renderStatic();
    });
    ro.observe(wrapper);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [variant]);

  if (variant === "decorative") {
    return (
      <div ref={wrapperRef} className={className}>
        <canvas ref={canvasRef} aria-hidden="true" />
        {label && (
          <span className="shapes-grid-label" data-grid-label>
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
