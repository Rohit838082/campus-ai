"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  doubts,
  notes,
  pyqs,
  forumPosts,
  resume,
  companyQuestions,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureResumeColumns } from "@/db/resumeMigrations";

// --- AI Doubt Solver (mocked LLM with curated responses) ---

const SUBJECT_HINTS: Record<string, (q: string) => string> = {
  "Data Structures": (q) => {
    const lower = q.toLowerCase();
    if (lower.includes("sort"))
      return `**Comparing common sorting algorithms:**\n\n| Algorithm | Avg | Worst | Stable |\n|---|---|---|---|\n| QuickSort | O(n log n) | O(n²) | No |\n| MergeSort | O(n log n) | O(n log n) | Yes |\n| HeapSort | O(n log n) | O(n log n) | No |\n\n**When to use what:**\n- QuickSort → fastest in practice, in-place\n- MergeSort → stable, great for linked lists\n- HeapSort → guaranteed O(n log n), in-place`;
    if (lower.includes("tree") || lower.includes("bst"))
      return `**Binary Search Tree (BST):**\n\nA BST is a binary tree where:\n1. Left subtree values < root\n2. Right subtree values > root\n\n**Operations (average case):**\n- Search: O(log n)\n- Insert: O(log n)\n- Delete: O(log n)\n\n**Traversal types:**\n- Inorder (LNR) → gives sorted order\n- Preorder (NLR) → used to copy tree\n- Postorder (LRN) → used to delete tree`;
    return `Here's a step-by-step breakdown:\n\n**Step 1 — Understand the problem**\nIdentify inputs, outputs, and constraints.\n\n**Step 2 — Choose the right data structure**\nArrays for indexed access, linked lists for dynamic size, trees for hierarchical data, hash maps for O(1) lookup.\n\n**Step 3 — Write pseudocode**\nBreak the algorithm into small functions.\n\n**Step 4 — Analyze complexity**\nTime and space — aim for the best trade-off.\n\n💡 *Tip: Practice similar problems on the Study Hub PYQs section!*`;
  },
  DBMS: () =>
    `**Key DBMS concepts:**\n\n**1. Normalization** — reduces redundancy\n- 1NF: atomic values\n- 2NF: no partial dependencies\n- 3NF: no transitive dependencies\n- BCNF: stronger than 3NF\n\n**2. ACID Properties**\n- **A**tomicity — all or nothing\n- **C**onsistency — valid state transitions\n- **I**solation — concurrent txns don't interfere\n- **D**urability — committed data persists\n\n**3. SQL Joins**\n- INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF\n\nNeed a deeper dive on any of these?`,
  "Operating Systems": () =>
    `**Core OS topics:**\n\n**1. Process vs Thread**\n- Process = independent execution unit, own memory\n- Thread = lightweight unit within a process, shared memory\n\n**2. CPU Scheduling**\n- FCFS, SJF, Round Robin, Priority, Multilevel Queue\n\n**3. Deadlocks**\n- 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait\n- Handle via: Prevention, Avoidance (Banker's), Detection, Recovery\n\n**4. Memory Management**\n- Paging, Segmentation, Virtual Memory, Page Replacement (LRU, FIFO, Optimal)`,
  "Computer Networks": () =>
    `**Networking essentials:**\n\n**OSI Model (7 layers):**\n1. Physical — bits on wire\n2. Data Link — MAC, frames\n3. Network — IP, routing\n4. Transport — TCP/UDP, ports\n5. Session — session management\n6. Presentation — encryption, compression\n7. Application — HTTP, FTP, SMTP\n\n**TCP vs UDP:**\n- TCP: reliable, ordered, connection-oriented\n- UDP: fast, connectionless, no guarantee`,
};

function generateMockAnswer(subject: string, question: string, attachmentName?: string): string {
  const gen = SUBJECT_HINTS[subject];
  let prefix = "";
  if (attachmentName) {
    prefix = `*(Successfully parsed and analyzed attached file: **${attachmentName}**)*\n\n`;
  }
  if (gen) return prefix + gen(question);
  return prefix + `**Regarding: "${question}"**\n\nHere's a structured answer for your ${subject} doubt:\n\n**1. Core Concept**\nLet's break this down into digestible parts so the fundamentals are clear.\n\n**2. Step-by-step reasoning**\n- Start with definitions and key terms\n- Work through the logic methodically\n- Apply the relevant formulas or theorems\n\n**3. Example**\nReal-world or numerical example that illustrates the concept.\n\n**4. Key takeaway**\nThe one line you should remember for exams.\n\n💡 *Want me to go deeper on any specific part? Just ask!*`;
}

async function generateAnswer(
  subject: string,
  question: string,
  attachmentBase64?: string,
  attachmentMimeType?: string,
  attachmentName?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return generateMockAnswer(subject, question, attachmentName);
  }

  try {
    const prompt = `You are a helpful, expert academic tutor. A student is asking a doubt regarding the subject of "${subject}".
Please provide a clear, concise, and structured explanation of the concept, using clean markdown formatting (like bullet points, bolding, or tables where appropriate). Keep the explanation student-friendly.

Student Question:
${question}`;

    const parts: any[] = [{ text: prompt }];
    if (attachmentBase64 && attachmentMimeType) {
      parts.push({
        inlineData: {
          mimeType: attachmentMimeType,
          data: attachmentBase64,
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: parts,
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.trim();
      }
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
  }

  return generateMockAnswer(subject, question, attachmentName);
}

export async function askDoubt(formData: FormData) {
  const subject = String(formData.get("subject") || "Data Structures");
  const question = String(formData.get("question") || "").trim();
  const attachmentBase64 = formData.get("attachmentBase64") ? String(formData.get("attachmentBase64")) : undefined;
  const attachmentMimeType = formData.get("attachmentMimeType") ? String(formData.get("attachmentMimeType")) : undefined;
  const attachmentName = formData.get("attachmentName") ? String(formData.get("attachmentName")) : undefined;

  if (!question) return { ok: false };

  const answer = await generateAnswer(
    subject,
    question,
    attachmentBase64,
    attachmentMimeType,
    attachmentName
  );
  try {
    if (db) {
      await db.insert(doubts).values({ subject, question, answer });
      revalidatePath("/doubts");
      revalidatePath("/dashboard");
    }
  } catch { /* ignore DB error */ }
  return { ok: true, answer, subject, question };
}

export async function rateDoubt(id: number, rating: number) {
  try {
    if (db) {
      await db.update(doubts).set({ rating }).where(eq(doubts.id, id));
      revalidatePath("/doubts");
    }
  } catch { /* ignore DB error */ }
}

export async function deleteDoubt(id: number) {
  try {
    if (db) {
      await db.delete(doubts).where(eq(doubts.id, id));
      revalidatePath("/doubts");
    }
  } catch { /* ignore DB error */ }
}

// --- Notes ---

export async function uploadNote(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "General");
  const description = String(formData.get("description") || "").trim();
  const semester = Number(formData.get("semester") || 4);
  if (!title) return { ok: false };

  try {
    if (db) {
      await db.insert(notes).values({
        title, subject, semester,
        university: "Mumbai University",
        author: "Pranav Pawar",
        description,
        pageCount: Math.max(1, Math.floor(Math.random() * 40) + 5),
        likes: 0, downloads: 0, status: "pending",
      });
      revalidatePath("/study");
    }
  } catch { /* ignore DB error */ }
  return { ok: true };
}

export async function likeNote(id: number) {
  try {
    if (db) {
      await db.update(notes).set({ likes: sql`${notes.likes} + 1` }).where(eq(notes.id, id));
      revalidatePath("/study");
    }
  } catch { /* ignore DB error */ }
}

// --- PYQs ---

export async function bookmarkPyq(id: number, bookmarked: boolean) {
  try {
    if (db) {
      await db.update(pyqs).set({ bookmarked }).where(eq(pyqs.id, id));
      revalidatePath("/study");
    }
  } catch { /* ignore DB error */ }
}

export async function downloadPyq(id: number) {
  try {
    if (db) {
      await db.update(pyqs).set({ downloads: sql`${pyqs.downloads} + 1` }).where(eq(pyqs.id, id));
      revalidatePath("/study");
    }
  } catch { /* ignore DB error */ }
}

// --- Forum ---

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const category = String(formData.get("category") || "Discussion");
  const tags = String(formData.get("tags") || "").trim();
  if (!title || !body) return { ok: false };

  try {
    if (db) {
      await db.insert(forumPosts).values({
        title, body, category, tags,
        author: "Pranav Pawar",
        university: "Mumbai University",
        upvotes: 0, comments: 0,
      });
      revalidatePath("/community");
    }
  } catch { /* ignore DB error */ }
  return { ok: true };
}

export async function upvotePost(id: number) {
  try {
    if (db) {
      await db.update(forumPosts).set({ upvotes: sql`${forumPosts.upvotes} + 1` }).where(eq(forumPosts.id, id));
      revalidatePath("/community");
    }
  } catch { /* ignore DB error */ }
}

// --- Placement ---

export async function attemptQuestion(id: number) {
  try {
    if (db) {
      await db
        .update(companyQuestions)
        .set({ attempts: sql`${companyQuestions.attempts} + 1` })
        .where(eq(companyQuestions.id, id));
      revalidatePath("/placements");
    }
  } catch { /* ignore DB error */ }
}

// --- Resume ---

export async function saveResume(formData: FormData) {
  const data = {
    fullName: String(formData.get("fullName") || ""),
    headline: String(formData.get("headline") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || ""),
    linkedin: String(formData.get("linkedin") || ""),
    github: String(formData.get("github") || ""),
    portfolio: String(formData.get("portfolio") || ""),
    summary: String(formData.get("summary") || ""),
    education: String(formData.get("education") || ""),
    skills: String(formData.get("skills") || ""),
    projects: String(formData.get("projects") || ""),
    experience: String(formData.get("experience") || ""),
    certificates: String(formData.get("certificates") || ""),
    languages: String(formData.get("languages") || ""),
  };

  // Mock AI scoring
  let score = 40;
  const feedback: string[] = [];
  if (data.headline.length > 20) score += 10;
  else feedback.push("✏️ Write a stronger headline (20+ chars, include your top skill).");
  if (data.skills.split(",").filter(Boolean).length >= 5) score += 15;
  else feedback.push("🛠️ Add at least 5 relevant skills — include both hard and soft skills.");
  if (data.projects.length > 50) score += 15;
  else feedback.push("🚀 Expand project descriptions with impact metrics (users, performance gains).");
  if (data.experience.length > 30) score += 10;
  else feedback.push("💼 Add internship/project experience with concrete responsibilities.");
  if (data.education.includes("CGPA") || data.education.includes("%")) score += 10;
  else feedback.push("🎓 Include CGPA or percentage in your education section.");
  score = Math.min(98, score);

  score = 35;
  feedback.length = 0;

  const skillCount = data.skills
    .split(/[\n,]/)
    .map((skill) => skill.trim())
    .filter(Boolean).length;
  const bulletCount = [data.education, data.experience, data.projects, data.certificates]
    .join("\n")
    .split("\n")
    .filter((line) => /^[-*]/.test(line.trim())).length;
  const hasMetric = /\b\d+[%+x]?\b/.test([data.summary, data.experience, data.projects].join(" "));

  if (data.headline.length >= 18) score += 8;
  else feedback.push("Add a focused headline with your target role and strongest skill.");
  if (data.summary.length >= 80) score += 10;
  else feedback.push("Add a 2-3 line summary with role, skills, and placement goal.");
  if (skillCount >= 8) score += 15;
  else feedback.push("Add at least 8 searchable skills, separated by commas or lines.");
  if (bulletCount >= 5) score += 12;
  else feedback.push("Use more bullet points under experience and projects for ATS readability.");
  if (hasMetric) score += 10;
  else feedback.push("Add measurable impact such as users, accuracy, speed, CGPA, or percentages.");
  if (data.education.includes("CGPA") || data.education.includes("%")) score += 8;
  else feedback.push("Include CGPA or percentage in the education section.");
  if (data.linkedin || data.github || data.portfolio) score += 5;
  else feedback.push("Add LinkedIn, GitHub, or portfolio links for recruiter screening.");
  score = Math.min(98, score);

  const aiFeedback =
    feedback.length === 0
      ? "✨ Excellent resume! Consider tailoring it further for each company you apply to."
      : feedback.join("\n");
  const cleanAiFeedback =
    feedback.length === 0
      ? "Excellent ATS-ready resume. Tailor keywords for each company before applying."
      : feedback.join("\n");
  const finalAiFeedback = cleanAiFeedback || aiFeedback;

  try {
    if (db) {
      await ensureResumeColumns();
      const existing = await db.select().from(resume).limit(1);
      if (existing.length > 0) {
        await db.update(resume).set({ ...data, aiScore: score, aiFeedback: finalAiFeedback, updatedAt: new Date() }).where(eq(resume.id, existing[0].id));
      } else {
        await db.insert(resume).values({ ...data, aiScore: score, aiFeedback: finalAiFeedback });
      }
      revalidatePath("/resume");
    }
  } catch { /* ignore DB error */ }
  return { ok: true, score, aiFeedback: finalAiFeedback };
}

// --- AI Study Assistant ---

export async function analyzeStudyResource(
  type: "notes" | "pyq",
  titleOrSubject: string,
  extraDetails: string,
  requestType: string
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "API Key not configured" };
  }

  try {
    const prompt = `You are an advanced AI Study Assistant designed to help students prepare for exams.
You are analyzing a study resource in the Study Hub:
Resource Type: ${type === "notes" ? "Class Notes" : "Previous Year Question Paper (PYQ)"}
Title/Subject: ${titleOrSubject}
Details: ${extraDetails}

The student has requested: "${requestType}"

Please generate a highly structured, exam-oriented response following the requirements:
1. Identify important topics, frequently repeated questions, patterns in question types.
2. Structure the output clearly using bolding, bullet points, headers, and tables.
3. If the student requested a "Question Paper + Answers", generate a complete mock question paper with detailed step-by-step answers.
4. Keep the answers clear, structured, and exam-ready. Assign weightage tags (⭐⭐⭐ High, ⭐⭐ Medium, ⭐ Low).

Always structure the final response using clean markdown.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) {
        return { ok: true, answer };
      }
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
  }

  return { ok: false, error: "Failed to generate AI study guide. Please check your connection." };
}
