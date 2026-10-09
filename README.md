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

## Packages

| Package | Purpose |
| :--- | :--- |
| `@axero/core` | HTTP server + signal/effect primitives |
| `@axero/ws` | Native WebSocket upgrade, frame codec, broadcast |
| `@axero/cli` | Terminal commands |

## License

MIT
