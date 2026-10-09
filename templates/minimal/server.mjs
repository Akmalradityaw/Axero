import { createServer } from '@axero/core';
import { createWS } from '@axero/ws';
import { readFile } from 'node:fs/promises';

const app = createServer();
const ws = createWS(app);
ws.on('connection', (c) => c.send('connected'));

app.get('/', async (_, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(await readFile(new URL('./client/index.html', import.meta.url)));
});
app.get('/app.mjs', async (_, res) => {
  res.setHeader('content-type', 'text/javascript');
  res.end(await readFile(new URL('./client/app.mjs', import.meta.url)));
});

await app.listen(process.env.PORT ?? 3000);
console.log('axero app on http://localhost:' + (process.env.PORT ?? 3000));
