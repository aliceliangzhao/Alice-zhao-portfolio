"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import InlineImageLoop from "./InlineImageLoop";
import ExternalLink from "./ExternalLink";
import styles from "./NextProjectTransition.module.css";

// Tokens may carry their own URL after a pipe ({img:...|url}, {link:label|url});
// without one they fall back to the project's externalLink.
function ParsedHeroText({ text, externalLink }) {
  const parts = text.split(/(\{img(?::[^}]*)?\}|\{link:[^}]+\})/g);
  return parts.map((part, i) => {
    const imgMatch = part.match(/^\{img:([^}]+)\}$/);
    if (imgMatch) {
      const [srcs, url] = imgMatch[1].split("|");
      const loop = <InlineImageLoop key={i} srcs={srcs.split(",")} />;
      const href = url || externalLink?.url;
      if (href) {
        return <ExternalLink key={i} href={href} hideIcon>{loop}</ExternalLink>;
      }
      return loop;
    }
    const linkMatch = part.match(/^\{link:([^}]+)\}$/);
    if (linkMatch) {
      const [label, url] = linkMatch[1].split("|");
      const href = url || externalLink?.url;
      if (href) {
        return <ExternalLink key={i} href={href}>{label}</ExternalLink>;
      }
      return label;
    }
    return part;
  });
}

export default function NextProjectTransition({ project }) {
  const router = useRouter();
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const footerRef = useRef(null);
  const heroRevealRef = useRef(null);
  const heroTextRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const bar = barRef.current;
    const line = lineRef.current;
    const label = labelRef.current;
    const title = titleRef.current;
    const footerEl = footerRef.current;
    const heroReveal = heroRevealRef.current;
    const heroText = heroTextRef.current;
    if (!section || !sticky || !bar || !line || !label || !title) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      bar.style.width = "100%";
      return;
    }

    if (window.innerWidth <= 900) return;

    let slideDistance = title.getBoundingClientRect().left - label.getBoundingClientRect().left;
    if (slideDistance <= 0) slideDistance = 0;

    const projectContent = section.previousElementSibling;

    const vh = window.innerHeight;
    const stickyTopPx = 0.5 * vh;
    const total = section.offsetHeight;
    const pinScroll = vh - stickyTopPx;
    const animRange = total - pinScroll;

    const FADE_DURATION = 400;
    const SLIDE_DELAY = 200;
    const SLIDE_DURATION = 500;
    const PHASE3_DELAY = SLIDE_DELAY + SLIDE_DURATION;
    const PHASE3_DURATION = 600;

    let phase2Started = false;
    let phase3Started = false;
    let navigated = false;
    const timers = [];
    const mountTime = Date.now();

    function triggerPhase3() {
      if (phase3Started) return;
      phase3Started = true;

      const titleRect = title.getBoundingClientRect();
      const targetBottom = vh - 60;
      const deltaY = targetBottom - titleRect.bottom;

      title.style.transition = `transform ${PHASE3_DURATION}ms ease`;
      title.style.transform = `translate(${-slideDistance}px, ${deltaY}px)`;

      if (heroReveal) {
        heroReveal.style.clipPath = "inset(0 0 54% 0)";
        heroReveal.offsetHeight;
        heroReveal.style.transition = `clip-path ${PHASE3_DURATION}ms ease`;
        heroReveal.style.clipPath = "inset(0 0 0 0)";
      }

      if (heroText) {
        heroText.style.transition = `opacity ${PHASE3_DURATION}ms ease`;
        heroText.style.opacity = "1";
      }

      timers.push(setTimeout(() => {
        if (navigated) return;
        navigated = true;
        sessionStorage.setItem("next-project-transition", "1");
        router.push(`/projects/${project.slug}/`);
      }, PHASE3_DURATION + 100));
    }

    function triggerPhase2() {
      if (phase2Started) return;
      phase2Started = true;

      line.style.transition = `opacity ${FADE_DURATION}ms ease`;
      label.style.transition = `opacity ${FADE_DURATION}ms ease`;
      if (footerEl) footerEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
      if (projectContent) projectContent.style.transition = `opacity ${FADE_DURATION}ms ease`;

      line.style.opacity = "0";
      label.style.opacity = "0";
      if (footerEl) footerEl.style.opacity = "0";
      if (projectContent) projectContent.style.opacity = "0";

      timers.push(setTimeout(() => {
        title.style.transition = `transform ${SLIDE_DURATION}ms ease`;
        title.style.transform = `translateX(${-slideDistance}px)`;
      }, SLIDE_DELAY));

      timers.push(setTimeout(() => {
        triggerPhase3();
      }, PHASE3_DELAY));
    }

    let ticking = false;
    function onScroll() {
      if (phase2Started) return;
      if (Date.now() - mountTime < 1000) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrolled = vh - rect.top;
        const progress = Math.max(0, Math.min(1, (scrolled - pinScroll) / animRange));

        const barP = Math.min(1, progress / 0.5);
        bar.style.width = `${barP * 100}%`;

        if (progress >= 0.5) {
          triggerPhase2();
        }

        ticking = false;
      });
    }

    function onResize() {
      if (phase2Started) return;
      title.style.transform = "translateX(0)";
      slideDistance = title.getBoundingClientRect().left - label.getBoundingClientRect().left;
      if (slideDistance <= 0) slideDistance = 0;
      ticking = false;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      timers.forEach(clearTimeout);
      if (projectContent) projectContent.style.opacity = "";
    };
  }, [router, project.slug]);

  function handleAreaClick(e) {
    if (e.target.closest("a")) return;
    router.push(`/projects/${project.slug}/`);
  }

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.stickyWrap} ref={stickyRef} onClick={handleAreaClick}>
        <Link href={`/projects/${project.slug}/`} className={styles.sectionLink} data-cursor="Try keep scrolling">
          <div className={styles.lineWrap} ref={lineRef}>
            <div className={styles.lineBg} />
            <div className={styles.lineBar} ref={barRef} />
          </div>

          <div className={styles.content}>
            <div className={styles.label} ref={labelRef}>
              <span className={styles.labelText}>Next project</span>
              <span className={styles.labelArrow}>&rarr;</span>
            </div>

            <div className={styles.titleBlock} ref={titleRef}>
              <h1 className={styles.title}>{project.projectTitle.main}</h1>
              {project.projectTitle.sub && (
                <span className={styles.subtitle}>{project.projectTitle.sub}</span>
              )}
            </div>
          </div>
        </Link>

        <div ref={footerRef}>
          <Footer />
        </div>
      </div>

      {/* Phase 3: fixed hero reveal — image is in position, clip-path does the swipe */}
      <div className={styles.heroReveal} ref={heroRevealRef}>
        <div className={styles.heroImageInner}>
          {project.heroImage && (
            <Image
              src={project.heroImage}
              alt={project.projectTitle.main}
              width={1920}
              height={1080}
              sizes="100vw"
              className={styles.heroImageEl}
            />
          )}
        </div>

        <div className={styles.heroText} ref={heroTextRef}>
          <div className={styles.heroTextBody}>
            {project.heroProblem && (
              <p>
                <ParsedHeroText
                  text={project.heroProblem}
                  externalLink={project.externalLink}
                />
              </p>
            )}
            {project.heroSolution && (
              <p>
                <ParsedHeroText
                  text={project.heroSolution}
                  externalLink={project.externalLink}
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
