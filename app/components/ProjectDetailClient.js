"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import MetricsBento from "./MetricsBento";
import ExternalLink from "./ExternalLink";
import InlineImageLoop from "./InlineImageLoop";
import SectionDivider from "./SectionDivider";
import SelectedWork from "./SelectedWork";
import DotGridBackground from "./DotGridBackground";
import { projectOrder } from "../data/projects";

/* Project detail page — simple-editorial style.
   A calm, flat, scrollable page: lead (title + meta + intro) → hero band →
   numbered sections → back link. (Step 6a renders each section's blocks
   stacked; Step 6b turns them into the tabbed panel explorer.) */

// --- inline content tokens ------------------------------------------------
// The hero copy embeds {link:label} (an external link) and {img:a,b,c} (an
// inline image loop). Parse them into components; everything else is text.
// Tokens: {img:src1,src2} and {link:label}. Either may carry its own URL after
// a pipe ({img:...|url}, {link:label|url}); without one it falls back to the
// project's externalLink.
function HeroText({ text, externalLink }) {
  const parts = text.split(/(\{img(?::[^}]*)?\}|\{link:[^}]+\})/g);
  return parts.map((part, i) => {
    const imgMatch = part.match(/^\{img:([^}]+)\}$/);
    if (imgMatch) {
      const [srcs, url] = imgMatch[1].split("|");
      const loop = <InlineImageLoop key={i} srcs={srcs.split(",")} />;
      const href = url || externalLink?.url;
      if (href) {
        return <ExternalLink key={i} href={href} hideIcon dataCursor={externalLink?.cursor}>{loop}</ExternalLink>;
      }
      return loop;
    }
    const linkMatch = part.match(/^\{link:([^}]+)\}$/);
    if (linkMatch) {
      const [label, url] = linkMatch[1].split("|");
      const href = url || externalLink?.url;
      if (href) {
        return <ExternalLink key={i} href={href} dataCursor={externalLink?.cursor}>{label}</ExternalLink>;
      }
      return label;
    }
    return part;
  });
}

// Split a heading like "01  Who and why." into its leading number and the rest
// so the number can be set in a muted weight, like the prototype.
function SectionHeading({ heading }) {
  const clean = heading.replace(/\.\s*$/, ""); // no trailing period on section titles
  const m = clean.match(/^(\d+)\s+(.*)$/);
  if (!m) return <>{clean}</>;
  return (
    <>
      <span className="pd-num">{m[1]}</span>
      {m[2]}
    </>
  );
}

// One subsection: a full-width header (bold label + centered hairline) over a
// grid body — description in cols 1-3, image(s) in cols 5-12 (col 4 is an empty
// gutter). Subsections are listed down the page, not tabbed.
function Subsection({ sub }) {
  return (
    <div className="pd-sub">
      <div className="pd-sub-head">
        <h3 className="pd-sub-label">{sub.label}</h3>
        <span className="pd-sub-rule" aria-hidden="true" />
      </div>
      <div className="pd-sub-body pd-grid">
        <div className="pd-sub-desc">
          {sub.text && <p>{sub.text}</p>}
        </div>
        <div className="pd-sub-media">
          {(sub.images || []).map((img, j) => (
            <img
              key={j}
              className={`pd-media${img.noBorder ? " pd-media--no-border" : ""}`}
              src={img.src}
              alt={img.alt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ section, flush }) {
  const subsections = section.content?.subsections || [];
  const lead = section.content?.lead;

  return (
    <section id={section.id} className={`pd-section${flush ? " pd-section--flush" : ""}`}>
      <header className={`pd-section-head pd-grid${section.headingAlign === "center" ? " pd-section-head--center" : ""}`}>
        <h2><SectionHeading heading={section.heading} /></h2>
        {lead && <p><HeroText text={lead} /></p>}
      </header>

      {subsections.length > 0 && (
        <div className="pd-subs">
          {subsections.map((sub, i) => <Subsection key={i} sub={sub} />)}
        </div>
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
      const revealDistance = Math.max(viewportHeight * 0.9, 600);
      const holdDistance = 0;   /* release as soon as the image finishes expanding */

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
          <div key={i} className={`zigzag-row ${isLeft ? "zigzag-left" : "zigzag-right"}`}>
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

function OutcomeSection({ section, metrics, metricsImage, metricsImageAlt, flush }) {
  const content = section.content;
  const blocks = Array.isArray(content) ? content : null;

  return (
    <section id={section.id} className={`pd-section${flush ? " pd-section--flush" : ""}`}>
      <header className={`pd-section-head pd-grid${section.headingAlign === "center" ? " pd-section-head--center" : ""}`}>
        <h2><SectionHeading heading={section.heading} /></h2>
        {section.summary && <p>{section.summary}</p>}
      </header>

      {metrics?.length > 0 && (
        <div className="pd-grid">
          <div className="pd-metrics">
            <MetricsBento metrics={metrics} image={metricsImage} imageAlt={metricsImageAlt} />
          </div>
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
  const meta = [project.role].filter(Boolean);
  // year gets the same pill treatment as the capability tags, shown first
  const pills = [project.year, ...(project.tags || [])].filter(Boolean);
  // the other case studies, for the "more work" section above the footer
  const otherSlugs = projectOrder.filter((slug) => slug !== project.slug);

  // Next 16's router *maintains* scroll position across navigations, so a
  // project opened from a scrolled-down homepage would land mid-page, below the
  // title. Force the top on entry (keyed on slug so it also fires when moving
  // between projects), skipping hash deep-links. We flip off the global smooth
  // scroll for the jump so it snaps instantly instead of animating from the
  // inherited offset.
  useLayoutEffect(() => {
    if (window.location.hash) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [project.slug]);

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
          {pills.length > 0 && (
            <ul className="pd-tags">
              {pills.map((t, i) => <li key={i} className="pd-tag">{t}</li>)}
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

        {/* Hero band. Uses `detailImage` if the project sets one, otherwise
            falls back to `heroImage` (the same image as the homepage card). */}
        {(project.detailImage || project.heroImage) && (
          <section className="pd-hero" aria-label="Product overview">
            <div className="pd-hero-inner pd-grid">
              <img
                className="pd-hero-img"
                src={project.detailImage || project.heroImage}
                alt={project.impact || project.navTitle || ""}
              />
            </div>
          </section>
        )}

        {/* Sections — a shapes-grid divider sits between each one (not before the
            first; the hero band already precedes it). Outcome keeps the
            style-card cinematic zigzag/reveal. */}
        {sections.map((section, i) => (
          <Fragment key={section.id}>
            {i > 0 && <SectionDivider symmetric />}
            {section.id === "outcome" ? (
              <OutcomeSection
                section={section}
                metrics={project.metrics}
                metricsImage={project.metricsImage}
                metricsImageAlt={project.navTitle}
                flush={i > 0}
              />
            ) : (
              <Section section={section} flush={i > 0} />
            )}
          </Fragment>
        ))}

        {!comingSoon && otherSlugs.length > 0 && (
          <SelectedWork projectSlugs={otherSlugs} />
        )}
      </main>

      {/* dotted band fills the gap between the work section and the footer */}
      <div className="pd-dot-gap" aria-hidden="true">
        <DotGridBackground className="pd-dot-gap-fill" />
      </div>

      <Footer />
    </>
  );
}
