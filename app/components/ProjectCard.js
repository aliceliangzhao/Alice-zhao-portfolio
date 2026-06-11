"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./ProjectCard.module.css";

/* Project row: text left (tags → title → statement), square image right.
   - Reveal: the image is split into two halves of the SAME image; left half
     slides down from the top, right half slides up from the bottom, meeting to
     form one image (triggered when the row scrolls into view).
   - Image hover: a smoothed cursor-follow parallax — the image zooms slightly
     (~1.05) and drifts a few px toward the cursor, lerped so it floats with
     inertia rather than tracking 1:1. Clipped by the container.
   - Content hover: the text area fills with the accent colour.
   Parallax is fine-pointer + non-reduced-motion only. */
export default function ProjectCard({ slug, title, tags = [], statement, image }) {
  const ref = useRef(null);
  const thumbRef = useRef(null);
  const innerRef = useRef(null);

  // Reveal once when scrolled into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add(styles.inview);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cursor-follow parallax: zoom on hover + a few px of lerped drift toward the
  // cursor, so the image floats with inertia (not a 1:1 tracker).
  useEffect(() => {
    const thumb = thumbRef.current;
    const inner = innerRef.current;
    if (!thumb || !inner) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const RANGE = 24;          // peak-to-peak drift (px) → about ±12px
    const HOVER_SCALE = 1.05;
    const LERP = 0.08;         // lower = more inertia / smoothing

    let tx = 0, ty = 0, ts = 1;   // targets
    let cx = 0, cy = 0, cs = 1;   // current (interpolated)
    let hovering = false;
    let raf = 0;

    const frame = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      cs += (ts - cs) * LERP;
      const settled =
        Math.abs(tx - cx) < 0.05 &&
        Math.abs(ty - cy) < 0.05 &&
        Math.abs(ts - cs) < 0.0005;
      if (settled && !hovering) {
        inner.style.transform = "";   // snap clean to identity at rest
        raf = 0;
        return;
      }
      inner.style.transform = `scale(${cs}) translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(frame);
    };
    const ensure = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onEnter = () => { hovering = true; ts = HOVER_SCALE; ensure(); };
    const onMove = (e) => {
      const r = thumb.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * RANGE;
      ty = ((e.clientY - r.top) / r.height - 0.5) * RANGE;
      ensure();
    };
    const onLeave = () => { hovering = false; tx = 0; ty = 0; ts = 1; ensure(); };

    thumb.addEventListener("pointerenter", onEnter);
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerleave", onLeave);
    return () => {
      thumb.removeEventListener("pointerenter", onEnter);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Link href={`/projects/${slug}`} className={styles.project} ref={ref}>
      <div className={styles.content}>
        <ul className={styles.tags}>
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.statement}>{statement}</p>
      </div>

      <div className={styles.thumb} ref={thumbRef}>
        <div className={styles.inner} ref={innerRef}>
          <span className={`${styles.half} ${styles.left}`}>
            <img src={image} alt="" loading="lazy" />
          </span>
          <span className={`${styles.half} ${styles.right}`}>
            <img src={image} alt={title} loading="lazy" />
          </span>
        </div>
      </div>
    </Link>
  );
}
