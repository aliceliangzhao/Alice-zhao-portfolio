"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MetricsCounter from "./MetricsCounter";
import ExternalLink from "./ExternalLink";
import InlineImageLoop from "./InlineImageLoop";
import SectionTabs from "./SectionTabs";

/* Project detail page — simple-editorial style.
   A calm, flat, scrollable page: lead (title + meta + intro) → hero band →
   numbered sections → back link. (Step 6a renders each section's blocks
   stacked; Step 6b turns them into the tabbed panel explorer.) */

// --- inline content tokens ------------------------------------------------
// The hero copy embeds {link:label} (an external link) and {img:a,b,c} (an
// inline image loop). Parse them into components; everything else is text.
function HeroText({ text, externalLink }) {
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

// Split a heading like "01  Who and why." into its leading number and the rest
// so the number can be set in a muted weight, like the prototype.
function SectionHeading({ heading }) {
  const m = heading.match(/^(\d+)\s+(.*)$/);
  if (!m) return <>{heading}</>;
  return (
    <>
      <span className="pd-num">{m[1]}</span>
      {m[2]}
    </>
  );
}

function Section({ section }) {
  const subsections = section.content?.subsections || [];
  const lead = section.content?.lead;

  return (
    <section id={section.id} className="pd-section">
      <header className="pd-section-head pd-grid">
        <h2><SectionHeading heading={section.heading} /></h2>
        {lead && <p>{lead}</p>}
      </header>

      {subsections.length > 0 && (
        <SectionTabs sectionId={section.id} subsections={subsections} />
      )}
    </section>
  );
}

/* Outcome keeps the style-card cinematic treatment: a zigzag of text + images
   where the final image is pinned and expands to fill the viewport as you
   scroll past it. The scroll math is unchanged from style-card. */
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
    if (prefersReduced) return;

    const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
    const smoothstep = (v) => v * v * (3 - 2 * v);

    function measure() {
      const baseWidth = stage.clientWidth;
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16 / 9;
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
    function tick() { update(); loopId = requestAnimationFrame(tick); }
    function onResize() { measure(); }

    window.addEventListener("resize", onResize, { passive: true });
    measure();
    tick();
    if (!img.complete) img.addEventListener("load", measure, { once: true });
    return () => {
      cancelAnimationFrame(loopId);
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
          <div key={i} className={`zigzag-row pd-grid ${isLeft ? "zigzag-left" : "zigzag-right"}`}>
            <div className="zigzag-text">
              <p className="subsection-label">{block.subheading}</p>
              <p className="subsection-text">{block.text}</p>
            </div>
            <div className="zigzag-images">
              {regularImages.map((image, j) => (
                <img key={j} src={image.src} alt={image.alt} className="zigzag-img" />
              ))}
              {expandImage && (
                <div ref={revealRef} className="zigzag-reveal-stage">
                  <div className="zigzag-reveal-pin">
                    <div className="zigzag-reveal-frame">
                      <img src={expandImage.src} alt={expandImage.alt} className="zigzag-reveal-img" />
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
  const content = section.content;
  const blocks = Array.isArray(content) ? content : null;

  return (
    <section id={section.id} className="pd-section">
      <header className="pd-section-head pd-grid">
        <h2><SectionHeading heading={section.heading} /></h2>
        {section.summary && <p>{section.summary}</p>}
      </header>

      {metrics?.length > 0 && (
        <div className="pd-grid">
          <div className="pd-metrics"><MetricsCounter metrics={metrics} /></div>
        </div>
      )}

      {blocks ? (
        <OutcomeZigzag content={blocks} />
      ) : content?.summary ? (
        <div className="pd-grid"><p className="pd-outcome-summary">{content.summary}</p></div>
      ) : null}
    </section>
  );
}

export default function ProjectDetailClient({ project }) {
  const comingSoon = !!project.comingSoon;
  const sections = comingSoon ? [] : (project.sections || []);
  const meta = [project.role, project.year, ...(project.tags || [])].filter(Boolean);

  return (
    <>
      {/* no phase labels in the nav for a coming-soon project */}
      <Navigation sections={sections} />

      <main className="pd">
        {/* Lead: title + meta + intro */}
        <section className="pd-lead pd-grid">
          <h1>{project.navTitle || project.projectTitle?.main}</h1>
          {meta.length > 0 && (
            <ul className="pd-meta">
              {meta.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          )}
          {comingSoon ? (
            <div className="pd-intro">
              <p>
                Launching in Oct 2026. Don&apos;t hesitate to reach out on{" "}
                <a href="https://www.linkedin.com/in/liangzhaoux/" target="_blank" rel="noreferrer">LinkedIn</a>
                {" "}or via{" "}
                <a href="mailto:liangzhao0801@gmail.com">email</a>
                {" "}if you can&apos;t wait to learn more.
              </p>
            </div>
          ) : (project.heroProblem || project.heroSolution) && (
            <div className="pd-intro">
              {project.heroProblem && (
                <p><HeroText text={project.heroProblem} externalLink={project.externalLink} /></p>
              )}
              {project.heroSolution && (
                <p><HeroText text={project.heroSolution} externalLink={project.externalLink} /></p>
              )}
            </div>
          )}
        </section>

        {/* Hero band */}
        {project.heroImage && (
          <section className="pd-hero" aria-label="Product overview">
            <div className="pd-hero-inner pd-grid">
              <img className="pd-hero-img" src={project.heroImage} alt={project.impact || project.navTitle || ""} />
            </div>
          </section>
        )}

        {/* Sections — outcome keeps the style-card cinematic zigzag/reveal */}
        {sections.map((section) =>
          section.id === "outcome" ? (
            <OutcomeSection key={section.id} section={section} metrics={project.metrics} />
          ) : (
            <Section key={section.id} section={section} />
          )
        )}
      </main>

      <footer className="pd-footer pd-grid">
        <Link href="/#work" className="pd-back">&larr; Back to all work</Link>
      </footer>
    </>
  );
}
