# AXERO.JS

> *Build real-time apps like breathing.*

Zero-dependency fullstack framework — native HTTP + WebSocket (RFC 6455) on one port, fine-grained signals, no Virtual DOM.

**Landing page:** [website/index.html](website/index.html)

## Install

```bash
npm install
```

## Quickstart

```bash
npm run dev
# → http://localhost:3000  (HTTP + WS, same port)
```

## CLI

```bash
axero --version   # 0.1.0-alpha
axero --doctor    # check Node >= 20
axero create <app>  # new app from templates/minimal
axero dev         # watch mode
```

## File-based routing

Routes auto-registered from `routes/` folder:

```text
routes/
  index.mjs      → GET /
  about.mjs      → GET /about
  item-[id].mjs  → GET /item-:id  (param)
```

Each file exports a default handler: `export default (req, res) => ...`. Params via `req.params`.

## ORM

```js
import { createORM } from '@axero/orm';

// JSON driver (default, zero dependency)
const orm = await createORM({ url: './data.json' });
const users = orm.collection('users');
await users.create({ name: 'Akmal' });
const found = await users.find({ name: 'Akmal' });

// SQLite driver (Node 22.5+)
const db = await createORM({ driver: 'sqlite', url: './db.sqlite' });
await db.execute('CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)');
const rows = await db.query('SELECT * FROM users WHERE name = ?', ['Akmal']);

// MySQL driver — npm install mysql2
const my = await createORM({ driver: 'mysql', url: 'mysql://user:pass@localhost/db' });
await my.execute('INSERT INTO users (name) VALUES (?)', ['Akmal']);

// Supabase driver — npm install @supabase/supabase-js
const sb = await createORM({ driver: 'supabase', url: 'https://xxx.supabase.co', key: 'anon-key' });
await sb.execute('users', { name: 'Akmal' });
```

## Packages

| Package | Purpose |
| :--- | :--- |
| `@axero/core` | HTTP server + signal/effect primitives |
| `@axero/ws` | Native WebSocket upgrade, frame codec, broadcast |
| `@axero/cli` | Terminal commands |
| `@axero/orm` | Database abstraction — JSON driver, collection API |

## License

MIT
