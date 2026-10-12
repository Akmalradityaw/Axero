import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../packages/cli/bin/axero.mjs', import.meta.url));
const TMP = join(process.cwd(), 'tests', '.tmp');

function run(args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn('node', [CLI, ...args], { cwd: opts.cwd || TMP, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('exit', (code) => resolve({ code, out }));
  });
}

before(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

after(() => rmSync(TMP, { recursive: true, force: true }));

test('axero --version', async () => {
  const { code, out } = await run(['--version']);
  assert.equal(code, 0);
  assert.match(out, /axero v0\.1\.0-alpha/);
});

test('axero --doctor on node >= 20', async () => {
  const { code, out } = await run(['--doctor']);
  assert.equal(code, 0);
  assert.match(out, /ok: node/);
});

test('axero no args prints usage', async () => {
  const { code, out } = await run([]);
  assert.equal(code, 0);
  assert.match(out, /usage: axero/);
});

test('axero create without name fails with usage', async () => {
  const { code, out } = await run(['create']);
  assert.equal(code, 1);
  assert.match(out, /usage: axero create/);
});

test('axero create copies template', async () => {
  const { code, out } = await run(['create', 'myapp']);
  assert.equal(code, 0);
  assert.match(out, /created myapp/);
  assert.ok(existsSync(join(TMP, 'myapp', 'server.mjs')));
  assert.ok(existsSync(join(TMP, 'myapp', 'client', 'index.html')));
});

test('axero create existing dir fails', async () => {
  const { code, out } = await run(['create', 'myapp']);
  assert.equal(code, 1);
  assert.match(out, /FAIL.*already exists/);
});

test('axero build creates dist with manifest', async () => {
  const app = join(TMP, 'buildapp');
  mkdirSync(join(app, 'client'), { recursive: true });
  writeFileSync(join(app, 'server.mjs'), 'console.log("hi")');
  writeFileSync(join(app, 'client', 'index.html'), '<h1>x</h1>');
  const { code, out } = await run(['build'], { cwd: app });
  assert.equal(code, 0);
  assert.match(out, /built/);
  const manifest = JSON.parse(readFileSync(join(app, 'dist', 'manifest.json'), 'utf8'));
  assert.ok(manifest.built);
  assert.ok(existsSync(join(app, 'dist', 'server.mjs')));
  assert.ok(existsSync(join(app, 'dist', 'client', 'index.html')));
  assert.ok(!existsSync(join(app, 'dist', 'dist')), 'nested dist not copied');
});

test('build skips node_modules and dist', async () => {
  const app = join(TMP, 'skipapp');
  mkdirSync(join(app, 'node_modules', 'x'), { recursive: true });
  mkdirSync(join(app, 'dist'), { recursive: true });
  writeFileSync(join(app, 'server.mjs'), '');
  writeFileSync(join(app, 'node_modules', 'x', 'junk.js'), '');
  await run(['build'], { cwd: app });
  assert.ok(!existsSync(join(app, 'dist', 'node_modules')));
  await run(['build'], { cwd: app });
  assert.ok(!existsSync(join(app, 'dist', 'dist', 'dist')), 'dist not re-nested');
});

test('integration: create → build → run dist server', async () => {
  await run(['create', 'e2eapp']);
  const app = join(TMP, 'e2eapp');
  const { code } = await run(['build'], { cwd: app });
  assert.equal(code, 0);
  const srv = spawn('node', ['server.mjs'], { cwd: join(app, 'dist'), env: { ...process.env, PORT: '3146' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((r) => setTimeout(r, 2500));
  try {
    const res = await fetch('http://localhost:3146/');
    assert.equal(res.status, 200);
  } finally {
    srv.kill();
    await new Promise((r) => setTimeout(r, 300));
  }
});
