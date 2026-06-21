interface PopularTopicsProps {
  onSelect: (topic: string) => void;
  activeTopic?: string;
}

const TOPICS = [
  { label: "Java", emoji: "☕" },
  { label: "Python", emoji: "🐍" },
  { label: "DSA", emoji: "🧮" },
  { label: "DBMS", emoji: "🗄️" },
  { label: "Operating System", emoji: "💻" },
  { label: "Machine Learning", emoji: "🤖" },
  { label: "Physics", emoji: "⚛️" },
  { label: "Chemistry", emoji: "🧪" },
  { label: "Mathematics", emoji: "📐" },
];

export default function PopularTopics({ onSelect, activeTopic }: PopularTopicsProps) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-500/5 dark:shadow-black/30 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔥</span>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
          Popular Topics
        </h2>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {TOPICS.map((t) => {
          const active =
            activeTopic?.toLowerCase() === t.label.toLowerCase();
          return (
            <button
              key={t.label}
              onClick={() => onSelect(t.label)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-white/60 dark:border-white/10 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:scale-105"
              }`}
            >
              <span className="mr-1.5">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
