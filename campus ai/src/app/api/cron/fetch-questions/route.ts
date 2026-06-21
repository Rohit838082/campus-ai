import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, companyQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";

type FetchedQuestion = {
  companyName: string;
  question: string;
  category: "Aptitude" | "Coding" | "HR" | "Technical";
  difficulty: "Easy" | "Med" | "Hard";
  modelAnswer: string;
};

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
  }
  if (!db) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const prompt = `Search the internet for new, old, repeated, and highly important interview preparation questions for top IT/Tech companies (e.g., Google, Amazon, Microsoft, TCS, Infosys). 
Your output MUST be a valid JSON array of objects. Do not include any markdown formatting (like \`\`\`json) or text before or after the array.

Each object must have exactly these keys:
- "companyName" (string, e.g., "Google", "Amazon", "General Tech")
- "question" (string, the actual interview question)
- "category" (string, MUST be exactly one of: "Aptitude", "Coding", "HR", "Technical")
- "difficulty" (string, MUST be exactly one of: "Easy", "Med", "Hard")
- "modelAnswer" (string, a concise model answer for the question)

Find at least 5 different and high-quality questions. Ensure valid JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }]
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "Failed to fetch from Gemini", details: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "No text returned from Gemini" }, { status: 500 });
    }

    // Clean up potential markdown code block artifacts
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let parsedQuestions: FetchedQuestion[];
    try {
      parsedQuestions = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", cleanedText);
      return NextResponse.json({ error: "Invalid JSON from Gemini" }, { status: 500 });
    }

    if (!Array.isArray(parsedQuestions)) {
      return NextResponse.json({ error: "Parsed JSON is not an array" }, { status: 500 });
    }

    let insertedCount = 0;

    for (const q of parsedQuestions) {
      if (!q.question || !q.modelAnswer || !q.companyName) continue;

      // Ensure valid enums
      const validCategories = ["Aptitude", "Coding", "HR", "Technical"];
      const category = validCategories.includes(q.category) ? q.category : "Technical";
      
      const validDiffs = ["Easy", "Med", "Hard"];
      const difficulty = validDiffs.includes(q.difficulty) ? q.difficulty : "Med";

      // 1. Get or create company
      let companyId: number;
      const existingCompany = await db.select().from(companies).where(eq(companies.name, q.companyName)).limit(1);

      if (existingCompany.length > 0) {
        companyId = existingCompany[0].id;
      } else {
        const [newCompany] = await db.insert(companies).values({
          name: q.companyName,
          category: "IT",
          logo: "🏢", 
          practiceCount: 0,
        }).returning({ id: companies.id });
        companyId = newCompany.id;
      }

      // 2. Check for duplicate question text
      const existingQuestion = await db.select().from(companyQuestions).where(eq(companyQuestions.question, q.question)).limit(1);
      
      if (existingQuestion.length === 0) {
        // 3. Insert question
        await db.insert(companyQuestions).values({
          companyId,
          question: q.question,
          category,
          difficulty,
          modelAnswer: q.modelAnswer,
          attempts: 0,
        });
        insertedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully fetched and inserted ${insertedCount} new questions.`,
      parsedQuestions 
    });

  } catch (error) {
    console.error("Error in fetch-questions cron:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
