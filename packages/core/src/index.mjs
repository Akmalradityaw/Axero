import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { scanRoutes, matchPath } from './router.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

export function createServer() {
  const routes = new Map();
  let staticDir = null;
  const server = http.createServer((req, res) => {
    res.json ??= (obj) => res.setHeader('content-type', 'application/json').end(JSON.stringify(obj));
    const pathname = new URL(req.url, 'http://x').pathname;
    let fn = routes.get(`${req.method} ${pathname}`);
    let params = {};
    if (!fn) {
      for (const [key, handler] of routes) {
        const [method, pattern] = key.split(' ');
        if (method !== req.method) continue;
        params = matchPath(pattern, pathname);
        if (params) {
          fn = handler;
          break;
        }
      }
    }
    if (!fn && req.method === 'GET' && staticDir) {
      const root = resolve(staticDir);
      const file = resolve(join(root, pathname === '/' ? 'index.html' : pathname.slice(1)));
      if (file.startsWith(root + '\\') || file.startsWith(root + '/') || file === root) {
        if (existsSync(file) && statSync(file).isFile()) {
          res.setHeader('content-type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream');
          return res.end(readFileSync(file));
        }
      }
    }
    if (!fn) {
      res.statusCode = 404;
      return res.end('not found');
    }
    req.params = params;
    fn(req, res);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('\nError: port sudah dipakai proses lain.\nHint: jalankan dengan port lain — PORT=<port> node server.mjs\n');
    } else {
      console.error('\nServer error:', err.message);
    }
    process.exit(1);
  });
  return {
    node: server,
    get: (path, fn) => routes.set(`GET ${path}`, fn),
    post: (path, fn) => routes.set(`POST ${path}`, fn),
    // ponytail: single dir, no cache/ETag/gzip — add those when serving hits real traffic.
    static: (dir) => { staticDir = dir; },
    loadRoutes: async (dir) => {
      let entries;
      try {
        entries = scanRoutes(dir);
      } catch (err) {
        if (err.code === 'ENOENT') throw new Error(`Routes folder not found: ${dir} — create it or fix app.loadRoutes() path`);
        throw err;
      }
      for (const { path, file } of entries) {
        const mod = await import(pathToFileURL(file).href);
        routes.set(`GET ${path}`, mod.default);
        if (typeof mod.POST === 'function') routes.set(`POST ${path}`, mod.POST);
      }
    },
    listen: (port = 3000) => new Promise((r) => server.listen(port, r)),
  };
}
