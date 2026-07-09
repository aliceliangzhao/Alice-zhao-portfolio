import { previousWork } from "../data/about";
import s from "./editorial.module.css";

/* Previous work — earlier roles as big text-link rows: company meta on the left,
   a stack of project links (each with a → and a full-width hairline) on the
   right. Data-driven from about.js `previousWork`; grows by adding entries. */
function ProjectLink({ project }) {
  const external = project.href.startsWith("http");
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={s.prevLink} href={project.href} {...props}>
      {project.title}
      <span className={s.prevArrow} aria-hidden="true">&rarr;</span>
    </a>
  );
}

export default function PreviousWork() {
  if (!previousWork.length) return null;
  return (
    <section id="previous-work" className={s.work}>
      {previousWork.map((company) => (
        <article key={company.company} className={`${s.workRow} ${s.grid12}`}>
          <div className={s.workMeta}>
            <h3>{company.company}</h3>
            <span className={s.year}>{company.time}</span>
          </div>
          <div className={s.prevProjects}>
            {company.projects.map((project) => (
              <ProjectLink key={project.title} project={project} />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
