import { useState, useEffect } from 'react';
import { useApp } from '../App';
import {
  User,
  Settings,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Award,
  Star,
  Flame,
  Target,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  Brain,
  Zap,
  BarChart3,
  Monitor,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  Coffee,
  TrendingUp,
  Lock,
  Crown,
} from 'lucide-react';

type Section = 'main' | 'focus' | 'settings';

export default function Profile() {
  const [section, setSection] = useState<Section>('main');

  return (
    <div className="px-4 md:px-8 py-6 animate-fade-in-up">
      {section === 'main' && <ProfileMain onNavigate={setSection} />}
      {section === 'focus' && <FocusMode onBack={() => setSection('main')} />}
      {section === 'settings' && <SettingsPage onBack={() => setSection('main')} />}
    </div>
  );
}

/* ══════════════════════════════════════
   PROFILE MAIN
   ══════════════════════════════════════ */

function ProfileMain({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const { user } = useApp();

  const badges = [
    { icon: '🔥', label: '7-Day Streak', unlocked: true },
    { icon: '🧠', label: 'AI Master', unlocked: true },
    { icon: '📝', label: '100 Notes', unlocked: true },
    { icon: '🎯', label: 'Mock Test Pro', unlocked: true },
    { icon: '⭐', label: 'Top 20 Rank', unlocked: true },
    { icon: '📚', label: 'Scholar', unlocked: true },
    { icon: '🏆', label: 'Semester Topper', unlocked: false },
    { icon: '💎', label: '5000 XP', unlocked: false },
    { icon: '👑', label: 'Campus Legend', unlocked: false },
  ];

  const xpForNextLevel = 3000;
  const xpProgress = (user.xp / xpForNextLevel) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (xpProgress / 100) * circumference;

  const weeklyData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.1 },
    { day: 'Fri', hours: 4.5 },
    { day: 'Sat', hours: 6.2 },
    { day: 'Sun', hours: 3.0 },
  ];
  const maxH = Math.max(...weeklyData.map(d => d.hours));

  const savedNotes = [
    { title: 'DSA Complete Notes', subject: 'DSA', type: 'Summary' },
    { title: 'OS Deadlocks Summary', subject: 'OS', type: 'Revision' },
    { title: 'DBMS Formula Sheet', subject: 'DBMS', type: 'Formula' },
  ];

  const aiUsage = [
    { action: 'Doubt Solved', count: 45, icon: <Brain size={14} className="text-primary" /> },
    { action: 'Notes Generated', count: 23, icon: <FileText size={14} className="text-emerald-500" /> },
    { action: 'Mock Tests Taken', count: 8, icon: <Target size={14} className="text-amber-500" /> },
    { action: 'Papers Analyzed', count: 12, icon: <BarChart3 size={14} className="text-purple-500" /> },
  ];

  const menuItems = [
    { icon: <Monitor size={18} />, label: 'Focus Mode', desc: 'Distraction-free study', section: 'focus' as Section, color: 'text-primary bg-primary-50' },
    { icon: <Timer size={18} />, label: 'Pomodoro Timer', desc: 'Focus timer & breaks', section: 'focus' as Section, color: 'text-emerald-500 bg-emerald-50' },
    { icon: <Briefcase size={18} />, label: 'Career Hub', desc: 'Jobs & internships', section: 'main' as Section, color: 'text-amber-500 bg-amber-50' },
    { icon: <Settings size={18} />, label: 'Settings', desc: 'Preferences & account', section: 'settings' as Section, color: 'text-text-secondary bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      {/* ═══════ PROFILE CARD ═══════ */}
      <div className="card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with XP Ring */}
          <div className="relative">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="#4F46E5" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-ring-circle"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                {user.avatar}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-bold text-text">{user.name}</h2>
              {user.premium && (
                <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <Crown size={10} /> PRO
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary mt-1">{user.university}</p>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
              <span className="text-xs bg-primary-50 text-primary px-2 py-0.5 rounded-md font-medium">{user.department}</span>
              <span className="text-xs bg-gray-100 text-text-secondary px-2 py-0.5 rounded-md font-medium">{user.semester}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-3">
              <Flame size={14} className="text-orange-500" />
              <span className="text-sm font-semibold text-orange-500">{user.streak}-day streak</span>
              <span className="text-text-tertiary mx-1">•</span>
              <Star size={14} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Level {user.level}</span>
              <span className="text-text-tertiary mx-1">•</span>
              <span className="text-sm font-semibold text-text">{user.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full max-w-xs mx-auto sm:mx-0 mt-2">
              <div className="flex items-center justify-between text-[10px] text-text-tertiary mb-1">
                <span>Level {user.level}</span>
                <span>{user.xp}/{xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ STATS GRID ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {[
          { icon: <Zap size={16} className="text-primary" />, label: 'Total XP', value: user.xp.toLocaleString(), bg: 'bg-primary-50' },
          { icon: <Flame size={16} className="text-orange-500" />, label: 'Day Streak', value: user.streak.toString(), bg: 'bg-orange-50' },
          { icon: <Target size={16} className="text-emerald-500" />, label: 'Accuracy', value: '87%', bg: 'bg-emerald-50' },
          { icon: <Award size={16} className="text-amber-500" />, label: 'Rank', value: `#${user.rank}`, bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              {stat.icon}
            </div>
            <p className="text-lg font-bold text-text">{stat.value}</p>
            <p className="text-[10px] text-text-tertiary font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ═══════ BADGES ═══════ */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text flex items-center gap-2">
            <Award size={16} className="text-amber-500" />
            Badges
          </h3>
          <span className="text-xs text-text-tertiary">{badges.filter(b => b.unlocked).length}/{badges.length} unlocked</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {badges.map((badge, i) => (
            <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${badge.unlocked ? 'bg-white hover:bg-gray-50' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${badge.unlocked ? 'bg-gray-50' : 'bg-gray-100'}`}>
                {badge.unlocked ? badge.icon : <Lock size={16} className="text-text-tertiary" />}
              </div>
              <span className="text-[10px] text-text-tertiary font-medium text-center leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ WEEKLY STUDY CHART ═══════ */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" />
            Weekly Study Hours
          </h3>
          <span className="text-xs text-success-500 font-medium">29.3h total</span>
        </div>
        <div className="flex items-end gap-3 h-28">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-medium text-text-tertiary">{d.hours}h</span>
              <div className="w-full rounded-lg gradient-primary transition-all duration-500 min-h-[4px]" style={{ height: `${(d.hours / maxH) * 88}px` }} />
              <span className="text-[10px] font-medium text-text-tertiary">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ AI USAGE ═══════ */}
      <div className="card p-5">
        <h3 className="font-semibold text-text flex items-center gap-2 mb-4">
          <Brain size={16} className="text-primary" />
          AI Usage This Month
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {aiUsage.map((item) => (
            <div key={item.action} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{item.count}</p>
                <p className="text-[10px] text-text-tertiary">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ SAVED NOTES ═══════ */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            Saved Notes
          </h3>
          <button className="text-xs text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {savedNotes.map((note) => (
            <div key={note.title} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileText size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{note.title}</p>
                <p className="text-xs text-text-tertiary">{note.subject} • {note.type}</p>
              </div>
              <ChevronRight size={14} className="text-text-tertiary shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ PREMIUM CARD ═══════ */}
      <div className="card p-5 relative overflow-hidden bg-gradient-to-br from-primary-50 to-indigo-50 border-primary/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} className="text-primary" />
            <h3 className="font-semibold text-text">CampusAI Pro</h3>
            {user.premium && <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-md">Active</span>}
          </div>
          <p className="text-sm text-text-secondary mb-3">Unlimited AI chats, exam predictions, offline access, and more.</p>
          <div className="flex flex-wrap gap-2">
            {['Unlimited AI', 'Exam Prediction', 'Offline Mode', 'Voice AI', 'Priority Support'].map((feature) => (
              <span key={feature} className="text-[10px] font-medium bg-white/80 text-primary px-2.5 py-1 rounded-lg">
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ MENU ITEMS ═══════ */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.section)}
            className="w-full card card-interactive p-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs text-text-tertiary">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-text-tertiary" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   FOCUS MODE
   ══════════════════════════════════════ */

function FocusMode({ onBack }: { onBack: () => void }) {
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [hideComments, setHideComments] = useState(true);
  const [hideShorts, setHideShorts] = useState(true);
  const [hideRecs, setHideRecs] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (focusActive) {
      interval = setInterval(() => setFocusTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [focusActive]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const studyVideos = [
    { title: 'Data Structures Full Course', channel: 'freeCodeCamp', duration: '6:32:40' },
    { title: 'Operating Systems Explained', channel: 'Gate Smashers', duration: '2:15:20' },
    { title: 'DBMS Complete Tutorial', channel: "Jenny's Lectures", duration: '4:45:10' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-text-secondary hover:text-text flex items-center gap-1 transition-colors">
        ← Back to Profile
      </button>

      <div className="flex items-center gap-2">
        <Monitor size={20} className="text-primary" />
        <h2 className="text-xl font-bold text-text">Focus Mode</h2>
      </div>

      {/* Focus Timer */}
      <div className="card p-8 text-center relative overflow-hidden">
        {focusActive && <div className="absolute inset-0 bg-primary-50/30" />}
        <div className="relative z-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
            focusActive ? 'bg-success-50 text-success-500' : 'bg-gray-100 text-text-tertiary'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${focusActive ? 'bg-success-500 animate-pulse' : 'bg-text-tertiary'}`} />
            {focusActive ? 'Focus Session Active' : 'Ready to Focus'}
          </div>
          <p className={`text-5xl md:text-6xl font-mono font-bold tracking-wider mb-6 ${focusActive ? 'gradient-text' : 'text-text'}`}>
            {formatTime(focusTime)}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setFocusActive(!focusActive)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                focusActive
                  ? 'bg-white border border-border text-text hover:bg-gray-50'
                  : 'gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
              }`}
            >
              {focusActive ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Focus</>}
            </button>
            <button
              onClick={() => { setFocusActive(false); setFocusTime(0); }}
              className="p-3 rounded-xl bg-white border border-border text-text-tertiary hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          {focusActive && (
            <p className="text-sm text-primary font-medium mt-4 animate-fade-in">Stay focused! You're doing great 💪</p>
          )}
        </div>
      </div>

      {/* YouTube Controls */}
      <div className="card p-5">
        <h3 className="font-semibold text-text text-sm mb-4 flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          YouTube Distraction Controls
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Hide Recommendations', desc: 'Block suggested videos', state: hideRecs, setter: setHideRecs },
            { label: 'Hide Comments', desc: 'Block comment section', state: hideComments, setter: setHideComments },
            { label: 'Hide Shorts', desc: 'Block YouTube Shorts', state: hideShorts, setter: setHideShorts },
          ].map((control) => (
            <div key={control.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{control.label}</p>
                <p className="text-xs text-text-tertiary">{control.desc}</p>
              </div>
              <button
                onClick={() => control.setter(!control.state)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${control.state ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${control.state ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Study Videos */}
      <div>
        <h3 className="font-semibold text-text text-sm mb-3 flex items-center gap-2">
          <Play size={16} className="text-error-500" />
          Study Videos (No Distractions)
        </h3>
        <div className="space-y-2">
          {studyVideos.map((video, i) => (
            <div key={i} className="card card-interactive p-4 flex items-center gap-3">
              <div className="w-12 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Play size={14} className="text-error-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{video.title}</p>
                <p className="text-xs text-text-tertiary">{video.channel} • {video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-primary">12</p>
          <p className="text-[10px] text-text-tertiary">Sessions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-success-500">18.5h</p>
          <p className="text-[10px] text-text-tertiary">Total Focus</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-amber-500">92m</p>
          <p className="text-[10px] text-text-tertiary">Avg Session</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════ */

function SettingsPage({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={onBack} className="text-sm text-text-secondary hover:text-text flex items-center gap-1 transition-colors">
        ← Back to Profile
      </button>

      <h2 className="text-xl font-bold text-text flex items-center gap-2">
        <Settings size={20} className="text-text-secondary" />
        Settings
      </h2>

      {/* Notifications */}
      <div className="card p-5">
        <h3 className="font-semibold text-text text-sm mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: 'Push Notifications', desc: 'Study reminders & updates', state: notifications, setter: setNotifications },
            { label: 'Study Reminders', desc: 'Daily schedule alerts', state: studyReminders, setter: setStudyReminders },
            { label: 'Daily Digest', desc: 'Activity summary email', state: dailyDigest, setter: setDailyDigest },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="text-xs text-text-tertiary">{item.desc}</p>
              </div>
              <button
                onClick={() => item.setter(!item.state)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${item.state ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.state ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-5">
        <h3 className="font-semibold text-text text-sm mb-3">Security & Privacy</h3>
        {[
          { icon: <Shield size={16} />, label: 'Change Password' },
          { icon: <Lock size={16} />, label: 'Privacy Settings' },
          { icon: <Monitor size={16} />, label: 'Connected Devices' },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center gap-3 py-3 text-left border-b border-border-light last:border-0 last:pb-0 first:pt-0">
            <span className="text-text-tertiary">{item.icon}</span>
            <span className="text-sm text-text flex-1">{item.label}</span>
            <ChevronRight size={14} className="text-text-tertiary" />
          </button>
        ))}
      </div>

      {/* Account */}
      <div className="card p-5">
        <h3 className="font-semibold text-text text-sm mb-3">Account</h3>
        {[
          { icon: <Crown size={16} />, label: 'Subscription Plan', value: 'Pro' },
          { icon: <Bell size={16} />, label: 'Help & Support' },
          { icon: <User size={16} />, label: 'Invite Friends' },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center gap-3 py-3 text-left border-b border-border-light last:border-0 last:pb-0 first:pt-0">
            <span className="text-text-tertiary">{item.icon}</span>
            <span className="text-sm text-text flex-1">{item.label}</span>
            {item.value && <span className="text-xs text-primary font-medium">{item.value}</span>}
            <ChevronRight size={14} className="text-text-tertiary" />
          </button>
        ))}
      </div>

      <button className="w-full card p-4 flex items-center justify-center gap-2 text-error-500 hover:bg-error-50 transition-colors">
        <LogOut size={16} />
        <span className="text-sm font-medium">Log Out</span>
      </button>

      <p className="text-center text-xs text-text-tertiary pb-4">CampusAI v1.0.0 • Made with ❤️ for students</p>
    </div>
  );
}
