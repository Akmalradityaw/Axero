# AXERO.JS Technical Design Principles & API Ergonomics

*Status: Greenfield Draft / RFC (Request for Comments)*  
*Fase Proyek: Pre-Alpha / Inception*

Dokumen ini mendefinisikan filosofi desain antarmuka kode (API ergonomics), pola internal arsitektur, serta kompromi teknis (*trade-offs*) yang disepakati untuk pengembangan **AXERO.JS**.

---

### 1. Filosofi Desain Inti

1. **Explicit over Magic:**  
   Meskipun AXERO menganut *convention-over-configuration*, alur data dan siklus hidup koneksi tidak boleh tersembunyi di balik abstraksi berlebihan. Pengembang harus selalu dapat melacak dari mana sebuah *state* berasal dan ke mana event dikirimkan.
2. **Minimal Runtime Overhead:**  
   Setiap kilobyte yang dikirimkan ke client harus memiliki justifikasi fungsional yang kuat. Hindari lapisan komputasi ganda (seperti parsing ulang data yang sama di server dan client).
3. **Unified Protocol Interface:**  
   Protokol HTTP dan WebSocket tidak diperlakukan sebagai dua server terpisah, melainkan dua cara komunikasi yang berbagi konteks aplikasi yang sama (autentikasi, shared state, dan konfigurasi server).

---

### 2. Eksplorasi Ergonomi API (Target Bentuk Kode)

Berikut adalah cetak biru antarmuka (*API contracts*) yang dituju untuk pembuktian konsep awal (*Proof of Concept*):

#### 2.1 Server & Real-Time Handler (`@axero/core` + `@axero/ws`)
Target kode server harus ringkas, intuitif, dan tidak mewajibkan pustaka eksternal pihak ketiga:

```typescript
import { createServer } from '@axero/core';
import { createWS } from '@axero/ws';

const app = createServer({
  port: 3000,
});

// Endpoint HTTP REST Standar
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Integrasi WebSocket native pada server yang sama
const ws = createWS(app);

ws.on('connection', (socket) => {
  console.log(`Client terhubung: ${socket.id}`);

  socket.on('chat:message', (payload) => {
    // Broadcast pesan ke seluruh client di room yang sama
    ws.to('general').emit('chat:message', {
      sender: socket.id,
      text: payload.text,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client terputus: ${socket.id}`);
  });
});

app.listen();
```

#### 2.2 Client Reactivity: Fine-Grained Signals (`@axero/core/client`)
Menghindari Virtual DOM diffing dengan menerapkan reaktivitas berbasis fungsi pengamat (*dependency graph*):

```typescript
import { createSignal, createEffect } from '@axero/core/client';

// 1. Deklarasi Sinyal Primitif
const [count, setCount] = createSignal<number>(0);

// 2. Efek Otomatis (Re-run saat dependency sinyal berubah)
createEffect(() => {
  const el = document.getElementById('counter-display');
  if (el) el.textContent = `Jumlah klik: ${count()}`;
});

// 3. Mutasi Nilai
setCount((prev) => prev + 1);
```

---

### 3. Kompromi Teknis & Batasan Desain (*Trade-offs*)

| Keputusan Desain | Keuntungan | Konsekuensi / Batasan Awal |
| :--- | :--- | :--- |
| **Native HTTP Upgrade** (Single Port) | Setup nol untuk WS, hemat resource, tidak butuh reverse proxy terpisah saat dev. | Mengharuskan runtime yang mendukung *persistent socket* (Node.js/Bun VPS/Container), tidak cocok langsung untuk serverless murni (AWS Lambda). |
| **Fine-Grained Signals** (No Virtual DOM) | Ukuran bundle runtime sangat kecil (`< 20 KB`), mutasi DOM cepat dan tepat sasaran. | Diperlukan compiler atau pola templating khusus agar developer tidak perlu melakukan binding DOM manual seumur hidup. |
| **Zero External WS Library** (RFC 6455 Native) | Dependensi nol, kontrol penuh pada alokasi memory buffer dan overhead handshake. | Tim inti wajib menangani *frame parsing*, *masking key*, dan *fragmentation* secara mandiri dan aman dari celah memori. |

---

### 4. Konvensi Penamaan & Struktur Modul Internal

1. **Paket Core:**  
   Semua modul internal menggunakan prefix `@axero/*` (`@axero/core`, `@axero/ws`, `@axero/cli`).
2. **Error Naming:**  
   Semua class error internal diturunkan dari class dasar `AxeroError` dengan kode terstandar (misal: `ERR_WS_HANDSHAKE_FAILED`, `ERR_PORT_IN_USE`).
3. **Internal Helpers:**  
   Fungsi internal yang tidak di-export ke publik wajib diletakkan dalam subfolder `internal/` atau diberi prefiks `_` jika berada dalam file yang sama.