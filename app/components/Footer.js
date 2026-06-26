import styles from "./Footer.module.css";
import HalftoneName from "./HalftoneName";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.nameBand}>
        <HalftoneName text="Alice Zhao" className={styles.nameCanvas} />
      </div>
      <div className={styles.metaRow}>
        <p className={styles.copy}>© {year} Alice Zhao &amp; LLMs &amp; Figma</p>
        <nav className={styles.legal} aria-label="Footer">
          <a href="https://www.linkedin.com/in/liangzhaoux/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:liangzhao0801@gmail.com">Email</a>
          <a href="https://github.com/aliceliangzhao" target="_blank" rel="noreferrer">Github</a>
          <a href="https://codepen.io/liangzhao0801" target="_blank" rel="noreferrer">Codepen</a>
        </nav>
      </div>
    </footer>
  );
}
