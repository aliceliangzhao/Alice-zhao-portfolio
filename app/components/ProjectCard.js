import Link from "next/link";
import styles from "./ProjectCard.module.css";

/* Project card: a light-grey rounded card with a 16:9 thumbnail (cropped from
   the top-left) on top, then a meta line (role @ company | year | tags), the
   title, and the impact statement. Fixed-width in the grid; height grows with
   the text. No hover. */
export default function ProjectCard({ slug, image, role, company, year, tags = [], title, statement }) {
  const meta = [
    company ? `${role} @ ${company}` : role,
    year,
    tags.length ? tags.join(", ") : null,
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <Link href={`/projects/${slug}`} className={styles.card}>
      <div className={styles.thumb}>
        <img className={styles.image} src={image} alt="" loading="lazy" />
      </div>
      <p className={styles.meta}>{meta}</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.statement}>{statement}</p>
    </Link>
  );
}
