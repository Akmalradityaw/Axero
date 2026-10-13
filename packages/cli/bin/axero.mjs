#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import net from 'node:net';
import { join } from 'node:path';

const { values, positionals } = parseArgs({
  options: { version: { type: 'boolean' }, help: { type: 'boolean' }, doctor: { type: 'boolean' } },
  allowPositionals: true
});
const [cmd, ...args] = positionals;
const VERSION = '0.1.0-alpha';

// --- UI & Styling Engine (No Dependencies) ---
const TTY = process.stdout.isTTY;
const paint = (n, s) => (TTY ? `\x1b[${n}m${s}\x1b[0m` : s);
const bold = (s) => paint(1, s);
const dim = (s) => paint(2, s);
const red = (s) => paint(31, s);
const green = (s) => paint(32, s);
const yellow = (s) => paint(33, s);
const cyan = (s) => paint(36, s);

const log = {
  info: (msg) => console.log(` ${cyan(bold('i'))} ${msg}`),
  success: (msg) => console.log(` ${green(bold('√'))} ${msg}`),
  error: (msg) => console.log(` ${red(bold('x'))} ${msg}`),
  warn: (msg) => console.log(` ${yellow(bold('!'))} ${msg}`),
  step: (msg) => console.log(` ${dim('—')} ${msg}`),
  br: () => console.log('')
};

const help = () => {
  log.br();
  console.log(`  ${cyan(bold('axero'))} ${dim(`v${VERSION}`)}`);
  console.log(`  Build real-time apps like breathing.\n`);
  console.log(bold('  USAGE'));
  console.log(`    $ axero <command> [args]\n`);
  console.log(bold('  COMMANDS'));
  console.log(`    ${cyan('create')} <app-name> [tpl]  ${dim('New app (default | minimal | backend-only)')}`);
  console.log(`    ${cyan('dev')}                      ${dim('Watch mode + HMR (PORT=... to change port)')}`);
  console.log(`    ${cyan('build')}                    ${dim('Production build → dist/')}\n`);
  console.log(bold('  OPTIONS'));
  console.log(`    ${cyan('--version')}                ${dim('Show version number')}`);
  console.log(`    ${cyan('--doctor')}                 ${dim('Check environment and dependencies')}`);
  console.log(`    ${cyan('--help')}                   ${dim('Show this help message')}\n`);
};

// --- Utilities ---
function portBusy(port) {
  return new Promise((resolve) => {
    const s = net.connect(port, '127.0.0.1');
    s.on('connect', () => { s.destroy(); resolve(true); });
    s.on('error', () => resolve(false));
  });
}

// --- Command Handlers ---
if (values.version) {
  console.log(cyan(bold(`axero v${VERSION}`)));
}
else if (values.doctor) {
  log.br();
  log.info(bold('System Check'));
  const ok = Number(process.versions.node.split('.')[0]) >= 20;
  if (ok) {
    log.success(`Node.js version: ${process.version} ${dim('(>= 20)')}`);
    process.exitCode = 0;
  } else {
    log.error(`Node.js version: ${process.version} ${dim('(< 20)')}`);
    log.step('Please install Node.js 20 or higher.');
    process.exitCode = 1;
  }
  log.br();
}
else if (values.help || !cmd) {
  help();
}
else if (cmd === 'dev') {
  const port = Number(process.env.PORT ?? 3000);

  log.br();
  process.stdout.write(` ${cyan(bold('i'))} Starting development server... `);

  if (await portBusy(port)) {
    console.log(red(bold('Failed\n')));
    log.error(`Port ${port} is currently in use.`);
    log.step(`Hint: Find the process using:`);
    log.step(`  Windows: netstat -ano | findstr :${port}`);
    log.step(`  Mac/Linux: lsof -i :${port}`);
    log.br();
    log.info(`Or change port: ${cyan(`PORT=<port> axero dev`)}`);
    process.exit(1);
  }

  console.log(green('Ready'));

  // Terminal Box UI
  const pad = (str, len) => str + ' '.repeat(Math.max(0, len - str.replace(/\x1b\[[0-9;]*m/g, '').length));
  console.log(`\n  ${cyan('┌──────────────────────────────────────────┐')}`);
  console.log(`  ${cyan('│')}                                          ${cyan('│')}`);
  console.log(`  ${cyan('│')}  ${bold('Axero Dev Server')} v${pad(VERSION, 20)}${cyan('│')}`);
  console.log(`  ${cyan('│')}                                          ${cyan('│')}`);
  console.log(`  ${cyan('│')}  ${dim('Local:')}   ${pad(green(`http://localhost:${port}`), 31)}${cyan('│')}`);
  console.log(`  ${cyan('│')}                                          ${cyan('│')}`);
  console.log(`  ${cyan('└──────────────────────────────────────────┘')}\n`);

  const child = spawn('node', ['--watch', 'server.mjs'], { cwd: process.cwd(), stdio: 'inherit' });

  const kill = () => {
    try { child.kill(); } catch { }
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  };

  process.on('exit', kill);
  process.on('SIGINT', () => { kill(); process.exit(0); });
  process.on('SIGTERM', () => { kill(); process.exit(0); });
}
else if (cmd === 'create') {
  log.br();
  const [name, template = 'default'] = args;

  if (!name) {
    log.error('Missing application name.');
    log.step(`Usage: axero create <app-name> [template]`);
    process.exit(1);
  }

  log.info(`Initializing project ${cyan(name)}`);

  const templatesDir = new URL('../../../templates/', import.meta.url);
  let available = [];
  try {
    available = readdirSync(templatesDir).filter((d) => !d.startsWith('.'));
  } catch (e) {
    log.error('Templates directory not found or inaccessible.');
    process.exit(1);
  }

  if (!available.includes(template)) {
    log.error(`Template "${template}" does not exist.`);
    log.step(`Valid templates: ${available.join(', ')}`);
    process.exit(1);
  }

  const dest = join(process.cwd(), name);
  if (existsSync(dest)) {
    log.error(`Directory "${name}" already exists.`);
    process.exit(1);
  }

  log.step(`Copying template: ${bold(template)}...`);
  cpSync(new URL(`${template}/`, templatesDir), dest, { recursive: true });

  log.br();
  log.success(`Project created successfully!`);
  console.log(`\n  ${bold('Next steps:')}`);
  console.log(`    ${cyan('cd')} ${name}`);
  console.log(`    ${cyan('axero dev')}\n`);
}
else if (cmd === 'build') {
  log.br();
  log.info('Starting production build...');

  const src = process.cwd();
  const dest = join(src, 'dist');

  log.step('Cleaning previous dist/ folder...');
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  log.step('Bundling and copying assets...');
  let fileCount = 0;
  for (const item of readdirSync(src)) {
    if (item === 'node_modules' || item === 'dist' || item === '.git') continue;
    cpSync(join(src, item), join(dest, item), { recursive: true });
    fileCount++;
  }

  log.step('Generating manifest.json...');
  writeFileSync(join(dest, 'manifest.json'), JSON.stringify({ built: new Date().toISOString(), name: 'axero-app' }, null, 2));

  log.br();
  log.success(`Build completed successfully!`);
  console.log(`  ${dim('Output :')} ${cyan(dest)}`);
  console.log(`  ${dim('Files  :')} ${fileCount} root items processed\n`);
}
else if (cmd) {
  log.br();
  log.error(`Unknown command "${cmd}"`);
  help();
  process.exit(1);
}
