import { intro } from "../data/about";
import ShapesGrid from "./ShapesGrid";
import s from "./editorial.module.css";

/* Homepage hero — the intro paragraph (lead in ink, career history in muted ink)
   over a full-viewport shapes-grid canvas. The section is the grid root; the copy
   is punched out of the lattice line-by-line via data-grid-exclude="lines". The
   hero is a touch under 100svh so the Selected work divider peeks at the bottom
   as a scroll cue. */
export default function EditorialIntro() {
  return (
    <section className={`${s.intro} ${s.grid12}`} data-grid-root>
      <ShapesGrid variant="fullscreen" className={s.heroGrid} />
      <p data-grid-exclude="lines">
        {intro.lead}{" "}
        <span className={s.muted}>{intro.muted}</span>
      </p>
      {/* Part of the hero grid, pinned to the bottom of the viewport: the
          Selected work label doubles as the scroll cue and the section heading. */}
      <a className={s.heroWorkLabel} href="#work" data-grid-exclude>
        Selected work
        <span className={s.heroWorkArrow} aria-hidden="true">&darr;</span>
      </a>
    </section>
  );
}
