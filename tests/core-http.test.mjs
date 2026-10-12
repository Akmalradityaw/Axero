import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../packages/core/src/index.mjs';

const servers = [];
async function boot(setup) {
  const app = createServer();
  setup(app);
  await app.listen(0);
  servers.push(app.node);
  return `http://127.0.0.1:${app.node.address().port}`;
}

after(() => servers.forEach((s) => s.close()));

test('static route: text response', async () => {
  const base = await boot((app) => app.get('/ping', (req, res) => res.end('pong')));
  const res = await fetch(`${base}/ping`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'pong');
});

test('static route: JSON response', async () => {
  const base = await boot((app) => app.get('/health', (req, res) => res.json({ ok: true })));
  const res = await fetch(`${base}/health`);
  assert.deepEqual(await res.json(), { ok: true });
});

test('dynamic route params', async () => {
  const base = await boot((app) =>
    app.get('/users/:id', (req, res) => res.json({ id: req.params.id }))
  );
  const res = await fetch(`${base}/users/42`);
  assert.deepEqual(await res.json(), { id: '42' });
});

test('POST route with method isolation', async () => {
  const base = await boot((app) => {
    app.get('/thing', (req, res) => res.end('get'));
    app.post('/thing', (req, res) => res.end('post'));
  });
  assert.equal(await (await fetch(`${base}/thing`)).text(), 'get');
  assert.equal(await (await fetch(`${base}/thing`, { method: 'POST' })).text(), 'post');
});

test('unknown route → 404', async () => {
  const base = await boot((app) => app.get('/x', (req, res) => res.end('x')));
  const res = await fetch(`${base}/nope`);
  assert.equal(res.status, 404);
});
