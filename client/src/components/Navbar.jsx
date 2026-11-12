import { useState } from 'react';
const links = [['home','Home'],['about','About'],['skills','Skills'],['projects','Projects'],
  ['education','Education'],['achievements','Achievements'],['resume','Resume'],['contact','Contact'],['manage','Manage']];
export default function Navbar({ name }) {
  const [open, setOpen] = useState(false);
  return (<header className="nav"><div className="container nav-inner">
    <a href="#home" className="brand">{name}</a>
    <button className="burger" aria-label="Toggle menu" onClick={() => setOpen(!open)}>☰</button>
    <nav className={open ? 'open' : ''}>{links.map(([id, label]) =>
      <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>
  </div></header>);
}
