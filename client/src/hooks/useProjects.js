import { useCallback, useEffect, useState } from 'react';
import { projectsApi } from '../api.js';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setLoading(true); setError('');
    try { setProjects(await projectsApi.list()); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { projects, loading, error, reload };
}
