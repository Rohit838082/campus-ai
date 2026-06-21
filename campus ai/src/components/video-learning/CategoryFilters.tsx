import type { Category } from "../../lib/videoMockData";

interface CategoryFiltersProps {
  active: Category | "all";
  onSelect: (c: Category | "all") => void;
}

const CATEGORIES: { label: Category | "all"; icon: string }[] = [
  { label: "all", icon: "✨" },
  { label: "Study", icon: "📚" },
  { label: "Interview Preparation", icon: "🎯" },
  { label: "Mock Tests", icon: "📝" },
  { label: "Placement", icon: "💼" },
  { label: "DSA", icon: "🧮" },
  { label: "Programming", icon: "💻" },
  { label: "AI & ML", icon: "🤖" },
  { label: "Aptitude", icon: "🧠" },
  { label: "Notes", icon: "🗒️" },
  { label: "Previous Year Papers", icon: "📄" },
];

export default function CategoryFilters({ active, onSelect }: CategoryFiltersProps) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5 shadow-lg shadow-indigo-500/5 dark:shadow-black/30 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
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
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          Categories
        </h2>
        {active !== "all" && (
          <button
            onClick={() => onSelect("all")}
            className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = active === c.label;
          return (
            <button
              key={c.label}
              onClick={() => onSelect(c.label)}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-white/60 dark:border-white/10 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:scale-105"
              }`}
            >
              <span className="mr-1.5">{c.icon}</span>
              {c.label === "all" ? "All" : c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
