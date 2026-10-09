import { createServer } from '@axero/core';
import { createWS } from '@axero/ws';

const app = createServer();
await app.loadRoutes('./routes');
createWS(app).on('connection', (c) => c.send('connected'));

await app.listen(process.env.PORT ?? 3000);
console.log('axero app on http://localhost:' + (process.env.PORT ?? 3000));
