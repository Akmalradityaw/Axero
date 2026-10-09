import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

async function createJSON(config = {}) {
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

async function createSQLite(config = {}) {
  try {
    const { connect } = await import('./sqlite.mjs');
    return connect(config.url);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('SQLite driver requires Node 22.5+ (node:sqlite). Use JSON driver or upgrade Node.');
    }
    throw err;
  }
}

async function createMySQL(config = {}) {
  try {
    const { connect } = await import('./mysql.mjs');
    return connect(config.url);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('MySQL driver requires: npm install mysql2');
    }
    throw err;
  }
}

async function createSupabase(config = {}) {
  try {
    const { connect } = await import('./supabase.mjs');
    return connect(config.url, config.key);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('Supabase driver requires: npm install @supabase/supabase-js');
    }
    throw err;
  }
}

export async function createORM(config = {}) {
  if (config.driver === 'sqlite') return createSQLite(config);
  if (config.driver === 'mysql') return createMySQL(config);
  if (config.driver === 'supabase') return createSupabase(config);
  return createJSON(config);
}
