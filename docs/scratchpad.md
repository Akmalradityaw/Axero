# AXERO.JS Scratchpad & Research Lab

*Tujuan Dokumen:*  
Tempat bebas untuk core team dan asisten AI menuliskan catatan kasar (*scratch notes*), ide mentah, hipotesis eksperimen, snippet kode uji coba (*spikes*), dan kendala teknis yang ditemui sebelum dirapikan ke dokumen resmi.

---

### 1. Eksperimen Aktif (*Current Spikes*)

#### Spike: Handshake WebSocket Native (RFC 6455)
* **Hipotesis:** Apakah kita bisa meng-upgrade HTTP request ke WebSocket connection dengan < 50 baris kode Node.js native tanpa library eksternal?
* **Snippet Eksperimen:**
```typescript
import http from 'node:http';
import crypto from 'node:crypto';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AXERO HTTP Engine Active');
});

server.on('upgrade', (req, socket, head) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  // MAGIC GUID RFC 6455: 258EAFA5-E914-47DA-95CA-C5AB0DC85B11
  const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  const acceptKey = crypto
    .createHash('sha1')
    .update(key + GUID)
    .digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
  ];

  socket.write(headers.concat('\r\n').join('\r\n'));
  console.log('[WS] Handshake berhasil di port yang sama!');

  // TODO: Implementasikan frame parser (unmasking data binary/text)
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
```
* **Hasil Pengujian Awal:** Berhasil terhubung via Chrome Console `new WebSocket('ws://localhost:3000')`. Socket tetap terbuka (101 Switching Protocols).

#### Hasil Verifikasi Fase 0 (2026-10-08, Node v20.20.2)
* **Spike 1 `spikes/spike1-handshake.mjs` (42 baris):** PASS — vektor RFC (`dGhlIHNhbXBsZSBub25jZQ==` → `s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`) + handshake raw-socket live ke ephemeral port balas `101 Switching Protocols`.
* **Spike 2 `spikes/spike2-frame.mjs` (38 baris):** PASS — decode masked `Hello`, roundtrip `encode→decode`, opcode ping `0x9` / close `0x8`.
* **Spike 3 `spikes/spike3-signal.mjs` (48 baris, <80):** PASS — `createSignal/createEffect` rerun tepat 3x untuk 2 mutasi, `set` nilai sama tidak rerun (no loop).
* **DoD Fase 0:** terpenuhi — 3 skrip mandiri stdlib-only, tanpa npm dep, tanpa monorepo.

---

### 2. Catatan Kendala & Hal Kritis (*Gotchas & Edge Cases*)

* **Masking Key pada Frame Client:**  
  Setiap frame data yang dikirim dari browser ke server **wajib** di-unmask menggunakan masking key 4-byte yang ada di header payload. Jika lupa unmask, payload teks akan terbaca sebagai karakter acak/rusak.
* **TCP Socket Hangup:**  
  Jika client menutup tab browser secara tiba-tiba tanpa mengirim frame *Close*, server harus menangani event `socket.on('error')` dan `socket.on('close')` agar tidak memicu memory leak atau crash pada proses Node.js.
* **CORS Header pada Handshake:**  
  Saat proses upgrade socket, kita harus memvalidasi header `Origin` untuk mencegah eksploitasi Cross-Site WebSocket Hijacking (CSWSH).

---

### 3. Bank Ide Mentah (*Unrefined Ideas / Backlog Ide*)

* [ ] **Ide Syntax DSL Template:** Apakah kita sebaiknya memakai JSX/TSX standar atau membuat compiler template ringan berbasis tag function ES6 (misal: `html\`<div>${count()}</div>\``)? JSX standar lebih ramah tooling IDE (Intellisense).
* [ ] **CLI Mascot & ASCII Banner:** Buat logo terminal ASCII yang ramping untuk perintah `axero` agar branding terasa konsisten dan menyenangkan saat developer menjalankan `axero dev`.
* [ ] **TUI Dashboard:** Eksplorasi library berbasis Blessed/Ink untuk tampilan database studio di terminal pada fase mendatang.