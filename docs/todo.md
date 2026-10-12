# AXERO.JS Task Backlog & Immediate TODOs

*Status: Aktif (Tahap Paling Awal / Pre-Alpha)*  
*Prinsip Pengerjaan: Selesaikan tugas fundamental sebelum menambahkan fitur kompleks.*

---

### Sprint 0: Inisialisasi Repositori & Monorepo Bootstrap — DONE 2026-10-08

- [x] Setup Workspace Root (git init, package.json private, pnpm-workspace.yaml, .gitignore)
- [x] Konfigurasi TypeScript Global (tsconfig.base.json, strict, ES2022)
- [x] Persiapan Paket Internal Awal (packages/core, packages/ws, packages/cli)
- [x] Script build awal SKIP — `.mjs` stdlib-only jalan tanpa compile

---

### Sprint 1: Prototipe Server Core & WebSocket Handshake (PoC) — DONE 2026-10-08

- [x] HTTP Server Minimal (`@axero/core`) — `createServer()` + `app.get/post`
- [x] WebSocket Upgrader (`@axero/ws`) — handshake, frame parse, encode
- [x] Uji Coba Lapangan — `playground/basic-test/server.mjs`, HTTP + WS satu port OK

---

### Sprint 2: CLI Runner Sederhana (`@axero/cli`) — DONE 2026-10-08

- [x] Binary executable (`packages/cli/bin/axero.mjs`)
- [x] Perintah `axero --version`, `--doctor`, `dev`, `create <app-name>`

---

### Sprint 3: Eksperimen Sinyal Sisi Client — DONE 2026-10-08

- [x] `createSignal<T>` + `createEffect`, no infinite loop
- [x] Template client pakai signals, DOM update tanpa Virtual DOM

---

### Sprint 4: Starter Template & Verifikasi v0.1.0-alpha — DONE 2026-10-08

- [x] `templates/minimal/` — server + client + WS
- [x] Clean machine test — HTTP 200 + WS broadcast OK
- [x] Fix `EADDRINUSE` — actionable error hint `PORT=<port>`
- [x] Tag `v0.1.0-alpha`

---

### Sprint 5: File-Based Routing (`@axero/core/router`) — DONE 2026-10-09

- [x] `scanRoutes(dir)` + `matchPath` — regex match + `req.params`
- [x] `app.loadRoutes(dir)` — auto-import + register
- [x] Test end-to-end: `/`, `/about`, `/item-123`, `/app`, 404 — 5/5 OK

---

### Sprint 6: Landing Page (`website/`) — DONE 2026-10-09

- [x] `website/index.html` — split hero + code example, 4 features, quickstart
- [x] No gradient, no external resources, responsive

---

### Sprint 7: ORM Layer (`@axero/orm`) — DONE 2026-10-09

- [x] `createORM(config)` + JSON driver (zero dependency)
- [x] Collection API: `create`, `find`, `findById`, `update`, `delete`
- [x] Test: 6/6 OK (create, find, findById, update, delete, persist)
- [x] SQLite driver done → lihat Sprint 8

---

### Sprint 8: SQLite Driver (`@axero/orm/sqlite`) — DONE 2026-10-09

- [x] `packages/orm/src/sqlite.mjs` — `node:sqlite` (Node 22.5+)
- [x] `createORM({ driver: 'sqlite', url })` — query/execute API
- [x] Test end-to-end di Node v24 — 5/5 OK

---

### Sprint 9: MySQL & Supabase Drivers — DONE 2026-10-09

- [x] `packages/orm/src/mysql.mjs` — `mysql2`, query/execute API
- [x] `packages/orm/src/supabase.mjs` — `@supabase/supabase-js`, collection API
- [x] Dynamic import + actionable error hint terverifikasi

---

### Sprint 10: HMR — Hot Module Replacement — DONE 2026-10-09

- [x] `packages/core/src/hmr.mjs` — `watchFiles` recursive
- [x] Template server watch routes + broadcast `hmr:reload`, client reload
- [x] Test end-to-end OK
- [ ] Hot swap tanpa reload — add jika diperlukan

---

### Sprint 11: Fase 3 — Stabilisasi — DONE 2026-10-09

- [x] Security audit — Origin check (CSWSH protection)
- [x] Broadcast loop hardening — `writable` check + try/catch
- [x] Stress test — 100 koneksi WS OK
- [x] API freeze — `docs/API.md` v0.1.0-alpha frozen

---

### Sprint 12: MySQL & Supabase Driver Test — DONE 2026-10-09

- [x] `npm install --save-dev mysql2 @supabase/supabase-js`
- [x] Driver load test — MySQL + Supabase OK

---

### Sprint 13: Supabase Driver Test End-to-End — DONE 2026-10-09

- [x] Supabase project `hexaverse-axero` aktif
- [x] Insert + select OK — `{"id":1,"name":"Akmal","email":"a@x.com"}`
- [ ] Update/delete via Supabase driver — API tersedia, belum di-test

---

### Sprint 14: Nested Routes (`@axero/core/router`) — DONE 2026-10-09

- [x] Recursive scan + path conversion, backward compatible
- [x] Template contoh `routes/users/[id].mjs`
- [x] Test: `/`, `/users`, `/users/42`, `/about` — 4/4 OK

---

### Sprint 15: Template UI Redesign (Tailwind CSS) — DONE 2026-10-10

- [x] `templates/minimal/client/index.html` — Tailwind CDN, clean light theme
- [x] Counter + chat card layout, no gradient
- [x] Test: status 200, Tailwind CDN OK

---

### Sprint 16: Welcome Page Redesign (Laravel-style) — DONE 2026-10-10

- [x] Dark theme welcome — logo besar, tagline, footer links
- [x] Counter + chat di bawah hero
- [x] Test: 6/6 OK

---

### Sprint 17: Design Tokens Consistency — DONE 2026-10-10

- [x] README + docs index — design tokens section
- [x] Welcome page — warna persis dari website
- [x] Test: 6/6 OK

---

### Sprint 18: Logo Integration — DONE 2026-10-10

- [x] Logo di website, template, README, docs
- [x] `brand/` — logo kit lengkap (dark, light, wordmark, favicon, PWA icons)

---

### Sprint 19: Logo Fix + Banner — DONE 2026-10-10

- [x] Fix clipping — stroke-based arcs, no clipping
- [x] Warna berbeda per arc (putih + emerald terang + dot emerald)
- [x] `brand/readme-banner.svg` — banner 1200×400 untuk README
- [x] Favicon re-export

---

### Sprint 20: `axero build` — Production Build Command — DONE 2026-10-10

- [x] CLI `axero build` — copy ke `dist/`, skip `node_modules`/`.git`
- [x] `dist/manifest.json` — build timestamp
- [x] Test: 6/6 OK — dist server jalan (HTTP 200)
- [ ] Production optimize — minify, bundle (add saat butuh)

---

### Sprint 21: Core Reliability — Test Suite + API Audit + Error Handling — DONE 2026-10-12

**Konteks:** progress sering keluar dari inti framework + CLI sering error saat dipakai. Root cause: CLI tidak punya test (error muncul saat user coba, bukan saat development).

- [x] `tests/cli.test.mjs` — test suite `node:test` (native, zero dep): `--version`, `--doctor`, usage, `create` (ok/existing/no-name), `build` (manifest/skip node_modules), integration `create → build → run → HTTP 200`.
- [x] `npm test` → `node --test "tests/*.test.mjs"` — 11/11 OK.
- [x] Core API audit — semua API di `docs/API.md` terverifikasi ada di `packages/` (createServer/get/post/loadRoutes/listen, signals, hmr, createWS+cors, createORM 4 drivers, subpath exports `./signals` `./hmr` OK).
- [x] Error handling audit — 2 gap fixed:
  - `createORM({ driver: 'typo' })` dulu silently fallback ke JSON → sekarang error + list valid driver.
  - `loadRoutes('./nope')` dulu throw ENOENT mentah → sekarang "Routes folder not found: ... create it or fix path".
- [x] `tests/errors.test.mjs` — 2 test error message.
- [ ] CLI error patterns historis (arg parsing, path levels, cpSync self-copy) — dicegah oleh test suite.

---

### Sprint 22: Monorepo Hardening (`docs/tasks/opencode_task_monorepo_hardening.md`) — DONE 2026-10-12

Semua item DoD dari task file terpenuhi:

- [x] **CI/CD** — `.github/workflows/ci.yml`: push/PR → main+develop, matrix Node 20.x/22.x ubuntu, checkout → setup-node (npm cache) → `npm ci || npm install` → `npm test`.
- [x] **Test suite terpusat** `tests/` (native `node:test`, zero dep) — 28/28 OK:
  - `core-http.test.mjs` (5) — lifecycle, static text/JSON, `[id]` params, method isolation, 404.
  - `ws-handshake.test.mjs` (6) — RFC vector `acceptKey`, live 101, unmask, CSWSH reject/allow, broadcast 2 client.
  - `signals.test.mjs` (4) — get/set, rerun, same-value no-rerun, self-mutation terminates.
  - `orm-json.test.mjs` (2) — CRUD lifecycle, persist lintas instance.
  - `cli.test.mjs` (9) + `errors.test.mjs` (2) — dari Sprint 21.
- [x] **Type definitions** — `packages/core/index.d.ts` + `signals.d.ts` + `hmr.d.ts`, `packages/ws/index.d.ts`, `packages/orm/index.d.ts`. Semua `package.json` punya `"types"` + `exports` condition `"types"` + field `"files"` whitelist (cli: `bin` saja).
- [x] **LICENSE** (MIT 2026, Hexaverse Technology - Akmal Raditya Wijaya) + **`.editorconfig`**.
- [x] **Workspace audit** — symlink normal (`npm ls`), `playground/basic-test` terisolasi sandbox, tidak ada anomali `node_modules`.
- [x] Doc fix: `docs/API.md` — `ws.broadcast` comment "kecuali sender" → "ke semua client" (match implementasi).

---

### Sprint 23: Template System (3 jenis) + Core Static/POST — DONE 2026-10-12

Konteks: perbaikan inti framework di bagian templates. 3 jenis template + fix bug yang bikin template rusak di browser/luar repo.

**Core fixes:**
- [x] `app.static(dir)` — static file serving (fallback setelah route), `/`→`index.html`, tolak `..` traversal, content-type by ext. ponytail: tanpa cache/ETag/gzip — add saat traffic nyata.
- [x] `loadRoutes` — named export `POST` di file route sekarang di-register (dulu GET-only).
- [x] Test: static 200/index/traversal, POST export — OK.

**Template bugs fixed:**
- [x] **Signals di browser** — import map `@axero/core/signals` → `/signals` + route `routes/signals.mjs` (resolve source via `createRequire`). Dulu bare specifier gagal di browser.
- [x] **Logo 404** — path `../../../brand/` keluar app root → pindah jadi `client/logo.svg` served via `app.static`.
- [x] **`workspace:*`** → versi `"0.1.0-alpha"` + ponytail comment (ceiling: app luar repo jalan setelah npm publish).

**3 Template (`templates/`):**
- [x] `default/` — fullstack showcase (isi minimal lama + semua fix di atas).
- [x] `minimal/` — barebone: 1 route, ~10 baris, tanpa client/WS.
- [x] `backend-only/` — REST (GET+POST via ORM JSON) + WS welcome, tanpa frontend.

**CLI:**
- [x] `axero create <name> [template]` — default `default`, validasi `readdirSync('templates/')`, error tampilkan list template valid.
- [x] Test: create default/minimal/backend-only/invalid — OK. Integration: `/`, `/signals` (isi `createSignal`), `/logo.svg`, `/app` — 4/4 OK.

**Docs:** `docs/API.md` (app.static, POST export, CLI [template]), `README.md`, `docs/architecture.md` (3 template).

---

### Sprint 24: `axero dev` — Port Pre-flight + Orphan Process Cleanup — DONE 2026-10-12

Konteks: loop `EADDRINUSE` + `Failed running server.mjs` saat `axero dev` diulang — orphan process pegang port.

- [x] **Pre-flight port check** — probe `net.connect` sebelum spawn; port busy → `FAIL: port X dipakai proses lain` + hint kill/`PORT=` → exit 1, tanpa spawn proses yang pasti gagal.
- [x] **Child cleanup** — simpan ref child; `exit`/`SIGINT`/`SIGTERM` → kill child. Windows: `taskkill /T /F` (process tree: `node --watch` + `server.mjs`). ponytail: Windows-only, unix cukup `child.kill()`.
- [x] Test: `axero dev refuses busy port` (occupy ephemeral port → exit 1 + pesan). 35/35 OK.
- [ ] Restart otomatis saat port bebas lagi — add jika user minta (bukan bug).
