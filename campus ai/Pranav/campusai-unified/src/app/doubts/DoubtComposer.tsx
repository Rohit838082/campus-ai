"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { askDoubt } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Send, Camera, Paperclip, Sparkles } from "lucide-react";

const SUBJECTS = [
  "Data Structures",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Mathematics",
  "Programming",
  "Software Engineering",
  "Theory of Computation",
];

export function DoubtComposer({ hasDoubts }: { hasDoubts: boolean }) {
  const [subject, setSubject] = useState("Data Structures");
  const [question, setQuestion] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasDoubts) inputRef.current?.focus();
  }, [hasDoubts]);

  const submit = () => {
    if (!question.trim() || pending) return;
    const fd = new FormData();
    fd.set("subject", subject);
    fd.set("question", question.trim());
    startTransition(async () => {
      await askDoubt(fd);
      setQuestion("");
      router.refresh();
    });
  };

  return (
    <div className="border-t border-border-soft bg-white p-4 lg:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Subject chips */}
        <div className="nice-scroll mb-3 flex gap-2 overflow-x-auto pb-1">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                subject === s
                  ? "bg-ai-gradient text-white shadow-sm"
                  : "border border-border-soft bg-white text-slate-muted hover:border-electric hover:text-electric"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex items-end gap-2 rounded-2xl border border-border-soft bg-bg p-2 focus-within:border-electric">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-muted hover:bg-white hover:text-electric"
            title="Upload image"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-muted hover:bg-white hover:text-electric"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            ref={inputRef}
            id="doubt-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={`Ask about ${subject}...`}
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm placeholder:text-slate-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!question.trim() || pending}
            className="btn-press flex h-10 w-10 items-center justify-center rounded-xl bg-ai-gradient text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? (
              <div className="flex gap-0.5">
                <span className="dot h-1.5 w-1.5 rounded-full bg-white" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-white" />
                <span className="dot h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-muted">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-royal" />
            AI may produce errors. Verify important information.
          </span>
          <span>Press <kbd className="rounded border border-border-soft bg-white px-1">Enter</kbd> to send</span>
        </div>
      </div>
    </div>
  );
}
