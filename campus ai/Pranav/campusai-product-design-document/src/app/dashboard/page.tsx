import Link from "next/link";
import { db } from "@/db";
import { profile, doubts, notes, pyqs } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import {
  Bot,
  BookOpen,
  Briefcase,
  Flame,
  Users,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  GraduationCap,
  Bell,
  FileText,
  Target,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [me] = await db.select().from(profile).limit(1);
  const recentDoubts = await db
    .select()
    .from(doubts)
    .orderBy(desc(doubts.createdAt))
    .limit(3);
  const [noteCount] = await db.select({ count: sql<number>`count(*)` }).from(notes);
  const [pyqCount] = await db.select({ count: sql<number>`count(*)` }).from(pyqs);
  const [doubtCount] = await db.select({ count: sql<number>`count(*)` }).from(doubts);

  if (!me) {
    return (
      <div className="p-10 text-center text-slate-muted">
        Bootstrapping your account... refresh in a moment.
      </div>
    );
  }

  const firstName = me.name.split(" ")[0];

  return (
    <div className="pb-24 lg:pb-10">
      {/* Header */}
      <div className="border-b border-border-soft bg-white px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1 className="mt-1 text-3xl font-bold text-navy md:text-4xl">
              Good {getGreeting()}, {firstName} 👋
            </h1>
            <p className="mt-1.5 text-slate-muted">
              You're on a <span className="font-semibold text-ink">{me.streakDays}-day streak</span>.
              Keep it going!
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/doubts"
              className="btn-press inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
            >
              <Bot className="h-4 w-4" /> Ask AI a doubt
            </Link>
            <Link
              href="/study"
              className="btn-press inline-flex items-center gap-2 rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> Upload notes
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-10">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick action grid */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted">
              Quick actions
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: Bot, label: "Ask a doubt", href: "/doubts", from: "from-electric to-royal" },
                { icon: BookOpen, label: "PYQ library", href: "/study", from: "from-emerald to-electric" },
                { icon: Briefcase, label: "Placement prep", href: "/placements", from: "from-royal to-navy" },
                { icon: Users, label: "Community", href: "/community", from: "from-amber to-danger" },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="btn-press group flex flex-col items-start gap-3 rounded-2xl border border-border-soft bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.from} text-white shadow-md`}
                  >
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">{a.label}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-electric opacity-0 transition group-hover:opacity-100">
                      Open <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Streak + today's timetable */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border-soft bg-gradient-to-br from-amber/5 to-danger/5 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber" />
                  <h3 className="font-bold text-ink">Study streak</h3>
                </div>
                <span className="rounded-md bg-amber/20 px-2 py-0.5 text-xs font-bold text-amber">
                  🔥 On fire
                </span>
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-bold text-navy">{me.streakDays}</span>
                <span className="mb-2 text-sm text-slate-muted">days</span>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < (me.streakDays % 7 || 7) ? "bg-amber" : "bg-border-soft"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-muted">
                {7 - (me.streakDays % 7 || 7)} more days to unlock the <strong>Weekly Warrior</strong> badge 🏆
              </p>
            </div>

            <div className="rounded-2xl border border-border-soft bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-electric" />
                  <h3 className="font-bold text-ink">Today's timetable</h3>
                </div>
                <Link href="/settings" className="text-[11px] font-semibold text-electric hover:underline">
                  Edit
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { time: "09:00", sub: "Data Structures", room: "Room 204", color: "bg-electric" },
                  { time: "11:00", sub: "DBMS Lab", room: "Lab 3", color: "bg-emerald" },
                  { time: "14:00", sub: "Operating Systems", room: "Room 102", color: "bg-royal" },
                  { time: "16:00", sub: "Mathematics", room: "Room 305", color: "bg-amber" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border-soft p-2.5"
                  >
                    <div className={`h-8 w-1 rounded-full ${c.color}`} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-ink">{c.sub}</div>
                      <div className="text-[11px] text-slate-muted">{c.room}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {c.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent AI doubts */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-royal" />
                <h3 className="font-bold text-ink">Recent AI doubts</h3>
              </div>
              <Link href="/doubts" className="text-xs font-semibold text-electric hover:underline">
                View all →
              </Link>
            </div>
            {recentDoubts.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center">
                <Bot className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-ink">No doubts yet</p>
                <p className="text-xs text-slate-muted">Ask your first question to get started.</p>
                <Link
                  href="/doubts"
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-ai-gradient px-3 py-1.5 text-xs font-bold text-white"
                >
                  Ask AI <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {recentDoubts.map((d) => (
                  <Link
                    key={d.id}
                    href="/doubts"
                    className="btn-press flex items-start gap-3 rounded-xl border border-border-soft p-3 transition hover:border-electric/40 hover:bg-electric/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-royal/10 text-xs font-bold text-royal">
                      {d.subject.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                          {d.subject}
                        </span>
                        <span className="text-[11px] text-slate-muted">
                          {timeAgo(d.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-ink">{d.question}</p>
                    </div>
                    <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-muted" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Stats cards */}
          <section className="grid grid-cols-2 gap-3">
            <StatCard icon={Bot} label="Doubts asked" value={doubtCount.count} color="text-royal" bg="bg-royal/10" />
            <StatCard icon={BookOpen} label="Notes available" value={noteCount.count} color="text-emerald" bg="bg-emerald/10" />
            <StatCard icon={FileText} label="PYQ papers" value={pyqCount.count} color="text-electric" bg="bg-electric/10" />
            <StatCard icon={Target} label="Readiness" value="62%" color="text-amber" bg="bg-amber/10" />
          </section>

          {/* AI Mentor promo */}
          <section className="relative overflow-hidden rounded-2xl bg-ai-gradient p-6 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <Sparkles className="h-7 w-7" />
            <h3 className="mt-3 text-lg font-bold">Meet your AI Mentor</h3>
            <p className="mt-1 text-sm text-white/80">
              Personalized study plans, weak subject detection, daily goals.
            </p>
            <Link
              href="/mentor"
              className="btn-press mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-navy hover:bg-slate-50"
            >
              Start plan <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Upcoming deadlines */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-danger" />
              <h3 className="font-bold text-ink">Upcoming</h3>
            </div>
            <div className="mt-3 space-y-3">
              {[
                { title: "DBMS Internal Exam", date: "Oct 28", tag: "Exam", tagColor: "bg-danger/10 text-danger" },
                { title: "TCS NQT Registration", date: "Nov 2", tag: "Placement", tagColor: "bg-electric/10 text-electric" },
                { title: "DSA Assignment #4", date: "Nov 5", tag: "Assignment", tagColor: "bg-amber/10 text-amber" },
              ].map((d) => (
                <div key={d.title} className="flex items-start gap-3">
                  <div className="flex flex-col items-center rounded-lg bg-slate-50 px-2.5 py-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-muted">
                      {d.date.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold text-navy">{d.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{d.title}</div>
                    <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${d.tagColor}`}>
                      {d.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance chart */}
          <section className="rounded-2xl border border-border-soft bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald" />
                <h3 className="font-bold text-ink">Weekly study</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald">+18%</span>
            </div>
            <div className="mt-4 flex items-end gap-2">
              {[40, 60, 35, 80, 55, 75, 90].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-electric to-royal"
                    style={{ height: `${h}px` }}
                  />
                  <span className="text-[10px] font-semibold text-slate-muted">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-bold text-navy">{value}</div>
      <div className="text-xs text-slate-muted">{label}</div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function timeAgo(d: Date) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
