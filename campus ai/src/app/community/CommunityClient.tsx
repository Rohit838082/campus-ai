"use client";

import { useState, useTransition } from "react";
import { createPost, upvotePost } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  Users,
  MessageSquare,
  TrendingUp,
  ChevronUp,
  Plus,
  X,
  Megaphone,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Award,
  Medal,
  Crown,
} from "lucide-react";

type Post = {
  id: number;
  category: string;
  title: string;
  body: string;
  author: string;
  university: string;
  upvotes: number;
  comments: number;
  tags: string;
  createdAt: Date;
};
type Leader = {
  id: number;
  rank: number;
  name: string;
  university: string;
  points: number;
  badges: number;
  avatar: string;
};

const CAT_META: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  Doubt: { icon: HelpCircle, color: "text-electric", bg: "bg-electric/10" },
  Discussion: { icon: MessageCircle, color: "text-royal", bg: "bg-royal/10" },
  Announcement: { icon: Megaphone, color: "text-danger", bg: "bg-danger/10" },
  Resource: { icon: BookOpen, color: "text-emerald", bg: "bg-emerald/10" },
};

export function CommunityClient({ posts, board }: { posts: Post[]; board: Leader[] }) {
  const [tab, setTab] = useState<"forum" | "leaderboard">("forum");
  const [catFilter, setCatFilter] = useState("All");
  const [showCompose, setShowCompose] = useState(false);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const filtered = posts.filter((p) => catFilter === "All" || p.category === catFilter);

  const handleUpvote = (id: number) =>
    startTransition(async () => {
      await upvotePost(id);
      router.refresh();
    });

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">Community</h1>
            <p className="mt-1 text-sm text-slate-muted">
              Ask, share, discuss. Earn badges for helping others.
            </p>
          </div>
          {tab === "forum" && (
            <button
              onClick={() => setShowCompose(true)}
              className="btn-press inline-flex items-center gap-2 rounded-xl bg-ai-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> New post
            </button>
          )}
        </div>

        <div className="mt-5 flex gap-1 rounded-xl bg-bg p-1">
          <button
            onClick={() => setTab("forum")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "forum" ? "bg-white text-ink shadow-sm" : "text-slate-muted"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Forum
          </button>
          <button
            onClick={() => setTab("leaderboard")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "leaderboard" ? "bg-white text-ink shadow-sm" : "text-slate-muted"
            }`}
          >
            <TrendingUp className="h-4 w-4" /> Leaderboard
          </button>
        </div>

        {tab === "forum" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {["All", "Doubt", "Discussion", "Announcement", "Resource"].map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  catFilter === c
                    ? "bg-navy text-white"
                    : "border border-border-soft bg-white text-slate-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 lg:p-10">
        {tab === "forum" ? (
          <div className="space-y-3">
            {filtered.map((p, i) => {
              const meta = CAT_META[p.category] || CAT_META.Discussion;
              const Icon = meta.icon;
              return (
                <article
                  key={p.id}
                  className="fade-up flex gap-3 rounded-2xl border border-border-soft bg-white p-4 transition hover:shadow-md md:gap-4"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      onClick={() => handleUpvote(p.id)}
                      disabled={pending}
                      className="btn-press rounded-lg p-1.5 text-electric hover:bg-electric/10"
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-bold text-ink">{p.upvotes}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                        <Icon className="h-3 w-3" /> {p.category}
                      </span>
                      {p.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (
                        <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-ink">
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-ink hover:text-electric md:text-base">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-muted">{p.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[9px] font-bold text-white">
                          {p.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                        </span>
                        <span className="font-semibold text-ink">{p.author}</span>
                        <span>· {p.university}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {p.comments}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <LeaderboardView board={board} />
        )}
      </div>

      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
    </div>
  );
}

function LeaderboardView({ board }: { board: Leader[] }) {
  const top3 = board.filter((b) => b.rank <= 3);
  const rest = board.filter((b) => b.rank > 3);

  return (
    <div>
      {/* Podium */}
      <div className="mb-8 flex items-end justify-center gap-3">
        {[top3[1], top3[0], top3[2]].filter(Boolean).map((l, i) => {
          const heights = ["h-28", "h-40", "h-24"];
          const sizes = ["h-16 w-16 text-2xl", "h-20 w-20 text-3xl", "h-14 w-14 text-xl"];
          const rings = ["ring-slate-300", "ring-amber", "ring-orange-400"];
          return (
            <div key={l.rank} className="flex flex-col items-center">
              <div className={`relative flex ${sizes[i]} items-center justify-center rounded-full bg-brand-gradient ring-4 ${rings[i]} text-white shadow-lg`}>
                {l.avatar}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">
                  #{l.rank}
                </div>
              </div>
              <div className={`mt-4 w-28 ${heights[i]} rounded-t-xl bg-gradient-to-t from-navy to-electric p-3 text-center text-white`}>
                <div className="truncate text-sm font-bold">{l.name.split(" ")[0]}</div>
                <div className="mt-1 text-xs opacity-80">{l.points} pts</div>
                <div className="mt-1 text-[10px] opacity-60">{l.badges} badges</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="rounded-2xl border border-border-soft bg-white">
        {rest.map((l, i) => (
          <div
            key={l.id}
            className={`fade-up flex items-center gap-4 p-4 ${
              i !== rest.length - 1 ? "border-b border-border-soft" : ""
            } ${l.name === "Priya Sharma" ? "bg-electric/5" : ""}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="w-8 text-center text-sm font-bold text-slate-muted">#{l.rank}</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-lg text-white">
              {l.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold text-ink">{l.name}</span>
                {l.name === "Priya Sharma" && (
                  <span className="rounded-md bg-electric px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">You</span>
                )}
              </div>
              <div className="text-[11px] text-slate-muted">{l.university}</div>
            </div>
            <div className="flex items-center gap-1 text-amber">
              <Medal className="h-4 w-4" />
              <span className="text-xs font-semibold">{l.badges}</span>
            </div>
            <div className="w-20 text-right text-sm font-bold text-navy">{l.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComposeModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const submit = (fd: FormData) => {
    startTransition(async () => {
      await createPost(fd);
      onClose();
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
      <form action={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-electric" />
            <h2 className="text-lg font-bold text-ink">New post</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-muted hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Category</span>
            <select
              name="category"
              className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            >
              <option>Doubt</option>
              <option>Discussion</option>
              <option>Resource</option>
              <option>Announcement</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Title</span>
            <input
              name="title"
              required
              placeholder="e.g., How to prepare for TCS NQT?"
              className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Body</span>
            <textarea
              name="body"
              required
              rows={5}
              placeholder="Share your thoughts, questions, or resources..."
              className="w-full resize-none rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Tags (comma separated)</span>
            <input
              name="tags"
              placeholder="tcs, placements, aptitude"
              className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </label>
          <div className="flex gap-2">
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
              {pending ? "Posting..." : "Publish"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
