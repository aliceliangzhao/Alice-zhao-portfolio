"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LineReveal from "./LineReveal";
import Tools from "./Tools";
import ToolPill from "./ToolPill";
import { workExperience, designPhilosophy, processSteps, toolsHeading, tools } from "../data/about";
import "./about-content.css";

/* The reused about sections — work experience, design philosophy, the
   AI-empowered design process (a two-column staggered masonry aligned by JS),
   and the design toolkit. Rendered as a fragment so each caller wraps it in
   `.about` (which the section/heading styles depend on). Used by both the
   homepage and the /about page. */
const RESUME_HREF = "/alice-zhao-ux-designer-resume.pdf";

export default function AboutDetails() {
  const philRef = useRef(null);
  const stepsRef = useRef(null);

  // Stagger the two process columns so each card's divider lines up with the
  // start of the next card in the opposite column (ported from the about page).
  useEffect(() => {
    const container = stepsRef.current;
    if (!container) return;

    function alignColumns() {
      const leftCards = Array.from(container.querySelectorAll(".process-col-left .process-card"));
      const rightCards = Array.from(container.querySelectorAll(".process-col-right .process-card"));
      const rightCol = container.querySelector(".process-col-right");
      if (!leftCards.length || !rightCards.length || !rightCol) return;

      const mobile = window.matchMedia("(max-width: 900px)").matches;
      if (mobile) {
        rightCol.style.paddingTop = "";
        [...leftCards, ...rightCards].forEach((c) => (c.style.marginTop = ""));
        return;
      }

      rightCol.style.paddingTop = "0";
      [...leftCards, ...rightCards].forEach((c) => (c.style.marginTop = "0"));

      const ordered = [];
      const max = Math.max(leftCards.length, rightCards.length);
      for (let i = 0; i < max; i++) {
        if (i < leftCards.length) ordered.push({ el: leftCards[i], col: "left" });
        if (i < rightCards.length) ordered.push({ el: rightCards[i], col: "right" });
      }

      const info = ordered.map((card) => {
        const rect = card.el.getBoundingClientRect();
        const divider = card.el.querySelector(".process-card-divider");
        const dOff = divider ? divider.getBoundingClientRect().top - rect.top : rect.height / 2;
        return { ...card, h: rect.height, dOff };
      });

      for (let i = 0; i < info.length; i++) {
        info[i].y = i === 0 ? 0 : info[i - 1].y + info[i - 1].dOff;
      }

      const rightItems = info.filter((c) => c.col === "right");
      const leftItems = info.filter((c) => c.col === "left");

      if (rightItems.length) {
        rightCol.style.paddingTop = `${rightItems[0].y}px`;
        let prevBottom = rightItems[0].y + rightItems[0].h;
        for (let i = 1; i < rightItems.length; i++) {
          rightItems[i].el.style.marginTop = `${Math.max(0, rightItems[i].y - prevBottom)}px`;
          prevBottom = rightItems[i].y + rightItems[i].h;
        }
      }

      if (leftItems.length > 1) {
        let prevBottom = leftItems[0].h;
        for (let i = 1; i < leftItems.length; i++) {
          leftItems[i].el.style.marginTop = `${Math.max(0, leftItems[i].y - prevBottom)}px`;
          prevBottom = leftItems[i].y + leftItems[i].h;
        }
      }
    }

    const images = container.querySelectorAll("img");
    let loaded = 0;
    const total = images.length;
    function onImageReady() {
      loaded++;
      if (loaded >= total) alignColumns();
    }
    if (total === 0) {
      alignColumns();
    } else {
      images.forEach((img) => {
        if (img.complete) loaded++;
        else {
          img.addEventListener("load", onImageReady);
          img.addEventListener("error", onImageReady);
        }
      });
      if (loaded >= total) alignColumns();
    }

    window.addEventListener("resize", alignColumns);
    return () => {
      window.removeEventListener("resize", alignColumns);
      images.forEach((img) => {
        img.removeEventListener("load", onImageReady);
        img.removeEventListener("error", onImageReady);
      });
    };
  }, []);

  // Reveal the design-philosophy heading line by line on scroll-in.
  useEffect(() => {
    const el = philRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("revealed"); io.disconnect(); }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── Work experience ── */}
      <section className="about-section col-grid">
        <h2>Work experience</h2>
        <p className="about-resume-link">
          <Link href={RESUME_HREF} target="_blank" rel="noreferrer">View my resume ↗</Link>
        </p>
        <div className="experience-list">
          {workExperience.map((entry, i) => (
            <div key={i} className="experience-entry col-grid">
              <p className="experience-time">{entry.time}</p>
              <div className="experience-main">
                <p className="experience-title">{entry.title} @ {entry.company}</p>
                <p className="experience-description">{entry.description}</p>
              </div>
              <div className="experience-work">
                <p className="experience-work-label">Selected work</p>
                <ul className="experience-work-list">
                  {entry.selectedWork.map((work, j) => (
                    <li key={j}>
                      <Link href={work.href}>{work.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Design philosophy ── */}
      <section id="design-philosophy" className="about-section col-grid">
        <h2 ref={philRef} className="section-heading-reveal">
          <LineReveal heading={designPhilosophy.heading} lead="" plain />
        </h2>
      </section>

      {/* ── AI-empowered design process ── */}
      <section id="design-process" className="about-section">
        <h2 className="process-heading">My AI-empowered design process</h2>
        <div className="process-steps" ref={stepsRef}>
          <div className="process-col process-col-left">
            {processSteps.filter((_, i) => i % 2 === 0).map((step, i) => (
              <div key={step.id} className="process-card" style={{ order: i * 2 }}>
                <div className="process-card-visual">
                  <img src={`/img/aboutMe/design-process/${step.id}.png`} alt={step.title} className="process-card-svg" />
                </div>
                <div className="process-card-content">
                  <h3 className="process-card-title">{step.id} {step.title}</h3>
                  <p className="process-card-desc">{step.description}</p>
                  <div className="process-card-divider" />
                  <div className="process-card-tools">
                    {step.tools.map((tool, j) => (
                      <ToolPill key={j} name={tool.name} icon={tool.icon} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="process-col process-col-right">
            {processSteps.filter((_, i) => i % 2 !== 0).map((step, i) => (
              <div key={step.id} className="process-card" style={{ order: i * 2 + 1 }}>
                <div className="process-card-visual">
                  <img src={`/img/aboutMe/design-process/${step.id}.png`} alt={step.title} className="process-card-svg" />
                </div>
                <div className="process-card-content">
                  <h3 className="process-card-title">{step.id} {step.title}</h3>
                  <p className="process-card-desc">{step.description}</p>
                  <div className="process-card-divider" />
                  <div className="process-card-tools">
                    {step.tools.map((tool, j) => (
                      <ToolPill key={j} name={tool.name} icon={tool.icon} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Design toolkit ── */}
      <div id="ai-toolkit">
        <Tools heading={toolsHeading} items={tools} />
      </div>
    </>
  );
}
