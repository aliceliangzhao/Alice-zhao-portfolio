"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

const CENTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Lab", href: "/lab", hideMobile: true },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/liangzhaoux/", external: true },
  { label: "Email", href: "mailto:liangzhao0801@gmail.com" },
  { label: "Resume", href: "https://drive.google.com/file/d/1mJRSpRVt-9k0j9rOz154nCsfPWPXsa4D/view", external: true },
];

function SocialLinks() {
  return SOCIAL_LINKS.map((l) =>
    l.external ? (
      <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
    ) : (
      <a key={l.label} href={l.href}>{l.label}</a>
    )
  );
}

export default function Navigation({ sections }) {
  const hasSections = sections && sections.length > 0;

  const [activeSection, setActiveSection] = useState(null);
  const [sectionDropOpen, setSectionDropOpen] = useState(false);
  const [hidden, setHidden] = useState(false);     // resurfacing: retract on scroll-down
  const [floating, setFloating] = useState(false); // frosted panel once scrolled off the top
  const sectionDropRef = useRef(null);

  // Scroll-spy for the project section nav.
  useEffect(() => {
    if (!hasSections) return;
    const ids = sections.map((s) => s.id);
    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = id;
      }
      setActiveSection((prev) => {
        if (prev !== current) setSectionDropOpen(false);
        return current;
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSections, sections]);

  // Resurfacing header: solid at the very top, hide on scroll-down,
  // reappear (frosted) on scroll-up.
  useEffect(() => {
    const TOP_GUARD = 80;
    const DELTA = 6;
    let lastY = window.pageYOffset || 0;
    let queued = false;
    function update() {
      queued = false;
      const y = window.pageYOffset || 0;
      const dy = y - lastY;
      if (y <= TOP_GUARD) { setHidden(false); setFloating(false); }
      else if (dy < -DELTA) { setHidden(false); setFloating(true); }
      else if (dy > DELTA) { setHidden(true); }
      lastY = y;
    }
    function onScroll() {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile section dropdown on outside click.
  useEffect(() => {
    function onClick(e) {
      if (sectionDropRef.current && !sectionDropRef.current.contains(e.target)) {
        setSectionDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const panel = el.closest(".project-section-handoff-panel") || el;
    const rect = panel.getBoundingClientRect();
    const navH =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) *
      parseFloat(getComputedStyle(document.documentElement).fontSize);
    window.scrollTo({ top: window.scrollY + rect.top - navH, behavior: "smooth" });
  }

  const activeLabel = hasSections
    ? (sections.find((s) => s.id === activeSection) || sections[0]).navLabel
    : null;

  const navClass = `${styles.nav}${hidden ? ` ${styles.hidden}` : ""}${floating ? ` ${styles.floating}` : ""}`;

  return (
    <header className={navClass}>
      {/* Left slot: project section nav, or the brand line on every other page. */}
      {hasSections ? (
        <div className={styles.sectionNav}>
          {sections.map((sec, i) => (
            <span key={sec.id} className={styles.sectionItem}>
              <button
                className={`${styles.sectionLink}${activeSection === sec.id ? ` ${styles.sectionActive}` : ""}`}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.navLabel}
              </button>
              {i < sections.length - 1 && <span className={styles.sectionSep}>/</span>}
            </span>
          ))}
        </div>
      ) : (
        <div className={styles.brand}>Alice Zhao is a product designer.</div>
      )}

      <nav className={styles.center} aria-label="Primary">
        {CENTER_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className={l.hideMobile ? styles.hideMobile : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile-only: the section nav collapses to a dropdown, between the
          center nav and Contact. */}
      {hasSections && (
        <div className={styles.sectionDrop} ref={sectionDropRef}>
          <button
            className={styles.sectionDropTrigger}
            onClick={() => setSectionDropOpen((o) => !o)}
          >
            <span>{activeLabel}</span>
            <span className={`${styles.sectionDropArrow}${sectionDropOpen ? ` ${styles.sectionDropArrowOpen}` : ""}`}>▾</span>
          </button>
          {sectionDropOpen && (
            <div className={styles.sectionDropList}>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  className={`${styles.sectionDropItem}${activeSection === sec.id ? ` ${styles.sectionDropItemActive}` : ""}`}
                  onClick={() => { scrollToSection(sec.id); setSectionDropOpen(false); }}
                >
                  {sec.navLabel}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className={styles.links} aria-label="Social">
        <SocialLinks />
      </nav>

      {/* Mobile-only: the three social links collapse into a Contact disclosure. */}
      <details className={styles.contact}>
        <summary aria-label="Contact menu">Contact</summary>
        <div className={styles.contactMenu}>
          <SocialLinks />
        </div>
      </details>
    </header>
  );
}
