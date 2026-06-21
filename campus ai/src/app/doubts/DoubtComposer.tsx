"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { askDoubt } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Send, Camera, Paperclip, Sparkles, X, FileText } from "lucide-react";

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

export function DoubtComposer({
  hasDoubts,
  onAsk,
  isPending,
  onToggleExamPrep,
  isExamPrepActive,
}: {
  hasDoubts: boolean;
  onAsk: (
    subject: string,
    question: string,
    attachment?: { name: string; type: string; base64: string; content?: string } | null
  ) => void;
  isPending?: boolean;
  onToggleExamPrep?: (active: boolean) => void;
  isExamPrepActive?: boolean;
}) {
  const [subject, setSubject] = useState("Data Structures");
  const [question, setQuestion] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    base64: string;
    content?: string;
  } | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasDoubts) inputRef.current?.focus();
  }, [hasDoubts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        base64: (reader.result as string).split(",")[1] || "",
        content: reader.result as string,
      });
    };

    if (file.type.startsWith("text/")) {
      const textReader = new FileReader();
      textReader.onloadend = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          base64: btoa(textReader.result as string),
          content: textReader.result as string,
        });
      };
      textReader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (acceptType?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType || "image/*,application/pdf,text/*,.doc,.docx";
      fileInputRef.current.click();
    }
  };

  const submit = () => {
    if ((!question.trim() && !attachedFile) || isPending) return;
    
    let fullQuestion = question.trim();
    if (!fullQuestion && attachedFile) {
      fullQuestion = `Analyze the attached file: ${attachedFile.name}`;
    }
    
    onAsk(subject, fullQuestion, attachedFile);
    setQuestion("");
    setAttachedFile(null);
  };

  return (
    <div className="border-t border-border-soft bg-white p-4 lg:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Subject chips */}
        <div className="nice-scroll mb-3 flex gap-2 overflow-x-auto pb-1">
          {onToggleExamPrep && (
            <button
              onClick={() => onToggleExamPrep(true)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                isExamPrepActive
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Exam Prep
            </button>
          )}
          
          <div className="h-6 w-px bg-border-soft self-center mx-1" />

          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubject(s);
                if (onToggleExamPrep) onToggleExamPrep(false);
              }}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                subject === s && !isExamPrepActive
                  ? "bg-ai-gradient text-white shadow-sm"
                  : "border border-border-soft bg-white text-slate-muted hover:border-electric hover:text-electric"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* File Attachment Preview */}
        {attachedFile && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-electric/20 bg-electric/5 p-3 animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              {attachedFile.type.startsWith("image/") ? (
                <img
                  src={attachedFile.content}
                  alt="Preview"
                  className="h-10 w-10 rounded-lg object-cover border border-border-soft"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-navy truncate max-w-[200px] sm:max-w-[400px]">
                  {attachedFile.name}
                </p>
                <p className="text-[10px] text-slate-muted uppercase">
                  {attachedFile.type.split("/")[1] || "File"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="rounded-lg p-1.5 text-slate-muted hover:bg-slate-200 hover:text-ink transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2 rounded-2xl border border-border-soft bg-bg p-2 focus-within:border-electric">
          <button
            type="button"
            onClick={() => triggerFileInput("image/*")}
            className="rounded-lg p-2 text-slate-muted hover:bg-white hover:text-electric transition"
            title="Upload image"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => triggerFileInput("application/pdf,text/*,.doc,.docx")}
            className="rounded-lg p-2 text-slate-muted hover:bg-white hover:text-electric transition"
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
            disabled={(!question.trim() && !attachedFile) || isPending}
            className="btn-press flex h-10 w-10 items-center justify-center rounded-xl bg-ai-gradient text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? (
              <div className="flex gap-0.5">
                <span className="dot h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="dot h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="dot h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
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
