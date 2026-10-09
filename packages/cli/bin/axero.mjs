#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';

// ponytail: 4 flags only, no create/build/db Ws yet — add per Fase 3/4 when playground proves dev loop.
const { values } = parseArgs({ options: { version: { type: 'boolean' }, help: { type: 'boolean' }, doctor: { type: 'boolean' }, dev: { type: 'boolean' } }, allowPositionals: true });
const VERSION = '0.1.0-alpha';

if (values.version) console.log(`axero v${VERSION}`);
else if (values.doctor) {
  const ok = Number(process.versions.node.split('.')[0]) >= 20;
  console.log(ok ? `ok: node ${process.version} >= 20` : `FAIL: node ${process.version} < 20 — install node >= 20`);
  process.exitCode = ok ? 0 : 1;
} else if (values.dev) {
  spawn('node', ['--watch', 'playground/basic-test/server.mjs'], { stdio: 'inherit', shell: process.platform === 'win32' });
} else {
  console.log(`axero v${VERSION}\nusage: axero [--version|--help|--doctor|--dev]`);
}
