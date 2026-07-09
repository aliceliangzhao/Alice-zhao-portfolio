import { connectLinks } from "../data/about";
import s from "./editorial.module.css";

/* Connect — the homepage's closing contact section: a "Let's get in touch!"
   heading on the left and a 2-up grid of contact links (label + value) on the
   right. Data-driven from about.js `connectLinks`. */
export default function Connect() {
  return (
    <section id="connect" className={`${s.connect} ${s.grid12}`}>
      <h2 className={s.connectHeading}>Let&apos;s get in touch!</h2>
      <div className={s.connectLinks}>
        {connectLinks.map((link) => {
          const external = link.href.startsWith("http");
          const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <a key={link.label} className={s.connectItem} href={link.href} {...props}>
              <span className={s.connectLabel}>
                {link.label}
                <span className={s.connectArrow} aria-hidden="true">&#8599;</span>
              </span>
              <span className={s.connectValue}>{link.value}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
