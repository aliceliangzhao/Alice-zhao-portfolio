import Image from "next/image";
import Link from "next/link";
import { workExperience } from "../data/about";
import { projects } from "../data/projects";
import s from "./editorial.module.css";

/* ↗ external-link glyph */
function ExtIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4h6v6M11.5 4.5 4 12" />
    </svg>
  );
}

/* Split a company's selected work into case-study cards (links into our own
   /projects/* pages, enriched from projects.js) and external note-cards
   (public launches/articles that live off-site). Keeps content single-sourced:
   titles/thumbs come from projects.js, never re-typed here. */
function resolveWork(items) {
  const caseStudies = [];
  const notes = [];
  for (const item of items) {
    const slug = item.href.startsWith("/projects/")
      ? item.href.slice("/projects/".length)
      : null;
    const project = slug ? projects[slug] : null;
    if (project) {
      caseStudies.push({
        href: item.href,
        title: project.navTitle,
        subtitle:
          typeof project.impact === "object" ? project.impact.card : project.impact,
        thumb: project.heroImage,
      });
    } else {
      notes.push({
        title: item.name,
        href: item.href,
        external: item.href.startsWith("http"),
      });
    }
  }
  return { caseStudies, notes };
}

function CaseStudyCard({ card, featured }) {
  return (
    <Link className={`${s.workCard}${featured ? ` ${s.feature}` : ""}`} href={card.href}>
      <span className={s.thumb}>
        <Image
          src={card.thumb}
          alt=""
          fill
          sizes={featured ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 50vw, 33vw"}
          priority={featured}
        />
      </span>
      <h4 className={s.cardTitle}>{card.title}</h4>
      <p className={s.cardSub}>{card.subtitle}</p>
    </Link>
  );
}

function NoteCard({ note, role }) {
  const linkProps = note.external
    ? { href: note.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: note.href };
  return (
    <a className={s.noteCard} {...linkProps}>
      <span className={s.noteThumb} aria-hidden="true" />
      <span className={s.noteBody}>
        <span className={s.noteTitle}>{note.title}</span>
        <span className={s.noteMeta}>
          <span className={s.noteRole}>{role}</span>
          {note.external && (
            <>
              <ExtIcon className={`${s.ext} ${s.noteExt}`} />
              <span className={s.vh}>(opens in a new tab)</span>
            </>
          )}
        </span>
      </span>
    </a>
  );
}

function WorkRow({ job }) {
  const { caseStudies, notes } = resolveWork(job.selectedWork);
  return (
    <article className={`${s.workRow} ${s.grid12}`}>
      <div className={s.workMeta}>
        <h3>{job.company}</h3>
        <span className={s.year}>{job.time}</span>
        <p>{job.description}</p>
      </div>

      {caseStudies.length > 0 && (
        <div className={s.workProjects}>
          {caseStudies.map((card, i) => (
            <CaseStudyCard key={card.href} card={card} featured={i === 0} />
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className={`${s.workNotes}${caseStudies.length === 0 ? ` ${s.flush}` : ""}`}>
          {notes.map((note) => (
            <NoteCard key={note.title} note={note} role={job.title} />
          ))}
        </div>
      )}
    </article>
  );
}

/* Selected work — one row per company, drawn from workExperience. */
export default function SelectedWork() {
  return (
    <section id="work" className={s.work}>
      <div className={s.grid12}>
        <p className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Selected work &darr;</span>
          <span className={s.sectionRule} aria-hidden="true" />
        </p>
      </div>
      {workExperience.map((job) => (
        <WorkRow key={job.company} job={job} />
      ))}
    </section>
  );
}
