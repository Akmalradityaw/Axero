import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSignal, createEffect } from '../packages/core/src/signals.mjs';

test('signal get/set + functional update', () => {
  const [get, set] = createSignal(1);
  assert.equal(get(), 1);
  set(2);
  assert.equal(get(), 2);
  set((p) => p + 1);
  assert.equal(get(), 3);
});

test('effect reruns on mutation', () => {
  const [get, set] = createSignal(0);
  let runs = 0;
  createEffect(() => {
    get();
    runs++;
  });
  assert.equal(runs, 1);
  set(1);
  assert.equal(runs, 2);
  set(2);
  assert.equal(runs, 3);
});

test('setting same value does not rerun (no loop)', () => {
  const [get, set] = createSignal('a');
  let runs = 0;
  createEffect(() => {
    get();
    runs++;
  });
  set('a');
  set('a');
  assert.equal(runs, 1);
});

test('effect writing to its own signal terminates', () => {
  const [get, set] = createSignal(0);
  let runs = 0;
  createEffect(() => {
    get();
    runs++;
    if (runs < 3) set(runs);
  });
  assert.equal(runs, 3);
});
