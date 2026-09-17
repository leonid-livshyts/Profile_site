import './ProjectCard.css'

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      {project.image && (
        <img className="project-card__image" src={project.image.src} alt={project.image.alt} loading="lazy" />
      )}
      <div className="project-card__body">
        <h2 className="project-card__title">{project.title}</h2>
        <p>{project.summary}</p>
        {project.tags.length > 0 && (
          <ul className="chips" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {project.links.length > 0 && (
          <div className="project-card__links">
            {project.links.map((link) => (
              <a key={link.href} className="button" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
