import { createClient } from '@supabase/supabase-js';

// ponytail: supabase-js only — install with: npm install @supabase/supabase-js
export async function connect(url, key) {
  const client = createClient(url, key);
  return {
    query: async (table, filter = {}) => {
      let q = client.from(table).select('*');
      for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
      const { data } = await q;
      return data;
    },
    execute: async (table, data) => {
      const { error } = await client.from(table).insert(data);
      if (error) throw error;
    },
    close: async () => {},
  };
}
