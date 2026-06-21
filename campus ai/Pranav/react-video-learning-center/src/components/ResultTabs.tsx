interface ResultTabsProps {
  active: "all" | "search" | "channels";
  onChange: (tab: "all" | "search" | "channels") => void;
  videoCount: number;
  channelCount: number;
}

const TABS: { id: "all" | "search" | "channels"; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "🔍" },
  { id: "search", label: "From Your Search", icon: "▶️" },
  { id: "channels", label: "Channels", icon: "📺" },
];

export default function ResultTabs({ active, onChange, videoCount, channelCount }: ResultTabsProps) {
  return (
    <div className="glass rounded-2xl p-2 shadow-lg animate-fade-in">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const badge =
            tab.id === "search"
              ? videoCount
              : tab.id === "channels"
                ? channelCount
                : videoCount + channelCount;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
