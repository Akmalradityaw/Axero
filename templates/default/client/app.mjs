import { createSignal, createEffect } from '@axero/core/signals';

const [count, setCount] = createSignal(0);
createEffect(() => {
  document.getElementById('out').textContent = 'klik: ' + count();
});
document.getElementById('btn').onclick = () => setCount(c => c + 1);

const ws = new WebSocket('ws://' + location.host);
ws.onmessage = (e) => {
  if (e.data === 'hmr:reload') return location.reload();
  const log = document.getElementById('log');
  log.textContent = e.data + '\n' + log.textContent;
};
document.getElementById('send').onclick = () => {
  const v = document.getElementById('msg').value;
  if (v) ws.send(v);
};
