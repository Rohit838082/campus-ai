"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/components/video-learning/SearchBar";
import VideoGrid from "@/components/video-learning/VideoGrid";
import VideoModal from "@/components/video-learning/VideoModal";
import PopularTopics from "@/components/video-learning/PopularTopics";
import RecentSearches from "@/components/video-learning/RecentSearches";
import CategoryFilters from "@/components/video-learning/CategoryFilters";
import FilterPanel from "@/components/video-learning/FilterPanel";
import ChannelsSection from "@/components/video-learning/ChannelsSection";
import TrendingSection from "@/components/video-learning/TrendingSection";
import ContinueWatching from "@/components/video-learning/ContinueWatching";
import SavedChannels from "@/components/video-learning/SavedChannels";
import GlobalSearchResults from "@/components/video-learning/GlobalSearchResults";
import ResultTabs from "@/components/video-learning/ResultTabs";
import {
  searchVideos,
  addContinueWatching,
  CHANNELS,
  PAGE_SIZE,
  type Video,
  type SearchResult,
  type Filters,
  type Category,
} from "@/lib/videoMockData";

const RECENT_KEY = "campusai:recent-searches";
const MAX_RECENT = 5;

export default function VideoLearningPage() {
  /* ------------------------- State ------------------------- */
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [category, setCategory] = useState<Category | "all">("all");
  const [resultTab, setResultTab] = useState<"all" | "search" | "channels">("all");

  const searchTokenRef = useRef(0);

  /* --------------------- Recent searches ------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, MAX_RECENT));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const saveRecent = useCallback((query: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.toLowerCase() !== query.toLowerCase());
      const next = [query, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* ------------------ Merged filter state ------------------ */
  const mergedFilters: Filters = useMemo(
    () => ({
      ...filters,
      category: category !== "all" ? category : undefined,
    }),
    [filters, category],
  );

  /* ------------------------ Search ------------------------- */
  const performSearch = useCallback(
    async (query: string, opts?: { keepFilters?: boolean }) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      const token = ++searchTokenRef.current;
      setCurrentQuery(trimmed);
      setIsLoading(true);
      setIsLoadingMore(false);
      setHasSearched(true);
      setVideos([]);
      setPage(0);
      setHasMore(false);
      setTotal(0);
      saveRecent(trimmed);

      // Optionally reset category when searching a fresh topic
      if (!opts?.keepFilters) {
        setCategory("all");
      }

      try {
        const res: SearchResult = await searchVideos(trimmed, 0, mergedFilters);
        if (token !== searchTokenRef.current) return;
        setVideos(res.videos);
        setPage(0);
        setHasMore(res.hasMore);
        setTotal(res.total);
      } finally {
        if (token === searchTokenRef.current) setIsLoading(false);
      }
    },
    [saveRecent, mergedFilters],
  );

  /* Re-run search when filters or category change (if a search is active) */
  const appliedFiltersRef = useRef<string>("");
  useEffect(() => {
    const key = JSON.stringify(mergedFilters);
    if (appliedFiltersRef.current === "" || appliedFiltersRef.current === key) {
      appliedFiltersRef.current = key;
      return;
    }
    appliedFiltersRef.current = key;
    if (currentQuery) {
      // silent re-search with current query + new filters
      (async () => {
        const token = ++searchTokenRef.current;
        setIsLoading(true);
        setVideos([]);
        setPage(0);
        try {
          const res = await searchVideos(currentQuery, 0, mergedFilters);
          if (token !== searchTokenRef.current) return;
          setVideos(res.videos);
          setPage(0);
          setHasMore(res.hasMore);
          setTotal(res.total);
        } finally {
          if (token === searchTokenRef.current) setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedFilters]);

  /* ------------------------ Load more ----------------------- */
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || !currentQuery) return;

    const token = searchTokenRef.current;
    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const res = await searchVideos(currentQuery, nextPage, mergedFilters);
      if (token !== searchTokenRef.current) return;
      setVideos((prev) => [...prev, ...res.videos]);
      setPage(nextPage);
      setHasMore(res.hasMore);
      setTotal(res.total);
    } finally {
      if (token === searchTokenRef.current) setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, currentQuery, page, mergedFilters]);

  /* ----------------------- Initial load --------------------- */
  useEffect(() => {
    performSearch("learning tutorials 2026");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------- Handlers ------------------------- */
  const handleChannelSelect = useCallback(
    (name: string | undefined) => {
      setFilters((prev) => {
        const next = { ...prev };
        if (name) next.channel = name;
        else delete next.channel;
        return next;
      });
      // Re-run the current search (or a default) with the channel filter
      const q = currentQuery || "learning";
      if (currentQuery) {
        performSearch(currentQuery, { keepFilters: true });
      } else {
        performSearch(q, { keepFilters: true });
      }
    },
    [currentQuery, performSearch],
  );

  const handleCategorySelect = useCallback((c: Category | "all") => {
    setCategory(c);
  }, []);

  const activeTopic = useMemo(
    () => (hasSearched ? currentQuery : ""),
    [hasSearched, currentQuery],
  );

  // Compute matched channels for the "Channels" tab badge
  const matchedChannelsCount = useMemo(() => {
    if (!currentQuery.trim()) return 0;
    const q = currentQuery.toLowerCase();
    return CHANNELS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)),
    ).length;
  }, [currentQuery]);

  /* ------------------------- UI ----------------------------- */
  return (
    <div className="relative min-h-screen px-4 md:px-8 py-6 space-y-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl animate-blob" />
        <div
          className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-fuchsia-400/10 blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Hero Header */}
      <section className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
          Video Hub · Learn anything, instantly
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
          Video Learning Center
        </h1>
        <p className="text-sm text-slate-muted max-w-2xl mx-auto">
          Search any topic. Learn from India&apos;s best educators and creators — right here.
        </p>
      </section>

      {/* Search */}
      <section className="max-w-4xl mx-auto">
        <SearchBar
          onSearch={(q) => performSearch(q)}
          isLoading={isLoading}
          initialValue={currentQuery}
        />
        <p className="text-center text-[10px] sm:text-xs text-slate-muted mt-2">
          💡 Try: <em>&quot;Java CodeWithHarry&quot;</em> · <em>&quot;DSA Love Babbar&quot;</em> · <em>&quot;DBMS Gate Smashers Hindi&quot;</em>
        </p>
      </section>

      {/* Categories */}
      <section>
        <CategoryFilters active={category} onSelect={handleCategorySelect} />
      </section>

      {/* Filter panel */}
      <section>
        <FilterPanel filters={filters} onChange={setFilters} />
      </section>

      {/* Recent + Popular Topics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentSearches
          items={recent}
          onSelect={(q) => performSearch(q)}
          onClear={clearRecent}
        />
        <PopularTopics
          onSelect={(q) => performSearch(q)}
          activeTopic={activeTopic}
        />
      </section>

      {/* Continue Watching */}
      <ContinueWatching onWatch={setSelectedVideo} />

      {/* Saved Channels */}
      <SavedChannels />

      {/* Channels */}
      <section>
        <ChannelsSection
          activeChannel={filters.channel}
          onSelectChannel={handleChannelSelect}
        />
      </section>

      {/* Active filter banner */}
      {filters.channel && (
        <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 animate-fade-in">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            🔎 Showing videos from{" "}
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {filters.channel}
            </span>
          </p>
          <button
            onClick={() => handleChannelSelect(undefined)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/85 border border-slate-200 hover:bg-slate-100 transition"
          >
            Clear channel filter
          </button>
        </div>
      )}

      {/* Results header + tabs */}
      {(hasSearched || videos.length > 0) && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-xl font-bold text-navy">
              {hasSearched ? (
                <>
                  Results for{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    &quot;{currentQuery}&quot;
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Featured
                  </span>{" "}
                  Videos
                </>
              )}
            </h3>
            {!isLoading && total > 0 && (
              <span className="text-xs text-slate-muted">
                {Math.min(videos.length, total)} of {total} videos · Page{" "}
                {page + 1}
              </span>
            )}
          </div>

          {hasSearched && currentQuery && (
            <ResultTabs
              active={resultTab}
              onChange={setResultTab}
              videoCount={total}
              channelCount={matchedChannelsCount}
            />
          )}
        </div>
      )}

      {/* Channels-only view */}
      {hasSearched && currentQuery && resultTab === "channels" && (
        <GlobalSearchResults
          query={currentQuery}
          videos={[]}
          isLoading={isLoading}
          onWatch={setSelectedVideo}
        />
      )}

      {/* Mixed view or videos-only view */}
      {(resultTab === "all" || resultTab === "search") && (
        <>
          {/* Channels preview in "All" mode */}
          {hasSearched && currentQuery && resultTab === "all" && (
            <GlobalSearchResults
              query={currentQuery}
              videos={videos}
              isLoading={isLoading}
              onWatch={setSelectedVideo}
            />
          )}

          {/* Video grid */}
          <section>
            <VideoGrid
              videos={videos}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasSearched={hasSearched}
              hasMore={hasMore}
              total={total}
              onWatch={setSelectedVideo}
              onLoadMore={loadMore}
            />
          </section>
        </>
      )}

      {/* Trending rails — only shown in "All" mode */}
      {resultTab === "all" && (
        <section className="pt-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-navy">
              🔥 Trending on CampusAI
            </h2>
            <p className="text-xs text-slate-muted mt-1.5">
              Hand-picked rails refreshed for you
            </p>
          </div>
          <TrendingSection onWatch={setSelectedVideo} />
        </section>
      )}

      {/* Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onWatch={(v) => {
          setSelectedVideo(v);
          addContinueWatching(v);
        }}
      />
    </div>
  );
}
