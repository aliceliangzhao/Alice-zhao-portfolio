"use client";

import { useRef, useState, useEffect } from "react";
import LineReveal from "./LineReveal";
import { bio } from "../data/about";
import styles from "./AboutCollage.module.css";

/* About-me section for the homepage: a small italic eyebrow + the bio intro
   (bold lead + muted continuation, reused from the about page data), revealed
   line by line on scroll-in, then a staggered photo collage. alice-liang.jpg
   is the featured centre image. */
const BASE = "/img/aboutMe/aboutMePhoto";
const PHOTOS = [
  { src: `${BASE}/DSCF3131 copy 2.jpg`, cls: "p1" },
  { src: `${BASE}/DSCF3543 copy 2.jpg`, cls: "p2" },
  { src: `${BASE}/alice-liang.jpg`, cls: "p3" }, // featured, centre
  { src: `${BASE}/DSCF8252 copy 2.jpg`, cls: "p4" },
  { src: `${BASE}/DSCF3026 copy 2.jpg`, cls: "p5" },
  { src: `${BASE}/DSCF9777 copy 2.jpg`, cls: "p6" },
];

export default function AboutCollage() {
  const introRef = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setPlay(true); io.disconnect(); }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className={styles.about}>
      <p className={styles.intro} ref={introRef}>
        <LineReveal
          play={play}
          stagger={90}
          segments={[
            { text: "[ about me ]", className: styles.eyebrow },
            { text: bio.heading, className: styles.lead },
            { text: bio.personal, className: styles.muted },
          ]}
        />
      </p>

      <div className={styles.collage}>
        {PHOTOS.map((p) => (
          <img
            key={p.cls}
            className={`${styles.photo} ${styles[p.cls]}`}
            src={p.src}
            alt=""
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
