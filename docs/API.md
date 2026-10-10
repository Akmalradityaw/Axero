# AXERO.JS API Reference — v0.1.0-alpha (Frozen)

*Semua API di bawah ini frozen untuk v0.1.0-alpha. Breaking changes hanya di v0.2.0+.*

---

## @axero/core

### `createServer()`

Membuat HTTP server dengan routing dan WebSocket upgrade support.

```js
const app = createServer();
```

**Returns:** `{ node, get, post, loadRoutes, listen }`

### `app.get(path, handler)`

Register GET handler.

```js
app.get('/health', (req, res) => res.json({ ok: true }));
```

### `app.post(path, handler)`

Register POST handler.

```js
app.post('/users', (req, res) => { /* ... */ });
```

### `app.loadRoutes(dir)`

Auto-register routes dari folder. File `.mjs` = route. `index.mjs` → `/`. `[id]` → `:id` param. Mendukung nested folder.

```js
await app.loadRoutes('./routes');
// routes/about.mjs → GET /about
// routes/item-[id].mjs → GET /item-:id → req.params.id
// routes/users/index.mjs → GET /users
// routes/users/[id].mjs → GET /users/42 → req.params.id === '42'
// routes/users/[id]/posts.mjs → GET /users/42/posts
```

### `app.listen(port?)`

Start server. Default port 3000.

```js
await app.listen(3000);
```

### Handler Signature

```js
(req, res) => {
  req.params        // route params (from [id])
  req.method        // 'GET' | 'POST'
  res.json(obj)     // send JSON response
  res.end(str)      // send text response
}
```

---

## @axero/core/signals

### `createSignal(initialValue)`

```js
const [get, set] = createSignal(0);
get();        // 0
set(1);       // update
set(p => p + 1); // functional update
```

### `createEffect(fn)`

Re-run saat signal berubah.

```js
createEffect(() => {
  console.log(get()); // re-run saat set() dipanggil
});
```

---

## @axero/core/hmr

### `watchFiles(dir, onChange)`

Watch file changes, trigger callback.

```js
import { watchFiles } from '@axero/core/hmr';
watchFiles('./routes', (filename) => {
  console.log('changed:', filename);
});
```

---

## @axero/ws

### `createWS(app, config?)`

Attach WebSocket ke HTTP server.

```js
const ws = createWS(app);
ws.on('connection', (socket) => {
  socket.send('connected');
});
ws.broadcast('hello'); // ke semua client kecuali sender
```

### `createWS` dengan CORS (Origin check)

```js
const ws = createWS(app, {
  cors: { origin: 'http://localhost:3000' }
  // atau array: origin: ['http://a.com', 'http://b.com']
});
```

---

## @axero/cli

```bash
axero --version          # 0.1.0-alpha
axero --doctor           # check Node >= 20
axero create <app-name>  # new app dari templates/minimal
axero dev                # watch mode + HMR
```

---

## @axero/orm

### `createORM(config)`

```js
import { createORM } from '@axero/orm';
```

### JSON Driver (default, zero dependency)

```js
const orm = await createORM({ url: './data.json' });
const users = orm.collection('users');
await users.create({ name: 'Akmal' });
await users.find({ name: 'Akmal' });
await users.findById(id);
await users.update(id, { name: 'Raditya' });
await users.delete(id);
```

### SQLite Driver (Node 22.5+)

```js
const db = await createORM({ driver: 'sqlite', url: './db.sqlite' });
await db.execute('CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)');
await db.execute('INSERT INTO users (id, name) VALUES (?, ?)', ['1', 'Akmal']);
const rows = await db.query('SELECT * FROM users WHERE name = ?', ['Akmal']);
```

### MySQL Driver

```js
// npm install mysql2
const db = await createORM({ driver: 'mysql', url: 'mysql://user:pass@localhost/db' });
await db.execute('INSERT INTO users (name) VALUES (?)', ['Akmal']);
```

### Supabase Driver

```js
// npm install @supabase/supabase-js
const db = await createORM({ driver: 'supabase', url: 'https://xxx.supabase.co', key: 'anon-key' });
await db.execute('users', { name: 'Akmal' });
const rows = await db.query('users', { name: 'Akmal' });
```
