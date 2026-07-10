import ShapesGrid from "./ShapesGrid";
import s from "./editorial.module.css";

/* SectionDivider — the decorative shapes strip that separates homepage sections
   (Selected work, Previous work, About, Connect). A 4-row lattice with the
   section label sitting on the left of the last row. Spans the content width so
   the label aligns with the page gutter. Reused at each section break.

   `symmetric` gives equal top/bottom spacing (project pages, where the divider
   sits centered between two sections); the default is the homepage's asymmetric
   spacing (a large gap above, a small gap into the section it introduces). */
export default function SectionDivider({ label, symmetric = false }) {
  const wrap = symmetric ? `${s.dividerWrap} ${s.dividerWrapSymmetric}` : s.dividerWrap;
  return (
    <div className={`${s.grid12} ${wrap}`}>
      <ShapesGrid variant="decorative" label={label} className={s.divider} />
    </div>
  );
}
