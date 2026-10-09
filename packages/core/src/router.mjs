import { readdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

export function scanRoutes(dir) {
  const routes = [];
  for (const file of readdirSync(dir)) {
    if (extname(file) !== '.mjs') continue;
    const name = basename(file, '.mjs');
    const path = name === 'index' ? '/' : '/' + name.replace(/\[(.+?)\]/g, ':$1');
    routes.push({ path, file: join(dir, file) });
  }
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
