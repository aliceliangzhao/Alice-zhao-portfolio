"use client";

import { useEffect, useRef, useState } from "react";
import s from "./editorial.module.css";

/* The animated strip itself. Photos are supplied by the PhotoMarquee server
   component, which reads them from the folder at build time.

   Every photo renders at the same row height (set in CSS); each item's --ar is
   the photo's true aspect ratio, so widths vary naturally and nothing is
   distorted or cropped. The set is duplicated so the loop is seamless. The
   animation only runs while the strip is in view (no offscreen ambient motion)
   and is disabled under prefers-reduced-motion. */
export default function PhotoMarqueeStrip({ photos }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = [...photos, ...photos]; // duplicate for the seamless loop

  return (
    <section
      ref={ref}
      className={s.marquee}
      data-inview={inView ? "true" : "false"}
      aria-label="Photography"
    >
      <div className={s.marqueeTrack}>
        {items.map((photo, i) => {
          const dup = i >= photos.length;
          return (
            <div
              key={i}
              className={s.marqueeItem}
              style={{ "--ar": photo.ar }}
              aria-hidden={dup ? "true" : undefined}
            >
              <img
                className={s.marqueePhoto}
                src={photo.src}
                alt={dup ? "" : photo.alt}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
