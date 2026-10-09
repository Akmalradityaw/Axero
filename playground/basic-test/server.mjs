import { createServer } from '../../packages/core/src/index.mjs';
import { createWS } from '../../packages/ws/src/index.mjs';

const app = createServer();
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
createWS(app).on('connection', (c) => c.send('connected'));

await app.listen(process.env.PORT ?? 3000);
console.log('playground on http://localhost:3000');
