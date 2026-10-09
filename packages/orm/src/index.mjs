import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

// ponytail: JSON driver only, no SQL — add sqlite driver via node:sqlite when needed.
export async function createORM(config = {}) {
  const url = config.url ?? './data.json';
  const path = url.replace('file://', '');
  let data = {};
  try {
    data = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    data = {};
  }

  const save = async () => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(data, null, 2));
  };

  return {
    collection(name) {
      if (!data[name]) data[name] = [];
      const docs = data[name];
      return {
        create: async (doc) => {
          const id = crypto.randomUUID();
          docs.push({ id, ...doc });
          await save();
          return { id, ...doc };
        },
        find: async (filter = {}) =>
          docs.filter((doc) => Object.entries(filter).every(([k, v]) => doc[k] === v)),
        findById: async (id) => docs.find((doc) => doc.id === id),
        update: async (id, updates) => {
          const doc = docs.find((d) => d.id === id);
          if (doc) Object.assign(doc, updates);
          await save();
          return doc;
        },
        delete: async (id) => {
          const idx = docs.findIndex((d) => d.id === id);
          if (idx >= 0) docs.splice(idx, 1);
          await save();
        },
      };
    },
    close: async () => {},
  };
}
