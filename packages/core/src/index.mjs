import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { scanRoutes, matchPath } from './router.mjs';

export function createServer() {
  const routes = new Map();
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
    loadRoutes: async (dir) => {
      for (const { path, file } of scanRoutes(dir)) {
        const mod = await import(pathToFileURL(file).href);
        routes.set(`GET ${path}`, mod.default);
      }
    },
    listen: (port = 3000) => new Promise((r) => server.listen(port, r)),
  };
}
