import type { Video } from "../utils/mockData";
import VideoCard from "./VideoCard";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";
import InfiniteScroll from "./InfiniteScroll";

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;       // initial / search loading
  isLoadingMore: boolean;   // pagination loading
  hasSearched: boolean;
  hasMore: boolean;
  total: number;
  onWatch: (video: Video) => void;
  onLoadMore: () => void;
}

export default function VideoGrid({
  videos,
  isLoading,
  isLoadingMore,
  hasSearched,
  hasMore,
  total,
  onWatch,
  onLoadMore,
}: VideoGridProps) {
  // Initial skeleton state (full page)
  if (isLoading && videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-300 font-medium animate-pulse-soft">
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
          Searching educational videos...
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (hasSearched && videos.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  if (videos.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            onWatch={onWatch}
            index={i}
          />
        ))}
        {/* Inline skeletons when loading more */}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </div>

      <InfiniteScroll
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
      />

      {!hasMore && total > 0 && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Showing all {total} videos
        </p>
      )}
    </div>
  );
}
