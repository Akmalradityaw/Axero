# AXERO.JS Memory Bank & Architectural Decision Records (ADR)

*Tujuan Dokumen:*  
Dokumen ini berfungsi sebagai memori persisten jangka panjang bagi developer dan asisten AI agar konteks proyek, prinsip tak terbantahkan (*invariants*), dan alasan di balik setiap keputusan arsitektur tidak hilang di tengah proses pengembangan.

---

### 1. Profil Proyek Singkat
* **Nama Framework:** AXERO.JS
* **Pencipta / Inisiator:** Akmal Raditya Wijaya (Hexaverse Technology / Hexatech)
* **Status Terkini:** Greenfield / Inisiasi (Tahap Nol, Belum Rilis, Belum Ada Versi Stabil)
* **Target Milestone Pertama:** `v0.1.0-alpha` (Proof of Concept & Minimal Viable Framework)
* **Bahasa Utama:** TypeScript (Strict Mode)
* **Runtime Target:** Node.js (>= v20.x), Bun (evaluasi kompatibilitas)

---

### 2. Aturan Mutlak Proyek (*Core Invariants*)

Aturan-aturan berikut adalah ketetapan permanen yang **TIDAK BOLEH** dilanggar tanpa konsensus arsitektural:

1. **Zero External WS Runtime Dependency:**  
   Paket `@axero/ws` wajib mengimplementasikan protokol WebSocket menggunakan pustaka standar Node.js (`node:http`, `node:crypto`, `node:stream`). Dilarang menambahkan dependensi seperti `ws` atau `socket.io` ke dalam runtime inti.
2. **Kemandirian Modul Core:**  
   `@axero/core` dan `@axero/ws` tidak boleh memiliki ketergantungan impor terhadap `@axero/cli`. CLI hanyalah *consumer* dan *orchestrator*.
3. **No Phantom Versions:**  
   Jangan merujuk framework ini sebagai rilis stabil (misal: "v2.0.0 Stable") dalam dokumentasi teknis atau kode program sebelum target `v1.0.0` resmi tercapai melalui tahapan pengujian nyata.
4. **Actionable Errors:**  
   Setiap pesan error fatal di terminal wajib menyediakan solusi atau instruksi konkret (*hint*) untuk pengguna.

---

### 3. Architectural Decision Records (ADR Log)

#### ADR-001: Penggunaan Monorepo Berbasis PNPM Workspace
* **Konteks:** Framework terdiri dari beberapa modul yang saling terkait (`cli`, `core`, `ws`, starter templates).
* **Keputusan:** Menggunakan `pnpm` dengan workspace protocol (`workspace:*`).
* **Alasan:** Efisiensi penyimpanan disk via symlink, eksekusi script cepat, serta isolasi dependensi yang ketat antar paket internal.

#### ADR-002: Arsitektur Single-Port HTTP & WebSocket Upgrade
* **Konteks:** Banyak developer fullstack mengeluhkan kerumitan mengatur port terpisah (misal port 3000 untuk web dan port 8080 untuk WS) yang memicu isu CORS dan routing reverse-proxy.
* **Keputusan:** Menangkap event `'upgrade'` pada instance `http.Server` Node.js native dan memvalidasi handshake RFC 6455 pada port yang sama dengan HTTP server.
* **Alasan:** Menyederhanakan mental model pengembang: satu aplikasi, satu alamat, satu port.

#### ADR-003: Reaktivitas Sisi Client Berbasis Sinyal (Tanpa Virtual DOM)
* **Konteks:** Virtual DOM diffing menambah ukuran bundle runtime dan overhead komputasi untuk pembaruan data yang sering terjadi pada aplikasi real-time.
* **Keputusan:** Menggunakan model *Fine-Grained Reactivity* primitif (`createSignal`, `createEffect`) yang langsung memperbarui node DOM target.
* **Alasan:** Menjaga ukuran runtime bundle tetap sangat ramping (`≤ 20 KB`) dan mempercepat respon visual saat data real-time masuk.

#### ADR-004: Strategi Penomoran Versi Pre-Release (`0.x.x`)
* **Konteks:** Menghindari ekspektasi kestabilan berlebih dari komunitas developer saat framework masih dalam tahap eksperimen.
* **Keputusan:** Seluruh rilis awal menggunakan skema `0.1.0-alpha`, `0.1.x`, dan `0.2.x-beta`. API publik dapat berubah (*breaking changes*) antar minor version hingga mencapai `1.0.0`.
* **Alasan:** Kepatuhan terhadap Semantic Versioning (SemVer) untuk produk dalam tahap fondasi awal.