"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  BookOpen,
  Briefcase,
  Users,
  GraduationCap,
  Bell,
  Search,
  Sparkles,
  Video,
  Timer,
} from "lucide-react";

const mobileTabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/doubts", label: "Ask AI", icon: Bot },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/placements", label: "Jobs", icon: Briefcase },
  { href: "/community", label: "Community", icon: Users },
];

export function TopBar() {
  const pathname = usePathname();
  if (pathname === "/") return null; // landing page has no top bar

  return (
    <>
      <header className="sticky top-0 z-20 hidden border-b border-border-soft bg-white/80 backdrop-blur lg:flex">
        <div className="flex h-16 w-full items-center gap-4 px-8">
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-border-soft bg-bg px-3 py-2">
            <Search className="h-4 w-4 text-slate-muted" />
            <input
              placeholder="Search doubts, notes, PYQs, companies..."
              className="w-full bg-transparent text-sm placeholder:text-slate-muted focus:outline-none"
            />
            <kbd className="hidden rounded-md border border-border-soft bg-white px-1.5 py-0.5 text-[10px] text-slate-muted md:inline">
              ⌘K
            </kbd>
          </div>
          <button className="relative rounded-xl p-2 text-slate-muted transition hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
          <div className="h-6 w-px bg-border-soft" />
          <Link
            href="/mentor"
            className="btn-press flex items-center gap-2 rounded-xl bg-ai-gradient px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Ask Mentor
          </Link>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-white/95 backdrop-blur lg:hidden">
        <ul className="no-scrollbar flex overflow-x-auto">
          {mobileTabs.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <li key={t.href} className="flex flex-1 min-w-[4rem]">
                <Link
                  href={t.href}
                  className={`flex w-full flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition ${
                    active ? "text-electric" : "text-slate-muted"
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-lg transition ${active ? "bg-electric/10" : ""}`}>
                    <t.icon className={`h-4 w-4 ${active ? "stroke-[2.25]" : ""}`} />
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border-soft bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-navy">CampusAI</span>
        </Link>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-slate-muted"><Search className="h-5 w-5" /></button>
          <button className="relative rounded-lg p-2 text-slate-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>
        </div>
      </div>
    </>
  );
}
