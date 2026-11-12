import { profile as p } from './data/profile.js';
import useProjects from './hooks/useProjects.js';
import Navbar from './components/Navbar.jsx';
import Section from './components/Section.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import ProjectManager from './components/ProjectManager.jsx';
import ContactForm from './components/ContactForm.jsx';

const toCard = d => ({ id: d.id, title: d.title, description: d.description, image: d.image || '',
  tech: d.technologies.split(',').map(t => t.trim()).filter(Boolean), githubLink: d.githubLink || '', liveDemo: d.liveDemo || '' });

export default function App() {
  const { projects, loading, error, reload } = useProjects();
  return (<>
    <Navbar name={p.name} />
    <section id="home" className="hero"><div className="container hero-inner">
      <div><p className="eyebrow">Hello, I'm</p><h1>{p.name}</h1><h2 className="headline">{p.headline}</h2>
        <p>{p.intro}</p><a className="btn" href="#contact">Contact me</a></div>
      {p.photo ? <img className="photo" src={p.photo} alt={p.name} /> : <div className="photo ph">[Your Profile Photo]</div>}
    </div></section>
    <Section id="about" title="About Me"><p>{p.about}</p></Section>
    <Section id="skills" title="Skills"><p className="note">{p.skillsNote}</p><div className="grid2">
      <div><h3>Technical</h3><div className="tags">{p.technicalSkills.map(s => <span key={s}>{s}</span>)}</div></div>
      <div><h3>Soft skills</h3><div className="tags">{p.softSkills.map(s => <span key={s}>{s}</span>)}</div></div></div></Section>
    <Section id="projects" title="Projects">
      {loading && <p className="note">Loading projects from the database...</p>}
      {!loading && error && <p className="err">{error}</p>}
      {!loading && !error && projects.length === 0 && <p className="note">No projects saved yet. Add one in the Manage Projects section below.</p>}
      {!loading && !error && projects.length > 0 &&
        <div className="grid3">{projects.map(d => <ProjectCard key={d.id} project={toCard(d)} />)}</div>}
    </Section>
    <Section id="education" title="Education">{p.education.map(e => (
      <div className="card" key={e.school + e.years}><div className="card-body"><h3>{e.school}</h3>
        {e.program && <p><strong>{e.program}</strong></p>}<p>{e.years}</p>{e.details && <p>{e.details}</p>}</div></div>))}</Section>
    <Section id="achievements" title="Achievements & Certificates"><div className="grid3">
      {p.achievements.map(a => <div className="card cert" key={a.title}>
        {a.image && <a href={a.image} target="_blank" rel="noreferrer"><img src={a.image} alt={a.title} /></a>}
        <div className="card-body"><h3>{a.title}</h3><p>{a.issuer}</p><p>{a.year}</p></div></div>)}</div></Section>
    <Section id="resume" title="Resume / CV"><p>View or download my résumé.</p>
      <a className="btn" href={p.resumeUrl} target="_blank" rel="noreferrer">View</a>{' '}
      <a className="btn alt" href={p.resumeUrl} download>Download</a></Section>
    <Section id="contact" title="Contact"><p>{p.contactEmail}</p><ContactForm /></Section>
    <Section id="manage" title="Manage Projects">
      <ProjectManager projects={projects} loading={loading} error={error} reload={reload} />
    </Section>
    <footer><p>© {new Date().getFullYear()} {p.name}</p></footer>
  </>);
}
