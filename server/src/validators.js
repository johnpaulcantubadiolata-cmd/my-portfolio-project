const isUrl = v => /^https?:\/\/\S+$/i.test(v);
const isImage = v => isUrl(v) || /^\/\S+$/.test(v);

function parseId(raw) {
  const n = Number(raw);
  return /^\d+$/.test(String(raw)) && n > 0 && n <= 2147483647 ? n : null;
}

function validateProject(body = {}) {
  const errors = {};
  const str = k => (typeof body[k] === 'string' ? body[k].trim() : '');
  const data = {
    title: str('title'), description: str('description'), technologies: str('technologies'),
    image: str('image') || null, githubLink: str('githubLink') || null, liveDemo: str('liveDemo') || null,
  };
  for (const [k, max] of Object.entries({ title: 150, description: 2000, technologies: 255 })) {
    if (!data[k]) errors[k] = 'This field is required.';
    else if (data[k].length > max) errors[k] = `Maximum ${max} characters.`;
  }
  if (data.image && (data.image.length > 500 || !isImage(data.image)))
    errors.image = 'Use an http/https URL or a path starting with /.';
  for (const k of ['githubLink', 'liveDemo'])
    if (data[k] && (data[k].length > 500 || !isUrl(data[k]))) errors[k] = 'Enter a valid http/https URL.';
  return { errors, data };
}
module.exports = { parseId, validateProject };
