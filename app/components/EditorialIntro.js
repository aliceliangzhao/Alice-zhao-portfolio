import { intro } from "../data/about";
import s from "./editorial.module.css";

/* Homepage intro — one large paragraph: the lead in ink, the career history in
   muted ink. Sits on the shared 12-col grid (cols 1-7 on desktop). */
export default function EditorialIntro() {
  return (
    <section className={`${s.intro} ${s.grid12}`}>
      <p>
        {intro.lead}{" "}
        <span className={s.muted}>{intro.muted}</span>
      </p>
    </section>
  );
}
