import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHANNELS, type Video, type Channel } from "../utils/mockData";
import VideoCard from "../components/VideoCard";
import ChannelCard from "../components/ChannelCard";

interface GlobalSearchResultsProps {
  query: string;
  videos: Video[];
  isLoading: boolean;
  onWatch: (v: Video) => void;
}

export default function GlobalSearchResults({
  query,
  videos,
  isLoading,
  onWatch,
}: GlobalSearchResultsProps) {
  const navigate = useNavigate();
  const [matchedChannels, setMatchedChannels] = useState<Channel[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setMatchedChannels([]);
      return;
    }
    const q = query.toLowerCase();
    const matched = CHANNELS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)),
    ).slice(0, 6);
    setMatchedChannels(matched);
  }, [query]);

  if (isLoading || !query.trim()) return null;
  if (videos.length === 0 && matchedChannels.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Channels */}
      {matchedChannels.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📺</span>
            Channels
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {matchedChannels.map((c, i) => (
              <div
                key={c.name}
                onClick={() => navigate(`/channel/${encodeURIComponent(c.name)}`)}
                className="cursor-pointer"
              >
                <ChannelCard channel={c} onClick={() => {}} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>▶️</span>
            Videos
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.slice(0, 8).map((v, i) => (
              <VideoCard key={v.id} video={v} onWatch={onWatch} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
