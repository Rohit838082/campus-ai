"use client";

import { Bot, Hash, Camera, ThumbsUp } from "lucide-react";

const SUGGESTIONS = [
  "What is normalization in DBMS?",
  "Explain BFS vs DFS",
  "Solve: integral of sin²x",
  "Difference between process and thread",
];

const CARDS = [
  { icon: Hash, title: "Quick formulas", sample: "Explain Big-O notation" },
  { icon: Camera, title: "Photo upload", sample: "Snap a question from your book" },
  { icon: ThumbsUp, title: "Exam prep", sample: "Compare TCP vs UDP" },
];

export function EmptyState() {
  const fillInput = (q: string) => {
    const input = document.querySelector<HTMLTextAreaElement>("#doubt-input");
    if (!input) return;
    // Trigger React's synthetic onChange by using native value setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(input, q);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 sm:px-6 text-center">
      {/* Icon */}
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-ai-gradient text-white shadow-lg">
        <Bot className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>

      <h2 className="mt-4 text-lg sm:text-xl font-bold text-navy">Ask me anything academic</h2>
      <p className="mt-2 max-w-sm sm:max-w-md text-sm text-slate-muted">
        Type a doubt below. Get step-by-step AI solutions saved to your history.
      </p>

      {/* Feature cards */}
      <div className="mt-6 sm:mt-8 grid w-full max-w-2xl gap-3 grid-cols-1 sm:grid-cols-3">
        {CARDS.map((s) => (
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

      {/* Suggestion pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => fillInput(q)}
            className="rounded-full border border-border-soft bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-electric hover:text-electric"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
