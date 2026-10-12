import { readFile } from 'node:fs/promises';

export default async (_, res) => {
  res.setHeader('content-type', 'text/javascript');
  res.end(await readFile(new URL('../client/app.mjs', import.meta.url)));
};
