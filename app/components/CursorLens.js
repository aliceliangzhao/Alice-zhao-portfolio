"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorLens.module.css";

/* A soft gradient disc that follows the pointer and recolors the ink beneath it
   (mix-blend-mode: lighten). The one sanctioned colour on the homepage. Only on
   fine-pointer devices, disabled under reduced motion. Ported from the mockup;
   JS feeds the pointer position to --mx/--my and toggles .lensOn on/off. */
export default function CursorLens() {
  const lensRef = useRef(null);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;   // CSS hides it here anyway

    const root = document.documentElement;
    let x = 0, y = 0, queued = false, on = false;

    const setHover = (state) => {
      if (on === state) return;
      on = state;
      lens.classList.toggle(styles.lensOn, state);
    };
    const apply = () => {
      queued = false;
      root.style.setProperty("--mx", x + "px");
      root.style.setProperty("--my", y + "px");
    };
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      setHover(true);
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    };
    const onLeave = () => setHover(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={lensRef} className={styles.lens} aria-hidden="true">
      <div className={styles.flow} />
    </div>
  );
}
