"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

/* Primary site nav (simple-editorial style). Used by project, about, and lab
   pages (the homepage has its own header until it's rebuilt).

   Desktop layout, left to right:  brand · phase labels · menu
     - brand        the standing positioning line, links home
     - phase labels  the project's sections (01/02/03) with scroll-spy. Only
                     rendered when `sections` is passed (project pages).
     - menu          Home / Work / About / Contact (Contact is a dropdown of
                     external links)

   Mobile (<=640px): the brand and desktop menu give way to two controls in a
   sticky bar that hides on scroll-down and resurfaces over a glass blur on
   scroll-up:
     - left   a section jumper (dropdown) when `sections` exist, else the short
              brand
     - right  a Menu disclosure holding the nav + contact links

   `title` is still accepted for backwards-compatible call sites but no longer
   rendered (the page title now lives in the page's own <h1>, not the header). */

const NAV_LINKS = [
  // These homepage anchors get real targets when the homepage sections are
  // rebuilt; Connect lands at the top until its section ships (dev-time dead
  // anchor — flag before deploy).
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Connect", href: "/#connect" },
];

const CONTACT_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/liangzhaoux/", external: true },
  { label: "Resume", href: "https://drive.google.com/file/d/1mJRSpRVt-9k0j9rOz154nCsfPWPXsa4D/view", external: true },
  { label: "Email", href: "mailto:liangzhao0801@gmail.com", external: false },
];

// the small diagonal ↗ drawn next to external contact links
function ExtIcon() {
  return (
    <svg className={styles.ext} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4h6v6M11.5 4.5 4 12" />
    </svg>
  );
}

// stroked chevron next to Contact; shares the ↗ icon's round-cap language and
// flips 180° (down -> up) when the dropdown opens
function Caret() {
  return (
    <svg className={styles.caret} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6.5 8 10l4-3.5" />
    </svg>
  );
}

export default function Navigation({ sections }) {
  const hasSections = Array.isArray(sections) && sections.length > 0;

  const [activeSection, setActiveSection] = useState(null);
  const [sectionDropOpen, setSectionDropOpen] = useState(false); // mobile section jumper
  const [menuOpen, setMenuOpen] = useState(false);         // mobile Menu

  const headerRef = useRef(null);
  const sectionDropRef = useRef(null);
  const menuRef = useRef(null);
  // measured to decide the desktop-inline vs compact-dropdown layout
  const brandRef = useRef(null);
  const sectionNavRef = useRef(null);
  const desktopMenuRef = useRef(null);

  // --- scroll-spy: highlight the section currently in view -----------------
  useEffect(() => {
    if (!hasSections) return;
    const ids = sections.map((s) => s.id);
    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= vh * 0.4) current = id;
      }
      setActiveSection(current);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSections, sections]);

  // --- overflow-aware layout: collapse to dropdowns when the inline trio
  //     (brand · phase labels · menu) can't fit on one line. Adapts to the
  //     actual label text instead of a fixed pixel breakpoint. ---------------
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let raf = 0;

    function measure() {
      const cs = getComputedStyle(header);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const gap = parseFloat(cs.columnGap) || 0;
      // Measure against the viewport, not header.clientWidth: when the inline
      // nav overflows it widens the page, which stretches the sticky header
      // past the viewport. Reading the header's own width would then report
      // that inflated space and never collapse (a self-reinforcing loop).
      // documentElement.clientWidth is the layout viewport, immune to overflow.
      const vw = document.documentElement.clientWidth;
      const available = vw - padL - padR;

      // scrollWidth reports each region's full width even while it's hidden
      // (the .compact rules keep the inline trio measurable), so the decision
      // is the same whether we're currently inline or compact — no flip-flop.
      const brandW = brandRef.current ? brandRef.current.scrollWidth : 0;
      const sectionW = sectionNavRef.current ? sectionNavRef.current.scrollWidth : 0;
      const menuW = desktopMenuRef.current ? desktopMenuRef.current.scrollWidth : 0;
      const regions = (brandW ? 1 : 0) + (sectionW ? 1 : 0) + (menuW ? 1 : 0);
      const needed = brandW + sectionW + menuW + Math.max(0, regions - 1) * gap;

      // Collapse to the dropdown bar when the inline row would overflow (a bit
      // before it touches, 24px) OR at mobile widths (<=640px), so the compact
      // bar always agrees with the mobile CSS breakpoint. Same rule everywhere,
      // so behaviour is identical on every page that uses this component.
      header.classList.toggle("compact", needed > available - 24 || vw <= 640);
    }

    function onResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("resize", onResize, { passive: true });
    // re-measure once the web font swaps in (it changes text widths)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [hasSections]);

  // --- auto-hide bar: hide on scroll-down, slide back in on scroll-up -------
  // Runs at all widths. On mobile the resurfaced state also picks up the glass
  // blur (is-glass); on desktop the bar is glass at all times, so is-glass is a
  // no-op there (its rule is scoped to the mobile media query).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY, ticking = false;
    const STEP = 8; // ignore sub-pixel jitter
    const anyOpen = () => sectionDropOpen || menuOpen;

    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY;
      if (y < 4) {
        header.classList.remove("is-hidden", "is-glass"); // at top: shown
      } else if (anyOpen()) {
        header.classList.remove("is-hidden");             // never hide while a panel is open
      } else if (goingDown && y - lastY > STEP) {
        header.classList.add("is-hidden");
        header.classList.remove("is-glass");
      } else if (!goingDown && lastY - y > STEP) {
        header.classList.remove("is-hidden");
        header.classList.add("is-glass");                 // resurfaced over content -> glass
      }
      lastY = y;
      ticking = false;
    }
    function onScrollRaf() {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }
    window.addEventListener("scroll", onScrollRaf, { passive: true });
    return () => window.removeEventListener("scroll", onScrollRaf);
  }, [sectionDropOpen, menuOpen]);

  // a panel being open keeps the bar solid (glass is only for the collapsed,
  // resurfaced state)
  useEffect(() => {
    headerRef.current?.classList.toggle("has-open", sectionDropOpen || menuOpen);
  }, [sectionDropOpen, menuOpen]);

  // --- close dropdowns on outside-click / Escape ---------------------------
  useEffect(() => {
    function onDown(e) {
      if (sectionDropRef.current && !sectionDropRef.current.contains(e.target)) setSectionDropOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") { setSectionDropOpen(false); setMenuOpen(false); }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = headerRef.current ? headerRef.current.offsetHeight : 0;
    const top = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const currentSection = sections?.find((s) => s.id === activeSection) || sections?.[0];

  function renderContactLink(c) {
    return (
      <a
        key={c.label}
        href={c.href}
        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {c.label}
        <ExtIcon />
      </a>
    );
  }

  return (
    <header ref={headerRef} className={styles.header} data-grid-exclude-fixed>
      {/* brand — desktop, and mobile when there are no sections */}
      <Link ref={brandRef} href="/" className={styles.brand}>Alice Zhao is a UX lead @ AWS.</Link>

      {/* desktop phase labels */}
      {hasSections && (
        <div ref={sectionNavRef} className={styles.sectionNav} aria-label="Sections">
          {sections.map((sec, i) => (
            <span key={sec.id} className={styles.sectionItem}>
              <button
                className={`${styles.sectionLink}${activeSection === sec.id ? ` ${styles.sectionActive}` : ""}`}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.navLabel}
              </button>
              {i < sections.length - 1 && <span className={styles.sectionSep} aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      )}

      {/* desktop menu */}
      <nav ref={desktopMenuRef} className={styles.menu} aria-label="Primary">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} href={l.href}>{l.label}</Link>
        ))}
      </nav>

      {/* mobile: section jumper (only when sections exist) */}
      {hasSections && (
        <div className={styles.mSections} ref={sectionDropRef}>
          <button
            className={`${styles.mSectionsToggle}${sectionDropOpen ? ` ${styles.mSectionsOpen}` : ""}`}
            onClick={() => setSectionDropOpen((o) => !o)}
            aria-expanded={sectionDropOpen}
          >
            <span className={styles.mSectionsCurrent}>{currentSection?.navLabel}</span>
            <Caret />
          </button>
          {sectionDropOpen && (
            <div className={styles.mSectionsMenu}>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  className={`${styles.mItem}${activeSection === sec.id ? ` ${styles.mItemCurrent}` : ""}`}
                  onClick={() => { scrollToSection(sec.id); setSectionDropOpen(false); }}
                >
                  <span className={styles.mDot} aria-hidden="true" />
                  {sec.navLabel}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* short brand — shown on tablet always; on mobile only when there are no
          sections (project pages drop the brand on mobile, keeping just the
          section jumper + Menu) */}
      <Link
        href="/"
        className={`${styles.mBrand}${hasSections ? ` ${styles.mBrandProject}` : ""}`}
      >
        Alice Zhao
      </Link>

      {/* mobile Menu */}
      <div className={styles.mMenu} ref={menuRef}>
        <button
          className={styles.mMenuToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        {menuOpen && (
          <div className={styles.mMenuPanel}>
            <div className={styles.mMenuNav}>
              {NAV_LINKS.map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
              ))}
            </div>
            <div className={styles.mMenuContact}>
              {CONTACT_LINKS.map(renderContactLink)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
