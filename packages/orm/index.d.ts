export interface JsonCollection {
  create(doc: Record<string, unknown>): Promise<{ id: string } & Record<string, unknown>>;
  find(filter?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  findById(id: string): Promise<Record<string, unknown> | undefined>;
  update(id: string, updates: Record<string, unknown>): Promise<Record<string, unknown> | undefined>;
  delete(id: string): Promise<void>;
}
export interface JsonORM {
  collection(name: string): JsonCollection;
  close(): Promise<void>;
}
export interface QueryORM {
  query(sql: string, params?: unknown[]): Promise<unknown[]>;
  execute(sql: string, params?: unknown[]): Promise<unknown>;
  close(): Promise<void>;
}
export interface ORMConfig {
  driver?: 'json' | 'sqlite' | 'mysql' | 'supabase';
  url?: string;
  key?: string;
}

export declare function createORM(config?: ORMConfig): Promise<JsonORM | QueryORM>;
