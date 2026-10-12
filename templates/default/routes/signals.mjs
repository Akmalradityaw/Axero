import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

export default (_, res) => {
  const file = createRequire(import.meta.url).resolve('@axero/core/signals');
  res.setHeader('content-type', 'text/javascript');
  res.end(readFileSync(file));
};
