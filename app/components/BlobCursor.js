"use client";

import { useEffect } from "react";

/* Site-wide custom cursor (simple-editorial style). A small accent dot tracks
   the pointer 1:1, trailed by a soft, organic "blob" ring (canvas-drawn) that
   lags behind with eased following. Over any clickable link/button the ring
   swells and wobbles harder while the dot fades; small targets additionally
   magnetise (the ring snaps to their centre).

   The page is strict ink-on-paper, and its ONE sanctioned colour is the cursor.
   The dot/ring use the --lens-ember token so the accent is the design's own,
   never a new hue. Decorative only: pointer-events:none, aria-hidden, never
   intercepts input. Gated to fine-pointer + hover devices, and skipped entirely
   under prefers-reduced-motion (a shape chasing the pointer is a vestibular
   trigger).

   Ported from the prototype's cursor.js into a React effect so it mounts once
   and tears down cleanly (listeners, rAF, injected nodes/style all removed). */

export default function BlobCursor() {
  useEffect(() => {
    // --- Capability + preference gates ------------------------------------
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!fine || calm || touch) return; // leave the native cursor untouched

    // --- Colours pulled from tokens (never hard-coded hues) ---------------
    const css = getComputedStyle(document.documentElement);
    const ACCENT = css.getPropertyValue("--lens-ember").trim() || "#ff6a3d";
    const INK = css.getPropertyValue("--color-fg").trim() || "#111";

    // --- Tunables (behaviour, not brand) ----------------------------------
    const DOT = 8;        // dot diameter (px)
    const R_REST = 14;    // ring radius at rest
    const R_STICK = 28;   // ring radius while expanded over a link
    const EASE = 0.18;    // ring follow speed, free
    const EASE_STK = 0.1; // ring follow speed, magnetised (snappier to centre)
    const EASE_R = 0.08;  // radius easing
    const STICK_W = 220;  // only magnetise to targets smaller than this …
    const STICK_H = 130;  // … so large cards don't yank the ring to their centre

    // --- Hide the native cursor (only now that we know we're active) ------
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      [data-cursor-hide], [data-cursor-hide] * { cursor: none !important; }`;
    document.head.appendChild(style);

    // --- Elements: dot above, full-screen ring canvas below ---------------
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "fixed", top: "0", left: "0", width: DOT + "px", height: DOT + "px",
      borderRadius: "50%", background: ACCENT, pointerEvents: "none",
      zIndex: "99999", willChange: "transform, opacity", opacity: "0",
      transition: "background .2s ease, opacity .15s ease",
    });
    dot.setAttribute("aria-hidden", "true");

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
      pointerEvents: "none", zIndex: "99998",
    });
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas, dot);

    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // --- State ------------------------------------------------------------
    let px = -100, py = -100;        // raw pointer
    let rx = -100, ry = -100;        // eased ring centre
    let rr = R_REST;                 // eased ring radius
    let tx = -100, ty = -100;        // ring target (pointer, or element centre)
    let ease = EASE, hot = false, stuck = false, hidden = false, visible = false, color = ACCENT;
    let frame = 0;
    let rafId = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    // 8 wobbling points around a circle → an organic, breathing outline
    const blob = (cx, cy, r, f, isHot) => {
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const w = isHot
          ? Math.sin(f / 55 + i * 1.2) * 4 + Math.cos(f / 40 + i * 2.1) * 3
          : Math.sin(f / 90 + i * 1.1) * 1.2;
        pts.push([cx + Math.cos(ang) * (r + w), cy + Math.sin(ang) * (r + w)]);
      }
      return pts;
    };

    // closed Catmull-Rom path through the points (smooth, no corners)
    const trace = (p) => {
      const n = p.length;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], d = p[(i + 2) % n];
        const c1x = b[0] + (c[0] - a[0]) / 6, c1y = b[1] + (c[1] - a[1]) / 6;
        const c2x = c[0] - (d[0] - b[0]) / 6, c2y = c[1] - (d[1] - b[1]) / 6;
        if (i === 0) ctx.moveTo(b[0], b[1]);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, c[0], c[1]);
      }
      ctx.closePath();
    };

    // --- Pointer: resolve colour, hide-zones, and the magnetic target -----
    const onMove = (e) => {
      px = e.clientX; py = e.clientY;
      if (!visible) { rx = px; ry = py; visible = true; }

      // colour flips to ink over any opted-in dark region (future-proof)
      let dark = false;
      for (const el of document.querySelectorAll("[data-cursor-dark]")) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { dark = true; break; }
      }
      color = dark ? INK : ACCENT;

      const under = document.elementFromPoint(e.clientX, e.clientY);
      hidden = !!under?.closest("[data-cursor-hide]");

      // Any clickable target turns the ring "hot" (grow + wobble). Small targets
      // additionally magnetise — the ring snaps to their centre. Large targets
      // keep following the pointer, because yanking the ring to a big card's
      // centre would jump it far away.
      const target = under?.closest("[data-cursor-target], a, button, summary, [role='button']");
      if (target) {
        hot = true;
        const r = target.getBoundingClientRect();
        if (r.width <= STICK_W && r.height <= STICK_H) {
          tx = r.left + r.width / 2; ty = r.top + r.height / 2;
          stuck = true; ease = EASE_STK; return;
        }
        tx = px; ty = py; stuck = false; ease = EASE_STK; return;
      }
      tx = px; ty = py; hot = false; stuck = false; ease = EASE;
    };
    document.addEventListener("mousemove", onMove);

    // --- Render loop ------------------------------------------------------
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dot.style.transform = `translate(${px - DOT / 2}px, ${py - DOT / 2}px)`;
      dot.style.background = color;
      dot.style.opacity = (!visible || hidden || hot) ? "0" : "1";
      canvas.style.opacity = (!visible || hidden) ? "0" : "1";

      // stuck → follow the element centre; otherwise follow the pointer
      rx = lerp(rx, stuck ? tx : px, ease);
      ry = lerp(ry, stuck ? ty : py, ease);
      rr = lerp(rr, hot ? R_STICK : R_REST, EASE_R);

      trace(blob(rx, ry, rr, frame, hot && rr > 22));
      if (hot) {
        ctx.fillStyle = color;   ctx.globalAlpha = 0.12; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55; ctx.stroke();
      } else {
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    // --- Teardown ---------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      dot.remove();
      canvas.remove();
      style.remove();
    };
  }, []);

  return null;
}
