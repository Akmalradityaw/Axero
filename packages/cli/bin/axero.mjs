#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import net from 'node:net';
import { join } from 'node:path';

// ponytail: create = plain recursive copy, no prompts/scaffolding questions — add when users need choices.
const { values, positionals } = parseArgs({ options: { version: { type: 'boolean' }, help: { type: 'boolean' }, doctor: { type: 'boolean' } }, allowPositionals: true });
const [cmd, ...args] = positionals;
const VERSION = '0.1.0-alpha';

// ponytail: manual ANSI, no chalk-like dep — off when piped (tests/CI stay plain).
const TTY = process.stdout.isTTY;
const paint = (n, s) => (TTY ? `\x1b[${n}m${s}\x1b[0m` : s);
const red = (s) => paint(31, s);
const green = (s) => paint(32, s);
const dim = (s) => paint(2, s);

const help = () => console.log(
  `axero v${VERSION} — build real-time apps like breathing.\n\n` +
  `usage: axero <command> [args]\n\n` +
  `  create <app-name> [template]   ${dim('new app (default | minimal | backend-only)')}\n` +
  `  dev                            ${dim('watch mode + HMR (PORT=... to change port)')}\n` +
  `  build                          ${dim('production build → dist/')}\n` +
  `  --version | --doctor | --help  ${dim('info & checks')}`
);

function portBusy(port) {
  return new Promise((resolve) => {
    const s = net.connect(port, '127.0.0.1');
    s.on('connect', () => { s.destroy(); resolve(true); });
    s.on('error', () => resolve(false));
  });
}

if (values.version) console.log(`axero v${VERSION}`);
else if (values.doctor) {
  const ok = Number(process.versions.node.split('.')[0]) >= 20;
  console.log(ok ? green(`ok: node ${process.version} >= 20`) : red(`FAIL: node ${process.version} < 20 — install node >= 20`));
  process.exitCode = ok ? 0 : 1;
} else if (values.help || !cmd) help();
else if (cmd === 'dev') {
  const port = Number(process.env.PORT ?? 3000);
  if (await portBusy(port)) {
    console.log(red(`FAIL: port ${port} dipakai proses lain.`) + `\n${dim(`Hint: cari prosesnya — Windows: netstat -ano | findstr :${port} / Mac: lsof -i :${port}. Atau langsung: PORT=<port> axero dev`)}`);
    process.exit(1);
  }
  const child = spawn('node', ['--watch', 'server.mjs'], { cwd: process.cwd(), stdio: 'inherit' });
  // ponytail: Windows-only tree kill (node --watch + server.mjs); unix cukup child.kill().
  const kill = () => {
    try { child.kill(); } catch {}
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  };
  process.on('exit', kill);
  process.on('SIGINT', () => { kill(); process.exit(0); });
  process.on('SIGTERM', () => { kill(); process.exit(0); });
} else if (cmd === 'create') {
  const [name, template = 'default'] = args;
  if (!name) {
    console.log('usage: axero create <app-name> [template]');
    process.exit(1);
  }
  const templatesDir = new URL('../../../templates/', import.meta.url);
  const available = readdirSync(templatesDir).filter((d) => !d.startsWith('.'));
  if (!available.includes(template)) {
    console.log(red(`FAIL: template "${template}" tidak ada.`) + `\n${dim(`Valid: ${available.join(', ')}`)}`);
    process.exit(1);
  }
  const dest = join(process.cwd(), name);
  if (existsSync(dest)) {
    console.log(red(`FAIL: ${dest} already exists`));
    process.exit(1);
  }
  cpSync(new URL(`${template}/`, templatesDir), dest, { recursive: true });
  console.log(green(`created ${name} (template: ${template})`) + `\n${dim(`  cd ${name} && axero dev`)}`);
} else if (cmd === 'build') {
  const src = process.cwd();
  const dest = join(src, 'dist');
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  for (const item of readdirSync(src)) {
    if (item === 'node_modules' || item === 'dist' || item === '.git') continue;
    cpSync(join(src, item), join(dest, item), { recursive: true });
  }
  writeFileSync(join(dest, 'manifest.json'), JSON.stringify({ built: new Date().toISOString(), name: 'axero-app' }, null, 2));
  console.log(green(`built → ${dest}`));
} else if (cmd) {
  console.log(red(`FAIL: unknown command "${cmd}"`) + '\n');
  help();
  process.exit(1);
} else {
  help();
}
