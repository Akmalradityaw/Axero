import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../packages/core/src/index.mjs';
import { createORM } from '../packages/orm/src/index.mjs';

test('createORM rejects unknown driver with valid list', async () => {
  await assert.rejects(
    () => createORM({ driver: 'mongo' }),
    /Unknown driver "mongo".*json, sqlite, mysql, supabase/,
  );
});

test('loadRoutes missing folder gives actionable error', async () => {
  const app = createServer();
  await assert.rejects(() => app.loadRoutes('./no-such-routes'), /Routes folder not found/);
});
