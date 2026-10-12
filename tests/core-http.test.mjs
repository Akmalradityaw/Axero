import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
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

test('static serves file + index.html at root', async () => {
  const dir = join(process.cwd(), 'tests', '.tmp-static');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), '<h1>hi</h1>');
  writeFileSync(join(dir, 'app.js'), 'console.log(1)');
  const base = await boot((app) => app.static(dir));
  assert.equal(await (await fetch(`${base}/`)).text(), '<h1>hi</h1>');
  const js = await fetch(`${base}/app.js`);
  assert.match(js.headers.get('content-type'), /javascript/);
  assert.equal(await js.text(), 'console.log(1)');
  rmSync(dir, { recursive: true, force: true });
});

test('static blocks path traversal', async () => {
  const dir = join(process.cwd(), 'tests', '.tmp-static2');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), 'x');
  const base = await boot((app) => app.static(dir));
  const res = await fetch(`${base}/..%2F..%2Fpackage.json`);
  assert.notEqual(res.status, 200);
  rmSync(dir, { recursive: true, force: true });
});

test('loadRoutes registers named POST export', async () => {
  const dir = join(process.cwd(), 'tests', '.tmp-routes');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'thing.mjs'), 'export default (_, res) => res.end("get");\nexport const POST = (_, res) => res.end("post");');
  const app = createServer();
  await app.loadRoutes(dir);
  await app.listen(0);
  servers.push(app.node);
  const base = `http://127.0.0.1:${app.node.address().port}`;
  assert.equal(await (await fetch(`${base}/thing`)).text(), 'get');
  assert.equal(await (await fetch(`${base}/thing`, { method: 'POST' })).text(), 'post');
  rmSync(dir, { recursive: true, force: true });
});
