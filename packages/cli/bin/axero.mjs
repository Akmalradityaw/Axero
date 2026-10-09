#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// ponytail: create = plain recursive copy, no prompts/scaffolding questions — add when users need choices.
const { values, positionals } = parseArgs({ options: { version: { type: 'boolean' }, help: { type: 'boolean' }, doctor: { type: 'boolean' }, dev: { type: 'boolean' } }, allowPositionals: true });
const [cmd, ...args] = positionals;
const VERSION = '0.1.0-alpha';

if (values.version) console.log(`axero v${VERSION}`);
else if (values.doctor) {
  const ok = Number(process.versions.node.split('.')[0]) >= 20;
  console.log(ok ? `ok: node ${process.version} >= 20` : `FAIL: node ${process.version} < 20 — install node >= 20`);
  process.exitCode = ok ? 0 : 1;
} else if (values.dev) {
  spawn('node', ['--watch', 'server.mjs'], { stdio: 'inherit', shell: process.platform === 'win32' });
} else if (cmd === 'create') {
  const name = args[0];
  if (!name) {
    console.log('usage: axero create <app-name>');
    process.exit(1);
  }
  const dest = join(process.cwd(), name);
  if (existsSync(dest)) {
    console.log(`FAIL: ${dest} already exists`);
    process.exit(1);
  }
  cpSync(new URL('../../../templates/minimal/', import.meta.url), dest, { recursive: true });
  console.log(`created ${name} — cd ${name} && axero dev`);
} else {
  console.log(`axero v${VERSION}\nusage: axero [--version|--help|--doctor|--dev|create <app-name>]`);
}
