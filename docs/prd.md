# Product Requirements Document (PRD)
## AXERO.JS Framework Ecosystem

* **Versi Dokumen:** 0.1.0-draft (Greenfield / Inisiasi)
* **Status Proyek:** Konsep & Pre-Development (Belum Rilis / Eksperimental)
* **Target Milestone Awal:** v0.1.0-alpha (Proof of Concept & MVP)
* **Owner:** Hexaverse Technology (Hexatech)
* **Lead Architect:** Akmal Raditya Wijaya
* **Runtime Target:** Node.js (>= v20.x), Bun, Modern Browsers

---

### 1. Executive Summary & Visi Produk

**AXERO.JS** adalah inisiatif riset dan pengembangan framework JavaScript/TypeScript *fullstack* yang mengutamakan kapabilitas **Real-Time First**. Berangkat dari filosofi *"Axel"* (sumbu rotasi) dan *"Zero"* (latensi mendekati nol), framework ini bertujuan membuktikan bahwa aplikasi real-time interaktif dapat dibangun secara elegan tanpa setup server WebSocket terpisah dan tanpa overhead bundle yang besar.

> **Tagline:** *"Build real-time apps like breathing."*

---

### 2. Problem Statement (Mengapa AXERO.JS Dibuat?)

1. **Kompleksitas WebSocket di Framework Fullstack:** Di ekosistem modern (Next.js, Nuxt, Remix), mengintegrasikan WebSocket native membutuhkan standalone server atau layanan pihak ketiga yang memisahkan konteks autentikasi dan routing aplikasi.
2. **Overhead Virtual DOM:** Framework UI modern sering kali membebani komputasi runtime dan ukuran bundle (>70kb) untuk aplikasi dinamis yang sebenarnya hanya membutuhkan reaktivitas data langsung.
3. **Ketergantungan Eksternal Berlebih:** Developer pemula maupun tim kecil sering terbebani oleh keharusan merakit lusinan pustaka (ORM terpisah, WS client/server terpisah, bundler terpisah) hanya untuk prototipe interaktif.

---

### 3. Tiga Pilar AXERO.JS (Target Desain Jangka Panjang)

| Pilar | Target Aspirasional | Rencana Pendekatan Teknis |
| :--- | :--- | :--- |
| **1. Speed** | Startup `< 100ms`, WS latency `< 5ms`, Client runtime bundle ramping (`~15-20kb`) | Eksplorasi Fine-Grained Reactivity (Signal) tanpa Virtual DOM diffing, bundler terpadu berbasis esbuild/tsup. |
| **2. Simplicity** | Satu CLI untuk inisialisasi, *Zero config by default* | Konvensi di atas konfigurasi, *starter template* terintegrasi, konfigurasi terpadu (`axero.config.ts`). |
| **3. Real-Time** | WebSocket sebagai warga kelas satu (*first-class citizen*) | Upgrade koneksi HTTP ke WebSocket secara native pada port yang sama tanpa library eksternal rumit. |

---

### 4. Target Persona Pengguna (Early Adopters)

* **Eksplorator & Independent Developers:** Pembuat aplikasi real-time ringan (chat, multiplayer mini-game, collaborative dashboard) yang ingin setup cepat.
* **Fullstack Engineers:** Developer yang mencari alternatif arsitektur berbasis sinyal yang terintegrasi langsung dari server ke UI.

---

### 5. Ruang Lingkup MVP (Fase 1 - v0.1.0-alpha)

Untuk membuktikan kelayakan arsitektur (*proof of concept*), fitur awal dibatasi pada fungsionalitas inti:

#### 5.1 CLI Sederhana (`@axero/cli`)
* `axero create <app-name>`: Mengkloning template starter (client + server).
* `axero dev`: Menjalankan server HTTP + WebSocket development secara bersamaan.
* `axero doctor`: Validasi dependensi sistem (versi Node.js, package manager).

#### 5.2 Server & Real-Time Core (`@axero/core` & `@axero/ws`)
* HTTP Server dasar dengan dukungan rute REST standar.
* Upgrade koneksi HTTP ke WebSocket pada port yang sama.
* Broadcast event sederhana: kirim pesan antar client yang terhubung.

#### 5.3 Client Reactivity Eksperimental
* Implementasi dasar primitif sinyal (`createSignal`, `createEffect`) untuk pembuktian DOM update tanpa virtual DOM.

---

### 6. Roadmap Pengembangan Bertahap

```text
[ Fase 0: Riset & PoC ] ──► [ Fase 1: v0.1.0-alpha ] ──► [ Fase 2: v0.2.0-beta ] ──► [ Fase 3: v1.0.0 Stable ]
  - Eksperimen Signal        - CLI create & dev          - File-based router        - Ekosistem stabil
  - Eksperimen WS Upgrade    - WS Broadcast Engine       - ORM abstraction layer    - Dokumentasi resmi
  - Monorepo Bootstrap       - Starter Template Dasar    - TUI Database Studio      - Siap Production
```

* **Fase 0 (Pre-Development / Fondasi):**
  * Setup monorepo workspace (pnpm/turborepo).
  * Pengujian isolasi teknis: apakah native WebSocket upgrade berjalan mulus bersama server HTTP Node.js native.
  * Uji coba engine sinyal client-side minimal.
* **Fase 1 (v0.1.0-alpha - Target PoC Publik Pertama):**
  * Publikasi CLI minimal untuk inisialisasi starter project.
  * Komunikasi real-time client-ke-server terverifikasi via perintah CLI dev.
* **Fase 2 (v0.2.0-beta - Pengembangan Ekosistem):**
  * Penambahan file-based routing otomatis.
  * Eksplorasi layer database ORM mandiri (`@axero/orm`).
  * Penyempurnaan Hot Module Replacement (HMR).
* **Fase 3 (v1.0.0 - Rilis Stabil Pertama):**
  * Target rilis stabil setelah pengujian beban (*stress testing*), audit keamanan koneksi WS, dan API publik dinyatakan stabil (*freeze*).