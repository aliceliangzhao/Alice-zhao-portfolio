"use client";

import Link from "next/link";
import Navigation from "./Navigation";
import MetricsCounter from "./MetricsCounter";
import ExternalLink from "./ExternalLink";
import InlineImageLoop from "./InlineImageLoop";

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

// One block: a short caption (label + text) beside its media. (Becomes a tab
// panel in Step 6b.)
function Block({ label, text, images }) {
  return (
    <div className="pd-block pd-grid">
      <div className="pd-block-caption">
        <p className="pd-block-label">{label}</p>
        {text && <p className="pd-block-text">{text}</p>}
      </div>
      <div className="pd-block-media">
        {(images || []).map((img, i) => (
          <img key={i} className="pd-media" src={img.src} alt={img.alt} />
        ))}
      </div>
    </div>
  );
}

function Section({ section, metrics }) {
  const isOutcome = section.id === "outcome";
  // outcome carries content as an array of {subheading,text,images}; other
  // sections carry content.subsections of {label,text,images}.
  const blocks = isOutcome
    ? (Array.isArray(section.content) ? section.content : [])
    : (section.content?.subsections || []);
  const lead = isOutcome ? section.summary : section.content?.lead;

  return (
    <section id={section.id} className="pd-section">
      <header className="pd-section-head pd-grid">
        <h2><SectionHeading heading={section.heading} /></h2>
        {lead && <p>{lead}</p>}
      </header>

      {isOutcome && metrics?.length > 0 && (
        <div className="pd-grid">
          <div className="pd-metrics">
            <MetricsCounter metrics={metrics} />
          </div>
        </div>
      )}

      <div className="pd-blocks">
        {blocks.map((b, i) => (
          <Block key={i} label={b.label || b.subheading} text={b.text} images={b.images} />
        ))}
      </div>
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

        {/* Sections */}
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            metrics={section.id === "outcome" ? project.metrics : undefined}
          />
        ))}
      </main>

      <footer className="pd-footer pd-grid">
        <Link href="/#work" className="pd-back">&larr; Back to all work</Link>
      </footer>
    </>
  );
}
