"use client";

import { useState, useTransition } from "react";
import { rateDoubt, deleteDoubt } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Bot, ThumbsUp, ThumbsDown, Copy, Check, Trash2, Sparkles } from "lucide-react";

type Doubt = {
  id: number;
  subject: string;
  question: string;
  answer: string;
  rating: number | null;
  createdAt: Date;
};

export function DoubtList({
  doubts,
  onRate,
  onDelete,
}: {
  doubts: Doubt[];
  onRate: (id: number, rating: number | null) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
      {doubts.map((d, i) => (
        <DoubtItem
          key={d.id}
          doubt={d}
          delay={i * 40}
          onRate={onRate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function DoubtItem({
  doubt,
  delay,
  onRate,
  onDelete,
}: {
  doubt: Doubt;
  delay: number;
  onRate: (id: number, rating: number | null) => void;
  onDelete: (id: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleRate = (r: number) => {
    const nextRating = doubt.rating === r ? null : r;
    onRate(doubt.id, nextRating);
    startTransition(async () => {
      try {
        await rateDoubt(doubt.id, nextRating ?? 0);
      } catch {
        /* ignore */
      }
    });
  };

  const handleDelete = () => {
    onDelete(doubt.id);
    startTransition(async () => {
      try {
        await deleteDoubt(doubt.id);
      } catch {
        /* ignore */
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(doubt.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fade-up space-y-3" style={{ animationDelay: `${delay}ms` }}>
      {/* User bubble */}
      <div className="flex items-start justify-end gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-electric px-4 py-3 text-sm text-white shadow-sm">
          <div className="mb-1 flex items-center justify-end gap-1.5">
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
              {doubt.subject}
            </span>
          </div>
          {doubt.question}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
          PS
        </div>
      </div>

      {/* AI bubble */}
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-gradient text-[11px] font-bold text-white shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="max-w-[85%] flex-1 rounded-2xl rounded-bl-sm border border-border-soft border-l-4 border-l-electric bg-white p-4 shadow-sm">
          <div className="prose prose-sm max-w-none text-[13px] leading-relaxed text-ink">
            {doubt.answer === "Thinking..." ? (
              <div className="flex items-center gap-1.5 py-1 text-slate-muted">
                <span className="h-2 w-2 animate-bounce rounded-full bg-electric" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-electric" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-electric" style={{ animationDelay: "300ms" }} />
                <span className="ml-1 text-xs">AI is thinking...</span>
              </div>
            ) : (
              <FormattedText text={doubt.answer} />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-soft pt-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-muted hover:bg-slate-100"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <div className="mx-1 h-4 w-px bg-border-soft" />
            <span className="text-[11px] text-slate-muted">Helpful?</span>
            <button
              onClick={() => handleRate(1)}
              disabled={pending}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                doubt.rating === 1
                  ? "bg-emerald/10 text-emerald"
                  : "text-slate-muted hover:bg-slate-100"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleRate(-1)}
              disabled={pending}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                doubt.rating === -1
                  ? "bg-danger/10 text-danger"
                  : "text-slate-muted hover:bg-slate-100"
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown-lite renderer for bold and line breaks
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p === "\n") return <br key={i} />;
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-navy">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.startsWith("*") && p.endsWith("*") && !p.startsWith("**")) {
          return <em key={i}>{p.slice(1, -1)}</em>;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
