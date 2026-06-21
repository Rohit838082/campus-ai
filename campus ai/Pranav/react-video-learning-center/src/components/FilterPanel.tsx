import type { Filters, Language, Region, ContentType, SortOption } from "../utils/mockData";

interface FilterPanelProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

interface SelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function Select({ label, icon, value, options, onChange }: SelectProps) {
  return (
    <label className="flex-1 min-w-[140px]">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-xl text-sm font-medium bg-white/70 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-white dark:bg-slate-900">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActive =
    (filters.language && filters.language !== "all") ||
    (filters.region && filters.region !== "all") ||
    (filters.contentType && filters.contentType !== "all") ||
    (filters.sort && filters.sort !== "relevance") ||
    !!filters.channel;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 shadow-lg shadow-indigo-500/5 dark:shadow-black/30 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-indigo-500"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {hasActive && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
              ACTIVE
            </span>
          )}
        </h2>
        {hasActive && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline font-medium"
          >
            Reset all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Select
          label="Language"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          }
          value={filters.language ?? "all"}
          onChange={(v) => update("language", (v === "all" ? "all" : v) as Language | "all")}
          options={[
            { value: "all", label: "All Languages" },
            { value: "en", label: "🇬🇧 English" },
            { value: "hi", label: "🇮🇳 Hindi" },
            { value: "hinglish", label: "🌐 Hinglish" },
          ]}
        />
        <Select
          label="Creator Region"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          }
          value={filters.region ?? "all"}
          onChange={(v) => update("region", (v === "all" ? "all" : v) as Region | "all")}
          options={[
            { value: "all", label: "All Creators" },
            { value: "in", label: "🇮🇳 Indian Creators" },
            { value: "intl", label: "🌍 International" },
          ]}
        />
        <Select
          label="Content Type"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          }
          value={filters.contentType ?? "all"}
          onChange={(v) => update("contentType", (v === "all" ? "all" : v) as ContentType | "all")}
          options={[
            { value: "all", label: "All Content" },
            { value: "video", label: "▶ Videos" },
            { value: "playlist", label: "📋 Playlists" },
            { value: "short", label: "⚡ Shorts" },
            { value: "course", label: "🎓 Courses" },
          ]}
        />
        <Select
          label="Sort By"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="M21 8h-6" />
              <path d="M21 12h-8" />
              <path d="M21 16h-10" />
            </svg>
          }
          value={filters.sort ?? "relevance"}
          onChange={(v) => update("sort", v as SortOption)}
          options={[
            { value: "relevance", label: "Relevance" },
            { value: "latest", label: "Latest" },
            { value: "most_viewed", label: "Most Viewed" },
            { value: "beginner", label: "Beginner Friendly" },
          ]}
        />
      </div>
    </div>
  );
}
