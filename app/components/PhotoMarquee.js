"use client";

import { useEffect, useRef, useState } from "react";
import s from "./editorial.module.css";

/* A full-bleed photo strip that loops left-to-right and pauses on hover.
   Placeholder boxes for now (swap the aspect ratios for real <img>s later).

   The set is duplicated so the loop is seamless. The animation only runs while
   the strip is in view (no offscreen ambient motion) and is disabled under
   prefers-reduced-motion. */

// varied aspect ratios so the motion is legible; duplicated for a seamless loop
const PHOTOS = ["3 / 2", "2 / 3", "4 / 3", "1 / 1", "3 / 2", "2 / 3", "4 / 3", "5 / 4"];

export default function PhotoMarquee() {
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

  const items = [...PHOTOS, ...PHOTOS]; // duplicate for the seamless loop

  return (
    <section
      ref={ref}
      className={s.marquee}
      data-inview={inView ? "true" : "false"}
      aria-label="Photography"
    >
      <div className={s.marqueeTrack}>
        {items.map((ar, i) => (
          <div
            key={i}
            className={s.marqueeItem}
            style={{ "--ar": ar }}
            aria-hidden={i >= PHOTOS.length ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
