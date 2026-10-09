# AXERO.JS Development Phases & Milestone Roadmap

*Status Proyek: Greenfield (Belum Dirilis)*  
*Strategi Versi: SemVer Pra-Rilis (`0.x.x`)*

Dokumen ini memetakan langkah-langkah pengembangan terstruktur dari nol absolut (*greenfield*) hingga rilis alpha fungsional pertama. Setiap fase memiliki kriteria kelulusan (*Definition of Done*) yang jelas sebelum melangkah ke fase berikutnya.

---

```text
[ Fase 0: Riset & PoC ] ──► [ Fase 1: Monorepo Foundation ] ──► [ Fase 2: WS & HTTP Core ] ──► [ Fase 3: CLI Dev Engine ] ──► [ Fase 4: v0.1.0-alpha ]
```

---

### Fase 0: Riset & Eksperimen Mandiri (*Spikes & Feasibility*)
**Fokus:** Memvalidasi hipotesis teknis paling berisiko melalui skrip prototipe kecil tanpa arsitektur monorepo penuh.

* [ ] **Spike 1 (WS Handshake):** Uji coba proses handshake WebSocket RFC 6455 menggunakan native `node:http` dan `node:crypto` (menghitung `Sec-WebSocket-Accept` via SHA-1 hashing).
* [ ] **Spike 2 (Frame Parsing):** Uji coba decoding dan encoding frame data WebSocket dasar (Text frame, Ping, Pong, Close).
* [ ] **Spike 3 (Signal Engine Primitif):** Membuat implementasi `createSignal` dan `createEffect` < 80 baris kode untuk menguji reaktivitas DOM sederhana.
* **Definition of Done (DoD) Fase 0:**
  * Skrip pengujian berjalan mandiri tanpa error di runtime Node.js >= 20.
  * Hasil riset dicatat di `docs/SCRATCHPAD.md`.

---

### Fase 1: Fondasi Monorepo & Tooling
**Fokus:** Membangun struktur kerja monorepo yang bersih, terisolasi, dan mudah di-build.

* [ ] Inisialisasi package manager monorepo (`pnpm-workspace.yaml`).
* [ ] Konfigurasi `tsconfig.base.json` bersama dengan aturan ketat (`"strict": true`).
* [ ] Setup paket awal di `packages/`:
  * `packages/core` (Engine HTTP & Reaktivitas dasar)
  * `packages/ws` (WebSocket protocol handler)
  * `packages/cli` (Runner terminal dan command parser)
* [ ] Setup bundler internal yang cepat (menggunakan `tsup` atau `esbuild`).
* [ ] Buat aplikasi sandbox pertama di `playground/basic-test/` untuk pengujian integrasi lokal.
* **Definition of Done (DoD) Fase 1:**
  * Perintah `pnpm build` berhasil mengompilasi semua paket di `packages/`.
  * Paket di `playground/` dapat mengimpor paket lokal via protokol `workspace:*`.

---

### Fase 2: Implementasi Server Core & Native WebSocket (`@axero/core` + `@axero/ws`)
**Fokus:** Membangun engine runtime yang mampu melayani request HTTP dan meng-upgrade koneksi ke WebSocket pada port yang sama.

* [ ] Buat wrapper HTTP listener berbasis `node:http` di `@axero/core`.
* [ ] Implementasikan router REST minimal (GET, POST, match URL static).
* [ ] Implementasikan listener upgrade socket TCP di `@axero/ws`.
* [ ] Hubungkan event lifecycle WebSocket: `connection`, `message`, `disconnect`.
* [ ] Mekanisme broadcast dasar: kirim pesan ke semua client yang sedang terhubung.
* **Definition of Done (DoD) Fase 2:**
  * Browser atau client WebSocket (seperti curl/wscat) dapat melakukan handshake ke `ws://localhost:3000` dan menerima echo message.
  * Endpoint HTTP `/api` dan WebSocket berjalan berdampingan pada satu port tanpa tabrakan.

---

### Fase 3: Tooling Developer & CLI Sederhana (`@axero/cli`)
**Fokus:** Mempermudah alur kerja developer saat membuat dan menguji proyek.

* [ ] Entry point binary executable (`bin/axero`).
* [ ] Perintah `axero --version` dan `axero --help`.
* [ ] Perintah `axero create <app-name>`: Menghasilkan starter project dari folder `templates/minimal`.
* [ ] Perintah `axero dev`: Menjalankan server lokal dengan mode pemantauan perubahan file (*watch mode* menggunakan native `fs.watch` atau `tsx`).
* **Definition of Done (DoD) Fase 3:**
  * Pengembang dapat menjalankan `./packages/cli/bin/axero dev` di dalam folder playground dan server langsung aktif.

---

### Fase 4: Integrasi Client & Rilis PoC Publik Pertama (`v0.1.0-alpha`)
**Fokus:** Menggabungkan runtime client signal dan server WebSocket menjadi satu starter pack utuh.

* [ ] Integrasi runtime sinyal ke bundle client aplikasi starter.
* [ ] Sinkronisasi state: tombol di UI mengubah nilai sinyal, lalu mengirim event WS ke server, dan server membroadcast ke tab browser lain.
* [ ] Penulisan panduan instalasi dan kontribusi awal (`README.md`).
* [ ] Audit checklist kestabilan dasar & tagging Git `v0.1.0-alpha`.
* **Definition of Done (DoD) Fase 4:**
  * Pengguna baru dapat mengkloning repo, menjalankan template starter, dan melihat aplikasi real-time interaktif berjalan mulus dalam kurun < 2 menit setup.

---

### Fase 5 & Seterusnya (Aspirasional / Masa Depan)
* **v0.2.0-beta:** File-based routing otomatis, Hot Module Replacement (HMR) lanjutan.
* **v0.3.0-beta:** Layer abstraksi database ringan (`@axero/orm`) dan Terminal UI Studio.
* **v1.0.0-rc / Stable:** API Freeze, audit keamanan protokol WS, stress test performa tinggi di bawah ribuan koneksi konkuren.