import { db } from "@/db";
import { profile } from "@/db/schema";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  Crown,
  Check,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [me] = await db.select().from(profile).limit(1);

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-navy md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-muted">
          Manage your profile, preferences, and subscription.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-10">
        {/* Profile */}
        <section className="rounded-2xl border border-border-soft bg-white p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-ink">
            <User className="h-5 w-5 text-electric" /> Profile
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white">
              {me?.name.split(" ").map((x) => x[0]).join("")}
            </div>
            <div>
              <div className="text-lg font-bold text-ink">{me?.name}</div>
              <div className="text-sm text-slate-muted">
                {me?.course} · Sem {me?.semester}
              </div>
              <div className="text-xs text-slate-muted">{me?.university}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoField label="Full name" value={me?.name ?? ""} />
            <InfoField label="University" value={me?.university ?? ""} />
            <InfoField label="Course" value={me?.course ?? ""} />
            <InfoField label="Semester" value={`Semester ${me?.semester}`} />
          </div>
          <button className="btn-press mt-5 rounded-xl border border-border-soft bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-50">
            Edit profile
          </button>
        </section>

        {/* Subscription */}
        <section className="rounded-2xl bg-ai-gradient p-6 text-white">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <h2 className="font-bold">Current plan</h2>
          </div>
          <div className="mt-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {me?.premiumTier === "free" ? "Free tier" : `${me?.premiumTier} plan`}
            </div>
            <div className="mt-1 text-2xl font-bold">
              {me?.premiumTier === "free" ? "₹0" : me?.premiumTier === "premium" ? "₹99" : "₹199"}
              <span className="text-sm font-normal text-white/70"> /month</span>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "3 AI doubts/day",
              "View notes & PYQs",
              "Community access",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="btn-press mt-5 block rounded-xl bg-white py-2.5 text-center text-sm font-bold text-navy hover:bg-slate-50"
          >
            Upgrade to Premium →
          </Link>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-border-soft bg-white p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 font-bold text-ink">
            <SettingsIcon className="h-5 w-5 text-electric" /> Preferences
          </h2>
          <div className="mt-4 divide-y divide-border-soft">
            {[
              { icon: Bell, label: "Notifications", desc: "Exam reminders, new notes alerts" },
              { icon: Palette, label: "Appearance", desc: "Light, dark, or system" },
              { icon: Globe, label: "Language", desc: "English (Hindi & Marathi coming soon)" },
              { icon: Lock, label: "Privacy & security", desc: "Manage data, delete account" },
              { icon: GraduationCap, label: "University", desc: me?.university ?? "Change university" },
              { icon: HelpCircle, label: "Help & support", desc: "FAQs, contact team" },
            ].map((p) => (
              <button
                key={p.label}
                className="btn-press flex w-full items-center gap-4 py-4 text-left hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-muted">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">{p.label}</div>
                  <div className="text-xs text-slate-muted">{p.desc}</div>
                </div>
                <span className="text-xs text-slate-muted">→</span>
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-border-soft pt-4">
            <button className="flex items-center gap-2 text-sm font-semibold text-danger hover:underline">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-soft p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-muted">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
