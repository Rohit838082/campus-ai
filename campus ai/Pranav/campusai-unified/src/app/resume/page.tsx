import { db } from "@/db";
import { resume } from "@/db/schema";
import { ResumeClient } from "./ResumeClient";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const [data] = await db.select().from(resume).limit(1);
  return <ResumeClient data={data ?? null} />;
}
