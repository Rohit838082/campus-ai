"use client";

import { useState, useTransition } from "react";
import { attemptQuestion } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Target,
  FileText,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  Timer,
  Code,
  Brain,
  Users,
  Lightbulb,
  Trophy,
} from "lucide-react";

type Company = {
  id: number;
  name: string;
  category: string;
  logo: string;
  practiceCount: number;
  questionCount: number;
};
type Question = {
  id: number;
  companyId: number;
  question: string;
  category: string;
  difficulty: string;
  modelAnswer: string;
  attempts: number;
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-emerald",
  Med: "bg-amber",
  Hard: "bg-danger",
};

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Aptitude: Brain,
  Coding: Code,
  Technical: Lightbulb,
  HR: Users,
};

export function PlacementsClient({
  companies,
  questions,
}: {
  companies: Company[];
  questions: Question[];
}) {
  const [selected, setSelected] = useState<Company | null>(null);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [openQ, setOpenQ] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [showScore, setShowScore] = useState(false);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const companyQuestions = selected
    ? questions
        .filter((q) => q.companyId === selected.id)
        .filter((q) => diffFilter === "All" || q.difficulty === diffFilter)
        .filter((q) => catFilter === "All" || q.category === catFilter)
    : [];

  const handleAttempt = (q: Question) => {
    startTransition(async () => {
      await attemptQuestion(q.id);
      setShowScore(true);
      router.refresh();
    });
  };

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-royal/10 px-3 py-1 text-xs font-bold text-royal">
              <Trophy className="h-3.5 w-3.5" /> Premium module
            </div>
            <h1 className="mt-2 text-2xl font-bold text-navy md:text-3xl">Placement Prep</h1>
            <p className="mt-1 text-sm text-slate-muted">
              Company-specific questions, AI evaluations & mock interviews.
            </p>
          </div>
        </div>

        {/* Top stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Readiness", value: "62%", icon: Target, color: "text-emerald", bg: "bg-emerald/10" },
            { label: "Companies", value: companies.length, icon: Briefcase, color: "text-electric", bg: "bg-electric/10" },
            { label: "Questions", value: questions.length, icon: FileText, color: "text-royal", bg: "bg-royal/10" },
            { label: "Mock interviews", value: "3", icon: MessageSquare, color: "text-amber", bg: "bg-amber/10" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border-soft bg-white p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-bold text-navy">{s.value}</div>
              <div className="text-xs text-slate-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!selected ? (
        <div className="p-6 lg:p-10">
          <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies (TCS, Infosys, Amazon...)"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-muted">
            All companies ({filtered.length})
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="fade-up btn-press group rounded-2xl border border-border-soft bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-2xl">
                    {c.logo}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-ink">{c.name}</div>
                    <div className="text-xs text-slate-muted">{c.category}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3 text-xs">
                  <div>
                    <div className="text-lg font-bold text-navy">{c.questionCount}</div>
                    <div className="text-slate-muted">questions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-navy">{c.practiceCount.toLocaleString()}</div>
                    <div className="text-slate-muted">practiced</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-muted transition group-hover:translate-x-1 group-hover:text-electric" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 lg:p-10">
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-sm font-semibold text-electric hover:underline"
          >
            ← Back to companies
          </button>
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/5 text-3xl">
              {selected.logo}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy">{selected.name}</h2>
              <p className="text-sm text-slate-muted">
                {selected.category} · {selected.questionCount} questions available
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/resume"
                className="btn-press rounded-lg border border-border-soft bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50"
              >
                <FileText className="mr-1 inline h-3.5 w-3.5" /> Resume
              </Link>
              <button className="btn-press rounded-lg bg-ai-gradient px-3 py-2 text-xs font-semibold text-white">
                <MessageSquare className="mr-1 inline h-3.5 w-3.5" /> Mock interview
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="rounded-lg border border-border-soft bg-white px-3 py-1.5 text-sm"
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Med">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="rounded-lg border border-border-soft bg-white px-3 py-1.5 text-sm"
            >
              <option value="All">All categories</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Coding">Coding</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="space-y-3">
            {companyQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-soft bg-white py-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold">No questions match</p>
              </div>
            ) : (
              companyQuestions.map((q, i) => {
                const CatIcon = CATEGORY_ICON[q.category] || Lightbulb;
                return (
                  <div
                    key={q.id}
                    className="fade-up overflow-hidden rounded-2xl border border-border-soft bg-white"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex">
                      <div className={`w-1.5 ${DIFFICULTY_COLOR[q.difficulty]}`} />
                      <div className="flex-1 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${DIFFICULTY_COLOR[q.difficulty]}`}>
                            {q.difficulty === "Med" ? "Medium" : q.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-ink">
                            <CatIcon className="h-3 w-3" /> {q.category}
                          </span>
                          <span className="text-[11px] text-slate-muted">
                            {q.attempts} attempts
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-ink">{q.question}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setOpenQ(q);
                              setAnswer("");
                              setShowScore(false);
                            }}
                            className="btn-press rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark"
                          >
                            Attempt
                          </button>
                          <button
                            onClick={() => setOpenQ(q)}
                            className="rounded-lg border border-border-soft bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50"
                          >
                            View solution
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {openQ && (
        <QuestionModal
          q={openQ}
          answer={answer}
          setAnswer={setAnswer}
          showScore={showScore}
          onClose={() => {
            setOpenQ(null);
            setShowScore(false);
          }}
          onAttempt={handleAttempt}
          pending={pending}
        />
      )}
    </div>
  );
}

function QuestionModal({
  q,
  answer,
  setAnswer,
  showScore,
  onClose,
  onAttempt,
  pending,
}: {
  q: Question;
  answer: string;
  setAnswer: (s: string) => void;
  showScore: boolean;
  onClose: () => void;
  onAttempt: (q: Question) => void;
  pending: boolean;
}) {
  const score = Math.min(9, 4 + Math.floor(answer.length / 30));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-border-soft p-5">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${DIFFICULTY_COLOR[q.difficulty]}`}>
                {q.difficulty === "Med" ? "Medium" : q.difficulty}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold">{q.category}</span>
            </div>
            <h2 className="mt-2 text-base font-bold text-navy">{q.question}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-muted hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {!showScore ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-semibold text-ink">Your answer</label>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber/10 px-2 py-0.5 text-[11px] font-semibold text-amber">
                  <Timer className="h-3 w-3" /> 90s suggested
                </span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                placeholder="Type your answer here..."
                className="w-full resize-none rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-border-soft bg-white py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  Skip
                </button>
                <button
                  onClick={() => onAttempt(q)}
                  disabled={!answer.trim() || pending}
                  className="btn-press flex-1 rounded-xl bg-ai-gradient py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {pending ? "Evaluating..." : "Submit & see score"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 rounded-xl bg-emerald/10 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-bold text-emerald">{score}/10</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-ink">
                    {score >= 8 ? "Excellent!" : score >= 6 ? "Good attempt" : "Needs improvement"}
                  </div>
                  <div className="text-xs text-slate-muted">
                    {score >= 8
                      ? "Your answer covers all key points."
                      : "Compare with model answer below to improve."}
                  </div>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald" />
              </div>

              <div className="mt-4 rounded-xl border-l-4 border-l-electric bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric">
                  <Sparkles className="h-3.5 w-3.5" /> Model answer
                </div>
                <p className="text-sm leading-relaxed text-ink">{q.modelAnswer}</p>
              </div>

              <button
                onClick={onClose}
                className="btn-press mt-5 w-full rounded-xl bg-navy py-2.5 text-sm font-semibold text-white hover:bg-navy-dark"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
