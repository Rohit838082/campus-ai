import { db } from "@/db";
import { doubts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DoubtComposer } from "./DoubtComposer";
import { DoubtList } from "./DoubtList";
import { Bot, Sparkles, Camera, ThumbsUp, Clock, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DoubtsPage() {
  const allDoubts = await db.select().from(doubts).orderBy(desc(doubts.createdAt)).limit(50);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col pb-16 lg:pb-0">
      {/* Header */}
      <div className="border-b border-border-soft bg-white px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai-gradient text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">AI Doubt Solver</h1>
            <p className="flex items-center gap-2 text-xs text-slate-muted">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-royal" />
                Powered by GPT-4o
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~4s response time
              </span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-emerald/10 px-3 py-1 text-[11px] font-bold text-emerald">
              ● Online
            </span>
            <span className="rounded-full border border-border-soft bg-white px-3 py-1 text-[11px] font-semibold text-slate-muted">
              Free: 3 doubts today
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat / content */}
        <div className="flex flex-1 flex-col">
          <div className="nice-scroll flex-1 overflow-y-auto">
            {allDoubts.length === 0 ? (
              <EmptyState />
            ) : (
              <DoubtList doubts={allDoubts} />
            )}
          </div>

          <DoubtComposer hasDoubts={allDoubts.length > 0} />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ai-gradient text-white shadow-lg">
        <Bot className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-navy">Ask me anything academic</h2>
      <p className="mt-1.5 max-w-md text-sm text-slate-muted">
        Type a doubt or upload a photo of your question. I'll give you step-by-step
        solutions, saved to your history.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-3">
        {[
          {
            icon: Hash,
            title: "Quick formulas",
            sample: "Explain Big-O notation",
          },
          {
            icon: Camera,
            title: "Photo upload",
            sample: "Snap a question from your book",
          },
          {
            icon: ThumbsUp,
            title: "Exam prep",
            sample: "Compare TCP vs UDP",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-border-soft bg-white p-4 text-left transition hover:border-electric/40 hover:shadow-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/10 text-electric">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-2 text-sm font-bold text-ink">{s.title}</div>
            <div className="mt-1 text-xs text-slate-muted">{s.sample}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {[
          "What is normalization in DBMS?",
          "Explain BFS vs DFS",
          "Solve: integral of sin²x",
          "Difference between process and thread",
        ].map((q) => (
          <form key={q} action="/doubts" method="GET" className="contents">
            <button
              type="button"
              onClick={(e) => {
                const form = e.currentTarget.closest("form");
                if (!form) return;
                const input = document.querySelector<HTMLInputElement>("#doubt-input");
                if (input) {
                  input.value = q;
                  input.focus();
                }
              }}
              className="rounded-full border border-border-soft bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-electric hover:text-electric"
            >
              {q}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
