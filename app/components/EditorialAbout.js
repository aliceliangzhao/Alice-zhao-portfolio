import { bio } from "../data/about";
import s from "./editorial.module.css";

/* About — a bracketed label beside a large two-tone statement (ink lead +
   muted personal line). Copy comes from about.js (bio). */
export default function EditorialAbout() {
  return (
    <section id="about" className={`${s.about} ${s.grid12} ${s.sectionFlush}`}>
      <p className={s.aboutLabel}>[ <i>about me</i> ]</p>
      <p className={s.aboutText}>
        {bio.heading} <span className={s.muted}>{bio.personal}</span>
      </p>
    </section>
  );
}
