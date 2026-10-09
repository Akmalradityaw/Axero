# AXERO.JS Engineering Standards & Contribution Rules

Dokumen ini berisi pedoman teknis dan prinsip kerja untuk seluruh pengembangan awal framework **AXERO.JS**. Standar ini dirancang agar basis kode tetap bersih, teruji, dan tidak membengkak sejak baris pertama.

---

### 1. Prinsip Monorepo & Batasan Paket

1. **Strict Decoupling:** Modul internal tidak boleh memiliki referensi impor melingkar (*circular dependencies*).
   * `@axero/ws` TIDAK BOLEH bergantung pada `@axero/cli`.
   * `@axero/core` harus dapat berjalan mandiri tanpa mewajibkan `@axero/orm`.
2. **Workspace Dependency Protocol:** Selalu gunakan protokol `workspace:*` pada `package.json` untuk referensi internal antar paket di dalam monorepo.
3. **Prinsip Minimal Dependensi Eksternal:**
   * Utamakan kapabilitas standar Node.js native (`node:http`, `node:crypto`, `node:events`, `node:fs`).
   * Jangan menambahkan pustaka pihak ketiga (npm) jika fungsionalitas tersebut dapat diselesaikan secara aman dan efisien dalam kurun < 100 baris kode native.

---

### 2. Standar TypeScript & Kualitas Kode

1. **Strict Type-Checking:** Seluruh paket wajib mengaktifkan `"strict": true` pada `tsconfig.json`.
2. **No Unchecked `any`:**
   * Hindari penggunaan tipe `any`.
   * Gunakan `unknown` untuk data yang belum terdefinisi strukturnya, lalu terapkan *type narrowing* menggunakan Type Guards.
   * Manfaatkan generic untuk fungsi utilitas yang bersifat universal.
3. **Explicit Return Types:** Seluruh fungsi publik yang di-export dari setiap paket wajib mendefinisikan tipe kembalian (*return type*) secara eksplisit untuk menjaga konsistensi intellisense pengguna.
4. **Pola Penanganan Error:**
   * Hindari melempar string error mentah (`throw "Error"`).
   * Buat class error terstruktur turunan `AxeroError` yang memuat pesan yang jelas dan saran perbaikan (*actionable hint*).

---

### 3. Target Performa Tahap Inisiasi (Aspirasional)

Meskipun pada fase awal fokus utama adalah fungsionalitas (*make it work*), arsitektur harus dirancang agar mampu memenuhi batasan berikut saat memasuki fase beta:

| Area | Target Desain | Catatan |
| :--- | :--- | :--- |
| **Client Bundle (Runtime)** | `≤ 20 KB` (gzipped) | Runtime sinyal awal dan handler koneksi client. |
| **Dev Server Cold Start** | `≤ 250 ms` (Fase Awal) | Ditingkatkan seiring optimasi bundler. |
| **WebSocket Overhead** | Minimal latency | Mengurangi alokasi memory buffer berulang (*buffer pooling*). |

---

### 4. Konvensi CLI & Pengalaman Pengguna (Terminal UX)

Untuk memastikan pengalaman terminal yang bersahabat bagi developer:

1. **Pesan Informasi Terstandarisasi:**
   * Simbol proses/sukses/gagal harus konsisten di seluruh perintah CLI.
2. **Actionable Errors:** Jika perintah gagal, pesan terminal wajib memuat:
   1. Apa kegagalan yang terjadi.
   2. Penyebab kemungkinan.
   3. Tindakan atau opsi perintah yang dapat dijalankan untuk memperbaikinya.

---

### 5. Alur Kerja Git & Versi Awal

1. **Format Commit (Conventional Commits):**
   * Format: `<type>(<scope>): <subject>`
   * Contoh: `feat(core): implement initial http server listener`
   * Contoh: `feat(ws): handle raw connection upgrade handshake`
   * Contoh: `chore(monorepo): setup pnpm workspace configuration`
2. **Strategi Cabang (Branching):**
   * `main`: Branch integrasi utama selama fase pengembangan awal.
   * `feat/<nama-fitur>`: Branch eksplorasi untuk mengimplementasikan modul spesifik sebelum digabungkan ke `main`.
3. **SemVer Pra-Rilis:**
   * Semua versi awal menggunakan skema `0.x.x` (misal: `0.1.0-alpha`, `0.1.0-alpha.1`) untuk menandakan bahwa API publik masih dapat berubah (*breaking changes*) sewaktu-waktu hingga mencapai rilis v1.0.0.