import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedChannels, CHANNELS, type Channel } from "../utils/mockData";
import ChannelCard from "../components/ChannelCard";

export default function SavedChannels() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<Channel[]>([]);

  useEffect(() => {
    const names = getSavedChannels();
    const channels = names
      .map((n) => CHANNELS.find((c) => c.name === n))
      .filter((c): c is Channel => !!c);
    setSaved(channels);
  }, []);

  if (saved.length === 0) return null;

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⭐</span>
          Saved Channels
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {saved.length} channel{saved.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {saved.map((c, i) => (
          <div key={c.name} onClick={() => navigate(`/channel/${encodeURIComponent(c.name)}`)}>
            <ChannelCard channel={c} onClick={() => {}} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
