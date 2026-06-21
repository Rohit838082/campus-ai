export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden shadow-lg p-0 animate-fade-in">
      <div className="aspect-video shimmer-bg relative">
        <div className="absolute bottom-2 right-2 w-12 h-5 rounded-md bg-slate-300/60 dark:bg-slate-700/60" />
      </div>
      <div className="p-4 flex gap-3">
        <div className="shrink-0 w-9 h-9 rounded-full shimmer-bg" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 rounded-full shimmer-bg w-11/12" />
          <div className="h-4 rounded-full shimmer-bg w-3/4" />
          <div className="h-3 rounded-full shimmer-bg w-1/2 mt-1" />
          <div className="h-3 rounded-full shimmer-bg w-2/3" />
          <div className="h-9 rounded-xl shimmer-bg w-full mt-2" />
        </div>
      </div>
    </div>
  );
}
