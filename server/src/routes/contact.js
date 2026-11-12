const router = require('express').Router();
const prisma = require('../db');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 150, subject: 150, message: 2000 };

function validate(body = {}) {
  const errors = {}; const clean = {};
  for (const key of Object.keys(LIMITS)) {
    const v = typeof body[key] === 'string' ? body[key].trim() : '';
    if (!v) errors[key] = 'This field is required.';
    else if (v.length > LIMITS[key]) errors[key] = `Maximum ${LIMITS[key]} characters.`;
    clean[key] = v;
  }
  if (!errors.email && !EMAIL.test(clean.email)) errors.email = 'Enter a valid email address.';
  if (!errors.message && clean.message.length < 10) errors.message = 'Message must be at least 10 characters.';
  return { errors, clean };
}

router.post('/', async (req, res, next) => {
  const { errors, clean } = validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  try {
    await prisma.message.create({ data: clean });
    res.status(201).json({ ok: true, message: 'Message sent. Thank you!' });
  } catch (err) { next(err); }
});
module.exports = router;
