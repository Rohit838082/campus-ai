"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  likeNote,
  bookmarkPyq,
  downloadPyq,
  uploadNote,
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
                      <button className="inline-flex items-center gap-1 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-navy-dark">
                        <Eye className="h-3 w-3" /> View
                      </button>
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

  const submit = (fd: FormData) => {
    startTransition(async () => {
      await uploadNote(fd);
      onClose();
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
      <form
        action={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-electric" />
            <h2 className="text-lg font-bold text-ink">Upload notes</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-muted hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Title">
            <input
              required
              name="title"
              placeholder="e.g., DBMS Complete Notes — Sem 4"
              className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
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
              placeholder="What's covered in these notes?"
              className="w-full resize-none rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </Field>

          <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-soft bg-bg">
            <Upload className="h-7 w-7 text-slate-muted" />
            <p className="mt-2 text-sm font-semibold text-ink">Drop PDF or images</p>
            <p className="text-[11px] text-slate-muted">Demo: file not required</p>
          </div>

          <div className="flex gap-2 pt-2">
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
          <p className="text-[11px] text-slate-muted">
            ⚠️ Notes are moderated. You'll see "Under review" badge until approved.
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
