import { db } from "@/db";
import { notes, pyqs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { StudyClient } from "./StudyClient";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const allNotes = await db.select().from(notes).orderBy(desc(notes.createdAt));
  const allPyqs = await db.select().from(pyqs).orderBy(desc(pyqs.createdAt));
  return <StudyClient notes={allNotes} pyqs={allPyqs} />;
}
