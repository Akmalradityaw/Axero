import { createServer } from '@axero/core';
import { createWS } from '@axero/ws';

// ponytail: deps use published version — hanya jalan di dalam repo sebelum npm publish;
// ceiling: pre-publish; upgrade path: npm publish / npm link.
const app = createServer();
await app.loadRoutes('./routes');
const ws = createWS(app);
ws.on('connection', (c) => c.send('{"event":"welcome"}'));

await app.listen(process.env.PORT ?? 3000);
// skip saat jalan di bawah `axero dev` (CLI sudah tampilkan box UI sendiri).
if (!process.env.AXERO_DEV) console.log('axero api on http://localhost:' + (process.env.PORT ?? 3000));
