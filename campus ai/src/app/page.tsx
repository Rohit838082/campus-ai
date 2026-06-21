import Link from "next/link";
import {
  Bot,
  BookOpen,
  GraduationCap,
  Sparkles,
  Users,
  Briefcase,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  Target,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-electric/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-royal/10 blur-3xl" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-navy">CampusAI</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-muted">
              Student Super App
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-muted md:flex">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#modules" className="hover:text-ink">Modules</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <a href="#universities" className="hover:text-ink">Universities</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-xl border border-border-soft px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-50 sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="btn-press inline-flex items-center gap-1 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-dark"
          >
            Get started <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white px-3 py-1 text-xs font-semibold text-navy shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-royal" />
              Built for Maharashtra universities
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-navy md:text-6xl">
              One AI app for{" "}
              <span className="text-brand-gradient">every college problem</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-muted">
              Doubts at 11 PM. Scattered notes. PYQ chaos. Placement panic. CampusAI
              unifies everything with an AI-first assistant — designed for Mumbai, Pune
              & Nagpur university students.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="btn-press inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-electric/20 hover:brightness-110"
              >
                Launch the app <ChevronRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-white px-6 py-3.5 text-base font-semibold text-navy hover:bg-slate-50"
              >
                See features
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald" />
                Privacy-first
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber" />
                Answers in 4s
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {["🎓", "📘", "🚀"].map((e) => (
                    <span
                      key={e}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-gradient text-xs"
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <span>5,000+ students</span>
              </div>
            </div>
          </div>

          {/* Hero mockup card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-ai-gradient opacity-20 blur-2xl" />
            <div className="relative rounded-3xl border border-border-soft bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border-soft pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-gradient text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">AI Doubt Solver</div>
                    <div className="text-[11px] text-slate-muted">GPT-4o · Online</div>
                  </div>
                </div>
                <span className="rounded-md bg-emerald/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald">
                  Live
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-electric px-4 py-2.5 text-sm text-white">
                  What is the time complexity of quicksort in the worst case?
                </div>
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ai-gradient text-[10px] font-bold text-white">
                    AI
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border-soft bg-slate-50 px-4 py-3 text-sm leading-relaxed text-ink">
                    <p className="font-semibold">Worst case: O(n²)</p>
                    <p className="mt-1 text-slate-muted">
                      Happens when pivot is consistently smallest/largest (e.g. sorted
                      array). Avoid with <em>randomized quicksort</em>.
                    </p>
                  </div>
                </div>
                <div className="ml-auto max-w-[60%] rounded-2xl rounded-br-sm bg-electric px-4 py-2.5 text-sm text-white">
                  How to avoid it?
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-border-soft bg-bg px-3 py-2.5">
                <span className="text-[11px] text-slate-muted">Subject:</span>
                <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-ink shadow-sm">
                  Data Structures
                </span>
                <input
                  readOnly
                  placeholder="Type your doubt..."
                  className="flex-1 bg-transparent text-sm placeholder:text-slate-muted focus:outline-none"
                />
                <button className="rounded-lg bg-ai-gradient px-3 py-1.5 text-xs font-bold text-white">
                  Send
                </button>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-4 top-8 hidden rounded-2xl border border-border-soft bg-white p-3 shadow-lg md:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-muted">Placement ready</div>
                  <div className="text-sm font-bold text-ink">87% score</div>
                </div>
              </div>
            </div>
            <div className="absolute -left-6 bottom-10 hidden rounded-2xl border border-border-soft bg-white p-3 shadow-lg md:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-muted">Streak</div>
                  <div className="text-sm font-bold text-ink">🔥 12 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section id="features" className="relative z-10 border-y border-border-soft bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 divide-x divide-border-soft md:grid-cols-4">
          {[
            { icon: Bot, label: "AI Doubts Solved", value: "180K+" },
            { icon: BookOpen, label: "Notes Shared", value: "12K+" },
            { icon: Users, label: "Active Students", value: "5,000+" },
            { icon: Briefcase, label: "Placements Helped", value: "420+" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-6 py-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-electric shadow-sm">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy">{s.value}</div>
                <div className="text-xs text-slate-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-electric/10 px-3 py-1 text-xs font-semibold text-electric">
            5 modules, 1 app
          </span>
          <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-3 text-slate-muted">
            Replace 5–8 fragmented apps with one intelligent, personalized ecosystem.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Bot,
              color: "from-electric to-royal",
              title: "AI Doubt Solver",
              desc: "Text or photo. Get step-by-step solutions streamed in seconds. Saves every doubt to your history.",
              cta: "Try it",
              href: "/doubts",
            },
            {
              icon: BookOpen,
              color: "from-emerald to-electric",
              title: "PYQ + Notes Library",
              desc: "Search past-year papers across 3 universities. Community-verified notes with preview & download.",
              cta: "Browse",
              href: "/study",
            },
            {
              icon: Briefcase,
              color: "from-royal to-navy",
              title: "Placement Prep",
              desc: "Company-specific questions, AI-evaluated answers, mock interviews, resume builder.",
              cta: "Start prep",
              href: "/placements",
            },
            {
              icon: Users,
              color: "from-amber to-danger",
              title: "Community Forum",
              desc: "Ask, discuss, share. Leaderboard with badges and points for top contributors.",
              cta: "Join",
              href: "/community",
            },
            {
              icon: Sparkles,
              color: "from-electric to-emerald",
              title: "Personal AI Mentor",
              desc: "Detects your weak subjects, builds a daily study plan, and keeps you accountable.",
              cta: "Meet mentor",
              href: "/mentor",
            },
            {
              icon: Target,
              color: "from-navy to-electric",
              title: "Analytics Dashboard",
              desc: "Track attendance, study hours, and performance across subjects with beautiful charts.",
              cta: "View stats",
              href: "/analytics",
            },
          ].map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="btn-press group relative overflow-hidden rounded-2xl border border-border-soft bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-white shadow-md`}
              >
                <m.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">{m.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-muted">{m.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-electric group-hover:gap-2">
                {m.cta} <ChevronRight className="h-4 w-4 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 border-t border-border-soft bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              Start free. Upgrade when ready.
            </h2>
            <p className="mt-3 text-slate-muted">
              Designed to be affordable for every student.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "forever",
                features: ["3 AI doubts/day", "View notes & PYQs", "Community forum", "Basic analytics"],
                cta: "Get started",
                highlight: false,
              },
              {
                name: "Premium",
                price: "₹99",
                period: "/month",
                features: ["Unlimited AI doubts", "Download notes & PYQs", "5 AI solutions/day", "Full placement module", "Advanced analytics"],
                cta: "Go Premium",
                highlight: true,
              },
              {
                name: "Pro",
                price: "₹199",
                period: "/month",
                features: ["Everything in Premium", "Priority AI responses", "Personalized AI mentor", "Verified contributor badge"],
                cta: "Go Pro",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-7 ${
                  p.highlight
                    ? "border-electric bg-white shadow-xl ring-1 ring-electric"
                    : "border-border-soft bg-white"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ai-gradient px-3 py-1 text-[11px] font-bold uppercase text-white">
                    Most popular
                  </span>
                )}
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-muted">
                  {p.name}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-navy">{p.price}</span>
                  <span className="text-sm text-slate-muted">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`btn-press mt-7 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                    p.highlight
                      ? "bg-ai-gradient text-white hover:brightness-110"
                      : "border border-border-soft text-navy hover:bg-slate-50"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section id="universities" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-brand-gradient p-10 text-white md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                Built for Maharashtra. Expanding across India.
              </h2>
              <p className="mt-4 max-w-lg text-white/80">
                CampusAI is deeply tailored to the syllabi, exam patterns, and
                placement ecosystems of Maharashtra&apos;s top universities.
              </p>
              <Link
                href="/dashboard"
                className="btn-press mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy hover:bg-slate-50"
              >
                Explore the app <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Mumbai University", count: "2,400+ students" },
                { name: "Pune University", count: "1,800+ students" },
                { name: "Nagpur University", count: "800+ students" },
                { name: "+ 17 more", count: "Coming soon" },
              ].map((u) => (
                <div
                  key={u.name}
                  className="rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20"
                >
                  <div className="text-sm font-bold">{u.name}</div>
                  <div className="mt-0.5 text-xs text-white/70">{u.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border-soft bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-muted md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>© 2025 CampusAI. Built for students, by students.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
