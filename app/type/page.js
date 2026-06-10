"use client";

import { useRef, useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import "./type-lab.css";

/* Dev-only specimen. Three columns:
   1. Size reference — every NEW tier (xxxl→xxs) with a live sample + px, so you
      can see how large each size is when reassigning an element.
   2. Current — the real S3 Tables elements scoped to the -legacy tokens.
   3. New — the same elements scoped to the -next tokens.
   Each element keeps its real font / weight / tracking; only the size tier
   changes between columns. Decide here, then flip the LIVE lines in tokens.css. */

const ALL_TIERS = ["xxxl", "xxl", "xl", "l", "m", "s", "xs", "xxs"];

// Measure an element's actual rendered font-size in px (clamp() is viewport-
// dependent, so we read it live and re-read on resize).
function useMeasuredPx(ref) {
  const [px, setPx] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setPx(Math.round(parseFloat(getComputedStyle(el).fontSize)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ref]);
  return px;
}

function RefRow({ tier }) {
  const ref = useRef(null);
  const px = useMeasuredPx(ref);
  return (
    <div className="ref-row">
      <div className="ref-head">
        <span className="ref-tier">{tier}</span>
        <span className="ref-px">{px != null ? `${px}px` : ""}</span>
      </div>
      <span
        ref={ref}
        className="ref-sample"
        style={{ fontSize: `var(--font-size-${tier}-next)` }}
      >
        Ag
      </span>
    </div>
  );
}

function SizeReference() {
  return (
    <aside className="size-ref">
      <span className="ref-caption">New sizes</span>
      {ALL_TIERS.map((t) => (
        <RefRow key={t} tier={t} />
      ))}
    </aside>
  );
}

function Field({ tier, as = "p", className, children }) {
  const ref = useRef(null);
  const px = useMeasuredPx(ref);
  const Tag = as;
  return (
    <div className="sp-field">
      <span className="sp-anno">
        {tier}
        {px != null && <> · {px}px</>}
      </span>
      <Tag
        ref={ref}
        className={className}
        style={{ fontSize: `var(--font-size-${tier})` }}
      >
        {children}
      </Tag>
    </div>
  );
}

function Specimen({ variant }) {
  return (
    <article className={`specimen specimen-${variant}`}>
      <Field tier="xl" as="h1" className="sp-title">
        AWS S3 Tables
      </Field>

      <Field tier="s" className="sp-sub">
        0→1 in 8 weeks
      </Field>

      <Field tier="l" className="sp-problem">
        Customers
      </Field>

      <Field tier="l" as="h2" className="sp-h2">
        01&nbsp;&nbsp;Who and why.
      </Field>

      <Field tier="xs" className="sp-label">
        Research
      </Field>

      <Field tier="xs" className="sp-body">
        I used internal AI tools to synthesize transcripts from 20+ enterprise
        customer interviews. The synthesis surfaced two target personas and
        their core pain points.
      </Field>
    </article>
  );
}

export default function TypeLab() {
  return (
    <>
      <Navigation title="Type lab" />
      <main className="typelab">
        <header className="typelab-intro">
          <h1>Project detail · current vs new scale</h1>
          <p className="typelab-note">
            Real S3 Tables elements in both size scales, same fonts. The left
            column lists every new size; the gray tag on each element shows its
            tier and live px. To try a different size on an element, change its
            tier in <code>app/type/page.js</code>; to adopt a tier site-wide,
            flip its LIVE line in <code>app/tokens.css</code>. Body (s) is already
            adopted.
          </p>
        </header>

        <div className="tl-colhead">
          <span>Sizes</span>
          <span>Current</span>
          <span>New</span>
        </div>

        <div className="specimen-grid">
          <SizeReference />
          <Specimen variant="current" />
          <Specimen variant="next" />
        </div>
      </main>
    </>
  );
}
