/ponytail full

*Status: DONE 2026-10-12 — 28/28 test OK. Rincian: `docs/TODO.md` Sprint 21–22.*

Bertindaklah sebagai Principal Software Engineer dan DevOps Architect. Lakukan audit, refactoring, hardening, serta implementasi kelengkapan monorepo AXERO.JS yang saat ini berada pada tahap milestone `v0.1.0-alpha`. 

Eksekusi seluruh tugas di bawah ini secara langsung di workspace tanpa merusak atau mengubah kontrak API publik yang telah di-freeze (lihat `docs/API.md`).

---

### Invariants & Batasan Arsitektur Proyek:
1. **Runtime & Modul:** Node.js (minimal 20.x), ESM native (`.mjs`).
2. **Zero-Dependency Rule:** Paket `@axero/ws` dan `@axero/core` WAJIB zero-dependency eksternal (hanya gunakan modul native Node.js: `node:http`, `node:crypto`, `node:events`, `node:fs`, `node:stream`).
3. **API Freeze:** Semua antarmuka di `docs/API.md` (termasuk `createServer`, `createWS`, `createSignal`, `createORM`, dan CLI commands) tidak boleh mengalami *breaking changes*.
4. **No External Test Runner:** Gunakan test runner native Node.js (`node:test` dan `node:assert`). Jangan menginstal Jest, Vitest, atau Mocha.

---

### Instruksi Tugas yang Wajib Dikerjakan:

#### 1. Setup Otomasi CI/CD GitHub Actions
Buat file alur kerja `.github/workflows/ci.yml` dengan spesifikasi:
- Trigger pada event `push` dan `pull_request` ke branch `main` dan `develop`.
- Gunakan matrix OS `ubuntu-latest` dengan Node.js versi `20.x` dan `22.x`.
- Langkah pekerjaan:
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` dengan matrix version dan cache npm/pnpm.
  3. `npm ci` (atau `npm install` jika lockfile belum siap).
  4. Jalankan pengujian otomatis via `npm test`.

#### 2. Migrasi & Standarisasi Test Suite Terpusat (`tests/`)
Pindahkan dan rapikan seluruh uji coba yang sebelumnya tersebar di `spikes/` menjadi test suite terpusat di root direktori `tests/`:
- Gunakan runner native Node.js (`node:test` dan `node:assert/strict`).
- Buat file pengujian berikut:
  - `tests/core-http.test.mjs`: Menguji HTTP server lifecycle, static route handler, dynamic route parameters (`[id]`), serta response JSON & text.
  - `tests/ws-handshake.test.mjs`: Menguji RFC 6455 handshake (`Sec-WebSocket-Accept` SHA-1 GUID), masking key decoding, frame unmasking, CSWSH origin check, dan broadcast.
  - `tests/signals.test.mjs`: Menguji reaktivitas `createSignal` & `createEffect` (rerun akurat saat mutasi, idempotensi tanpa infinite loop).
  - `tests/orm-json.test.mjs`: Menguji JSON driver CRUD lengkap (`create`, `find`, `findById`, `update`, `delete`, serta persistensi file disk).
  - `tests/cli-sanity.test.mjs`: Menguji eksekusi CLI (`axero --version` menghasilkan `0.1.0-alpha`, `axero doctor`).
- Perbarui file `package.json` di root agar script `"test"` memanggil `node --test tests/**/*.test.mjs`.

#### 3. TypeScript Type Definitions (`.d.ts`) & Packaging Hygiene
AXERO.JS adalah framework modern dengan target developer TypeScript. Tambahkan definisi tipe dan rapikan manifest publikasi npm:
- Buat file tipe deklarasi TypeScript untuk paket internal:
  - `packages/core/index.d.ts`: Tipe untuk `createServer`, routing handler (`req.params`, `res.json`), sinyal (`createSignal`, `createEffect`), serta HMR watcher.
  - `packages/ws/index.d.ts`: Tipe untuk `createWS`, options CORS/Origin, socket client instance, serta metode broadcast.
  - `packages/orm/index.d.ts`: Tipe generic untuk `createORM`, antarmuka collection JSON, dan query/execute driver SQLite.
- Audit dan perbarui `package.json` di masing-masing sub-paket (`packages/core`, `packages/ws`, `packages/orm`, `packages/cli`):
  - Tambahkan field `"types": "./index.d.ts"`.
  - Tambahkan field `"files"` (whitelist distribusi) agar hanya folder/file yang relevan (`src`, `bin`, `index.d.ts`, `README.md`) yang terunggah saat `npm publish`.
  - Pastikan subpath exports pada `packages/core/package.json` mendukung impor submodul (misal: `@axero/core/signals` dan `@axero/core/hmr`).

#### 4. File Legalitas & Standar Lingkungan Kerja
- Buat file `LICENSE` di root repositori:
  - Format: Lisensi MIT standar.
  - Tahun: 2026.
  - Pemegang Hak Cipta: Hexaverse Technology (Hexatech) - Akmal Raditya Wijaya.
- Buat file `.editorconfig` di root repositori:
  ```ini
  root = true

  [*]
  indent_style = space
  indent_size = 2
  end_of_line = lf
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true

  [*.md]
  trim_trailing_whitespace = false
  ```

#### 5. Audit Workspace Root & Isolasi Sandbox
- Periksa root `package.json` dan struktur workspace (`workspaces` field):
  - Pastikan folder `playground/basic-test` terisolasi sebagai sandbox pengujian lokal dan tidak menciptakan entri yang mengotori instalasi dependensi root.
  - Bersihkan symlink atau instalasi anomali di `node_modules` jika ada path yang tertaut tidak wajar.

---

### Kriteria Selesai (Definition of Done):
1. Seluruh file baru (`.github/workflows/ci.yml`, `tests/*`, `LICENSE`, `.editorconfig`, `*.d.ts`) tercipta dengan sintaks bersih.
2. Perintah `npm test` dari root repositori berjalan sukses 100% tanpa error di Node.js >= 20.
3. Tidak ada dependensi npm eksternal baru yang ditambahkan ke `@axero/core` dan `@axero/ws`.
4. Berikan rangkuman file yang dibuat/diubah serta instruksi perintah untuk memverifikasinya di terminal lokal.