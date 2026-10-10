import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';

// ponytail: text-only broadcast, ≤64KB, no rooms/fragmentation — add rooms + 64-bit len when needed.
export const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
export const acceptKey = (key) => crypto.createHash('sha1').update(key + GUID).digest('base64');

export function encodeFrame(text) {
  const data = Buffer.from(text);
  const n = data.length;
  const head = n < 126 ? [0x81, n] : [0x81, 126, (n >> 8) & 0xff, n & 0xff];
  return Buffer.concat([Buffer.from(head), data]);
}

export function decodeFrame(buf) {
  const opcode = buf[0] & 0x0f;
  let len = buf[1] & 0x7f;
  let off = 2;
  if (len === 126) {
    len = buf.readUInt16BE(2);
    off = 4;
  }
  const mask = (buf[1] & 0x80) !== 0 ? buf.subarray(off, off + 4) : null;
  if (mask) off += 4;
  const payload = buf.subarray(off, off + len);
  if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
  return { opcode, payload: Buffer.from(payload) };
}

export function createWS(app, config = {}) {
  const clients = new Set();
  const bus = new EventEmitter();
  app.node.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) return socket.destroy();

    const origin = req.headers.origin;
    if (config.cors?.origin && origin) {
      const allowed = Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin];
      if (!allowed.includes(origin)) return socket.destroy();
    }

    socket.write(
      ['HTTP/1.1 101 Switching Protocols', 'Upgrade: websocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${acceptKey(key)}`, '\r\n'].join('\r\n')
    );
    clients.add(socket);
    const api = { send: (t) => socket.write(encodeFrame(t)) };
    bus.emit('connection', api);
    socket.on('data', (chunk) => {
      try {
        const { opcode, payload } = decodeFrame(Buffer.from(chunk));
        if (opcode === 0x8) return socket.end();
        if (opcode === 0x9) return socket.write(Buffer.from([0x8a, 0x00])); // pong
        if (opcode !== 0x1) return;
        const text = payload.toString();
        for (const c of clients) {
          if (c === socket || !c.writable) continue;
          try {
            c.write(encodeFrame(text));
          } catch {
            clients.delete(c);
          }
        }
        api.onmessage?.(text);
      } catch {
        socket.destroy();
      }
    });
    socket.on('close', () => clients.delete(socket));
    socket.on('error', () => clients.delete(socket));
  });
  return { on: bus.on.bind(bus), broadcast: (t) => clients.forEach((c) => c.write(encodeFrame(t))) };
}
