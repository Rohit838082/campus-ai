export default function EmptyState() {
  return (
    <div className="glass rounded-2xl p-10 sm:p-14 text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-indigo-500 dark:text-indigo-300"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        No educational videos found.
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
        Try another topic.
      </p>
    </div>
  );
}
