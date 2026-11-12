const router = require('express').Router();
const prisma = require('../db');
const { parseId, validateProject } = require('../validators');

router.use((req, res, next) => {
  if (req.method !== 'GET' && process.env.ALLOW_PROJECT_EDITS === 'false')
    return res.status(403).json({ ok: false, error: 'Editing projects is disabled on this server.' });
  next();
});

router.param('id', (req, res, next, raw) => {
  const id = parseId(raw);
  if (!id) return res.status(400).json({ ok: false, error: 'Invalid project id.' });
  req.projectId = id;
  next();
});

const notFound = res => res.status(404).json({ ok: false, error: 'Project not found.' });
const isMissing = err => err && err.code === 'P2025';

router.get('/', async (_req, res, next) => {
  try { res.json(await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.projectId } });
    project ? res.json(project) : notFound(res);
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  const { errors, data } = validateProject(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  try { res.status(201).json(await prisma.project.create({ data })); }
  catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  const { errors, data } = validateProject(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  try { res.json(await prisma.project.update({ where: { id: req.projectId }, data })); }
  catch (e) { isMissing(e) ? notFound(res) : next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.projectId } });
    res.json({ ok: true, message: 'Project deleted.' });
  } catch (e) { isMissing(e) ? notFound(res) : next(e); }
});
module.exports = router;
