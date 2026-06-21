import { db } from "@/db";
import { companies, companyQuestions } from "@/db/schema";
import { PlacementsClient } from "./PlacementsClient";
import { mockCompanies, mockCompanyQuestions } from "@/lib/mockFallback";

export const dynamic = "force-dynamic";

export default async function PlacementsPage() {
  let companiesWithCounts = mockCompanies as typeof mockCompanies;
  let questions = mockCompanyQuestions as typeof mockCompanyQuestions;

  try {
    if (db) {
      const allCompanies = await db.select().from(companies);
      const dbQuestions = await db.select().from(companyQuestions);
      if (allCompanies.length > 0) {
        questions = dbQuestions as typeof mockCompanyQuestions;
        companiesWithCounts = allCompanies.map((c) => ({
          ...c,
          questionCount: dbQuestions.filter((q) => q.companyId === c.id).length,
        })) as typeof mockCompanies;
      }
    }
  } catch { /* use mock fallback */ }

  return <PlacementsClient companies={companiesWithCounts} questions={questions} />;
}
