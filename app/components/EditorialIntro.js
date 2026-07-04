import { intro } from "../data/about";
import DotGridBackground from "./DotGridBackground";
import s from "./editorial.module.css";

/* Homepage intro — one large paragraph: the lead in ink, the career history in
   muted ink. Sits on the shared 12-col grid (cols 1-7 on desktop). A dot-grid
   canvas fills the right half behind the text (desktop only). */
export default function EditorialIntro() {
  return (
    <section className={`${s.intro} ${s.grid12}`}>
      <DotGridBackground className={s.heroDots} />
      <p>
        {intro.lead}{" "}
        <span className={s.muted}>{intro.muted}</span>
      </p>
    </section>
  );
}
