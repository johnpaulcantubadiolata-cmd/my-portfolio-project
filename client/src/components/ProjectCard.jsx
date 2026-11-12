export default function ProjectCard({ project }) {
  const demo = project.liveDemo || project.link;
  return (<article className="card project">
    {project.image ? <img src={project.image} alt={project.title} /> : <div className="img-ph">Project image</div>}
    <div className="card-body"><h3>{project.title}</h3><p>{project.description}</p>
      <div className="tags">{(project.tech || []).map(t => <span key={t}>{t}</span>)}</div>
      <div className="links">
        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub</a>}
        {demo && <a href={demo} target="_blank" rel="noreferrer">Live demo</a>}
      </div>
    </div></article>);
}
