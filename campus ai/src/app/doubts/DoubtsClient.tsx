"use client";

import { useEffect, useState, useTransition } from "react";
import { DoubtComposer } from "./DoubtComposer";
import { DoubtList } from "./DoubtList";
import { EmptyState } from "./EmptyState";
import { ExamPrepDashboard } from "./ExamPrepDashboard";
import { Bot, Sparkles, Clock, Target } from "lucide-react";
import { askDoubt } from "@/app/actions";

type Doubt = {
  id: number;
  subject: string;
  question: string;
  answer: string;
  rating: number | null;
  createdAt: Date;
};

const LOCAL_DOUBTS_KEY = "campusai:local-doubts";

// Simple markdown-lite renderer or curated answers logic
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

function generateClientAnswer(subject: string, question: string): string {
  const gen = SUBJECT_HINTS[subject];
  if (gen) return gen(question);
  return `**Regarding: "${question}"**\n\nHere's a structured answer for your ${subject} doubt:\n\n**1. Core Concept**\nLet's break this down into digestible parts so the fundamentals are clear.\n\n**2. Step-by-step reasoning**\n- Start with definitions and key terms\n- Work through the logic methodically\n- Apply the relevant formulas or theorems\n\n**3. Example**\nReal-world or numerical example that illustrates the concept.\n\n**4. Key takeaway**\nThe one line you should remember for exams.\n\n💡 *Want me to go deeper on any specific part? Just ask!*`;
}

export function DoubtsClient({ initialDoubts }: { initialDoubts: Doubt[] }) {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [pending, startTransition] = useTransition();
  const [isExamPrepActive, setIsExamPrepActive] = useState(false);

  // Load and merge local storage doubts on mount or when initialDoubts changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_DOUBTS_KEY);
      const localDoubts: Doubt[] = raw ? JSON.parse(raw) : [];

      const unique = new Map<string, Doubt>();
      // First, add database doubts (they take precedence)
      initialDoubts.forEach((d) => {
        unique.set(d.question.toLowerCase().trim(), d);
      });
      // Then, add local doubts if they aren't already present in DB doubts
      localDoubts.forEach((d) => {
        const qKey = d.question.toLowerCase().trim();
        if (!unique.has(qKey)) {
          unique.set(qKey, d);
        }
      });

      const combined = Array.from(unique.values());
      // Sort newest first
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDoubts(combined);
    } catch {
      setDoubts(initialDoubts);
    }
  }, [initialDoubts]);

  const handleAskDoubt = async (
    subject: string,
    question: string,
    attachment?: { name: string; type: string; base64: string; content?: string } | null
  ) => {
    const tempId = Date.now();
    let displayQuestion = question;
    if (attachment) {
      displayQuestion = `${question}\n\n📎 Attached: ${attachment.name}`;
    }

    const newDoubt: Doubt = {
      id: tempId,
      subject,
      question: displayQuestion,
      answer: "Thinking...",
      rating: null,
      createdAt: new Date(),
    };

    // Optimistically update client state immediately so the chat updates instantly
    setDoubts((prev) => [newDoubt, ...prev]);

    // Save to localStorage as a fallback
    try {
      const raw = localStorage.getItem(LOCAL_DOUBTS_KEY);
      const localDoubts: Doubt[] = raw ? JSON.parse(raw) : [];
      const updated = [newDoubt, ...localDoubts];
      localStorage.setItem(LOCAL_DOUBTS_KEY, JSON.stringify(updated));
    } catch {
      /* ignore storage errors */
    }

    // Call backend server action in background to keep DB in sync if online
    startTransition(async () => {
      let finalAnswer = "";
      try {
        const fd = new FormData();
        fd.set("subject", subject);
        fd.set("question", displayQuestion);
        if (attachment) {
          fd.set("attachmentBase64", attachment.base64);
          fd.set("attachmentMimeType", attachment.type);
          fd.set("attachmentName", attachment.name);
        }
        const res = await askDoubt(fd);
        if (res && res.ok && res.answer) {
          finalAnswer = res.answer;
        } else {
          finalAnswer = generateClientAnswer(subject, displayQuestion);
        }
      } catch {
        finalAnswer = generateClientAnswer(subject, displayQuestion);
      }

      // Update local state with final answer
      setDoubts((prev) =>
        prev.map((d) => (d.id === tempId ? { ...d, answer: finalAnswer } : d))
      );

      // Update localStorage with final answer
      try {
        const raw = localStorage.getItem(LOCAL_DOUBTS_KEY);
        if (raw) {
          const localDoubts: Doubt[] = JSON.parse(raw);
          const updated = localDoubts.map((d) =>
            d.id === tempId ? { ...d, answer: finalAnswer } : d
          );
          localStorage.setItem(LOCAL_DOUBTS_KEY, JSON.stringify(updated));
        }
      } catch {
        /* ignore storage errors */
      }
    });
  };

  const handleRateDoubt = (id: number, rating: number | null) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, rating } : d))
    );

    // Sync to localStorage
    try {
      const raw = localStorage.getItem(LOCAL_DOUBTS_KEY);
      if (raw) {
        const localDoubts: Doubt[] = JSON.parse(raw);
        const updated = localDoubts.map((d) => (d.id === id ? { ...d, rating } : d));
        localStorage.setItem(LOCAL_DOUBTS_KEY, JSON.stringify(updated));
      }
    } catch {
      /* ignore storage errors */
    }
  };

  const handleDeleteDoubt = (id: number) => {
    setDoubts((prev) => prev.filter((d) => d.id !== id));

    // Sync to localStorage
    try {
      const raw = localStorage.getItem(LOCAL_DOUBTS_KEY);
      if (raw) {
        const localDoubts: Doubt[] = JSON.parse(raw);
        const updated = localDoubts.filter((d) => d.id !== id);
        localStorage.setItem(LOCAL_DOUBTS_KEY, JSON.stringify(updated));
      }
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col pb-14 lg:pb-0">
      {/* ─── Header ─── */}
      <div className="shrink-0 border-b border-border-soft bg-white px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ai-gradient text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-navy sm:text-xl">
              {isExamPrepActive ? "Exam Preparation" : "AI Doubt Solver"}
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-muted">
              {isExamPrepActive ? (
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-rose-500" />
                  Analyze PYQs & Notes
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-royal" />
                    Powered by GPT-4o
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~4s response time
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-emerald/10 px-3 py-1 text-[11px] font-bold text-emerald">
              ● Online
            </span>
            <span className="rounded-full border border-border-soft bg-white px-3 py-1 text-[11px] font-semibold text-slate-muted">
              Free: 3 doubts today
            </span>
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable chat / empty state */}
          <div className="nice-scroll flex-1 overflow-y-auto">
            {isExamPrepActive ? (
              <ExamPrepDashboard />
            ) : doubts.length === 0 ? (
              <EmptyState />
            ) : (
              <DoubtList
                doubts={doubts}
                onRate={handleRateDoubt}
                onDelete={handleDeleteDoubt}
              />
            )}
          </div>

          {/* Composer pinned to bottom */}
          <DoubtComposer
            hasDoubts={doubts.length > 0}
            onAsk={handleAskDoubt}
            isPending={pending}
            onToggleExamPrep={setIsExamPrepActive}
            isExamPrepActive={isExamPrepActive}
          />
        </div>
      </div>
    </div>
  );
}
