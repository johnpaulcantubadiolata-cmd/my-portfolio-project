const assert = require('assert');
const { parseId, validateProject } = require('../src/validators');
const { describeError } = require('../src/errors');

assert.strictEqual(parseId('5'), 5);
['0', 'abc', '1.5', '-2', ''].forEach(v => assert.strictEqual(parseId(v), null));
let r = validateProject({});
assert.deepStrictEqual(Object.keys(r.errors).sort(), ['description', 'technologies', 'title']);
r = validateProject({ title: ' T ', description: 'd', technologies: 'a,b', image: '/x.png', githubLink: 'https://github.com/x/y' });
assert.deepStrictEqual(r.errors, {}); assert.strictEqual(r.data.title, 'T'); assert.strictEqual(r.data.liveDemo, null);
r = validateProject({ title: 't', description: 'd', technologies: 'x', githubLink: 'ftp://bad', image: 'bad path' });
assert.deepStrictEqual(Object.keys(r.errors).sort(), ['githubLink', 'image']);

assert.strictEqual(describeError({ name: 'PrismaClientInitializationError', errorCode: 'P1001' }).status, 503);
assert.strictEqual(describeError({ code: 'P1000' }).body.code, 'DB_UNAVAILABLE');
assert.strictEqual(describeError({ code: 'P2021' }).body.code, 'DB_NOT_MIGRATED');
assert.strictEqual(describeError({ type: 'entity.parse.failed' }).status, 400);
assert.strictEqual(describeError({ code: 'P2025' }), null);
assert.strictEqual(describeError(new Error('x')), null);
console.log('All offline checks passed.');
