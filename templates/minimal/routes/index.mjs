import { readFile } from 'node:fs/promises';

export default async (_, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(await readFile(new URL('../client/index.html', import.meta.url)));
};
