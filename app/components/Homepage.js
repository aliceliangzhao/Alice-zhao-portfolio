"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import Footer from "./Footer";
import HalftoneName from "./HalftoneName";
import CursorLens from "./CursorLens";
import LineReveal from "./LineReveal";
import { projects, projectOrder } from "../data/projects";
import styles from "./Homepage.module.css";

// Runs before paint on the client, no-ops (no warning) during SSR.
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Homepage() {
  // Reveal choreography: content is hidden until the hero name is legible, then
  // fades/rises in. Server renders "idle" (content visible — no-JS/SEO safe);
  // the client flips to "preloading" before paint, and the hero reveals it.
  const [phase, setPhase] = useState("idle");

  useIso(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setPhase("preloading");
  }, []);

  const handleReveal = useCallback(() => setPhase("revealed"), []);

  const phaseClass =
    phase === "preloading" ? styles.preloading : phase === "revealed" ? styles.revealed : "";

  const cards = projectOrder
    .map((slug) => ({ slug, ...projects[slug] }))
    .filter((p) => p && !p.comingSoon);

  return (
    <>
      <CursorLens />
      <Navigation hiddenForIntro={phase === "preloading"} />

      <div className={`${styles.page} ${phaseClass}`}>
        <div className={styles.landing}>
          <section className={`${styles.intro} ${styles.grid12}`}>
            <p>
              <LineReveal
                play={phase === "revealed"}
                stagger={90}
                segments={[
                  { text: "Currently designing agentic experience at Amazon AWS.", className: styles.bold },
                  { text: "Previously built design systems and enterprise applications at Morgan Stanley, Siemens, Purdue, and Insperity.", className: styles.muted },
                  { text: "My work lives in consoles, data tools, and design systems: the dense surfaces teams use all day.", className: styles.focus },
                ]}
              />
            </p>
          </section>

          <section className={`${styles.hero} ${styles.grid12}`}>
            <div className={styles.well}>
              <HalftoneName
                text="Alice Zhao"
                playIntro
                onReveal={handleReveal}
                className={styles.heroCanvas}
              />
            </div>
          </section>

          <div className={styles.scrollCue} aria-hidden="true">
            <span className={styles.trail} />
            <span className={styles.runner} />
          </div>
        </div>

        <section className={`${styles.projects} ${styles.grid12}`} id="work">
          <div className={styles.projectList}>
            {cards.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.project}>
                <div className={styles.pthumbWrap}>
                  <Image
                    className={styles.pthumb}
                    src={p.heroImage}
                    alt={p.navTitle || p.projectTitle?.main || "Project"}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <ul className={styles.ptags}>
                  {(p.tags || []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <h3 className={styles.ptitle}>{p.navTitle || p.projectTitle?.main}</h3>
                <p className={styles.pstatement}>
                  {typeof p.impact === "object" ? p.impact?.card : p.impact}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
