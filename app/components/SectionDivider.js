import ShapesGrid from "./ShapesGrid";
import s from "./editorial.module.css";

/* SectionDivider — the decorative shapes strip that separates homepage sections
   (Selected work, Previous work, About, Connect). A 4-row lattice with the
   section label sitting on the left of the last row. Spans the content width so
   the label aligns with the page gutter. Reused at each section break. */
export default function SectionDivider({ label }) {
  return (
    <div className={s.grid12}>
      <ShapesGrid variant="decorative" label={label} className={s.divider} />
    </div>
  );
}
