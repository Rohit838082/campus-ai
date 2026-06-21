import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  /** Extra distance in pixels before the bottom to trigger loading. Default 400. */
  threshold?: number;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 400,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: `${threshold}px 0px` },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, threshold]);

  return (
    <div ref={sentinelRef} className="w-full h-px" aria-hidden="true">
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-8 text-indigo-600 dark:text-indigo-300 font-medium animate-pulse-soft">
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading more videos...
        </div>
      )}
      {!hasMore && !isLoading && (
        <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
          ✨ You&apos;ve reached the end — that&apos;s all the videos for this topic.
        </p>
      )}
    </div>
  );
}
