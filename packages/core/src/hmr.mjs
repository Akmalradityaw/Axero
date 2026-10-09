import { watch } from 'node:fs';

export function watchFiles(dir, onChange) {
  watch(dir, { recursive: true }, (_, filename) => {
    if (filename) onChange(filename);
  });
}
