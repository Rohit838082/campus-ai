import { db } from "@/db";
import { notes, pyqs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { StudyClient } from "./StudyClient";
import { mockNotes, mockPyqs } from "@/lib/mockFallback";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  let allNotes = mockNotes as typeof mockNotes;
  let allPyqs = mockPyqs as typeof mockPyqs;
  try {
    if (db) {
      const dbNotes = await db.select().from(notes).orderBy(desc(notes.createdAt));
      const dbPyqs = await db.select().from(pyqs).orderBy(desc(pyqs.createdAt));
      if (dbNotes.length > 0) allNotes = dbNotes as typeof mockNotes;
      if (dbPyqs.length > 0) allPyqs = dbPyqs as typeof mockPyqs;
    }
  } catch { /* use mock fallback */ }
  return <StudyClient notes={allNotes} pyqs={allPyqs} />;
}
