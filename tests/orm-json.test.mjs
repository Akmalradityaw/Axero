import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createORM } from '../packages/orm/src/index.mjs';

const FILE = join(process.cwd(), 'tests', '.tmp-orm.json');

after(() => rmSync(FILE, { force: true }));

test('JSON driver: full CRUD lifecycle', async () => {
  const orm = await createORM({ url: FILE });
  const users = orm.collection('users');

  const created = await users.create({ name: 'Akmal' });
  assert.ok(created.id);

  const found = await users.find({ name: 'Akmal' });
  assert.equal(found.length, 1);

  const byId = await users.findById(created.id);
  assert.equal(byId.name, 'Akmal');

  await users.update(created.id, { name: 'Raditya' });
  assert.equal((await users.findById(created.id)).name, 'Raditya');

  await users.delete(created.id);
  assert.equal((await users.find()).length, 0);
});

test('JSON driver: data persists across instances', async () => {
  const orm1 = await createORM({ url: FILE });
  await orm1.collection('items').create({ sku: 'AX-1' });

  const raw = JSON.parse(readFileSync(FILE, 'utf8'));
  assert.equal(raw.items.length, 1);

  const orm2 = await createORM({ url: FILE });
  const items = await orm2.collection('items').find({ sku: 'AX-1' });
  assert.equal(items.length, 1);
});
