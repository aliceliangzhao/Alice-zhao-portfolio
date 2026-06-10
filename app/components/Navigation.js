"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

const CENTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Lab", href: "/lab" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/liangzhaoux/", external: true },
  { label: "Resume", href: "https://drive.google.com/file/d/1mJRSpRVt-9k0j9rOz154nCsfPWPXsa4D/view", external: true },
  { label: "Email", href: "mailto:liangzhao0801@gmail.com" },
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

export default function Navigation({ title, sections }) {
  const pathname = usePathname();
  const hasSections = sections && sections.length > 0;

  const [activeSection, setActiveSection] = useState(null);
  const [sectionOpen, setSectionOpen] = useState(false); // mobile project panel
  const [menuOpen, setMenuOpen] = useState(false);       // mobile menu panel
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);

  const navName = CENTER_LINKS.find((l) => l.href === pathname)?.label;
  const pageName = navName || title || "";
  // Which center link is "active" in the Menu panel: projects live under Work.
  const activeNav = hasSections ? "Work" : navName || null;
  const anyOpen = sectionOpen || menuOpen;

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
      setActiveSection(current);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSections, sections]);

  // Resurfacing header: solid at top, hide on scroll-down, reappear on scroll-up.
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

  // Lock body scroll while the full-viewport menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close both panels when resizing up to desktop.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 900) { setSectionOpen(false); setMenuOpen(false); }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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

  const toggleSection = () => { setMenuOpen(false); setSectionOpen((o) => !o); };
  const toggleMenu = () => { setSectionOpen(false); setMenuOpen((o) => !o); };

  const activeLabel = hasSections
    ? (sections.find((s) => s.id === activeSection) || sections[0]).navLabel
    : null;

  const navClass = `${styles.nav}${hidden && !anyOpen ? ` ${styles.hidden}` : ""}${floating ? ` ${styles.floating}` : ""}`;

  return (
    <>
      <header className={navClass}>
        {/* DESKTOP left: section nav (project pages) or brand line. */}
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
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <nav className={styles.links} aria-label="Social">
          <SocialLinks />
        </nav>

        {/* MOBILE bar: left = project-nav trigger or page name; right = Menu. */}
        <div className={styles.mobileLeft}>
          {hasSections ? (
            <button className={styles.mTrigger} onClick={toggleSection}>
              <span>{activeLabel}</span>
              <span className={`${styles.caret}${sectionOpen ? ` ${styles.caretOpen}` : ""}`}>▾</span>
            </button>
          ) : (
            <span className={styles.mPageName}>{pageName}</span>
          )}
        </div>
        <button className={styles.menuTrigger} onClick={toggleMenu}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* MOBILE project panel — slides down from behind the header. */}
      {hasSections && (
        <div
          className={`${styles.sectionPanel}${sectionOpen ? ` ${styles.open}` : ""}`}
          inert={!sectionOpen}
        >
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`${styles.panelItem}${activeSection === sec.id ? ` ${styles.panelItemActive}` : ""}`}
              onClick={() => { scrollToSection(sec.id); setSectionOpen(false); }}
            >
              {sec.navLabel}
            </button>
          ))}
        </div>
      )}

      {/* MOBILE menu panel — slides down, full viewport. */}
      <div
        className={`${styles.menuPanel}${menuOpen ? ` ${styles.open}` : ""}`}
        inert={!menuOpen}
      >
        <nav className={styles.menuNav} aria-label="Primary">
            {CENTER_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`${styles.menuItem}${activeNav === l.label ? ` ${styles.menuItemActive}` : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={styles.menuContacts}>
            {SOCIAL_LINKS.map((l) =>
              l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>
              ) : (
                <a key={l.label} href={l.href}>{l.label} →</a>
              )
            )}
          </div>
        </div>
    </>
  );
}
