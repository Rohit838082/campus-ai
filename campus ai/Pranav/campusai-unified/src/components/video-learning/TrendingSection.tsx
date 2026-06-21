import { useEffect, useState } from "react";
import { searchVideos, type Video, type Filters } from "../../lib/videoMockData";
import VideoCard from "./VideoCard";

interface Rail {
  id: string;
  title: string;
  icon: string;
  query: string;
  filters?: Filters;
}

const RAILS: Rail[] = [
  { id: "trending-courses", title: "Trending Courses", icon: "🔥", query: "full course 2026", filters: { contentType: "course", sort: "most_viewed" } },
  { id: "top-indian", title: "Top Indian Educators", icon: "🇮🇳", query: "complete tutorial", filters: { region: "in", sort: "most_viewed" } },
  { id: "most-watched", title: "Most Watched This Week", icon: "👀", query: "learn", filters: { sort: "latest" } },
  { id: "placement", title: "Placement Preparation", icon: "💼", query: "placement preparation", filters: { category: "Placement" } },
  { id: "interview", title: "Interview Questions", icon: "🎯", query: "interview questions", filters: { category: "Interview Preparation" } },
  { id: "mock-tests", title: "Mock Test Videos", icon: "📝", query: "mock test practice", filters: { category: "Mock Tests" } },
];

interface TrendingSectionProps {
  onWatch: (v: Video) => void;
}

export default function TrendingSection({ onWatch }: TrendingSectionProps) {
  const [railData, setRailData] = useState<Record<string, Video[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const entries = await Promise.all(
        RAILS.map(async (r) => {
          try {
            const res = await searchVideos(r.query, 0, r.filters ?? {});
            return [r.id, res.videos.slice(0, 8)] as const;
          } catch {
            return [r.id, []] as const;
          }
        }),
      );
      if (!cancelled) {
        setRailData(Object.fromEntries(entries));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-10">
      {RAILS.map((rail) => {
        const videos = railData[rail.id] ?? [];
        return (
          <section key={rail.id} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>{rail.icon}</span>
                {rail.title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {loading ? "Loading..." : `${videos.length} videos`}
              </span>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden">
                    <div className="aspect-video shimmer-bg" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded-full shimmer-bg w-11/12" />
                      <div className="h-3 rounded-full shimmer-bg w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((v, i) => (
                  <VideoCard key={v.id} video={v} onWatch={onWatch} index={i} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
