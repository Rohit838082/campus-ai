interface RecentSearchesProps {
  items: string[];
  onSelect: (topic: string) => void;
  onClear: () => void;
}

export default function RecentSearches({
  items,
  onSelect,
  onClear,
}: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-500/5 dark:shadow-black/30 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-indigo-500 dark:text-indigo-300"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
            Recent Searches
          </h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-400 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
