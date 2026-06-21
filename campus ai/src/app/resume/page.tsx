import { db } from "@/db";
import { resume } from "@/db/schema";
import { ensureResumeColumns } from "@/db/resumeMigrations";
import { ResumeClient } from "./ResumeClient";
import { mockResume } from "@/lib/mockFallback";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  let data = mockResume as typeof mockResume | null;
  try {
    if (db) {
      await ensureResumeColumns();
      const [dbData] = await db.select().from(resume).limit(1);
      if (dbData) data = dbData;
    }
  } catch { /* use mock fallback */ }
  return <ResumeClient data={data ?? null} />;
}
