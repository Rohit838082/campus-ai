import { db } from "@/db";
import { companies, companyQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PlacementsClient } from "./PlacementsClient";

export const dynamic = "force-dynamic";

export default async function PlacementsPage() {
  const allCompanies = await db.select().from(companies);
  const questions = await db.select().from(companyQuestions);

  const companiesWithCounts = allCompanies.map((c) => ({
    ...c,
    questionCount: questions.filter((q) => q.companyId === c.id).length,
  }));

  return <PlacementsClient companies={companiesWithCounts} questions={questions} />;
}
