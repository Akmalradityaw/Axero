# AXERO.JS System Architecture & Technical Design

*Dokumen ini merupakan cetak biru teknis (*technical blueprint*) yang dirancang untuk memandu pengembangan dari tahap nol (PoC) hingga sistem utuh.*

---

### 1. Monorepo Package Topology (Target Desain)

Framework dikembangkan menggunakan struktur monorepo agar setiap modul dapat diuji secara independen namun tetap terintegrasi secara harmonis.

```text
axero (Root Monorepo)
 ├── packages/
 │    ├── cli/       (@axero/cli)      --> Entry point terminal, runner perintah dev & create
 │    ├── core/      (@axero/core)     --> Runtime HTTP server, file router, reactivity engine
 │    ├── ws/        (@axero/ws)       --> Modul koneksi & pub/sub native WebSocket
 │    └── orm/       (@axero/orm)      --> Abstraksi database & migrasi (fase berikutnya)
 ├── templates/                        --> Template starter proyek pengguna
 │    ├── minimal/                     --> Starter paling sederhana untuk pengujian
 │    └── fullstack/                   --> Starter client + server + WS lengkap
 └── playground/                       --> Area uji coba lokal langsung (dogfooding)
```

#### Alur Dependensi Antar Package
```text
┌──────────────┐
│  @axero/cli  │ ──► Menjalankan orkestrasi build, dev, dan generator
└──────┬───────┘
       │
       ▼
┌──────────────┐      ┌────────────┐
│  @axero/core │ ◄─── │ @axero/ws  │ (Koneksi WS menempel pada HTTP Server core)
└──────┬───────┘      └────────────┘
       │
       ▼
┌──────────────┐
│  @axero/orm  │ (Layer terisolasi untuk manipulasi database - Fase lanjutan)
└──────────────┘
```

---

### 2. Siklus Hidup Request & Koneksi (Request Lifecycle)

Target arsitektur runtime menangani request HTTP standar dan WebSocket upgrade dalam satu port listener:

```text
[ Permintaan Masuk (Port :3000) ]
               │
               ▼
      [ HTTP Connection Listener ]
               │
               ├─── [ Header 'Upgrade: websocket'? ]
               │             │
               │             ├── YA  ──► Oper ke [@axero/ws]
               │             │             ├── Autentikasi / Handshake
               │             │             ├── Registrasi Socket ke Room
               │             │             └── Event Listener (Ping/Pong/Message)
               │             │
               │             └── TIDAK ─► Oper ke [@axero/core]
               │                           ├── Middleware (CORS, Parser)
               │                           ├── REST Controller / Static Asset
               │                           └── Server Render (SSR / HTML Response)
```

---

### 3. Prioritas Implementasi Subsystem

Pengembangan modul dibagi menjadi tahapan logis agar fondasi awal kokoh:

#### Prioritas 1: Server & WS Engine (`@axero/core` + `@axero/ws`)
* Memanfaatkan modul native `node:http` untuk mendengarkan port.
* Menangani proses *upgrade* socket TCP ke protokol WebSocket (RFC 6455) tanpa dependensi eksternal berat.
* Menyediakan API sederhana untuk server:
  ```typescript
  // Target API PoC
  import { createServer } from '@axero/core';
  import { createWS } from '@axero/ws';

  const app = createServer();
  const ws = createWS(app);

  ws.on('connection', (client) => {
    client.send('connected', { time: Date.now() });
  });
  ```

#### Prioritas 2: Client Signal Reactivity (`@axero/core/client`)
* Menerapkan konsep *Fine-Grained Signals*:
  * `createSignal<T>(initialValue)`: Menyimpan data dan daftar fungsi pelacak (*subscribers*).
  * `createEffect(fn)`: Menjalankan eksekusi ulang otomatis ketika sinyal di dalamnya berubah.
* Menghindari virtual DOM; langsung memperbarui elemen DOM melalui pemanggilan mutasi node native.

#### Prioritas 3: CLI Developer Experience (`@axero/cli`)
* Menyediakan perintah `axero create` yang menyalin template dari folder `templates/` ke komputer pengguna.
* Menyediakan perintah `axero dev` yang menyalakan server dengan watch mode menggunakan Node.js native watch atau bundler berbasis esbuild.

#### Prioritas 4 (Masa Depan): ORM & Routing Kompleks
* File-based routing berbasis Radix-Tree.
* Database abstraction layer (`@axero/orm`) untuk multi-driver (MySQL, SQLite, PostgreSQL).