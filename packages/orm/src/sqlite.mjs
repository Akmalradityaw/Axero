import { DatabaseSync } from 'node:sqlite';

// ponytail: node:sqlite only (Node 22.5+ experimental, 23+ stable) — add mysql2/supabase drivers when needed.
export async function connect(url) {
  const path = url.replace('sqlite://', '');
  const db = new DatabaseSync(path);
  return {
    query: (sql, params = []) => db.prepare(sql).all(...params),
    execute: (sql, params = []) => db.prepare(sql).run(...params),
    close: () => db.close(),
  };
}
