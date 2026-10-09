// ponytail: sync effects only, no batching — add queueMicrotask batch when fan-out hurts.
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
