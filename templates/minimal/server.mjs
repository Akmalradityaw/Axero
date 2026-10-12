import { createServer } from '@axero/core';

// ponytail: deps use published version — hanya jalan di dalam repo sebelum npm publish;
// ceiling: pre-publish; upgrade path: npm publish / npm link.
const app = createServer();
app.get('/', (_, res) => res.json({ ok: true, msg: 'axero minimal' }));
await app.listen(process.env.PORT ?? 3000);
console.log('axero app on http://localhost:' + (process.env.PORT ?? 3000));
