import { createPool } from 'mysql2/promise';

// ponytail: mysql2 only — install with: npm install mysql2
export async function connect(url) {
  const pool = createPool(url);
  return {
    query: (sql, params = []) => pool.execute(sql, params),
    execute: (sql, params = []) => pool.execute(sql, params),
    close: () => pool.end(),
  };
}
