import type { Video, Language, Region, ContentType } from "../../lib/videoMockData";

interface VideoCardProps {
  video: Video;
  onWatch: (video: Video) => void;
  index?: number;
  compact?: boolean;
}

const LANGUAGE_BADGE: Record<Language, { label: string; color: string }> = {
  en: { label: "EN", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  hi: { label: "हिं", color: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30" },
  hinglish: { label: "Hinglish", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
};

const REGION_BADGE: Record<Region, { label: string; color: string }> = {
  in: { label: "🇮🇳 India", color: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30" },
  intl: { label: "🌍 Global", color: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30" },
};

const TYPE_ICON: Record<ContentType, string> = {
  video: "▶",
  playlist: "📋",
  short: "⚡",
  course: "🎓",
};

export default function VideoCard({ video, onWatch, index = 0, compact = false }: VideoCardProps) {
  const lang = LANGUAGE_BADGE[video.language];
  const region = REGION_BADGE[video.region];

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
      className="group glass rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/5 dark:shadow-black/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in flex flex-col"
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden cursor-pointer aspect-video bg-slate-200 dark:bg-slate-800"
        onClick={() => onWatch(video)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-purple-600 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration + content type */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          {video.contentType !== "video" && (
            <span
              title={video.contentType}
              className="px-1.5 py-0.5 rounded-md bg-indigo-600/90 text-white text-[11px] font-semibold"
            >
              {TYPE_ICON[video.contentType]}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-semibold tracking-wide">
            {video.duration}
          </span>
        </div>

        {/* Language + Region badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm ${lang.color}`}
          >
            {lang.label}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold border backdrop-blur-sm ${region.color}`}
          >
            {region.label}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className={`p-4 flex gap-3 flex-1 ${compact ? "p-3" : ""}`}>
        <div
          aria-hidden
          className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-md"
        >
          {video.channel
            .replace(/[^A-Za-z0-9 ]/g, "")
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase() || "CA"}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <h3
            className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug text-[15px]"
            title={video.title}
          >
            {video.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/channel/${encodeURIComponent(video.channel)}`;
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition"
              title={`Open ${video.channel} channel`}
            >
              {video.channel}
            </button>
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span>{video.views} views</span>
            <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span>{video.published}</span>
          </div>

          {!compact && (
            <button
              onClick={() => onWatch(video)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
