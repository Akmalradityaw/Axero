import { readdirSync } from 'node:fs';
import { join, relative, sep, extname } from 'node:path';

export function scanRoutes(dir) {
  const routes = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (extname(e.name) === '.mjs') {
        const rel = relative(dir, p).replace(/\.mjs$/, '');
        const path = '/' + rel.split(sep).map((s) =>
          s === 'index' ? '' : s.replace(/\[(.+?)\]/g, ':$1')
        ).join('/').replace(/\/+$/, '') || '/';
        routes.push({ path, file: p });
      }
    }
  };
  walk(dir);
  return routes;
}

export function matchPath(pattern, path) {
  const keys = [];
  const src = pattern.replace(/:([^/]+)/g, (_, k) => {
    keys.push(k);
    return '([^/]+)';
  });
  const m = path.match(new RegExp('^' + src + '$'));
  if (!m) return null;
  const params = {};
  keys.forEach((k, i) => (params[k] = m[i + 1]));
  return params;
}
