# AXERO.JS Task Backlog & Immediate TODOs

*Status: Aktif (Tahap Paling Awal / Pre-Alpha)*  
*Prinsip Pengerjaan: Selesaikan tugas fundamental sebelum menambahkan fitur kompleks.*

---

### Sprint 0: Inisialisasi Repositori & Monorepo Bootstrap (Prioritas Tertinggi) — DONE 2026-10-08, npm workspaces (tanpa pnpm/turbo, YAGNI)

- [x] **Setup Workspace Root**
  - [x] Jalankan `git init` pada root repository.
  - [x] Buat file `package.json` root dengan konfigurasi `"private": true`.
  - [x] Buat file `pnpm-workspace.yaml` yang mendaftarkan folder `packages/*`, `templates/*`, dan `playground/*`.
  - [x] Siapkan file `.gitignore` standar Node.js (abaikan `node_modules`, `dist`, `.env`).
- [x] **Konfigurasi TypeScript Global**
  - [x] Buat `tsconfig.base.json` dengan `"strict": true`, `"target": "ES2022"`, `"moduleResolution": "NodeNext"`.
- [x] **Persiapan Paket Internal Awal**
  - [x] Folder `packages/core` + `package.json` (`name: "@axero/core"`).
  - [x] Folder `packages/ws` + `package.json` (`name: "@axero/ws"`).
  - [x] Folder `packages/cli` + `package.json` (`name: "@axero/cli"`).
  - [x] Pasang script build awal (SKIP tsup/tsc build — `.mjs` stdlib-only jalan tanpa compile, add saat butuh bundle client).

---

### Sprint 1: Prototipe Server Core & WebSocket Handshake (`PoC`)

- [x] **HTTP Server Minimal (`@axero/core`)**
  - [x] Buat fungsi `createServer()` yang membungkus `node:http`.
  - [x] Sediakan registrasi handler URL sederhana (`app.get(path, handler)`).
  - [x] Pastikan server dapat merespons string dan JSON.
- [x] **WebSocket Upgrader (`@axero/ws`)**
  - [x] Buat fungsi `createWS(server)`.
  - [x] Tangani event `'upgrade'` dari server HTTP.
  - [x] Implementasikan perhitungan hash `Sec-WebSocket-Accept` (SHA-1 + GUID).
  - [x] Kirim respon `101 Switching Protocols` ke socket client.
  - [x] Implementasikan pembacaan frame data teks dasar (parsing opcode `0x1` dan decoding payload dengan masking key).
  - [x] Implementasikan pengiriman frame data dari server ke client tanpa mask (sesuai RFC 6455).
- [x] **Uji Coba Lapangan (Playground)**
  - [x] Buat file `playground/basic-test/server.mjs` (`.mjs` bukan `.ts` — tanpa toolchain).
  - [x] Hubungkan client browser biasa ke server dan pastikan pesan dua arah (*bidirectional*) berhasil terkirim.

---

### Sprint 2: CLI Runner Sederhana (`@axero/cli`) — DONE 2026-10-08

- [x] Setup file binary executable di `packages/cli/bin/axero.mjs` (`#!/usr/bin/env node`).
- [x] Integrasikan parser argumen baris perintah (`node:util parseArgs`).
- [x] Buat perintah `axero --version` (membaca versi saat ini dari package.json).
- [x] Buat perintah `axero doctor` untuk memverifikasi versi Node.js sistem (wajib >= 20.x).
- [x] Buat perintah `axero dev` (menjalankan server development lokal dari folder yang ditunjuk).
- [x] Buat perintah `axero create <app-name>` (copy `templates/minimal` ke folder tujuan).

---

### Sprint 3: Eksperimen Sinyal Sisi Client (`@axero/core/client`) — DONE 2026-10-08

- [x] Tulis primitif `createSignal<T>(initialValue)` dengan getter dan setter.
- [x] Tulis primitif `createEffect(callback)` yang mendaftar subscriber aktif saat getter dipanggil.
- [x] Pastikan tidak ada infinite loop saat sinyal dimutasi di dalam efek.
- [x] Uji coba manipulasi elemen HTML native langsung di browser tanpa Virtual DOM (via `templates/minimal/client`).

---

### Sprint 4: Starter Template & Verifikasi v0.1.0-alpha — DONE 2026-10-08

- [x] Buat folder starter di `templates/minimal/` (berisi server HTTP + script koneksi WS sederhana).
- [x] Sempurnakan perintah `axero create <app-name>` agar meng-copy template tersebut ke direktori baru.
- [x] Lakukan uji coba menyeluruh dari sudut pandang pengguna baru (*clean machine test*) — HTTP 200 + WS broadcast OK.
- [x] Fix `EADDRINUSE` — error message actionable dengan hint `PORT=<port>` (bukan crash trace).
- [x] Rapikan catatan rilis awal dan tag commit pertama sebagai `v0.1.0-alpha`.

---

### Sprint 5: File-Based Routing (`@axero/core/router`) — DONE 2026-10-09

- [x] `scanRoutes(dir)` — scan folder `routes/`, filename → path (`index` → `/`, `[id]` → `:id`).
- [x] `matchPath(pattern, path)` — regex match + extract params ke `req.params`.
- [x] `app.loadRoutes(dir)` — auto-import + register semua file `.mjs` di folder.
- [x] Template `minimal` pakai `loadRoutes` untuk semua routes.
- [x] Test end-to-end: `/`, `/about`, `/item-123` (param), `/app`, 404 — semua OK.

---

### Sprint 6: Landing Page (`website/`) — DONE 2026-10-09

- [x] `website/index.html` — split hero + code example, 4 features, quickstart section.
- [x] No gradient, no external resources, system font stack.
- [x] Responsive: mobile collapse, nav hamburger-ready.