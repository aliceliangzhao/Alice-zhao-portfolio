"use client";

import { useEffect, useRef, useState } from "react";
import s from "./MetricsBento.module.css";

/* A metric value that counts up from 0 once scrolled into view (respects
   reduced-motion, which jumps straight to the final value). */
function AnimatedValue({ value, suffix, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={s.value}>
      {display}
      {suffix && <span className={s.suffix}>{suffix}</span>}
    </span>
  );
}

function MetricCard({ metric, area }) {
  return (
    <div className={`${s.card} ${s.metric} ${s[area]}`}>
      <AnimatedValue value={metric.value} suffix={metric.suffix || ""} />
      <span className={s.label}>{metric.label}</span>
    </div>
  );
}

/* Outcome metrics bento. Exact, hand-placed arrangement:
     desktop 4x2 · tablet 3x2 · mobile 2x2 (metrics only)
   Built for 4 metrics + one product image; spacer cells and the image drop off
   as the grid narrows (see MetricsBento.module.css grid-template-areas). */
export default function MetricsBento({ metrics, image, imageAlt }) {
  if (!metrics || metrics.length === 0) return null;
  const [m1, m2, m3, m4] = metrics;

  return (
    <div className={s.bento}>
      {m1 && <MetricCard metric={m1} area="m1" />}
      {m2 && <MetricCard metric={m2} area="m2" />}
      {m3 && <MetricCard metric={m3} area="m3" />}
      {m4 && <MetricCard metric={m4} area="m4" />}

      {image && (
        <div className={`${s.card} ${s.image} ${s.im}`}>
          <img src={image} alt={imageAlt || ""} />
        </div>
      )}
      <div className={`${s.card} ${s.spacer} ${s.sa}`} aria-hidden="true" />
      <div className={`${s.card} ${s.spacer} ${s.sb}`} aria-hidden="true" />
      <div className={`${s.card} ${s.spacer} ${s.sc}`} aria-hidden="true" />
    </div>
  );
}
