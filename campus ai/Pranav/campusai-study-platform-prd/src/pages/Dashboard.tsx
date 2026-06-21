import { useState } from 'react';
import { useApp } from '../App';
import {
  Flame,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Zap,
  Brain,
  FileText,
  Award,
  BarChart3,
  Play,
} from 'lucide-react';

export default function Dashboard() {
  const { user, setPage } = useApp();

  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: 'Solve 5 DSA problems', done: true },
    { id: 2, text: 'Revise OS Chapter 5', done: true },
    { id: 3, text: 'Complete CN notes', done: false },
    { id: 4, text: '30 min mock test', done: false },
  ]);

  const toggleGoal = (id: number) => {
    setDailyGoals(goals => goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const completedGoals = dailyGoals.filter(g => g.done).length;
  const totalGoals = dailyGoals.length;

  const exams = [
    { subject: 'Data Structures', date: 'Dec 15', days: 5, color: 'bg-error-50 text-error-500' },
    { subject: 'Operating Systems', date: 'Dec 18', days: 8, color: 'bg-warning-50 text-warning-500' },
    { subject: 'Computer Networks', date: 'Dec 22', days: 12, color: 'bg-success-50 text-success-500' },
  ];

  const continueLearning = [
    { subject: 'Data Structures', topic: 'Binary Trees', progress: 65, color: 'from-indigo-500 to-blue-500' },
    { subject: 'Operating Systems', topic: 'Deadlocks', progress: 42, color: 'from-emerald-500 to-teal-500' },
    { subject: 'DBMS', topic: 'SQL Queries', progress: 80, color: 'from-amber-500 to-orange-500' },
  ];

  const weeklyHours = [
    { day: 'Mon', h: 3.5 },
    { day: 'Tue', h: 4.2 },
    { day: 'Wed', h: 2.8 },
    { day: 'Thu', h: 5.1 },
    { day: 'Fri', h: 4.5 },
    { day: 'Sat', h: 6.2 },
    { day: 'Sun', h: 3.0 },
  ];
  const maxH = Math.max(...weeklyHours.map(d => d.h));

  const recentNotes = [
    { title: 'DSA Complete Notes', subject: 'DSA', updated: '2h ago' },
    { title: 'OS Deadlocks Summary', subject: 'OS', updated: '1d ago' },
    { title: 'DBMS Formula Sheet', subject: 'DBMS', updated: '3d ago' },
  ];

  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakData = [true, true, true, true, true, true, true];

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-fade-in-up">
      {/* ═══════ WELCOME CARD ═══════ */}
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -translate-y-32 translate-x-32 opacity-60" />
        <div className="absolute bottom-0 right-32 w-40 h-40 bg-primary-100 rounded-full translate-y-20 opacity-40" />
        <div className="relative z-10">
          <p className="text-text-secondary text-sm mb-1">Good morning,</p>
          <h1 className="text-2xl md:text-3xl font-bold text-text">{user.name.split(' ')[0]} 👋</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-md">
            You're on a <span className="font-semibold text-primary">{user.streak}-day streak</span>! Keep the momentum going.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => setPage('ai')}
              className="gradient-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Sparkles size={16} />
              Ask AI Tutor
            </button>
            <button
              onClick={() => setPage('study')}
              className="bg-white border border-border text-text text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              <Play size={16} />
              Continue Study
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ STATS ROW ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame size={16} className="text-orange-500" />
            </div>
            <span className="text-xs text-text-tertiary font-medium">Streak</span>
          </div>
          <p className="text-2xl font-bold text-text">{user.streak}</p>
          <p className="text-xs text-text-tertiary">days 🔥</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Clock size={16} className="text-primary" />
            </div>
            <span className="text-xs text-text-tertiary font-medium">Study</span>
          </div>
          <p className="text-2xl font-bold text-text">4.5h</p>
          <p className="text-xs text-success-500 font-medium">+12% ↑</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center">
              <Target size={16} className="text-success-500" />
            </div>
            <span className="text-xs text-text-tertiary font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-text">87%</p>
          <p className="text-xs text-success-500 font-medium">+3% ↑</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center">
              <Award size={16} className="text-secondary" />
            </div>
            <span className="text-xs text-text-tertiary font-medium">Rank</span>
          </div>
          <p className="text-2xl font-bold text-text">#{user.rank}</p>
          <p className="text-xs text-success-500 font-medium">↑3 spots</p>
        </div>
      </div>

      {/* ═══════ STREAK + ATTENDANCE ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Study Streak */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />
              Study Streak
            </h3>
            <span className="text-sm font-bold text-orange-500">{user.streak} days</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {streakDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  streakData[i]
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-gray-100 text-text-tertiary'
                }`}>
                  {streakData[i] ? '✓' : ''}
                </div>
                <span className={`text-[10px] font-medium ${i === 6 ? 'text-primary' : 'text-text-tertiary'}`}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Attendance
            </h3>
            <span className="text-sm font-bold text-success-500">85%</span>
          </div>
          <div className="space-y-2.5">
            {[
              { sub: 'DSA', pct: 92 },
              { sub: 'OS', pct: 83 },
              { sub: 'DBMS', pct: 79 },
              { sub: 'CN', pct: 69 },
            ].map(s => (
              <div key={s.sub} className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-secondary w-10">{s.sub}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${s.pct >= 75 ? 'bg-success-500' : s.pct >= 65 ? 'bg-warning-500' : 'bg-error-500'}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold w-8 text-right ${s.pct >= 75 ? 'text-success-500' : s.pct >= 65 ? 'text-warning-500' : 'text-error-500'}`}>
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ EXAM COUNTDOWN ═══════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Upcoming Exams
          </h2>
          <button onClick={() => setPage('study')} className="text-xs text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {exams.map((exam) => (
            <div key={exam.subject} className="card p-4 min-w-[200px] shrink-0 card-interactive">
              <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${exam.color} mb-3`}>
                {exam.days} days left
              </div>
              <p className="font-semibold text-text text-sm">{exam.subject}</p>
              <p className="text-xs text-text-tertiary mt-1">{exam.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ AI RECOMMENDATIONS ═══════ */}
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-50 rounded-full -translate-y-24 translate-x-24 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text text-sm">AI Recommendations</h3>
              <p className="text-xs text-text-tertiary">Based on your progress & syllabus</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { text: 'Focus on Binary Trees — 92% probability in exam', tag: 'DSA', tagColor: 'bg-indigo-50 text-indigo-600' },
              { text: 'Complete Deadlocks module — high weightage topic', tag: 'OS', tagColor: 'bg-emerald-50 text-emerald-600' },
              { text: 'Practice SQL Joins — frequently asked in papers', tag: 'DBMS', tagColor: 'bg-amber-50 text-amber-600' },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50/60 rounded-xl">
                <Zap size={14} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-text flex-1">{rec.text}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${rec.tagColor}`}>{rec.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ CONTINUE LEARNING ═══════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Continue Learning
          </h2>
          <button onClick={() => setPage('study')} className="text-xs text-primary font-medium hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
          {continueLearning.map((item) => (
            <button
              key={item.topic}
              onClick={() => setPage('study')}
              className="card card-interactive p-5 text-left group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                <BookOpen size={18} className="text-white" />
              </div>
              <p className="font-semibold text-text text-sm">{item.topic}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{item.subject}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-tertiary">Progress</span>
                  <span className="text-xs font-semibold text-primary">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-primary transition-all duration-700"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium group-hover:gap-2 transition-all">
                Continue <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ DAILY GOALS + PROGRESS CHART ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Goals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Today's Goals
            </h3>
            <span className="text-xs font-semibold text-primary">{completedGoals}/{totalGoals}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-500"
              style={{ width: `${(completedGoals / totalGoals) * 100}%` }}
            />
          </div>
          <div className="space-y-2">
            {dailyGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className="w-full flex items-center gap-3 py-1.5 group"
              >
                {goal.done ? (
                  <CheckCircle2 size={18} className="text-success-500 shrink-0" />
                ) : (
                  <Circle size={18} className="text-gray-300 shrink-0 group-hover:text-primary/40 transition-colors" />
                )}
                <span className={`text-sm ${goal.done ? 'line-through text-text-tertiary' : 'text-text'}`}>
                  {goal.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              Weekly Study Hours
            </h3>
            <span className="text-xs text-success-500 font-medium">29.3h total</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {weeklyHours.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-text-tertiary">{d.h}h</span>
                <div className="w-full rounded-lg gradient-primary transition-all duration-500 min-h-[4px]" style={{ height: `${(d.h / maxH) * 96}px` }} />
                <span className="text-[10px] font-medium text-text-tertiary">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ RECENT NOTES ═══════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Recent Notes
          </h2>
          <button onClick={() => setPage('study')} className="text-xs text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentNotes.map((note) => (
            <button key={note.title} onClick={() => setPage('study')} className="card card-interactive p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text text-sm truncate">{note.title}</p>
                  <p className="text-xs text-text-tertiary">{note.subject} • {note.updated}</p>
                </div>
                <ChevronRight size={16} className="text-text-tertiary shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
