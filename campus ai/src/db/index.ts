import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDbReady?: boolean;
};

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  try {
    _pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({ connectionString: databaseUrl });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = _pool;
    }
    _db = drizzle(_pool);
    globalForDb.__arenaNextJsDbReady = true;
  } catch {
    globalForDb.__arenaNextJsDbReady = false;
  }
} else {
  globalForDb.__arenaNextJsDbReady = false;
}

export const pool = _pool;
export const db = _db;
export const isDbReady = () => globalForDb.__arenaNextJsDbReady === true;
