import { db } from "@/db";
import { doubts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DoubtsClient } from "./DoubtsClient";
import { mockDoubts } from "@/lib/mockFallback";

export const dynamic = "force-dynamic";

export default async function DoubtsPage() {
  let allDoubts = [] as any[];
  try {
    if (db) {
      const dbDoubts = await db
        .select()
        .from(doubts)
        .orderBy(desc(doubts.createdAt))
        .limit(50);
      allDoubts = dbDoubts;
    }
  } catch {
    /* no DB — fallback to client-side empty state and localStorage */
  }

  // Convert Date fields to ISO strings or ensure they are serializable
  const serializedDoubts = allDoubts.map(d => ({
    ...d,
    createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : d.createdAt,
  }));

  return <DoubtsClient initialDoubts={serializedDoubts} />;
}
