import { useEffect, useState } from "react";
import { getContinueWatching, type Video } from "../../lib/videoMockData";
import VideoCard from "./VideoCard";

interface ContinueWatchingProps {
  onWatch: (v: Video) => void;
}

export default function ContinueWatching({ onWatch }: ContinueWatchingProps) {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    setVideos(getContinueWatching());
  }, []);

  if (videos.length === 0) return null;

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>▶️</span>
          Continue Watching
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {videos.length} video{videos.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((v, i) => (
          <VideoCard key={v.id} video={v} onWatch={onWatch} index={i} />
        ))}
      </div>
    </section>
  );
}
