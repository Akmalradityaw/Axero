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

### Sprint 2: CLI Runner Sederhana (`@axero/cli`)

- [ ] Setup file binary executable di `packages/cli/bin/axero.js` (`#!/usr/bin/env node`).
- [ ] Integrasikan parser argumen baris perintah (bisa memanfaatkan `node:util parseArgs` atau pustaka minimal seperti `citty`/`commander`).
- [ ] Buat perintah `axero --version` (membaca versi saat ini dari package.json).
- [ ] Buat perintah `axero doctor` untuk memverifikasi versi Node.js sistem (wajib >= 20.x).
- [ ] Buat perintah `axero dev` (menjalankan server development lokal dari folder yang ditunjuk).

---

### Sprint 3: Eksperimen Sinyal Sisi Client (`@axero/core/client`)

- [ ] Tulis primitif `createSignal<T>(initialValue)` dengan getter dan setter.
- [ ] Tulis primitif `createEffect(callback)` yang mendaftarkan subscriber aktif saat getter dipanggil.
- [ ] Pastikan tidak ada infinite loop saat sinyal dimutasi di dalam efek.
- [ ] Uji coba manipulasi elemen HTML native langsung di browser tanpa Virtual DOM.

---

### Sprint 4: Starter Template & Verifikasi v0.1.0-alpha

- [ ] Buat folder starter di `templates/minimal/` (berisi server HTTP + script koneksi WS sederhana).
- [ ] Sempurnakan perintah `axero create <app-name>` agar meng-copy template tersebut ke direktori baru.
- [ ] Lakukan uji coba menyeluruh dari sudut pandang pengguna baru (*clean machine test*).
- [ ] Rapikan catatan rilis awal dan tag commit pertama sebagai `v0.1.0-alpha`.