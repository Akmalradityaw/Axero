import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { createServer } from '../packages/core/src/index.mjs';
import { createWS, acceptKey, decodeFrame } from '../packages/ws/src/index.mjs';

const cleanups = [];
function boot(config) {
  const app = createServer();
  const ws = createWS(app, config);
  app.get('/', (req, res) => res.end('ok'));
  return new Promise((resolve) => {
    app.listen(0).then(() => {
      cleanups.push(app.node);
      resolve({ port: app.node.address().port, ws });
    });
  });
}

function upgrade(port, extra = '') {
  const sock = net.connect(port, '127.0.0.1');
  const buf = [];
  sock.on('data', (d) => buf.push(d));
  sock.write(
    `GET / HTTP/1.1\r\nHost: 127.0.0.1\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n${extra}\r\n`
  );
  return { sock, response: () => Buffer.concat(buf).toString('latin1') };
}

function maskedFrame(text) {
  const data = Buffer.from(text);
  const mask = Buffer.from([0x12, 0x34, 0x56, 0x78]);
  const payload = Buffer.from(data.map((b, i) => b ^ mask[i % 4]));
  return Buffer.concat([Buffer.from([0x81, 0x80 | data.length]), mask, payload]);
}

after(() => cleanups.forEach((s) => s.close()));

test('RFC 6455 accept key vector', () => {
  assert.equal(acceptKey('dGhlIHNhbXBsZSBub25jZQ=='), 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=');
});

test('live handshake returns 101 + correct accept key', async () => {
  const { port } = await boot();
  const { sock, response } = upgrade(port);
  await new Promise((r) => setTimeout(r, 200));
  const res = response();
  assert.match(res, /101 Switching Protocols/);
  assert.match(res, /Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK\+xOo=/);
  sock.destroy();
});

test('decodeFrame unmasks masked client payload', () => {
  const { opcode, payload } = decodeFrame(maskedFrame('hello'));
  assert.equal(opcode, 0x1);
  assert.equal(payload.toString(), 'hello');
});

test('CSWSH: wrong Origin rejected (no 101)', async () => {
  const { port } = await boot({ cors: { origin: 'http://localhost:3000' } });
  const { sock, response } = upgrade(port, 'Origin: http://evil.com\r\n');
  await new Promise((r) => setTimeout(r, 200));
  assert.ok(!response().includes('101'), 'must not upgrade on bad origin');
  sock.destroy();
});

test('CSWSH: allowed Origin upgrades', async () => {
  const { port } = await boot({ cors: { origin: 'http://localhost:3000' } });
  const { sock, response } = upgrade(port, 'Origin: http://localhost:3000\r\n');
  await new Promise((r) => setTimeout(r, 200));
  assert.match(response(), /101 Switching Protocols/);
  sock.destroy();
});

test('broadcast reaches every connected client', async () => {
  const { port, ws } = await boot();
  const a = upgrade(port);
  const b = upgrade(port);
  await new Promise((r) => setTimeout(r, 200));
  ws.broadcast('team');
  await new Promise((r) => setTimeout(r, 200));
  const got = [a.response(), b.response()].filter((r) => r.includes('team'));
  assert.equal(got.length, 2);
  a.sock.destroy();
  b.sock.destroy();
});
