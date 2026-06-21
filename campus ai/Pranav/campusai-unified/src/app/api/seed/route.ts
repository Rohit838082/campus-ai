import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const seeded = await seedIfEmpty();
    return NextResponse.json({ ok: true, seeded });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
