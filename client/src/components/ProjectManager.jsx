import { useState } from 'react';
import { projectsApi } from '../api.js';

const empty = { title: '', description: '', technologies: '', image: '', githubLink: '', liveDemo: '' };

export default function ProjectManager({ projects, loading, error, reload }) {
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const fail = e => {
    setFieldErrors(e.fields || {});
    setStatus({ type: 'err', text: e.message });
  };
  const reset = () => { setForm(empty); setEditingId(null); setFieldErrors({}); };

  function startEdit(p) {
    setEditingId(p.id); setFieldErrors({}); setStatus({ type: '', text: '' });
    setForm({ title: p.title, description: p.description, technologies: p.technologies,
      image: p.image || '', githubLink: p.githubLink || '', liveDemo: p.liveDemo || '' });
    document.getElementById('manage')?.scrollIntoView({ behavior: 'smooth' });
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setFieldErrors({}); setStatus({ type: '', text: '' });
    try {
      if (editingId) await projectsApi.update(editingId, form); else await projectsApi.create(form);
      setStatus({ type: 'ok', text: editingId ? 'Project updated.' : 'Project added.' });
      reset(); await reload();
    } catch (err) { fail(err); }
    setBusy(false);
  }
  async function remove(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await projectsApi.remove(p.id);
      setStatus({ type: 'ok', text: 'Project deleted.' });
      if (editingId === p.id) reset();
      await reload();
    } catch (err) { fail(err); }
  }
  const field = (k, label, Tag = 'input', extra = {}) => (
    <label>{label}<Tag value={form[k]} onChange={set(k)} {...extra} />
      {fieldErrors[k] && <small className="error">{fieldErrors[k]}</small>}</label>);

  return (<>
    <p className="note">This section demonstrates database integration and CRUD (Create, Read, Update, Delete) using Prisma ORM with MySQL. Each action calls the Express API (/api/projects), where Prisma Client reads or writes the projects table. Nothing is stored in the browser. Local classroom demo, no login.</p>
    <p className={error ? 'err' : 'ok'}>{loading ? 'Checking database...' : error ? `Database error: ${error}` : 'Database connected: projects are loaded from MySQL through Prisma.'}</p>
    <form className="form" onSubmit={submit} noValidate>
      <h3>{editingId ? 'Edit project' : 'Add project'}</h3>
      {field('title', 'Project title')}
      {field('description', 'Description', 'textarea', { rows: 4 })}
      {field('technologies', 'Technologies used (comma-separated)')}
      {field('image', 'Image path or URL (e.g. /projects/my-app.png)')}
      {field('githubLink', 'GitHub link')}
      {field('liveDemo', 'Live demo link')}
      <div className="actions">
        <button className="btn" disabled={busy}>{busy ? 'Saving...' : editingId ? 'Save changes' : 'Add project'}</button>
        {editingId && <button type="button" className="btn alt" onClick={reset}>Cancel</button>}
      </div>
      {status.text && <p className={status.type}>{status.text}</p>}
    </form>
    <div className="manage-list">
      <h3>Saved projects</h3>
      {loading && <p>Loading projects...</p>}
            {!loading && !error && projects.length === 0 && <p>No saved projects yet. Add one above.</p>}
      {!loading && projects.map(p => (
        <div className="card item" key={p.id}>
          <div><h3>{p.title}</h3><p>{p.technologies}</p></div>
          <div className="actions">
            <button className="btn alt sm" onClick={() => startEdit(p)}>Edit</button>
            <button className="btn danger sm" onClick={() => remove(p)}>Delete</button>
          </div>
        </div>))}
    </div>
  </>);
}
