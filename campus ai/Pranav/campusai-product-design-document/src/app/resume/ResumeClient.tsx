"use client";

import { useState, useTransition } from "react";
import { saveResume } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  User,
  Mail,
  Phone,
  GraduationCap,
  Wrench,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Resume = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  aiScore: number;
  aiFeedback: string;
} | null;

export function ResumeClient({ data }: { data: Resume }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [localScore, setLocalScore] = useState(data?.aiScore ?? 0);
  const [localFeedback, setLocalFeedback] = useState(data?.aiFeedback ?? "");

  const submit = (fd: FormData) => {
    startTransition(async () => {
      const res = await saveResume(fd);
      if (res.ok) {
        setLocalScore(res.score);
        setLocalFeedback(res.aiFeedback);
      }
      router.refresh();
    });
  };

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">Resume Builder</h1>
            <p className="mt-1 text-sm text-slate-muted">
              AI-scored resume, tailored for campus placements.
            </p>
          </div>
          <button className="btn-press inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2 lg:p-10">
        {/* Form */}
        <form action={submit} className="space-y-4 rounded-2xl border border-border-soft bg-white p-6">
          <h2 className="flex items-center gap-2 font-bold text-ink">
            <FileText className="h-5 w-5 text-electric" /> Your details
          </h2>

          <Field icon={User} label="Full name">
            <input name="fullName" defaultValue={data?.fullName} className={inputCls} />
          </Field>
          <Field icon={Lightbulb} label="Headline (one-liner about you)">
            <input name="headline" defaultValue={data?.headline} className={inputCls} placeholder="e.g., Full-stack developer passionate about AI" />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field icon={Mail} label="Email">
              <input name="email" type="email" defaultValue={data?.email} className={inputCls} />
            </Field>
            <Field icon={Phone} label="Phone">
              <input name="phone" defaultValue={data?.phone} className={inputCls} />
            </Field>
          </div>
          <Field icon={GraduationCap} label="Education">
            <textarea name="education" rows={3} defaultValue={data?.education} className={inputCls} placeholder="Degrees, CGPA, boards" />
          </Field>
          <Field icon={Wrench} label="Skills (comma separated)">
            <input name="skills" defaultValue={data?.skills} className={inputCls} placeholder="JavaScript, React, Python, ..." />
          </Field>
          <Field icon={Briefcase} label="Experience">
            <textarea name="experience" rows={3} defaultValue={data?.experience} className={inputCls} placeholder="Internships, roles" />
          </Field>
          <Field icon={Lightbulb} label="Projects">
            <textarea name="projects" rows={4} defaultValue={data?.projects} className={inputCls} placeholder="Notable projects with impact" />
          </Field>

          <button
            type="submit"
            disabled={pending}
            className="btn-press flex w-full items-center justify-center gap-2 rounded-xl bg-ai-gradient py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> AI is reviewing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Save & get AI feedback
              </>
            )}
          </button>
        </form>

        {/* Preview + AI feedback */}
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-2xl border border-border-soft bg-white p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-royal" />
              <h2 className="font-bold text-ink">AI Resume Score</h2>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <ScoreRing score={localScore} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">
                  {localScore >= 80 ? "Excellent!" : localScore >= 60 ? "Good start" : localScore > 0 ? "Needs work" : "Awaiting review"}
                </div>
                <p className="mt-1 text-xs text-slate-muted">
                  {localScore === 0
                    ? "Fill the form and save to get AI feedback."
                    : "Score based on completeness, impact metrics, and formatting."}
                </p>
              </div>
            </div>
            {localFeedback && (
              <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4">
                {localFeedback.split("\n").filter(Boolean).map((line, i) => {
                  const isGood = line.startsWith("✨");
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2 text-sm ${
                        isGood ? "text-emerald" : "text-ink"
                      }`}
                    >
                      {isGood ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                      )}
                      <span>{line.replace(/^[✏️🛠️🚀💼🎓✨]\s*/, "")}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live preview */}
          <div className="rounded-2xl border border-border-soft bg-white p-6">
            <h2 className="flex items-center gap-2 font-bold text-ink">
              <FileText className="h-5 w-5 text-electric" /> Live preview
            </h2>
            <div className="mt-4 space-y-3 border-l-4 border-l-electric pl-4 text-sm">
              <div>
                <div className="text-lg font-bold text-navy">{data?.fullName || "Your Name"}</div>
                <div className="text-xs text-slate-muted">{data?.headline || "Your headline"}</div>
              </div>
              <div className="text-[11px] text-slate-muted">
                {data?.email} · {data?.phone}
              </div>
              {data?.education && (
                <PreviewSection title="Education" body={data.education} />
              )}
              {data?.skills && <PreviewSection title="Skills" body={data.skills} />}
              {data?.experience && <PreviewSection title="Experience" body={data.experience} />}
              {data?.projects && <PreviewSection title="Projects" body={data.projects} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
        <Icon className="h-3.5 w-3.5 text-slate-muted" /> {label}
      </span>
      {children}
    </label>
  );
}

function PreviewSection({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-electric">{title}</div>
      <div className="mt-0.5 whitespace-pre-wrap text-[12px] leading-relaxed text-ink">{body}</div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#059669" : score >= 60 ? "#2563eb" : score > 0 ? "#d97706" : "#94a3b8";
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90">
        <circle cx="56" cy="56" r={radius} strokeWidth="8" stroke="#e2e8f0" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-navy">{score || "—"}</span>
        <span className="text-[10px] font-semibold text-slate-muted">/ 100</span>
      </div>
    </div>
  );
}
