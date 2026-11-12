import { useState } from 'react';
const empty = { name: '', email: '', subject: '', message: '' };
export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErrors({}); setStatus({ type: '', text: '' });
    try {
      const res = await fetch('/api/contact', { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setStatus({ type: 'ok', text: data.message }); setForm(empty); }
      else if (data.errors) setErrors(data.errors);
      else setStatus({ type: 'err', text: data.error || 'Could not send message.' });
    } catch { setStatus({ type: 'err', text: 'Cannot reach the backend API. Start it with npm start in the server folder.' }); }
    setBusy(false);
  }
  const field = (k, label, Tag = 'input', extra = {}) => (
    <label>{label}<Tag value={form[k]} onChange={set(k)} {...extra} />
      {errors[k] && <small className="error">{errors[k]}</small>}</label>);
  return (<form className="form" onSubmit={submit} noValidate>
    {field('name', 'Name')}{field('email', 'Email', 'input', { type: 'email' })}
    {field('subject', 'Subject')}{field('message', 'Message', 'textarea', { rows: 5 })}
    <button className="btn" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</button>
    {status.text && <p className={status.type}>{status.text}</p>}
  </form>);
}
