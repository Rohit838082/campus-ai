"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  likeNote,
  bookmarkPyq,
  downloadPyq,
  uploadNote,
  analyzeStudyResource,
} from "@/app/actions";
import {
  BookOpen,
  FileText,
  Search,
  Download,
  Heart,
  Star,
  Upload,
  Filter,
  Sparkles,
  Check,
  Clock,
  X,
  Eye,
  Brain,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

type Note = {
  id: number;
  title: string;
  subject: string;
  semester: number;
  university: string;
  author: string;
  description: string | null;
  pageCount: number;
  likes: number;
  downloads: number;
  status: string;
  createdAt: Date;
};

type Pyq = {
  id: number;
  subject: string;
  university: string;
  year: number;
  paperType: string;
  semester: number;
  downloads: number;
  bookmarked: boolean;
};

const SEMESTERS = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];
const UNIS = ["All Universities", "Mumbai University", "Pune University", "Nagpur University"];

export function StudyClient({ notes, pyqs }: { notes: Note[]; pyqs: Pyq[] }) {
  const [tab, setTab] = useState<"notes" | "pyqs">("notes");
  const [search, setSearch] = useState("");
  const [semFilter, setSemFilter] = useState("All");
  const [uniFilter, setUniFilter] = useState("All Universities");
  const [showUpload, setShowUpload] = useState(false);
  const [aiResource, setAiResource] = useState<{
    type: "notes" | "pyq";
    titleOrSubject: string;
    details: string;
  } | null>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const filteredNotes = notes.filter((n) => {
    if (search && !`${n.title} ${n.subject} ${n.author}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (semFilter !== "All" && n.semester !== Number(semFilter)) return false;
    if (uniFilter !== "All Universities" && n.university !== uniFilter) return false;
    return true;
  });

  const filteredPyqs = pyqs.filter((p) => {
    if (search && !`${p.subject} ${p.university}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (semFilter !== "All" && p.semester !== Number(semFilter)) return false;
    if (uniFilter !== "All Universities" && p.university !== uniFilter) return false;
    return true;
  });

  const handleLike = (id: number) => startTransition(async () => { await likeNote(id); router.refresh(); });
  const handleBookmark = (id: number, v: boolean) => startTransition(async () => { await bookmarkPyq(id, v); router.refresh(); });
  const handleDownload = (id: number) => startTransition(async () => { await downloadPyq(id); router.refresh(); });

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">Study Hub</h1>
            <p className="mt-1 text-sm text-slate-muted">
              PYQs, notes & resources from students across Maharashtra.
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-press inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
          >
            <Upload className="h-4 w-4" /> Upload notes
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-xl bg-bg p-1">
          {[
            { id: "notes", label: "Notes Library", icon: BookOpen, count: notes.length },
            { id: "pyqs", label: "PYQ Papers", icon: FileText, count: pyqs.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "notes" | "pyqs")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === t.id ? "bg-white text-ink shadow-sm" : "text-slate-muted"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-border-soft bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${tab === "notes" ? "notes, subjects, authors" : "subjects, universities"}...`}
              className="flex-1 bg-transparent text-sm placeholder:text-slate-muted focus:outline-none"
            />
          </div>
          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="rounded-xl border border-border-soft bg-white px-3 py-2 text-sm font-medium text-ink focus:border-electric focus:outline-none"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All semesters" : `Semester ${s}`}
              </option>
            ))}
          </select>
          <select
            value={uniFilter}
            onChange={(e) => setUniFilter(e.target.value)}
            className="rounded-xl border border-border-soft bg-white px-3 py-2 text-sm font-medium text-ink focus:border-electric focus:outline-none"
          >
            {UNIS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        {tab === "notes" ? (
          filteredNotes.length === 0 ? (
            <Empty label="No notes match your filters" icon={BookOpen} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((n, i) => (
                <article
                  key={n.id}
                  className="fade-up group flex flex-col rounded-2xl border border-border-soft bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Preview thumbnail */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-100 to-slate-50">
                    <div className="flex flex-col items-center text-slate-muted">
                      <FileText className="h-10 w-10" />
                      <span className="mt-1 text-xs font-semibold">{n.pageCount} pages</span>
                    </div>
                    <div className="absolute right-2 top-2">
                      {n.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald/90 px-2 py-1 text-[10px] font-bold text-white">
                          <Check className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {n.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber px-2 py-1 text-[10px] font-bold text-white">
                          <Clock className="h-3 w-3" /> Under review
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                      <span className="text-[10px] font-semibold text-white">{n.university}</span>
                      <span className="text-[10px] font-semibold text-white">Sem {n.semester}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-electric/10 px-2 py-0.5 text-[10px] font-bold text-electric">
                        {n.subject}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold text-ink">{n.title}</h3>
                    {n.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-muted">{n.description}</p>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                        {n.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-xs font-medium text-ink">{n.author}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3 text-xs text-slate-muted">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(n.id)}
                          disabled={pending}
                          className="btn-press flex items-center gap-1 hover:text-danger"
                        >
                          <Heart className="h-3.5 w-3.5" /> {n.likes}
                        </button>
                        <span className="flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" /> {n.downloads}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="inline-flex items-center gap-1 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-navy-dark">
                          <Eye className="h-3 w-3" /> View
                        </button>
                        <button
                          onClick={() => setAiResource({
                            type: "notes",
                            titleOrSubject: n.title,
                            details: `Subject: ${n.subject}, Semester: ${n.semester}, Description: ${n.description || 'None'}`,
                          })}
                          className="inline-flex items-center gap-1 rounded-md bg-ai-gradient px-2.5 py-1 text-[11px] font-semibold text-white hover:brightness-110"
                        >
                          <Sparkles className="h-3 w-3" /> AI Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : filteredPyqs.length === 0 ? (
          <Empty label="No PYQs match your filters" icon={FileText} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredPyqs.map((p, i) => (
              <div
                key={p.id}
                className="fade-up flex items-start gap-3 rounded-2xl border border-border-soft bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${uniColor(p.university)}`}>
                      {p.university.replace(" University", "")}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                      Sem {p.semester}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                      {p.year}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-muted">
                      {p.paperType}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold text-ink">{p.subject}</h3>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-muted">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" /> {p.downloads} downloads
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleBookmark(p.id, !p.bookmarked)}
                    className={`btn-press rounded-lg p-2 transition ${
                      p.bookmarked
                        ? "bg-amber/10 text-amber"
                        : "text-slate-muted hover:bg-slate-100"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${p.bookmarked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleDownload(p.id)}
                    className="btn-press rounded-lg bg-electric p-2 text-white hover:bg-electric-soft"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAiResource({
                      type: "pyq",
                      titleOrSubject: p.subject,
                      details: `University: ${p.university}, Year: ${p.year}, Semester: ${p.semester}, Paper Type: ${p.paperType}`,
                    })}
                    className="btn-press rounded-lg bg-ai-gradient p-2 text-white"
                    title="AI Solve"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {aiResource && (
        <AIAnalysisModal
          resource={aiResource}
          onClose={() => setAiResource(null)}
        />
      )}
    </div>
  );
}

function Empty({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-soft bg-white py-16">
      <Icon className="h-12 w-12 text-slate-300" />
      <p className="mt-4 text-sm font-semibold text-ink">{label}</p>
      <p className="text-xs text-slate-muted">Try changing the filters above.</p>
    </div>
  );
}

function uniColor(u: string) {
  if (u.includes("Mumbai")) return "bg-electric/10 text-electric";
  if (u.includes("Pune")) return "bg-emerald/10 text-emerald";
  if (u.includes("Nagpur")) return "bg-royal/10 text-royal";
  return "bg-slate-100 text-ink";
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submit = (fd: FormData) => {
    startTransition(async () => {
      await uploadNote(fd);
      onClose();
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:p-6 md:items-center">
      <form
        action={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-border-soft pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-electric" />
            <h2 className="text-lg font-bold text-ink">Upload resource</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-muted hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 py-1">
          <Field label="Title">
            <input
              required
              name="title"
              placeholder="e.g., DBMS Complete Notes — Sem 4"
              className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </Field>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Resource Type">
              <select
                name="resourceType"
                defaultValue="notes"
                className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
              >
                <option value="notes">Class Notes</option>
                <option value="syllabus">Syllabus Document</option>
                <option value="pyq">Previous Year Paper (PYQ)</option>
                <option value="material">PDF / Study Material</option>
              </select>
            </Field>

            <Field label="Subject">
              <input
                required
                name="subject"
                defaultValue="DBMS"
                className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
              />
            </Field>

            <Field label="Semester">
              <select
                name="semester"
                defaultValue="4"
                className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              rows={3}
              placeholder="What's covered in these study materials?"
              className="w-full resize-none rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </Field>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-soft bg-slate-50/50 hover:border-electric/50 hover:bg-electric/5 transition-all p-4 text-center group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
            />
            <Upload className="h-8 w-8 text-slate-400 group-hover:text-electric group-hover:scale-110 transition-all duration-200" />
            {file ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-ink truncate max-w-[280px]">{file.name}</p>
                <p className="text-[11px] text-slate-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB · Click to change</p>
              </div>
            ) : (
              <div className="mt-2 space-y-0.5">
                <p className="text-sm font-bold text-ink">Drag & drop or click to upload</p>
                <p className="text-[11px] text-slate-muted">PDF, TXT, PYQs, or Syllabus (Max 25MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border-soft shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border-soft bg-white py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-press flex-1 rounded-xl bg-ai-gradient py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {pending ? "Uploading..." : "Submit for review"}
            </button>
          </div>
          <p className="text-[11px] text-slate-muted mt-3 text-center">
            ⚠️ Uploads are moderated. You&apos;ll see &quot;Under review&quot; badge until approved.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

const LOADING_STEPS = [
  "Initializing AI Study Engine...",
  "Scanning syllabus structure and notes...",
  "Correlating content with Maharashtra PYQ patterns...",
  "Predicting important topics and question probabilities...",
  "Drafting step-by-step model answers...",
  "Polishing final exam prep guide...",
];

function AIAnalysisModal({
  resource,
  onClose,
}: {
  resource: { type: "notes" | "pyq"; titleOrSubject: string; details: string };
  onClose: () => void;
}) {
  const [promptType, setPromptType] = useState<"questions" | "mock" | "concepts">("questions");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [pending, startTransition] = useTransition();

  // Rotate loading steps
  useState(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  });

  const handleGenerate = () => {
    setStatus("loading");
    setLoadingStepIndex(0);
    setErrorMsg("");

    let requestStr = "Generate Important Exam Questions & Answers";
    if (promptType === "mock") {
      requestStr = "Generate a Mock Exam Paper with Solutions";
    } else if (promptType === "concepts") {
      requestStr = "Key Concepts Summary & Explanation";
    }

    startTransition(async () => {
      try {
        const res = await analyzeStudyResource(
          resource.type,
          resource.titleOrSubject,
          resource.details,
          requestStr
        );
        if (res.ok && res.answer) {
          setResult(res.answer);
          setStatus("done");
        } else {
          setErrorMsg(res.error || "Failed to analyze study resource.");
          setStatus("error");
        }
      } catch (err) {
        setErrorMsg("A connection error occurred. Please try again.");
        setStatus("error");
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6 md:items-center">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai-gradient text-white shadow-md">
              <Brain className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy truncate max-w-[450px]">
                {resource.titleOrSubject}
              </h2>
              <p className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider">
                AI {resource.type === "notes" ? "Notes Analysis" : "PYQ Solver"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-muted hover:bg-slate-100 hover:text-ink transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 nice-scroll">
          {status === "idle" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-electric/20 bg-electric/5 p-4 text-sm text-ink leading-relaxed">
                <p className="font-semibold text-electric">⚡ Instant Exam Prep Guide</p>
                <p className="mt-1 text-xs text-slate-muted">
                  Gemini AI will analyze this study resource and synthesize custom prep materials tailored for your exams.
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
                  Select Prep Objective:
                </span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      id: "questions",
                      title: "Exam Qs & As",
                      desc: "Important predicted exam questions with detailed answers.",
                      tag: "Recommended",
                    },
                    {
                      id: "mock",
                      title: "Mock Paper",
                      desc: "Simulated exam question paper with step-by-step solutions.",
                      tag: "Test Ready",
                    },
                    {
                      id: "concepts",
                      title: "Concept Summary",
                      desc: "High-yield summary of core topics, formulas, and definitions.",
                      tag: "Quick Review",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPromptType(opt.id as any)}
                      className={`flex flex-col text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
                        promptType === opt.id
                          ? "border-electric bg-electric/5 ring-2 ring-electric/25"
                          : "border-border-soft bg-white"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-sm font-bold text-navy">{opt.title}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                            promptType === opt.id
                              ? "bg-electric text-white"
                              : "bg-slate-100 text-slate-muted"
                          }`}
                        >
                          {opt.tag}
                        </span>
                      </span>
                      <span className="mt-2 text-[11px] leading-normal text-slate-muted">
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  className="btn-press flex w-full items-center justify-center gap-2 rounded-2xl bg-ai-gradient py-3.5 text-sm font-bold text-white shadow-lg shadow-electric/20 hover:brightness-110"
                >
                  <Sparkles className="h-4 w-4" /> Generate Exam Prep Guide
                </button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              {/* Premium Scanning Animation */}
              <div className="relative w-44 h-56 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between p-3 overflow-hidden shadow-inner">
                {/* Horizontal scanning light */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric to-transparent blur-[1px] animate-bounce" style={{ animationDuration: '4s' }} />
                
                {/* Simulated text lines */}
                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded bg-slate-200" />
                  <div className="h-2 w-full rounded bg-slate-200" />
                  <div className="h-2 w-5/6 rounded bg-slate-200" />
                </div>
                <div className="space-y-2 self-center flex flex-col items-center justify-center flex-1">
                  <Brain className="h-10 w-10 text-electric animate-pulse" />
                  <span className="text-[10px] font-bold text-electric uppercase tracking-wider animate-pulse-soft">
                    Analyzing...
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-1/2 rounded bg-slate-200" />
                  <div className="h-2 w-2/3 rounded bg-slate-200" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-navy flex items-center justify-center gap-1.5">
                  {LOADING_STEPS[loadingStepIndex]}
                </p>
                <p className="text-xs text-slate-muted">This may take 10-15 seconds. Please don't close the modal.</p>
              </div>
            </div>
          )}

          {status === "done" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 rounded-2xl bg-emerald/5 border border-emerald/10 px-4 py-3 text-xs text-emerald font-semibold">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> AI Exam Prep Guide generated successfully!
                </span>
                <span>Gemini 2.5 Flash</span>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 border-b border-border-soft pb-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-soft bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-slate-50 transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copied!" : "Copy Prep Guide"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-soft bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-slate-50 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Print / Save PDF
                </button>
              </div>

              {/* Formatted output */}
              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-ink bg-slate-50/50 p-6 rounded-2xl border border-border-soft/60">
                <AIFormattedText text={result} />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <X className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-navy">Analysis Failed</h3>
                <p className="text-sm text-slate-muted max-w-sm">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="btn-press rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-dark transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Advanced Markdown Parser
function AIFormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const renderContent = (content: string) => {
    // Bold parsing
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-navy">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Weightage tags matching ⭐
      if (part.includes("⭐")) {
        const starParts = part.split(/(⭐+)/g);
        return starParts.map((sp, spi) => {
          if (sp.startsWith("⭐")) {
            return (
              <span key={spi} className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber border border-amber-200">
                {sp} Weightage
              </span>
            );
          }
          return sp;
        });
      }
      return part;
    });
  };

  return (
    <div className="space-y-3.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Table Parsing
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
          if (trimmed.includes("---")) {
            // Divider row, skip
            return null;
          }
          if (!inTable) {
            inTable = true;
            tableHeaders = cells;
            tableRows = [];
            return null;
          } else {
            tableRows.push(cells);
            return null;
          }
        } else if (inTable) {
          // Table ended, render it
          inTable = false;
          const currentHeaders = [...tableHeaders];
          const currentRows = [...tableRows];
          tableHeaders = [];
          tableRows = [];
          
          return (
            <div key={`table-${idx}`} className="my-4 overflow-x-auto rounded-xl border border-border-soft shadow-sm">
              <table className="min-w-full divide-y divide-border-soft bg-white text-left text-xs">
                <thead className="bg-slate-50 font-bold text-navy">
                  <tr>
                    {currentHeaders.map((h, i) => (
                      <th key={i} className="px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft text-slate-muted">
                  {currentRows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-slate-50/50">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2">{renderContent(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Headings
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="text-sm font-bold text-navy border-b border-border-soft pb-1 mt-5">
              {renderContent(trimmed.replace(/^###\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="text-base font-bold text-navy border-l-4 border-electric pl-2.5 py-0.5 mt-6">
              {renderContent(trimmed.replace(/^##\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="text-lg font-bold text-navy border-b-2 border-electric pb-2 mt-7">
              {renderContent(trimmed.replace(/^#\s*/, ""))}
            </h2>
          );
        }

        // Lists
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <li key={idx} className="ml-5 list-disc text-slate-muted text-xs sm:text-sm">
              {renderContent(trimmed.replace(/^[-*]\s*/, ""))}
            </li>
          );
        }

        // Numbered Lists
        if (/^\d+\./.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s*/, "");
          return (
            <div key={idx} className="flex gap-2 text-slate-muted text-xs sm:text-sm">
              <span className="font-bold text-electric shrink-0">{trimmed.match(/^\d+\./)?.[0]}</span>
              <span className="flex-1">{renderContent(content)}</span>
            </div>
          );
        }

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-slate-muted text-xs sm:text-sm leading-relaxed">
            {renderContent(line)}
          </p>
        );
      })}
    </div>
  );
}
