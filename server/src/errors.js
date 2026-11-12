const DB_DOWN = ['P1000', 'P1001', 'P1002', 'P1003', 'P1008', 'P1017', 'P2024'];
const DB_SCHEMA = ['P2021', 'P2022'];

function describeError(err) {
  if (err && err.type === 'entity.parse.failed')
    return { status: 400, body: { ok: false, error: 'Invalid JSON in request body.' } };
  if (err && err.type === 'entity.too.large')
    return { status: 413, body: { ok: false, error: 'Request body is too large.' } };
  const code = err && (err.errorCode || err.code);
  if ((err && err.name === 'PrismaClientInitializationError') || DB_DOWN.includes(code))
    return { status: 503, body: { ok: false, code: 'DB_UNAVAILABLE',
      error: 'Cannot connect to the MySQL database. Start MySQL (XAMPP) and check DATABASE_URL (user, password, database name) in server/.env.' } };
  if (DB_SCHEMA.includes(code))
    return { status: 503, body: { ok: false, code: 'DB_NOT_MIGRATED',
      error: 'Database tables are missing or outdated. In the server folder run: npm run db:migrate' } };
  return null;
}
module.exports = { describeError };
