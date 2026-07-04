"use client";

import { useEffect, useRef, useState } from "react";

/* SectionTabs — the per-section content explorer on the project detail page.
   Each subsection (label + text + images) is one view.

   Desktop: a WAI-ARIA tab group — a tab bar with a sliding underline, one panel
   shown at a time, full keyboard support.
   Mobile (<=640px): the tab bar is hidden and every panel is shown stacked down
   the page, each headed by its label — so the whole section reads as a list.
   (Both presentations share one DOM; CSS switches between them.)

   A section with a single subsection skips the tab bar entirely. */

function Panel({ sectionId, index, sub, hidden }) {
  return (
    <div
      id={`${sectionId}-panel-${index}`}
      className="pd-panel"
      role="tabpanel"
      aria-labelledby={`${sectionId}-tab-${index}`}
      hidden={hidden}
      data-active={hidden ? undefined : "true"}
      tabIndex={0}
    >
      <div className="pd-panel-caption">
        <h3 className="pd-panel-label">{sub.label}</h3>
        {sub.text && <p className="pd-panel-text">{sub.text}</p>}
      </div>
      <div className="pd-panel-media">
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
  );
}

export default function SectionTabs({ sectionId, subsections }) {
  const [active, setActive] = useState(0);
  const tablistRef = useRef(null);
  const underlineRef = useRef(null);
  const tabRefs = useRef([]);
  const activeRef = useRef(0);
  activeRef.current = active;

  // Position the sliding underline under the active tab. `animate` is false for
  // the initial placement, resize, font load, and tablist scroll (snap, don't
  // slide); true when the user picks a tab (glide).
  function place(animate) {
    const tablist = tablistRef.current;
    const underline = underlineRef.current;
    const tab = tabRefs.current[activeRef.current];
    if (!tablist || !underline || !tab) return;
    if (tablist.offsetParent === null) return; // tab bar hidden (mobile): nothing to do
    if (!animate) underline.style.transition = "none";
    underline.style.transform = `translateX(${tab.offsetLeft}px)`;
    underline.style.width = `${tab.offsetWidth}px`;
    if (!animate) {
      void underline.offsetWidth; // flush so the snap doesn't animate
      underline.style.transition = "";
    }
  }

  // Initial placement + keep the underline aligned on resize, font load, and
  // horizontal tab scroll. Mount-once.
  useEffect(() => {
    place(false);
    const snap = () => place(false);
    window.addEventListener("resize", snap);
    const tablist = tablistRef.current;
    tablist?.addEventListener("scroll", snap, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(snap).catch(() => {});
    return () => {
      window.removeEventListener("resize", snap);
      tablist?.removeEventListener("scroll", snap);
    };
  }, []);

  // Glide the underline whenever the user changes tabs (skip the mount run).
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) place(true);
    mounted.current = true;
  }, [active]);

  function onKeyDown(e) {
    const n = subsections.length;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  // Single subsection: no tab bar, just the one panel (label shown).
  if (subsections.length <= 1) {
    if (!subsections[0]) return null;
    return (
      <div className="pd-panels pd-panels--static">
        <Panel sectionId={sectionId} index={0} sub={subsections[0]} hidden={false} />
      </div>
    );
  }

  return (
    <div className="pd-tabwrap">
      <div className="pd-tabs" role="tablist" aria-label="Section views" ref={tablistRef}>
        {subsections.map((sub, i) => (
          <button
            key={i}
            id={`${sectionId}-tab-${i}`}
            ref={(el) => { tabRefs.current[i] = el; }}
            className={`pd-tab${active === i ? " pd-tab--active" : ""}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${sectionId}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
          >
            {sub.label}
          </button>
        ))}
        <span ref={underlineRef} className="pd-tab-underline" aria-hidden="true" />
      </div>

      <div className="pd-panels">
        {subsections.map((sub, i) => (
          <Panel key={i} sectionId={sectionId} index={i} sub={sub} hidden={active !== i} />
        ))}
      </div>
    </div>
  );
}
