import { useEffect, useState } from "react";
import type { Video } from "../../lib/videoMockData";
import { fetchRelatedVideos } from "../../lib/videoMockData";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  onWatch: (video: Video) => void;
}

export default function VideoModal({ video, onClose, onWatch }: VideoModalProps) {
  const [related, setRelated] = useState<Video[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (!video) {
      setRelated([]);
      return;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fetch related
    let cancelled = false;
    setLoadingRelated(true);
    fetchRelatedVideos(video, 8)
      .then((r) => {
        if (!cancelled) setRelated(r);
      })
      .finally(() => {
        if (!cancelled) setLoadingRelated(false);
      });

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl my-4 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-slide-up border border-white/20 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 sticky top-0 z-10 backdrop-blur">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base line-clamp-1">
              {video.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {video.channel} · {video.views} views
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Player */}
          <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              key={video.videoId}
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Related videos sidebar */}
          <aside className="border-t lg:border-t-0 lg:border-l border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-900/60 max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
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
                  <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                  <path d="m12 12 4 10 1.7-4.3L22 16Z" />
                </svg>
                Related Videos
              </h4>
            </div>

            <div className="p-3 space-y-3">
              {loadingRelated
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-2 animate-pulse">
                      <div className="w-28 h-16 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded bg-slate-200 dark:bg-slate-800 w-full" />
                        <div className="h-3 rounded bg-slate-200 dark:bg-slate-800 w-3/4" />
                        <div className="h-2 rounded bg-slate-200 dark:bg-slate-800 w-1/2" />
                      </div>
                    </div>
                  ))
                : related.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onWatch(r)}
                      className="w-full flex gap-2 p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition text-left group"
                    >
                      <div className="relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={r.thumbnail}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-white text-[10px] font-semibold">
                          {r.duration}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {r.channel}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {r.views} views
                        </p>
                      </div>
                    </button>
                  ))}

              {!loadingRelated && related.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                  No related videos found.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
