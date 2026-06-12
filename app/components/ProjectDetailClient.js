"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { projects } from "../data/projects";
import Navigation from "./Navigation";
import MetricsCounter from "./MetricsCounter";
import ExternalLink from "./ExternalLink";
import HeroVisual from "./HeroVisual";
import InlineImageLoop from "./InlineImageLoop";
import LineReveal from "./LineReveal";
import NextProjectTransition from "./NextProjectTransition";
import WaveBackground from "./WaveBackground";
import Footer from "./Footer";

function HeroBottomRow({ project, className }) {
  return (
    <div className={className}>
      <div className="project-hero-heading">
        <h1>{project.projectTitle.main}</h1>
        {project.projectTitle.sub && (
          <span className="project-hero-subtitle">{project.projectTitle.sub}</span>
        )}
      </div>
      <div className="project-hero-text">
        {project.comingSoonMessage ? (
          <p>
            Launching in Oct 2026, don't hesitate to reach out on{" "}
            <a href="https://www.linkedin.com/in/liangzhaoux/" target="_blank" rel="noreferrer">LinkedIn</a>
            {" "}or via{" "}
            <a href="mailto:liangzhao0801@gmail.com">email</a>
            {" "}if you can't wait to learn more.
          </p>
        ) : (
          <>
            {project.heroProblem && (
              <p>
                <HeroSolutionText
                  text={project.heroProblem}
                  externalLink={project.externalLink}
                />
              </p>
            )}
            {project.heroSolution && (
              <p>
                <HeroSolutionText
                  text={project.heroSolution}
                  externalLink={project.externalLink}
                />
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}


function HeroSolutionText({ text, externalLink }) {
  const parts = text.split(/(\{img(?::[^}]*)?\}|\{link:[^}]+\})/g);
  return parts.map((part, i) => {
    const imgMatch = part.match(/^\{img:([^}]+)\}$/);
    if (imgMatch) {
      const loop = <InlineImageLoop key={i} srcs={imgMatch[1].split(",")} />;
      if (externalLink) {
        return <ExternalLink key={i} href={externalLink.url} hideIcon dataCursor={externalLink.cursor}>{loop}</ExternalLink>;
      }
      return loop;
    }
    const linkMatch = part.match(/^\{link:([^}]+)\}$/);
    if (linkMatch && externalLink) {
      return <ExternalLink key={i} href={externalLink.url} dataCursor={externalLink.cursor}>{linkMatch[1]}</ExternalLink>;
    }
    return part;
  });
}


function OutcomeZigzag({ content }) {
  const revealRef = useRef(null);

  useLayoutEffect(() => {
    const stage = revealRef.current;
    if (!stage) return;
    const pin = stage.querySelector(".zigzag-reveal-pin");
    const frame = stage.querySelector(".zigzag-reveal-frame");
    const img = stage.querySelector(".zigzag-reveal-img");
    if (!pin || !frame || !img) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      return;
    }

    function clamp(value, min = 0, max = 1) {
      return Math.max(min, Math.min(max, value));
    }

    function smoothstep(value) {
      return value * value * (3 - 2 * value);
    }

    function measure() {
      const baseWidth = stage.clientWidth;
      const ratio =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 16 / 9;
      const baseHeight = baseWidth / ratio;
      const viewportHeight = window.innerHeight;
      const revealDistance = Math.max(viewportHeight * 1.05, 680);
      const holdDistance = viewportHeight * 0.55;

      stage.style.setProperty("--reveal-ratio", ratio);
      stage.style.setProperty("--reveal-base-h", `${baseHeight}px`);
      stage.style.setProperty("--reveal-distance", `${revealDistance}px`);
      stage.style.setProperty("--reveal-extra", `${revealDistance + holdDistance}px`);
      update();
    }

    function update() {
      const rect = stage.getBoundingClientRect();
      const baseWidth = stage.clientWidth;
      const baseHeight = parseFloat(stage.style.getPropertyValue("--reveal-base-h")) || pin.offsetHeight;
      const revealDistance = parseFloat(stage.style.getPropertyValue("--reveal-distance")) || window.innerHeight;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const stickyTop = Math.max(0, (vh - baseHeight) / 2);
      const progress = clamp((stickyTop - rect.top) / revealDistance);
      const eased = smoothstep(progress);

      frame.style.setProperty("--reveal-frame-w", `${baseWidth + (vw - baseWidth) * eased}px`);
      frame.style.setProperty("--reveal-frame-h", `${baseHeight + (vh - baseHeight) * eased}px`);
      frame.style.setProperty("--reveal-frame-x", `${-rect.left * eased}px`);
      frame.style.setProperty("--reveal-frame-y", `${-stickyTop * eased}px`);
    }

    let loopId = 0;
    function startLoop() {
      if (loopId) return;
      function tick() {
        update();
        loopId = requestAnimationFrame(tick);
      }
      tick();
    }

    function stopLoop() {
      if (!loopId) return;
      cancelAnimationFrame(loopId);
      loopId = 0;
    }

    function onResize() {
      measure();
    }

    window.addEventListener("resize", onResize, { passive: true });
    measure();
    startLoop();
    if (!img.complete) {
      img.addEventListener("load", measure, { once: true });
    }
    return () => {
      stopLoop();
      window.removeEventListener("resize", onResize);
      img.removeEventListener("load", measure);
    };
  }, []);

  const lastBlockIdx = content.length - 1;

  return (
    <div className="outcome-zigzag">
      {content.map((block, i) => {
        const isLeft = i % 2 === 0;
        const isLastBlock = i === lastBlockIdx;
        const images = block.images || [];
        const regularImages = isLastBlock ? images.slice(0, -1) : images;
        const expandImage = isLastBlock && images.length > 0 ? images[images.length - 1] : null;

        return (
          <div key={i} className={`zigzag-row col-grid ${isLeft ? "zigzag-left" : "zigzag-right"}`}>
            <div className="zigzag-text">
              <p className="subsection-label">{block.subheading}</p>
              <p className="subsection-text">{block.text}</p>
            </div>
            <div className="zigzag-images">
              {regularImages.map((img, j) => (
                <img key={j} src={img.src} alt={img.alt} className="zigzag-img" />
              ))}
              {expandImage && (
                <div ref={revealRef} className="zigzag-reveal-stage">
                  <div className="zigzag-reveal-pin">
                    <div className="zigzag-reveal-frame">
                      <img
                        src={expandImage.src}
                        alt={expandImage.alt}
                        className="zigzag-reveal-img"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OutcomeSection({ section, metrics }) {
  const { content } = section;
  const isArray = Array.isArray(content);
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={section.id} className="project-section col-grid">
      <h2 ref={headingRef} className={`section-heading-reveal${section.headingAlign === "center" ? " heading-center" : ""}`}>
        <LineReveal heading={section.heading} lead={section.summary || ""} align={section.headingAlign} />
      </h2>

      {isArray ? (
        <>
          <MetricsCounter metrics={metrics} />
          <OutcomeZigzag content={content} />
        </>
      ) : (
        <>
          <MetricsCounter metrics={metrics} />
          {content.summary && <p className="outcome-summary">{content.summary}</p>}
        </>
      )}
    </section>
  );
}


function BlockSection({ section }) {
  const { content } = section;
  if (!content.lead) return null;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={section.id} className="project-section col-grid">
      <h2 ref={ref} className="section-heading-reveal">
        <LineReveal heading={section.heading} lead={content.lead} />
      </h2>
      {content.subsections && content.subsections.length > 0 && (
        <div className="subsections-grid">
          {content.subsections.map((sub, i) => (
            <div key={i} className="subsection-item col-grid">
              <p className="subsection-label">{sub.label}</p>
              {sub.images?.length === 1 && (
                <img className={`subsection-img subsection-img-full${sub.images[0].noBorder ? " subsection-img-bare" : ""}`} src={sub.images[0].src} alt={sub.images[0].alt} />
              )}
              {sub.images?.length >= 2 && (
                <div className="subsection-img-pair">
                  <img className={`subsection-img subsection-img-left${sub.images[0].noBorder ? " subsection-img-bare" : ""}`} src={sub.images[0].src} alt={sub.images[0].alt} />
                  <img className={`subsection-img subsection-img-right${sub.images[1].noBorder ? " subsection-img-bare" : ""}`} src={sub.images[1].src} alt={sub.images[1].alt} />
                </div>
              )}
              <p className="subsection-text">{sub.text}</p>
            </div>
          ))}
        </div>
      )}
      {content.sectionImages
        ? content.sectionImages.map((img, i) => (
            <img key={i} className="section-image" src={img.src} alt={img.alt} />
          ))
        : content.sectionImage && (
            <img className="section-image" src={content.sectionImage.src} alt={content.sectionImage.alt} />
          )}
    </section>
  );
}

const SECTION_RENDERERS = {
  problem: BlockSection,
  scoping: BlockSection,
  "design-iteration": BlockSection,
  outcome: OutcomeSection,
};

const TRANSITION_SECTION_IDS = ["problem", "scoping", "design-iteration", "outcome"];

function ProjectSectionTransitionTrack({ sections, metrics, onHeroDimChange }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const panels = Array.from(track.querySelectorAll(".project-section-handoff-panel"));
    if (panels.length <= 1) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    function updateHandoff() {
      const vh = window.innerHeight;
      let nextHandoff = { incomingIndex: null, progress: 0 };

      for (let i = 0; i < panels.length; i += 1) {
        const rect = panels[i].getBoundingClientRect();
        if (rect.top < vh * 1 && rect.top > -vh * 0.2) {                                                                                                  
          const progress = Math.max(0, Math.min(1, 1 - rect.top / (vh * 1)));  
          nextHandoff = { incomingIndex: i, progress };
        }
      }

      panels.forEach((panel, index) => {
        const isIncoming = nextHandoff.incomingIndex === index;
        const isBehind = nextHandoff.incomingIndex === index + 1;
        panel.classList.toggle("is-incoming", isIncoming);
        panel.classList.toggle("is-behind", isBehind);
        if (isIncoming) {
          panel.style.setProperty("--incoming-y", `${(1 - nextHandoff.progress) * 10}vh`);
        } else {
          panel.style.removeProperty("--incoming-y");
        }
        if (isBehind) {
          const dimP = Math.max(0, (nextHandoff.progress - 0.2) / 0.8);
          panel.style.setProperty("--panel-dim", `${dimP * 80}%`);
          panel.style.setProperty("--behind-y", `${nextHandoff.progress * 80}vh`);
        } else {
          panel.style.removeProperty("--panel-dim");
          panel.style.removeProperty("--behind-y");
        }
      });

      if (panels[0]) {
        const isMobile = window.innerWidth <= 900;
        const firstRect = panels[0].getBoundingClientRect();
        const heroProgress = isMobile
          ? Math.max(0, Math.min(1, (window.scrollY - 24) / (vh * 1.35)))
          : Math.max(0, Math.min(1, 1 - firstRect.top / (vh * 1.25)));
        const isHeroHandoff = isMobile
          ? window.scrollY > 24 && firstRect.top > -vh * 0.2
          : firstRect.top < vh * 1.25 && firstRect.top > -vh * 0.2;
        onHeroDimChange(isHeroHandoff ? heroProgress : 0);
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHandoff);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateHandoff();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections, onHeroDimChange]);

  if (sections.length === 0) return null;

  return (
    <div ref={trackRef} className="project-section-transition-track">
      {sections.map((section, index) => {
        const Renderer = SECTION_RENDERERS[section.id];
        if (!Renderer) return null;

        return (
          <div
            key={section.id}
            className="project-section-handoff-panel"
          >
            <div className="project-section-handoff-motion">
              <Renderer
                section={section}
                metrics={section.id === "outcome" ? metrics : undefined}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectDetailClient({ project }) {
  const nextProject = project.nextProject
    ? projects[project.nextProject]
    : null;
  const imageRef = useRef(null);
  const heroRef = useRef(null);
  const transitionSections = project.sections.filter((section) =>
    TRANSITION_SECTION_IDS.includes(section.id)
  );
  const normalSections = project.sections.filter((section) =>
    !TRANSITION_SECTION_IDS.includes(section.id)
  );

  function updateHeroDim(progress) {
    const hero = heroRef.current;
    if (!hero) return;
    const dimP = Math.max(0, (progress - 0.2) / 0.8);
    hero.style.setProperty("--hero-dim", `${dimP * 80}%`);
    hero.style.setProperty("--hero-behind-y", `${progress * 42}vh`);
  }

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const fromTransition = sessionStorage.getItem("next-project-transition");
    if (fromTransition) {
      sessionStorage.removeItem("next-project-transition");
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      image.style.clipPath = "inset(0)";
      return;
    }

    function calcInitial() {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gutter = 3.75 * rem;
      const gap = 20;
      const vw = window.innerWidth;
      const colWidth = (vw - gutter * 2 - gap * 7) / 8;
      const side = colWidth * 2.5 + gap * 1.5;
      const imgH = image.offsetHeight;
      return {
        top: 0,
        right: vw - gutter - side,
        bottom: Math.max(0, imgH - side),
        left: gutter,
        scrollDist: window.innerHeight * 0.3,
      };
    }

    let init = calcInitial();

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.max(0, Math.min(1, window.scrollY / init.scrollDist));
        const t = init.top * (1 - progress);
        const r = init.right * (1 - progress);
        const b = init.bottom * (1 - progress);
        const l = init.left * (1 - progress);
        image.style.clipPath = `inset(${t}px ${r}px ${b}px ${l}px)`;
        ticking = false;
      });
    }

    function onResize() {
      init = calcInitial();
      onScroll();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <Navigation title={project.navTitle || "Project"} sections={project.comingSoon ? [] : project.sections} />

      <article className="project-detail">
        <header
          ref={heroRef}
          className={`project-hero${project.comingSoon ? " project-hero-coming-soon" : ""}`}
        >
          {project.comingSoon ? (
            <WaveBackground />
          ) : (
            <div className="hero-image-expand" ref={imageRef}>
              <HeroVisual
                src={project.heroImage}
                alt={project.projectTitle.main}
              />
            </div>
          )}
          <div className="hero-content">
            <HeroBottomRow project={project} className="hero-bottom-row col-grid" />
          </div>
          {!project.comingSoon && <div className="hero-scroll-spacer" />}
        </header>

        {!project.comingSoon && (
          <div className="project-content">
            <ProjectSectionTransitionTrack
              sections={transitionSections}
              metrics={project.metrics}
              onHeroDimChange={updateHeroDim}
            />
            {normalSections.map((section) => {
              const Renderer = SECTION_RENDERERS[section.id];
              if (!Renderer) return null;
              return (
                <Renderer
                  key={section.id}
                  section={section}
                  metrics={section.id === "outcome" ? project.metrics : undefined}
                />
              );
            })}
          </div>
        )}

        {nextProject && (
          <NextProjectTransition project={nextProject} />
        )}
      </article>

      {!nextProject && <Footer />}
    </>
  );
}
