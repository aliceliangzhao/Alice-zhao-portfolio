import { bio } from "../data/about";
import InlineHeroText from "./InlineHeroText";
import s from "./editorial.module.css";

/* About — a bracketed label beside a large two-tone statement (ink lead +
   muted personal line). Copy comes from about.js (bio). */
export default function EditorialAbout() {
  return (
    <section className={`${s.about} ${s.grid12} ${s.sectionFlush}`}>
      <p className={s.aboutText}>
        <InlineHeroText text={bio.heading} /> <span className={s.muted}>{bio.personal}</span>
      </p>
    </section>
  );
}
