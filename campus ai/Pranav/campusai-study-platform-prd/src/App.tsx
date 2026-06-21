import { useState, createContext, useContext, ReactNode } from 'react';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import Study from './pages/Study';
import Community from './pages/Community';
import Profile from './pages/Profile';

type Page = 'home' | 'ai' | 'study' | 'community' | 'profile';

interface AppContextType {
  page: Page;
  setPage: (p: Page) => void;
  user: typeof defaultUser;
}

const defaultUser = {
  name: 'Arjun Sharma',
  email: 'arjun@campus.edu',
  avatar: 'AS',
  university: 'IIT Delhi',
  department: 'Computer Science',
  semester: '5th Semester',
  xp: 2450,
  level: 12,
  rank: 15,
  premium: true,
  streak: 7,
};

export const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

import {
  Home,
  MessageSquare,
  BookOpen,
  Users,
  UserCircle,
  Search,
  Bell,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
} from 'lucide-react';

const sidebarItems: { id: Page; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { id: 'ai', label: 'AI Tutor', icon: <MessageSquare size={20} /> },
  { id: 'study', label: 'Study', icon: <BookOpen size={20} /> },
  { id: 'community', label: 'Community', icon: <Users size={20} /> },
  { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
];

const bottomNavItems: { id: Page; label: string; icon: ReactNode; activeIcon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={22} strokeWidth={1.5} />, activeIcon: <Home size={22} strokeWidth={2.5} /> },
  { id: 'ai', label: 'AI Tutor', icon: <MessageSquare size={22} strokeWidth={1.5} />, activeIcon: <MessageSquare size={22} strokeWidth={2.5} /> },
  { id: 'study', label: 'Study', icon: <BookOpen size={22} strokeWidth={1.5} />, activeIcon: <BookOpen size={22} strokeWidth={2.5} /> },
  { id: 'community', label: 'Community', icon: <Users size={22} strokeWidth={1.5} />, activeIcon: <Users size={22} strokeWidth={2.5} /> },
  { id: 'profile', label: 'Profile', icon: <User size={22} strokeWidth={1.5} />, activeIcon: <User size={22} strokeWidth={2.5} /> },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (page) {
      case 'home': return <Dashboard />;
      case 'ai': return <AITutor />;
      case 'study': return <Study />;
      case 'community': return <Community />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <AppContext.Provider value={{ page, setPage, user: defaultUser }}>
      <div className="min-h-screen bg-bg font-sans">
        {/* ═══════════ DESKTOP SIDEBAR ═══════════ */}
        <aside className={`hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col bg-surface border-r border-border-light transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-[72px]'}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-border-light">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg gradient-text whitespace-nowrap animate-fade-in">CampusAI</span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-primary' : ''}`}>{item.icon}</span>
                  {sidebarOpen && (
                    <span className="whitespace-nowrap animate-fade-in">{item.label}</span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-border-light p-3 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </button>
            {/* Collapse Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-tertiary hover:bg-gray-50 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              {sidebarOpen && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* ═══════════ MAIN AREA ═══════════ */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-[72px]'}`}>
          {/* Desktop Top Bar */}
          <header className="hidden md:flex sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-border-light items-center justify-between px-8">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <Search size={18} className="text-text-tertiary shrink-0" />
              <input
                type="text"
                placeholder="Search notes, subjects, doubts..."
                className="w-full bg-transparent text-sm text-text placeholder:text-text-tertiary border-none outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell size={20} className="text-text-secondary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>
              <button
                onClick={() => setPage('profile')}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {defaultUser.avatar}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text leading-tight">{defaultUser.name}</p>
                  <p className="text-xs text-text-tertiary">{defaultUser.university}</p>
                </div>
                {defaultUser.premium && (
                  <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-md">PRO</span>
                )}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto">
              {renderPage()}
            </div>
          </main>
        </div>

        {/* ═══════════ MOBILE BOTTOM NAV ═══════════ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border-light">
          <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
            {bottomNavItems.map((item) => {
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                    isActive ? 'text-primary' : 'text-text-tertiary active:text-text-secondary'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {isActive ? item.activeIcon : item.icon}
                  </span>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ═══════════ FLOATING AI BUTTON (Mobile) ═══════════ */}
        {page !== 'ai' && (
          <button
            onClick={() => setPage('ai')}
            className="md:hidden fixed right-4 bottom-20 z-30 w-14 h-14 rounded-2xl gradient-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Sparkles size={22} />
          </button>
        )}
      </div>
    </AppContext.Provider>
  );
}
