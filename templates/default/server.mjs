import { createServer } from '@axero/core';
import { createWS } from '@axero/ws';
import { watchFiles } from '@axero/core/hmr';

const app = createServer();
// ponytail: deps use published version — app luar monorepo baru jalan setelah npm publish.
// ceiling: pre-publish hanya jalan di dalam repo ini; upgrade path: npm publish / npm link.
app.static('./client');
await app.loadRoutes('./routes');
const ws = createWS(app);
ws.on('connection', (c) => c.send('connected'));

watchFiles('./routes', () => ws.broadcast('hmr:reload'));

await app.listen(process.env.PORT ?? 3000);
console.log('axero app on http://localhost:' + (process.env.PORT ?? 3000));
