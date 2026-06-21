import type { Channel } from "../utils/mockData";

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
  isActive?: boolean;
  index?: number;
}

export default function ChannelCard({ channel, onClick, isActive, index = 0 }: ChannelCardProps) {
  const initials = channel.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const regionFlag = channel.region === "in" ? "🇮🇳" : "🌍";

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
      className={`group glass rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 animate-fade-in min-w-[180px] sm:min-w-[200px] ${
        isActive
          ? "ring-2 ring-indigo-500 shadow-xl shadow-purple-500/30 scale-[1.02]"
          : "shadow-lg shadow-indigo-500/5 dark:shadow-black/30 hover:shadow-xl hover:shadow-purple-500/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          aria-hidden
          className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-110 transition-transform duration-300"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
              {channel.name}
            </h3>
            <span title={channel.region === "in" ? "Indian Creator" : "International Creator"}>
              {regionFlag}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {channel.subscribers} subscribers
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
        {channel.description}
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/40">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {channel.videoCount} videos
        </span>
        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
          Explore →
        </span>
      </div>
    </button>
  );
}
