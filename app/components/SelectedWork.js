import Image from "next/image";
import Link from "next/link";
import { currentWork } from "../data/about";
import { projects, projectOrder } from "../data/projects";
import s from "./editorial.module.css";

/* Shape a project record into the card data used by CaseStudyCard. Single
   source for both the homepage cards and the project-page "more work" variant;
   titles/thumbs/tags come from projects.js, never re-typed here. */
function projectToCard(project, href) {
  return {
    href,
    title: project.navTitle,
    subtitle:
      typeof project.impact === "object" ? project.impact.card : project.impact,
    thumb: project.heroImage,
    tags: project.tags || [],
  };
}

function CaseStudyCard({ card, featured }) {
  return (
    <Link className={`${s.workCard}${featured ? ` ${s.feature}` : ""}`} href={card.href}>
      <span className={s.thumb}>
        <Image
          src={card.thumb}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 66vw"
          priority={featured}
        />
      </span>
      <div className={s.cardBody}>
        <h4 className={s.cardTitle}>
          {card.title}
          <span className={s.cardArrow} aria-hidden="true">↗</span>
        </h4>
        <p className={s.cardSub}>{card.subtitle}</p>
        {card.tags.length > 0 && (
          <p className={s.tags}>
            {card.tags.map((tag) => (
              <span key={tag} className={s.tag}>{tag}</span>
            ))}
          </p>
        )}
      </div>
    </Link>
  );
}

/* Project-page variant: a stripped, full-width row of project cards (the other
   case studies), under the same "Selected work" label. */
function MoreWork({ slugs }) {
  const cards = slugs
    .map((slug) => {
      const project = projects[slug];
      return project ? projectToCard(project, `/projects/${slug}`) : null;
    })
    .filter(Boolean);
  if (cards.length === 0) return null;

  return (
    <section className={s.work}>
      <div className={s.grid12}>
        <p className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Selected work</span>
          <span className={s.sectionRule} aria-hidden="true" />
        </p>
        <div className={s.workProjectsFull}>
          {cards.map((card) => (
            <CaseStudyCard key={card.href} card={card} featured={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Selected work. Default (homepage): the current-role meta beside a single
   column of case-study cards (from projectOrder). With `projectSlugs`: the
   project-page variant — full-width project cards under a "Selected work" label. */
export default function SelectedWork({ projectSlugs }) {
  if (projectSlugs) return <MoreWork slugs={projectSlugs} />;

  const cards = projectOrder
    .map((slug) => (projects[slug] ? projectToCard(projects[slug], `/projects/${slug}`) : null))
    .filter(Boolean);

  return (
    <section id="work" className={`${s.work} ${s.workHome}`}>
      <article className={`${s.workRow} ${s.grid12}`}>
        <div className={s.workMeta}>
          <h3>{currentWork.company}</h3>
          <span className={s.year}>{currentWork.time}</span>
          <p>{currentWork.description}</p>
        </div>
        <div className={s.workProjectsSingle}>
          {cards.map((card) => (
            <CaseStudyCard key={card.href} card={card} featured={false} />
          ))}
        </div>
      </article>
    </section>
  );
}
