import Link from "next/link";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  Flame,
  Lightbulb,
} from "lucide-react";

export default function MentorPage() {
  const weakSubjects = [
    { name: "Operating Systems", score: 42, icon: "💾", plan: "Read chapters 4-6 of Galvin + solve 10 scheduling problems", days: 7 },
    { name: "Discrete Math", score: 58, icon: "📐", plan: "Practice 5 proofs/day from Rosen textbook", days: 10 },
    { name: "Computer Networks", score: 64, icon: "🌐", plan: "Watch Kurose lectures 1-4, take notes", days: 5 },
  ];
  const strongSubjects = [
    { name: "Data Structures", score: 88, icon: "🌳" },
    { name: "DBMS", score: 82, icon: "🗄️" },
    { name: "Java OOP", score: 91, icon: "☕" },
  ];
  const dailyGoals = [
    { label: "Solve 5 DSA problems", done: true, icon: "🧩" },
    { label: "Read OS chapter 5", done: true, icon: "📖" },
    { label: "Practice 2 SQL queries", done: false, icon: "💻" },
    { label: "Review DBMS notes", done: false, icon: "📝" },
  ];
  const doneCount = dailyGoals.filter((g) => g.done).length;

  return (
    <div className="pb-24 lg:pb-10">
      <div className="bg-ai-gradient px-6 py-10 text-white lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> Personal AI Mentor
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Hi Priya, here&apos;s your plan 🎯</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Based on your recent activity, attendance, and PYQ practice — I&apos;ve built a
            personalized 7-day study plan to improve your weakest subjects.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Target className="h-4 w-4" /> Focus this week
              </div>
              <div className="mt-1 text-xl font-bold">Operating Systems</div>
              <div className="text-xs text-white/70">Lowest subject score (42%)</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Flame className="h-4 w-4" /> Daily streak
              </div>
              <div className="mt-1 text-xl font-bold">12 days</div>
              <div className="text-xs text-white/70">Keep it up!</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Clock className="h-4 w-4" /> Est. time today
              </div>
              <div className="mt-1 text-xl font-bold">2.5 hours</div>
              <div className="text-xs text-white/70">4 tasks remaining</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-10">
        <div className="space-y-6 lg:col-span-2">
          {/* Today's goals */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-electric" />
                <h2 className="font-bold text-ink">Today&apos;s goals</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${(doneCount / dailyGoals.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-ink">
                  {doneCount}/{dailyGoals.length}
                </span>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {dailyGoals.map((g, i) => (
                <li
                  key={i}
                  className={`fade-up flex items-center gap-3 rounded-xl border p-3 transition ${
                    g.done ? "border-emerald/30 bg-emerald/5" : "border-border-soft"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <button
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      g.done
                        ? "border-emerald bg-emerald text-white"
                        : "border-border-soft hover:border-electric"
                    }`}
                  >
                    {g.done && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  <span className="text-lg">{g.icon}</span>
                  <span className={`flex-1 text-sm font-semibold ${g.done ? "text-slate-muted line-through" : "text-ink"}`}>
                    {g.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-muted">
                    {g.done ? "Done ✓" : "To do"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Weak subjects */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-danger" />
              <h2 className="font-bold text-ink">Subjects to improve</h2>
            </div>
            <div className="mt-4 space-y-3">
              {weakSubjects.map((s) => (
                <div key={s.name} className="rounded-xl border border-border-soft p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-xl">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-ink">{s.name}</h3>
                        <span className="text-sm font-bold text-danger">{s.score}%</span>
                      </div>
                      <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-danger to-amber"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-muted">
                        <Lightbulb className="mr-1 inline h-3 w-3 text-amber" />
                        {s.plan}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="btn-press rounded-lg bg-ai-gradient px-3 py-1.5 text-xs font-semibold text-white">
                          Start plan
                        </button>
                        <span className="text-[11px] text-slate-muted">{s.days} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Strong subjects */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald" />
              <h2 className="font-bold text-ink">Your strengths</h2>
            </div>
            <div className="mt-4 space-y-2">
              {strongSubjects.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border-soft p-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{s.name}</div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald">{s.score}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming exams */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-royal" />
              <h2 className="font-bold text-ink">Upcoming exams</h2>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { sub: "DBMS Internal", date: "Oct 28", days: 3 },
                { sub: "OS Semester", date: "Nov 12", days: 18 },
                { sub: "DSA End-sem", date: "Nov 20", days: 26 },
              ].map((e) => (
                <div key={e.sub} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-royal/10">
                    <span className="text-[10px] font-bold text-royal">{e.date.split(" ")[0]}</span>
                    <span className="text-sm font-bold text-navy">{e.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{e.sub}</div>
                    <div className="text-[11px] text-slate-muted">In {e.days} days</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/analytics"
              className="btn-press mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-100"
            >
              View all analytics <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
