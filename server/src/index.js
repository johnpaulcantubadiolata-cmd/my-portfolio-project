require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const { describeError } = require('./errors');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 10,
  message: { ok: false, error: 'Too many requests. Try again later.' } }));

app.get('/api/health', async (_req, res) => {
  try { await db.$queryRaw`SELECT 1`; res.json({ ok: true, db: 'connected' }); }
  catch (e) { res.status(503).json({ ok: false, db: 'unavailable', error: describeError(e)?.body.error || 'Database unavailable.' }); }
});
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));
app.use((err, _req, res, _next) => {
  const known = describeError(err);
  if (known) { if (known.status >= 500) console.error(err.message); return res.status(known.status).json(known.body); }
  console.error(err);
  res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
});
app.listen(process.env.PORT || 5000, () => console.log('API running on port', process.env.PORT || 5000));
db.$connect()
  .then(() => console.log('MySQL connected through Prisma.'))
  .catch(e => console.error('WARNING: cannot connect to MySQL. Start MySQL and check DATABASE_URL in server/.env.\n' + e.message));
