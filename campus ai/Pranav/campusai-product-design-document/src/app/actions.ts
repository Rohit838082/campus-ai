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

function generateAnswer(subject: string, question: string): string {
  const gen = SUBJECT_HINTS[subject];
  if (gen) return gen(question);
  return `**Regarding: "${question}"**\n\nHere's a structured answer for your ${subject} doubt:\n\n**1. Core Concept**\nLet's break this down into digestible parts so the fundamentals are clear.\n\n**2. Step-by-step reasoning**\n- Start with definitions and key terms\n- Work through the logic methodically\n- Apply the relevant formulas or theorems\n\n**3. Example**\nReal-world or numerical example that illustrates the concept.\n\n**4. Key takeaway**\nThe one line you should remember for exams.\n\n💡 *Want me to go deeper on any specific part? Just ask!*`;
}

export async function askDoubt(formData: FormData) {
  const subject = String(formData.get("subject") || "Data Structures");
  const question = String(formData.get("question") || "").trim();
  if (!question) return { ok: false };

  const answer = generateAnswer(subject, question);
  await db.insert(doubts).values({ subject, question, answer });
  revalidatePath("/doubts");
  revalidatePath("/dashboard");
  return { ok: true, answer, subject, question };
}

export async function rateDoubt(id: number, rating: number) {
  await db.update(doubts).set({ rating }).where(eq(doubts.id, id));
  revalidatePath("/doubts");
}

export async function deleteDoubt(id: number) {
  await db.delete(doubts).where(eq(doubts.id, id));
  revalidatePath("/doubts");
}

// --- Notes ---

export async function uploadNote(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "General");
  const description = String(formData.get("description") || "").trim();
  const semester = Number(formData.get("semester") || 4);
  if (!title) return { ok: false };

  await db.insert(notes).values({
    title,
    subject,
    semester,
    university: "Mumbai University",
    author: "Priya Sharma",
    description,
    pageCount: Math.max(1, Math.floor(Math.random() * 40) + 5),
    likes: 0,
    downloads: 0,
    status: "pending",
  });
  revalidatePath("/study");
  return { ok: true };
}

export async function likeNote(id: number) {
  await db.update(notes).set({ likes: sql`${notes.likes} + 1` }).where(eq(notes.id, id));
  revalidatePath("/study");
}

// --- PYQs ---

export async function bookmarkPyq(id: number, bookmarked: boolean) {
  await db.update(pyqs).set({ bookmarked }).where(eq(pyqs.id, id));
  revalidatePath("/study");
}

export async function downloadPyq(id: number) {
  await db.update(pyqs).set({ downloads: sql`${pyqs.downloads} + 1` }).where(eq(pyqs.id, id));
  revalidatePath("/study");
}

// --- Forum ---

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const category = String(formData.get("category") || "Discussion");
  const tags = String(formData.get("tags") || "").trim();
  if (!title || !body) return { ok: false };

  await db.insert(forumPosts).values({
    title,
    body,
    category,
    tags,
    author: "Priya Sharma",
    university: "Mumbai University",
    upvotes: 0,
    comments: 0,
  });
  revalidatePath("/community");
  return { ok: true };
}

export async function upvotePost(id: number) {
  await db.update(forumPosts).set({ upvotes: sql`${forumPosts.upvotes} + 1` }).where(eq(forumPosts.id, id));
  revalidatePath("/community");
}

// --- Placement ---

export async function attemptQuestion(id: number) {
  await db
    .update(companyQuestions)
    .set({ attempts: sql`${companyQuestions.attempts} + 1` })
    .where(eq(companyQuestions.id, id));
  revalidatePath("/placements");
}

// --- Resume ---

export async function saveResume(formData: FormData) {
  const data = {
    fullName: String(formData.get("fullName") || ""),
    headline: String(formData.get("headline") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    education: String(formData.get("education") || ""),
    skills: String(formData.get("skills") || ""),
    projects: String(formData.get("projects") || ""),
    experience: String(formData.get("experience") || ""),
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

  const aiFeedback =
    feedback.length === 0
      ? "✨ Excellent resume! Consider tailoring it further for each company you apply to."
      : feedback.join("\n");

  const existing = await db.select().from(resume).limit(1);
  if (existing.length > 0) {
    await db.update(resume).set({ ...data, aiScore: score, aiFeedback, updatedAt: new Date() }).where(eq(resume.id, existing[0].id));
  } else {
    await db.insert(resume).values({ ...data, aiScore: score, aiFeedback });
  }
  revalidatePath("/resume");
  return { ok: true, score, aiFeedback };
}
