"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WaveBackground from "./WaveBackground";
import styles from "./Navigation.module.css";

const BG_COLORS = [
  { value: "#DAF0F7", label: "Ice blue" },
  { value: "#F5D9E0", label: "Blush" },
  { value: "#F5EDCC", label: "Cream" },
  { value: "#D4F0D4", label: "Mint" },
  { value: "#ffffff", label: "White" },
  { value: "#110F0B", label: "Dark", dark: true },
];

export default function Navigation({ title, isHome, sections }) {
  const [bgColor, setBgColor] = useState("#ffffff");
  const bgInitialized = useRef(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionDropOpen, setSectionDropOpen] = useState(false);
  const navRef = useRef(null);
  const pickerRef = useRef(null);
  const sectionDropRef = useRef(null);

  useEffect(() => {
    if (!bgInitialized.current) {
      const saved = localStorage.getItem("bg-color");
      if (saved && saved !== "#ffffff") {
        setBgColor(saved);
        return;
      }
      bgInitialized.current = true;
    }
    const selected = BG_COLORS.find((c) => c.value === bgColor);
    const isDark = selected?.dark ?? false;
    document.body.toggleAttribute("data-dark", isDark);
    document.documentElement.style.setProperty("--bg", bgColor);
    if (!isDark) {
      document.documentElement.style.setProperty("--bg2", bgColor);
    }
    localStorage.setItem("bg-color", bgColor);
    bgInitialized.current = true;
  }, [bgColor]);

  useEffect(() => {
    const onNavVisibility = (e) => {
      if (!navRef.current) return;
      const p = e.detail.progress;
      navRef.current.style.transform = `translateY(${-p * 60}px)`;
    };
    const onToggleDrawer = () => setDrawerOpen((o) => !o);
    const onToggleMode = () => {
      setBgColor((prev) => {
        const current = BG_COLORS.find((c) => c.value === prev);
        return current?.dark ? "#ffffff" : "#110F0B";
      });
    };
    const onClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
      if (sectionDropRef.current && !sectionDropRef.current.contains(e.target)) {
        setSectionDropOpen(false);
      }
    };
    window.addEventListener("nav-visibility", onNavVisibility);
    window.addEventListener("toggle-drawer", onToggleDrawer);
    window.addEventListener("toggle-mode", onToggleMode);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("nav-visibility", onNavVisibility);
      window.removeEventListener("toggle-drawer", onToggleDrawer);
      window.removeEventListener("toggle-mode", onToggleMode);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const ids = sections.map((s) => s.id);
    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh * 0.4) current = id;
      }
      setActiveSection((prev) => {
        if (prev !== current) setSectionDropOpen(false);
        return current;
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const panel = el.closest(".project-section-handoff-panel") || el;
    const rect = panel.getBoundingClientRect();
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    window.scrollTo({ top: window.scrollY + rect.top - navHeight, behavior: "smooth" });
  }

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <div className={styles.fixedBtns}>
        <button
          className={`${styles.menuBtn}${drawerOpen ? ` ${styles.open}` : ""}`}
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Open menu"
          data-cursor="Sésame, ouvre-toi"
        >
          <span></span><span></span><span></span>
        </button>
        <div className={styles.colorPicker} ref={pickerRef}>
          <button
            className={styles.colorPickerBtn}
            onClick={() => setPickerOpen((o) => !o)}
            aria-label="Change background color"
            data-cursor=""
          >
            <span className={styles.colorSwatch} style={{ backgroundColor: bgColor }} />
          </button>
          {pickerOpen && (
            <div className={styles.colorDropdown}>
              {BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`${styles.colorOption}${bgColor === c.value ? ` ${styles.colorOptionActive}` : ""}`}
                  onClick={() => { setBgColor(c.value); setPickerOpen(false); }}
                  aria-label={c.label}
                  data-cursor=""
                >
                  <span className={styles.colorSwatch} style={{ backgroundColor: c.value }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav ref={navRef} className={styles.nav}>
        {isHome ? (
          <a href="#" className={styles.name} data-cursor="Go back to the awesome homepage">Alice Zhao</a>
        ) : (
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.name} data-cursor="Go back to the awesome homepage">Alice Zhao</Link>
            {title && (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.title}>{title}</span>
              </>
            )}
          </div>
        )}
        {sections && sections.length > 0 && (
          <>
            <div className={styles.sectionNav}>
              {sections.map((sec, i) => (
                <span key={sec.id}>
                  <button
                    className={`${styles.sectionLink}${activeSection === sec.id ? ` ${styles.sectionActive}` : ""}`}
                    onClick={() => scrollToSection(sec.id)}
                    data-cursor=""
                  >
                    {sec.navLabel}
                  </button>
                  {i < sections.length - 1 && <span className={styles.sectionSep}>/</span>}
                </span>
              ))}
            </div>
            <div className={styles.sectionDrop} ref={sectionDropRef}>
              <button
                className={styles.sectionDropTrigger}
                onClick={() => setSectionDropOpen((o) => !o)}
              >
                <span>{(sections.find((s) => s.id === activeSection) || sections[0]).navLabel}</span>
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
          </>
        )}
      </nav>

      <div className={`${styles.drawer}${drawerOpen ? ` ${styles.open}` : ""}`}>
        {drawerOpen && <WaveBackground className={styles.drawerWaves} />}
        <nav className={styles.links}>
          <Link href="/" onClick={closeDrawer}>Back to home</Link>
          <Link href="/projects/s3-tables" onClick={closeDrawer}>AWS S3 Tables</Link>
          <Link href="/projects/simplifying-data-access" onClick={closeDrawer}>Simplifying data access</Link>
          <Link href="/projects/agent-opportunities" onClick={closeDrawer}>AWS agentic experience</Link>
          <Link href="/about" onClick={closeDrawer}>About me</Link>
          <Link href="/about#design-process" onClick={closeDrawer}>My design process</Link>
          <Link href="/lab" onClick={closeDrawer}>My lab</Link>
        </nav>
        <div className={styles.bottom}>
          <a href="https://www.linkedin.com/in/liangzhaoux/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="mailto:liangzhao0801@gmail.com">Email ↗</a>
          <a href="https://drive.google.com/file/d/1mJRSpRVt-9k0j9rOz154nCsfPWPXsa4D/view" target="_blank" rel="noreferrer">Resume ↗</a>
        </div>
      </div>
    </>
  );
}
