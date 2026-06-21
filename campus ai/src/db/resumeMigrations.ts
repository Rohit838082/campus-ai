import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function ensureResumeColumns() {
  if (!db) return;

  try {
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS summary text NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS address varchar(200) NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS linkedin varchar(240) NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS github varchar(240) NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS portfolio varchar(240) NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS certificates text NOT NULL DEFAULT ''`);
    await db.execute(sql`ALTER TABLE resume ADD COLUMN IF NOT EXISTS languages text NOT NULL DEFAULT ''`);
  } catch {
    // The app can still render with mock data when the database is unavailable.
  }
}
