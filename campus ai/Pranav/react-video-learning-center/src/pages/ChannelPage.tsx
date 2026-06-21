import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  searchChannelVideos,
  CHANNELS,
  CHANNEL_BY_NAME,
  type Video,
  type ContentType,
  type SortOption,
} from "../utils/mockData";
import VideoGrid from "../components/VideoGrid";
import VideoModal from "../components/VideoModal";
import ChannelCard from "../components/ChannelCard";

type Tab = "all" | "playlist" | "short" | "popular" | "latest";

export default function ChannelPage() {
  const { channelName } = useParams<{ channelName: string }>();
  const navigate = useNavigate();

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const channel = channelName
    ? CHANNEL_BY_NAME.get(channelName.toLowerCase())
    : undefined;

  // Fetch videos for this channel
  const fetchChannelVideos = useCallback(
    async (
      resetPage: boolean,
      query: string,
      tab: Tab,
    ) => {
      if (!channelName) return;

      const targetPage = resetPage ? 0 : page + 1;
      if (resetPage) {
        setIsLoading(true);
        setVideos([]);
      } else {
        setIsLoadingMore(true);
      }

      try {
        // Build filters based on tab
        let contentType: ContentType | "all" | undefined;
        let sort: SortOption | undefined;

        if (tab === "playlist") contentType = "playlist";
        else if (tab === "short") contentType = "short";
        else if (tab === "popular") sort = "most_viewed";
        else if (tab === "latest") sort = "latest";

        const searchQ = query.trim() || "tutorial";
        const res = await searchChannelVideos(channelName, searchQ, targetPage, {
          contentType,
          sort,
        });

        if (resetPage) {
          setVideos(res.videos);
          setPage(0);
        } else {
          setVideos((prev) => [...prev, ...res.videos]);
          setPage(targetPage);
        }
        setHasMore(res.hasMore);
        setTotal(res.total);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [channelName, page],
  );

  useEffect(() => {
    if (channelName) {
      fetchChannelVideos(true, searchQuery, activeTab);
    }
  }, [channelName, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChannelVideos(true, searchQuery, activeTab);
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchChannelVideos(false, searchQuery, activeTab);
    }
  };

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Channel not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Find related channels (same region or similar tags)
  const relatedChannels = CHANNELS.filter(
    (c) =>
      c.name !== channel.name &&
      (c.region === channel.region ||
        c.tags.some((t) => channel.tags.includes(t))),
  ).slice(0, 6);

  const initials = channel.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-fuchsia-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950" />

      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white hover:bg-white/30 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </button>
      </div>

      {/* Channel Info */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div
              aria-hidden
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-xl ring-4 ring-white dark:ring-slate-900"
            >
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                  {channel.name}
                </h1>
                <span className="text-2xl">{channel.region === "in" ? "🇮🇳" : "🌍"}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
                {channel.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {channel.subscribers} subscribers
                </span>
                <span>•</span>
                <span>{channel.videoCount} videos</span>
                <span>•</span>
                <span className="capitalize">
                  {channel.language === "en"
                    ? "English"
                    : channel.language === "hi"
                      ? "Hindi"
                      : "Hinglish"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {channel.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search within channel */}
        <form onSubmit={handleSearch} className="glass rounded-2xl p-3 shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search within ${channel.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="glass rounded-2xl p-2 shadow-lg">
          <div className="flex gap-1 overflow-x-auto">
            {([
              { id: "all", label: "All Videos", icon: "▶" },
              { id: "playlist", label: "Playlists", icon: "📋" },
              { id: "short", label: "Shorts", icon: "⚡" },
              { id: "popular", label: "Popular", icon: "🔥" },
              { id: "latest", label: "Latest", icon: "🕒" },
            ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Videos */}
        <VideoGrid
          videos={videos}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasSearched={true}
          hasMore={hasMore}
          total={total}
          onWatch={setSelectedVideo}
          onLoadMore={loadMore}
        />

        {/* Related Channels */}
        {relatedChannels.length > 0 && (
          <section className="pt-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Similar Channels
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedChannels.map((c, i) => (
                <Link key={c.name} to={`/channel/${encodeURIComponent(c.name)}`}>
                  <ChannelCard channel={c} onClick={() => {}} index={i} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onWatch={setSelectedVideo}
      />
    </div>
  );
}
