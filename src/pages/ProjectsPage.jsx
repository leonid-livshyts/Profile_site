import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'
import './CardGridPage.css'

function ProjectsPage() {
  return (
    <div className="container">
      <title>Projects · Leonid Livshyts</title>
      <h1>Projects</h1>
      <p className="card-page__lead">Things I have built at school and on my own, from robots to websites.</p>
      <ul className="card-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectsPage
