const NO_BACKEND = 'Cannot reach the backend API. Start it with "npm start" in the server folder.';

async function request(url, options = {}) {
  let res;
  try { res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options }); }
  catch { throw new Error(NO_BACKEND); }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && data.error)
      || (data && data.errors ? 'Please fix the highlighted fields.' : res.status >= 500 ? NO_BACKEND : 'Request failed.');
    const err = new Error(message);
    err.fields = (data && data.errors) || {};
    throw err;
  }
  return data;
}
export const projectsApi = {
  list: () => request('/api/projects'),
  create: body => request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: id => request(`/api/projects/${id}`, { method: 'DELETE' }),
};
