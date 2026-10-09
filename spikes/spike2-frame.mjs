import assert from 'node:assert/strict';

// ponytail: no fragmentation/continuation, server frames ≤65535 bytes — add 64-bit len + streaming when needed.

export function encode(payload, opcode = 0x1) {
  const data = Buffer.from(payload);
  const len = data.length;
  const head = len < 126 ? [0x80 | opcode, len] : [0x80 | opcode, 126, (len >> 8) & 0xff, len & 0xff];
  return Buffer.concat([Buffer.from(head), data]);
}

export function decode(buf) {
  const fin = (buf[0] & 0x80) !== 0;
  const opcode = buf[0] & 0x0f;
  const masked = (buf[1] & 0x80) !== 0;
  let len = buf[1] & 0x7f;
  let off = 2;
  if (len === 126) {
    len = buf.readUInt16BE(2);
    off = 4;
  }
  const mask = masked ? buf.subarray(off, off + 4) : null;
  if (masked) off += 4;
  const payload = buf.subarray(off, off + len);
  if (masked) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
  return { fin, opcode, payload: Buffer.from(payload) };
}

if (process.argv[1]?.endsWith('frame.mjs')) {
  // RFC-style masked "Hello": 81 85 37 fa 21 3d 7f 9f 4d 51 58
  const hello = decode(Buffer.from([0x81, 0x85, 0x37, 0xfa, 0x21, 0x3d, 0x7f, 0x9f, 0x4d, 0x51, 0x58]));
  assert.equal(hello.opcode, 0x1);
  assert.equal(hello.payload.toString(), 'Hello');
  assert.equal(decode(encode('halo')).payload.toString(), 'halo'); // server roundtrip
  assert.equal(decode(Buffer.from([0x89, 0x00])).opcode, 0x9); // ping
  assert.equal(decode(Buffer.from([0x88, 0x00])).opcode, 0x8); // close
  console.log('spike2 OK: text unmask + encode + ping/close');
}
