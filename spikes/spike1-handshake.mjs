import http from 'node:http';
import crypto from 'node:crypto';
import net from 'node:net';
import assert from 'node:assert/strict';

// ponytail: no Origin check, no extensions/subprotocol, close/error cleanup minimal — add when facing internet clients.

export const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
export const acceptKey = (key) => crypto.createHash('sha1').update(key + GUID).digest('base64');

export function createSpikeServer() {
  const server = http.createServer((_, res) => res.end('AXERO HTTP Engine Active'));
  server.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) return socket.destroy();
    socket.write(
      ['HTTP/1.1 101 Switching Protocols', 'Upgrade: websocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${acceptKey(key)}`, '\r\n'].join('\r\n')
    );
  });
  return server;
}

// self-check: RFC 6455 vector + live raw-socket handshake on ephemeral port
if (process.argv[1]?.endsWith('handshake.mjs')) {
  assert.equal(acceptKey('dGhlIHNhbXBsZSBub25jZQ=='), 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=');
  const server = createSpikeServer();
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const raw = net.connect(port, '127.0.0.1', () => {
    raw.write('GET / HTTP/1.1\r\nHost: x\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n');
  });
  const head = await new Promise((resolve, reject) => {
    raw.once('data', resolve);
    raw.once('error', reject);
  });
  const text = head.toString();
  assert.match(text, /101 Switching Protocols/);
  assert.match(text, /s3pPLMBiTxaQ9kYGzzhZRbK\+xOo=/);
  raw.destroy();
  server.close();
  console.log('spike1 OK: handshake 101 + acceptKey valid');
}
