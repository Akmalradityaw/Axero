import http from 'node:http';

// ponytail: static exact-match routes only, no params/wildcards — add radix tree when routes grow.
export function createServer() {
  const routes = new Map();
  const server = http.createServer((req, res) => {
    res.json ??= (obj) => res.setHeader('content-type', 'application/json').end(JSON.stringify(obj));
    const fn = routes.get(`${req.method} ${new URL(req.url, 'http://x').pathname}`);
    if (!fn) {
      res.statusCode = 404;
      return res.end('not found');
    }
    fn(req, res);
  });
  return {
    node: server,
    get: (path, fn) => routes.set(`GET ${path}`, fn),
    post: (path, fn) => routes.set(`POST ${path}`, fn),
    listen: (port = 3000) => new Promise((r) => server.listen(port, r)),
  };
}
