import Link from "next/link";
import {
  Home,
  Bot,
  BookOpen,
  Briefcase,
  Users,
  BarChart3,
  Sparkles,
  FileText,
  Settings,
  GraduationCap,
  Crown,
} from "lucide-react";

const primary = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/doubts", label: "AI Doubt Solver", icon: Bot, badge: "AI" },
  { href: "/study", label: "Study Hub", icon: BookOpen },
  { href: "/placements", label: "Placement Prep", icon: Briefcase, badge: "PRO" },
  { href: "/community", label: "Community", icon: Users },
];

const secondary = [
  { href: "/mentor", label: "AI Mentor", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border-soft bg-white lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold text-navy">CampusAI</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-muted">
            Student Super App
          </span>
        </div>
      </Link>

      <div className="px-4 pt-2">
        <div className="rounded-xl bg-gradient-to-br from-royal/10 to-electric/10 p-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-royal" />
            <span className="text-xs font-semibold text-navy">Free Plan</span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-slate-muted">
            3 AI doubts/day · View-only notes
          </p>
          <button className="btn-press mt-2 w-full rounded-lg bg-royal py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-110">
            Upgrade to Premium
          </button>
        </div>
      </div>

      <nav className="nice-scroll mt-4 flex-1 overflow-y-auto px-3">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-muted">
          Main
        </div>
        <ul className="space-y-0.5">
          {primary.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </ul>

        <div className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-muted">
          Insights
        </div>
        <ul className="space-y-0.5">
          {secondary.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-border-soft p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
            PS
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">Priya Sharma</div>
            <div className="truncate text-[11px] text-slate-muted">Mumbai University · Sem 4</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="btn-press group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-muted transition hover:bg-slate-100 hover:text-ink"
      >
        <Icon className="h-[18px] w-[18px]" />
        <span className="flex-1">{label}</span>
        {badge === "AI" && (
          <span className="rounded-md bg-ai-gradient px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            AI
          </span>
        )}
        {badge === "PRO" && (
          <span className="rounded-md bg-royal px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            Pro
          </span>
        )}
      </Link>
    </li>
  );
}
