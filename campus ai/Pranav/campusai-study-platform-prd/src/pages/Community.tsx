import { useState } from 'react';
import { useApp } from '../App';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Plus,
  Search,
  TrendingUp,
  Award,
  ArrowUp,
  Filter,
  Send,
} from 'lucide-react';

interface Post {
  id: string;
  author: { name: string; initials: string; department: string; points: number; badge?: string; color: string };
  content: string;
  type: 'note' | 'doubt' | 'achievement' | 'discussion';
  likes: number;
  comments: number;
  saves: number;
  liked: boolean;
  saved: boolean;
  timeAgo: string;
  tags: string[];
}

const initialPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Priya Patel', initials: 'PP', department: 'CSE', points: 3200, badge: '🏆 Topper', color: 'bg-indigo-100 text-indigo-600' },
    content: 'Just uploaded my complete DSA revision notes! 📚 Covers all important topics including Binary Trees, Graphs, DP, and Sorting algorithms with solved examples. Hope this helps everyone preparing for end-sems!',
    type: 'note',
    likes: 142,
    comments: 28,
    saves: 89,
    liked: false,
    saved: false,
    timeAgo: '2h ago',
    tags: ['DSA', 'Notes', 'Revision'],
  },
  {
    id: '2',
    author: { name: 'Rahul Verma', initials: 'RV', department: 'CSE', points: 2100, color: 'bg-emerald-100 text-emerald-600' },
    content: 'Can someone explain the difference between FIFO and LRU page replacement algorithms? I keep getting confused between them in numericals. Any good resources? 🤔',
    type: 'doubt',
    likes: 34,
    comments: 12,
    saves: 15,
    liked: false,
    saved: false,
    timeAgo: '3h ago',
    tags: ['OS', 'Doubt', 'Memory'],
  },
  {
    id: '3',
    author: { name: 'Ananya Singh', initials: 'AS', department: 'IT', points: 4500, badge: '🌟 Mentor', color: 'bg-amber-100 text-amber-600' },
    content: '🎯 Scored 92% in the AI Mock Test for DBMS! The question prediction was super accurate — 6 out of 10 questions matched. Highly recommend trying it before your exams.',
    type: 'achievement',
    likes: 234,
    comments: 45,
    saves: 67,
    liked: true,
    saved: true,
    timeAgo: '5h ago',
    tags: ['DBMS', 'MockTest', 'Achievement'],
  },
  {
    id: '4',
    author: { name: 'Vikram Joshi', initials: 'VJ', department: 'CSE', points: 1800, color: 'bg-purple-100 text-purple-600' },
    content: 'Which topics are most important for Computer Networks end-sem? Our professor said TCP/IP and Application Layer but I feel like Data Link Layer is also important. What do you guys think?',
    type: 'discussion',
    likes: 56,
    comments: 31,
    saves: 22,
    liked: false,
    saved: false,
    timeAgo: '6h ago',
    tags: ['CN', 'Discussion', 'ExamPrep'],
  },
];

const leaderboard = [
  { rank: 1, name: 'Ananya Singh', initials: 'AS', points: 4500, color: 'bg-amber-100 text-amber-600' },
  { rank: 2, name: 'Priya Patel', initials: 'PP', points: 3200, color: 'bg-indigo-100 text-indigo-600' },
  { rank: 3, name: 'Rahul Verma', initials: 'RV', points: 2100, color: 'bg-emerald-100 text-emerald-600' },
  { rank: 4, name: 'Vikram Joshi', initials: 'VJ', points: 1800, color: 'bg-purple-100 text-purple-600' },
  { rank: 5, name: 'Sneha Gupta', initials: 'SG', points: 1650, color: 'bg-rose-100 text-rose-600' },
];

export default function Community() {
  const { user } = useApp();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState<'all' | 'notes' | 'doubts' | 'discussion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved, saves: p.saved ? p.saves - 1 : p.saves + 1 } : p));
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'notes' && p.type !== 'note') return false;
    if (activeFilter === 'doubts' && p.type !== 'doubt') return false;
    if (activeFilter === 'discussion' && p.type !== 'discussion') return false;
    if (searchQuery && !p.content.toLowerCase().includes(searchQuery.toLowerCase()) && !p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'note': return { label: '📝 Note', class: 'bg-indigo-50 text-indigo-600' };
      case 'doubt': return { label: '❓ Doubt', class: 'bg-amber-50 text-amber-600' };
      case 'achievement': return { label: '🎯 Achievement', class: 'bg-emerald-50 text-emerald-600' };
      case 'discussion': return { label: '💬 Discussion', class: 'bg-purple-50 text-purple-600' };
      default: return { label: type, class: 'bg-gray-50 text-gray-600' };
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">Community</h1>
          <p className="text-sm text-text-secondary mt-0.5">Learn together, grow together</p>
        </div>
        <button className="gradient-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
          <Plus size={16} />
          <span className="hidden sm:inline">New Post</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2.5">
          <Search size={16} className="text-text-tertiary shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, notes, doubts..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all' as const, label: 'All' },
            { id: 'notes' as const, label: '📝 Notes' },
            { id: 'doubts' as const, label: '❓ Doubts' },
            { id: 'discussion' as const, label: '💬 Discuss' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-text-secondary hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══════ POST FEED ═══════ */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPosts.map((post) => {
            const badge = getTypeBadge(post.type);
            return (
              <div key={post.id} className="card p-5">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${post.author.color}`}>
                      {post.author.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text">{post.author.name}</span>
                        {post.author.badge && <span className="text-xs">{post.author.badge}</span>}
                      </div>
                      <p className="text-xs text-text-tertiary">{post.author.department} • {post.timeAgo}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-text leading-relaxed mb-3">{post.content}</p>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-text-secondary">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 -ml-1.5">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                  >
                    <Heart size={15} className={post.liked ? 'text-error-500 fill-error-500' : 'text-text-tertiary'} />
                    <span className={post.liked ? 'text-error-500' : 'text-text-tertiary'}>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle size={15} />
                    {post.comments}
                  </button>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                  >
                    <Bookmark size={15} className={post.saved ? 'text-primary fill-primary' : 'text-text-tertiary'} />
                    <span className={post.saved ? 'text-primary' : 'text-text-tertiary'}>{post.saves}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:bg-gray-50 transition-colors">
                    <Share2 size={15} />
                  </button>
                </div>

                {/* Comment Input */}
                {commentingOn === post.id && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light animate-fade-in">
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {user.avatar}
                    </div>
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm text-text placeholder:text-text-tertiary border border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                    />
                    <button className="gradient-primary text-white p-2 rounded-xl shrink-0 active:scale-95 transition-transform">
                      <Send size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-text-tertiary text-sm">No posts found</p>
            </div>
          )}
        </div>

        {/* ═══════ SIDEBAR ═══════ */}
        <div className="space-y-5">
          {/* Leaderboard */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-amber-500" />
              <h3 className="font-semibold text-text text-sm">Top Contributors</h3>
            </div>
            <div className="space-y-2.5">
              {leaderboard.map((person, i) => (
                <div key={person.rank} className={`flex items-center gap-3 p-2 rounded-xl ${i === 0 ? 'bg-amber-50/50' : ''}`}>
                  <span className={`text-sm font-bold w-6 text-center ${person.rank <= 3 ? 'text-amber-500' : 'text-text-tertiary'}`}>
                    {person.rank <= 3 ? ['🥇', '🥈', '🥉'][person.rank - 1] : person.rank}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${person.color}`}>
                    {person.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{person.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUp size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-primary">{person.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border-light">
              <div className="flex items-center gap-3 p-2 bg-primary-50/50 rounded-xl">
                <span className="text-sm font-bold text-primary w-6 text-center">15</span>
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">You</p>
                </div>
                <span className="text-xs font-semibold text-primary">{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-semibold text-text text-sm">Trending Topics</h3>
            </div>
            <div className="space-y-2">
              {[
                { tag: 'End Sem Prep', posts: 234 },
                { tag: 'DSA Revision', posts: 189 },
                { tag: 'OS Deadlocks', posts: 156 },
                { tag: 'DBMS SQL', posts: 134 },
                { tag: 'Placement 2025', posts: 112 },
              ].map((topic) => (
                <button key={topic.tag} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <span className="text-sm text-text font-medium">#{topic.tag}</span>
                  <span className="text-xs text-text-tertiary">{topic.posts} posts</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
