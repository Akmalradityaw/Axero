import assert from 'node:assert/strict';

// ponytail: sync effects only, no batching/scheduler — add queueMicrotask batch when effects fan out.

let current = null;
export function createSignal(v) {
  const subs = new Set();
  const get = () => {
    if (current) subs.add(current);
    return v;
  };
  const set = (next) => {
    const nv = typeof next === 'function' ? next(v) : next;
    if (Object.is(nv, v)) return;
    v = nv;
    [...subs].forEach((fn) => fn());
  };
  return [get, set];
}
export function createEffect(fn) {
  const run = () => {
    current = run;
    try {
      fn();
    } finally {
      current = null;
    }
  };
  run();
}

if (process.argv[1]?.endsWith('signal.mjs')) {
  const [count, setCount] = createSignal(0);
  let runs = 0;
  let seen = '';
  createEffect(() => {
    runs++;
    seen = `klik: ${count()}`;
  });
  assert.equal(seen, 'klik: 0');
  setCount((p) => p + 1);
  setCount((p) => p + 1);
  assert.equal(seen, 'klik: 2');
  assert.equal(runs, 3);
  setCount(2); // same value → no rerun
  assert.equal(runs, 3);
  console.log('spike3 OK: signal+effect rerun, no loop');
}
