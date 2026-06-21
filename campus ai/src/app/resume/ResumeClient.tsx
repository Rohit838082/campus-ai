"use client";

import { useMemo, useState, useTransition } from "react";
import type { ChangeEvent, ComponentType, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { saveResume } from "@/app/actions";
import { ResumaveTemplate } from "./ResumaveTemplate";
import {
  AlertCircle,
  Award,
  Briefcase,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Lightbulb,
  Link as LinkIcon,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

type ResumeRecord = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  certificates?: string;
  languages?: string;
  aiScore: number;
  aiFeedback: string;
} | null;

export type ResumeDraft = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  certificates: string;
  languages: string;
};

type TemplateId = "resumave" | "compact" | "campus";

const emptyDraft: ResumeDraft = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  education: "",
  skills: "",
  projects: "",
  experience: "",
  certificates: "",
  languages: "",
};

const sampleDraft: ResumeDraft = {
  fullName: "Priya Sharma",
  headline: "Full-stack developer | AI projects | Campus placement ready",
  email: "priya.sharma@mu.ac.in",
  phone: "+91 98765 43210",
  address: "Mumbai, India",
  linkedin: "linkedin.com/in/priyasharma",
  github: "github.com/priyasharma",
  portfolio: "priyasharma.dev",
  summary:
    "Computer science student with hands-on experience building full-stack products using Next.js, PostgreSQL, and Python. Strong foundation in data structures, DBMS, and AI workflows with a focus on measurable product impact.",
  education:
    "BSc Computer Science | 2022 - 2025\nMumbai University, CGPA 8.7 | Mumbai\n- Coursework: Data Structures, DBMS, Operating Systems, Computer Networks\n\nHSC Science | 2022\nMaharashtra Board, 89% | Mumbai",
  experience:
    "SDE Intern | May 2024 - Jul 2024\nTechStartup Inc | Mumbai\n- Shipped 3 production features in a Next.js dashboard used by 500+ students\n- Reduced API response time by 28% by optimizing PostgreSQL queries\n- Wrote reusable React components and reviewed pull requests with the engineering team",
  projects:
    "CampusAI Notes Module | github.com/priyasharma/campusai\n- Built note upload, search, and moderation workflows for 500+ daily users\n- Added server actions and fallback mock data to keep the app usable without PostgreSQL\n\nSmart Attendance System | github.com/priyasharma/attendance-ai\n- Created face recognition attendance flow using Python and OpenCV\n- Improved check-in accuracy to 94% on classroom test data",
  skills:
    "Languages: JavaScript, TypeScript, Python, SQL\nFrontend: React, Next.js, Tailwind CSS\nBackend: Node.js, PostgreSQL, Drizzle ORM\nTools: Git, Docker, REST APIs, Figma",
  certificates:
    "AWS Cloud Foundations | 2024\nAmazon Web Services\n\nData Structures and Algorithms | 2023\nNPTEL",
  languages:
    "English | Professional Working Proficiency\nHindi | Native or Bilingual Proficiency\nMarathi | Native or Bilingual Proficiency",
};

const templates: Array<{ id: TemplateId; name: string; detail: string }> = [
  { id: "resumave", name: "Resumave Classic", detail: "Centered header, Times-style ATS layout" },
  { id: "compact", name: "Compact ATS", detail: "Dense one-page recruiter scan" },
  { id: "campus", name: "Campus Minimal", detail: "Clean headings for fresher resumes" },
];

export function ResumeClient({ data }: { data: ResumeRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<ResumeDraft>(() => toDraft(data));
  const [template, setTemplate] = useState<TemplateId>("resumave");
  const [localScore, setLocalScore] = useState(data?.aiScore ?? 0);
  const [localFeedback, setLocalFeedback] = useState(data?.aiFeedback ?? "");

  const completeness = useMemo(() => getCompleteness(draft), [draft]);

  const updateField =
    (field: keyof ResumeDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((current) => ({ ...current, [field]: event.target.value }));
    };

  const loadSample = () => {
    setDraft(sampleDraft);
    setLocalScore(0);
    setLocalFeedback("Sample loaded. Save it to get an ATS score for this draft.");
  };

  const printResume = () => {
    window.print();
  };

  const submit = (fd: FormData) => {
    Object.entries(draft).forEach(([key, value]) => fd.set(key, value));

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
      <div className="resume-builder-chrome border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">Resume Builder</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-muted">
              ATS-friendly resume templates adapted from the Resumave builder.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="btn-press inline-flex items-center gap-2 rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
            >
              <Sparkles className="h-4 w-4 text-royal" />
              Load ATS sample
            </button>
            <button
              type="button"
              onClick={printResume}
              className="btn-press inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.1fr)] lg:p-10">
        <form action={submit} className="resume-builder-chrome space-y-5 rounded-2xl border border-border-soft bg-white p-5 lg:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-bold text-ink">
              <FileText className="h-5 w-5 text-electric" />
              Builder fields
            </h2>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-muted">
              {completeness}% complete
            </div>
          </div>

          <FormSection title="Contact" icon={User}>
            <Field icon={User} label="Full name">
              <input name="fullName" value={draft.fullName} onChange={updateField("fullName")} className={inputCls} placeholder="Priya Sharma" />
            </Field>
            <Field icon={Lightbulb} label="Headline">
              <input
                name="headline"
                value={draft.headline}
                onChange={updateField("headline")}
                className={inputCls}
                placeholder="Full-stack developer | AI projects | Placement ready"
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field icon={Mail} label="Email">
                <input name="email" type="email" value={draft.email} onChange={updateField("email")} className={inputCls} placeholder="name@example.com" />
              </Field>
              <Field icon={Phone} label="Phone">
                <input name="phone" value={draft.phone} onChange={updateField("phone")} className={inputCls} placeholder="+91 98765 43210" />
              </Field>
            </div>
            <Field icon={LinkIcon} label="Location">
              <input name="address" value={draft.address} onChange={updateField("address")} className={inputCls} placeholder="Mumbai, India" />
            </Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field icon={LinkIcon} label="LinkedIn">
                <input name="linkedin" value={draft.linkedin} onChange={updateField("linkedin")} className={inputCls} placeholder="linkedin.com/in/name" />
              </Field>
              <Field icon={LinkIcon} label="GitHub">
                <input name="github" value={draft.github} onChange={updateField("github")} className={inputCls} placeholder="github.com/name" />
              </Field>
              <Field icon={LinkIcon} label="Portfolio">
                <input name="portfolio" value={draft.portfolio} onChange={updateField("portfolio")} className={inputCls} placeholder="yourname.dev" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="ATS content" icon={Sparkles}>
            <Field icon={Lightbulb} label="Professional summary">
              <textarea
                name="summary"
                rows={4}
                value={draft.summary}
                onChange={updateField("summary")}
                className={inputCls}
                placeholder="2-3 lines with target role, core skills, and measurable strengths."
              />
            </Field>
            <Field icon={GraduationCap} label="Education">
              <textarea
                name="education"
                rows={6}
                value={draft.education}
                onChange={updateField("education")}
                className={inputCls}
                placeholder={"Degree | 2022 - 2026\nCollege, CGPA 8.7 | Mumbai\n- Coursework: DSA, DBMS, OS"}
              />
            </Field>
            <Field icon={Briefcase} label="Experience">
              <textarea
                name="experience"
                rows={7}
                value={draft.experience}
                onChange={updateField("experience")}
                className={inputCls}
                placeholder={"Role | May 2024 - Jul 2024\nCompany | Location\n- Built feature with measurable result"}
              />
            </Field>
            <Field icon={Lightbulb} label="Projects">
              <textarea
                name="projects"
                rows={7}
                value={draft.projects}
                onChange={updateField("projects")}
                className={inputCls}
                placeholder={"Project name | github.com/name/project\n- Built X using Y\n- Improved Z by 25%"}
              />
            </Field>
            <Field icon={Wrench} label="Skills">
              <textarea
                name="skills"
                rows={4}
                value={draft.skills}
                onChange={updateField("skills")}
                className={inputCls}
                placeholder={"Languages: JavaScript, TypeScript, Python\nFrontend: React, Next.js, Tailwind CSS"}
              />
            </Field>
            <Field icon={Award} label="Certificates">
              <textarea
                name="certificates"
                rows={4}
                value={draft.certificates}
                onChange={updateField("certificates")}
                className={inputCls}
                placeholder={"Certificate title | 2024\nIssuer name"}
              />
            </Field>
            <Field icon={FileText} label="Languages">
              <textarea
                name="languages"
                rows={3}
                value={draft.languages}
                onChange={updateField("languages")}
                className={inputCls}
                placeholder={"English | Professional Working Proficiency\nHindi | Native or Bilingual Proficiency"}
              />
            </Field>
          </FormSection>

          <button
            type="submit"
            disabled={pending}
            className="btn-press flex w-full items-center justify-center gap-2 rounded-xl bg-ai-gradient py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving and scoring...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Save and get ATS feedback
              </>
            )}
          </button>
        </form>

        <div className="space-y-5">
          <div className="resume-builder-chrome rounded-2xl border border-border-soft bg-white p-5 lg:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-royal" />
              <h2 className="font-bold text-ink">ATS Resume Score</h2>
            </div>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ScoreRing score={localScore} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">
                  {localScore >= 85 ? "Strong ATS match" : localScore >= 70 ? "Good placement draft" : localScore > 0 ? "Needs stronger keywords" : "Awaiting review"}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-muted">
                  The score checks keyword density, bullet structure, measurable impact, links, and complete sections.
                </p>
                {localFeedback && (
                  <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
                    {localFeedback
                      .split("\n")
                      .map((line) => cleanFeedback(line))
                      .filter(Boolean)
                      .map((line, index) => {
                        const isAction = /^(add|use|include)/i.test(line);
                        return (
                          <div key={`${line}-${index}`} className="flex items-start gap-2 text-sm text-ink">
                            {isAction ? (
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                            ) : (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                            )}
                            <span>{line}</span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="resume-builder-chrome rounded-2xl border border-border-soft bg-white p-5 lg:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="flex items-center gap-2 font-bold text-ink">
                <FileText className="h-5 w-5 text-electric" />
                Resume templates
              </h2>
              <div className="grid gap-2 sm:grid-cols-3">
                {templates.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTemplate(item.id)}
                    className={`btn-press rounded-xl border px-3 py-2 text-left transition ${
                      template === item.id
                        ? "border-electric bg-secondary-50 text-ink"
                        : "border-border-soft bg-white text-slate-muted hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.name}</span>
                    <span className="mt-0.5 block text-[10px] leading-snug">{item.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border-soft bg-white p-3 shadow-sm sm:p-5">
            <div className="resume-print-root mx-auto w-fit">
              <ResumeTemplate draft={draft} template={template} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .resume-print-root,
          .resume-print-root * {
            visibility: visible !important;
          }

          .resume-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .resume-sheet {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
          }

          .resume-builder-chrome {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-muted/70 focus:border-electric focus:outline-none";

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-border-soft pt-4 first:border-t-0 first:pt-0">
      <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
        <Icon className="h-4 w-4 text-electric" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
        <Icon className="h-3.5 w-3.5 text-slate-muted" />
        {label}
      </span>
      {children}
    </label>
  );
}

function ResumeTemplate({ draft, template }: { draft: ResumeDraft; template: TemplateId }) {
  if (template === "resumave") {
    return <ResumaveTemplate draft={draft} />;
  }

  const contactItems = getContactItems(draft);
  const isCompact = template === "compact";
  const isCampus = template === "campus";

  return (
    <article
      className={`resume-sheet min-h-[1123px] w-[794px] bg-white text-black shadow-sm ${
        isCompact ? "px-12 py-10" : "px-14 py-12"
      }`}
      style={{
        fontFamily: isCampus ? "Arial, Helvetica, sans-serif" : "'Times New Roman', Times, serif",
      }}
    >
      <header className={isCompact ? "border-b border-gray-400 pb-3" : "text-center"}>
        <h1 className={`${isCompact ? "text-[24px]" : "text-[25px]"} font-bold uppercase tracking-normal text-gray-950`}>
          {draft.fullName || "Your Name"}
        </h1>
        {draft.headline && (
          <p className={`${isCompact ? "mt-1" : "mt-1.5"} text-[11px] font-medium text-gray-700`}>
            {draft.headline}
          </p>
        )}
        {contactItems.length > 0 && (
          <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-gray-700 ${isCompact ? "" : "justify-center"}`}>
            {contactItems.map((item) => (
              <a key={`${item.label}-${item.href}`} href={item.href} className="text-gray-700 no-underline">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className={isCompact ? "mt-4 space-y-3" : "mt-4 space-y-4"}>
        {draft.summary && (
          <TemplateSection title="Summary" compact={isCompact} campus={isCampus}>
            <p className="text-[10.8px] leading-snug text-gray-800">{draft.summary}</p>
          </TemplateSection>
        )}

        {draft.education && (
          <TemplateSection title="Education" compact={isCompact} campus={isCampus}>
            <StructuredBlocks text={draft.education} compact={isCompact} />
          </TemplateSection>
        )}

        {draft.experience && (
          <TemplateSection title="Experience" compact={isCompact} campus={isCampus}>
            <StructuredBlocks text={draft.experience} compact={isCompact} />
          </TemplateSection>
        )}

        {draft.projects && (
          <TemplateSection title="Projects" compact={isCompact} campus={isCampus}>
            <StructuredBlocks text={draft.projects} compact={isCompact} />
          </TemplateSection>
        )}

        {draft.skills && (
          <TemplateSection title="Skills" compact={isCompact} campus={isCampus}>
            <SkillsBlock text={draft.skills} />
          </TemplateSection>
        )}

        {draft.certificates && (
          <TemplateSection title="Certifications" compact={isCompact} campus={isCampus}>
            <StructuredBlocks text={draft.certificates} compact={isCompact} />
          </TemplateSection>
        )}

        {draft.languages && (
          <TemplateSection title="Languages" compact={isCompact} campus={isCampus}>
            <LanguagesBlock text={draft.languages} />
          </TemplateSection>
        )}
      </div>
    </article>
  );
}

function TemplateSection({
  title,
  compact,
  campus,
  children,
}: {
  title: string;
  compact: boolean;
  campus: boolean;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        className={`border-b text-[12px] font-bold uppercase tracking-normal text-gray-950 ${
          campus ? "border-gray-700 pb-1" : "border-gray-400 pb-0.5"
        }`}
      >
        {title}
      </h2>
      <div className={compact ? "mt-1.5" : "mt-2"}>{children}</div>
    </section>
  );
}

function StructuredBlocks({ text, compact }: { text: string; compact: boolean }) {
  const blocks = parseBlocks(text);

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {blocks.map((block, index) => (
        <div key={`${block.title.left}-${index}`} className="text-[10.6px] leading-snug text-gray-800">
          <div className="flex items-start justify-between gap-4">
            <strong className="font-bold text-gray-900">{block.title.left}</strong>
            {block.title.right && <span className="shrink-0 text-right text-[10px] italic text-gray-600">{block.title.right}</span>}
          </div>
          {(block.subtitle.left || block.subtitle.right) && (
            <div className="mt-0.5 flex items-start justify-between gap-4 text-gray-700">
              <span className="italic">{block.subtitle.left}</span>
              {block.subtitle.right && <span className="shrink-0 text-right text-[10px] text-gray-600">{block.subtitle.right}</span>}
            </div>
          )}
          {block.bullets.length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-800">
              {block.bullets.map((bullet, bulletIndex) => (
                <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsBlock({ text }: { text: string }) {
  const lines = splitLines(text);

  if (lines.length === 0) return null;

  return (
    <div className="space-y-1 text-[10.6px] leading-snug text-gray-800">
      {lines.map((line, index) => {
        const [label, ...rest] = line.split(":");
        const value = rest.join(":").trim();

        if (value) {
          return (
            <p key={`${line}-${index}`}>
              <strong className="font-bold text-gray-900">{label.trim()}:</strong> {value}
            </p>
          );
        }

        return <p key={`${line}-${index}`}>{line}</p>;
      })}
    </div>
  );
}

function LanguagesBlock({ text }: { text: string }) {
  const lines = splitLines(text);

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10.6px] leading-snug text-gray-800">
      {lines.map((line, index) => {
        const meta = parseMeta(line);
        return (
          <p key={`${line}-${index}`}>
            <strong className="font-bold text-gray-900">{meta.left}</strong>
            {meta.right && <span className="text-gray-700"> - {meta.right}</span>}
          </p>
        );
      })}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#059669" : score >= 70 ? "#2563eb" : score > 0 ? "#d97706" : "#94a3b8";

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={radius} strokeWidth="8" stroke="#e2e8f0" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-navy">{score || "-"}</span>
        <span className="text-[10px] font-semibold text-slate-muted">/ 100</span>
      </div>
    </div>
  );
}

function toDraft(data: ResumeRecord): ResumeDraft {
  if (!data) return emptyDraft;

  return {
    fullName: data.fullName ?? "",
    headline: data.headline ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address: data.address ?? "",
    linkedin: data.linkedin ?? "",
    github: data.github ?? "",
    portfolio: data.portfolio ?? "",
    summary: data.summary ?? "",
    education: data.education ?? "",
    skills: data.skills ?? "",
    projects: data.projects ?? "",
    experience: data.experience ?? "",
    certificates: data.certificates ?? "",
    languages: data.languages ?? "",
  };
}

function getCompleteness(draft: ResumeDraft) {
  const required: Array<keyof ResumeDraft> = [
    "fullName",
    "headline",
    "email",
    "phone",
    "summary",
    "education",
    "skills",
    "projects",
  ];
  const filled = required.filter((field) => draft[field].trim().length > 0).length;
  return Math.round((filled / required.length) * 100);
}

function getContactItems(draft: ResumeDraft) {
  return [
    draft.phone && { label: draft.phone, href: `tel:${draft.phone.replace(/\s/g, "")}` },
    draft.email && { label: draft.email, href: `mailto:${draft.email}` },
    draft.address && { label: draft.address, href: "#" },
    draft.linkedin && { label: cleanLinkLabel(draft.linkedin), href: withProtocol(draft.linkedin) },
    draft.github && { label: cleanLinkLabel(draft.github), href: withProtocol(draft.github) },
    draft.portfolio && { label: cleanLinkLabel(draft.portfolio), href: withProtocol(draft.portfolio) },
  ].filter(Boolean) as Array<{ label: string; href: string }>;
}

export function parseBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((block) => splitLines(block))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      const title = parseMeta(lines[0] ?? "");
      const hasSubtitle = lines.length > 1 && !isBullet(lines[1]);
      const subtitle = hasSubtitle ? parseMeta(lines[1]) : { left: "", right: "" };
      const bulletStart = hasSubtitle ? 2 : 1;
      const bullets = lines.slice(bulletStart).map(cleanBullet).filter(Boolean);

      return { title, subtitle, bullets };
    });
}

export function parseMeta(line: string) {
  const [left, ...rest] = line.split("|");
  return {
    left: cleanBullet(left || "").trim(),
    right: rest.join("|").trim(),
  };
}

export function splitLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isBullet(line: string) {
  return /^[-*]/.test(line.trim());
}

export function cleanBullet(line: string) {
  return line.replace(/^[-*]\s*/, "").trim();
}

function withProtocol(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function cleanLinkLabel(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function cleanFeedback(line: string) {
  return line.replace(/^[^A-Za-z0-9]+/, "").trim();
}
