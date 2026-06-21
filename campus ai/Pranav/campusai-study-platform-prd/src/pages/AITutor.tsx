import { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import {
  Send,
  Image,
  Mic,
  Camera,
  Sparkles,
  BookOpen,
  Code,
  Lightbulb,
  Copy,
  Bookmark,
  Share2,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  Plus,
  MessageSquare,
  Trash2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  saved?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
}

const chatSessions: ChatSession[] = [
  { id: '1', title: 'Binary Trees Explanation', lastMessage: 'Explain BST deletion...', time: '2h ago' },
  { id: '2', title: 'OS Deadlocks Doubt', lastMessage: 'What are the conditions...', time: '1d ago' },
  { id: '3', title: 'SQL Practice', lastMessage: 'Write a query for...', time: '3d ago' },
];

const suggestions = [
  { icon: <BookOpen size={14} />, text: 'Explain Deadlocks in OS', color: 'bg-indigo-50 text-indigo-600' },
  { icon: <Code size={14} />, text: 'Write BFS in Python', color: 'bg-emerald-50 text-emerald-600' },
  { icon: <Lightbulb size={14} />, text: 'Important DBMS topics', color: 'bg-amber-50 text-amber-600' },
  { icon: <Sparkles size={14} />, text: 'Predict exam questions', color: 'bg-purple-50 text-purple-600' },
];

function generateAIResponse(input: string): string {
  const topic = input.replace(/explain|what is|how|tell me|help|write/gi, '').trim() || 'this topic';
  return `Here's a comprehensive explanation of **${topic}**:

**Core Concept**
${topic} is a fundamental concept that's crucial for your exams. Let me break it down step by step.

**Key Points**
• This topic appears frequently in previous year papers (7/10 times)
• Focus on understanding the underlying principles first
• Practice with numerical examples to strengthen your grasp

**Step-by-Step Explanation**
1. Start with the basic definition and properties
2. Understand how it relates to other concepts in the syllabus
3. Work through practice problems systematically
4. Review common exam patterns for this topic

**Exam Prediction** 📊
Based on analysis of 10+ previous papers, this has a **78% probability** of appearing in your next exam. Focus especially on:
- Core definitions and properties
- Problem-solving techniques
- Comparison with related concepts

**Pro Tip** 💡
Create flashcards for the key terms and review them daily. This topic often appears in both short and long answer sections.

Want me to generate practice questions or create flashcards for this?`;
}

export default function AITutor() {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hi ${user.name.split(' ')[0]}! 👋\n\nI'm your AI Tutor, ready to help you with:\n\n• **Doubt Solving** — Ask me anything about your subjects\n• **Step-by-step Explanations** — I'll break down complex topics\n• **Exam Predictions** — Know what's likely to appear\n• **Code Help** — Programming assistance in any language\n• **Multi-language** — I can explain in Hindi too!\n\nWhat would you like to learn today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(msgText),
        timestamp: 'Just now',
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSave = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, saved: !m.saved } : m));
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith('• ')) {
        return <div key={i} className="flex gap-2 ml-1 my-0.5"><span className="text-primary shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: line.slice(2) }} /></div>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <div key={i} className="ml-2 my-0.5" dangerouslySetInnerHTML={{ __html: line }} />;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)]">
      {/* ═══════ CHAT SIDEBAR (Desktop) ═══════ */}
      <div className="hidden md:flex w-64 shrink-0 flex-col border-r border-border-light bg-white">
        <div className="p-4 border-b border-border-light">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium text-text hover:bg-gray-50 transition-colors">
            <Plus size={16} />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-2 py-1">Recent Chats</p>
          {chatSessions.map((session) => (
            <button key={session.id} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-gray-50 transition-colors group">
              <MessageSquare size={14} className="text-text-tertiary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text truncate">{session.title}</p>
                <p className="text-[10px] text-text-tertiary truncate">{session.time}</p>
              </div>
              <Trash2 size={12} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ MAIN CHAT AREA ═══════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border-light bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-50"
            >
              <ChevronDown size={18} className="text-text-secondary" />
            </button>
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">AI Tutor</h2>
              <p className="text-[10px] text-success-500 font-medium">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-text-tertiary">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-5 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'ai' ? 'gradient-primary' : 'bg-gray-100'
              }`}>
                {msg.role === 'ai' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-text-secondary" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-white border border-border-light text-text shadow-sm'
                    : 'gradient-primary text-white'
                }`}>
                  {formatMessage(msg.content)}
                </div>

                {/* Action Buttons (AI messages only) */}
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="p-1.5 rounded-lg hover:bg-gray-50 text-text-tertiary hover:text-text transition-colors"
                      title="Copy"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => toggleSave(msg.id)}
                      className={`p-1.5 rounded-lg hover:bg-gray-50 transition-colors ${msg.saved ? 'text-primary' : 'text-text-tertiary hover:text-text'}`}
                      title="Save"
                    >
                      <Bookmark size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-50 text-text-tertiary hover:text-text transition-colors" title="Share">
                      <Share2 size={13} />
                    </button>
                    {copiedId === msg.id && (
                      <span className="text-[10px] text-success-500 font-medium ml-1 animate-fade-in">Copied!</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border border-border-light rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (when few messages) */}
        {messages.length <= 2 && (
          <div className="px-4 md:px-6 pb-2">
            <p className="text-xs text-text-tertiary mb-2">Try asking:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:bg-gray-50 text-left transition-colors active:scale-[0.98]"
                >
                  <span className={`p-1 rounded-md ${s.color}`}>{s.icon}</span>
                  <span className="text-xs text-text">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border-light bg-white px-4 md:px-6 py-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-white focus-within:shadow-sm transition-all">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-text-tertiary hover:text-primary transition-colors shrink-0">
              <Camera size={18} />
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary outline-none min-w-0"
            />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-text-tertiary hover:text-primary transition-colors shrink-0">
              <Image size={18} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-text-tertiary hover:text-primary transition-colors shrink-0">
              <Mic size={18} />
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className={`p-2.5 rounded-xl transition-all shrink-0 ${
                input.trim()
                  ? 'gradient-primary text-white shadow-sm shadow-primary/20 active:scale-95'
                  : 'bg-gray-200 text-text-tertiary'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-text-tertiary text-center mt-2">AI Tutor may make mistakes. Verify important information.</p>
        </div>
      </div>

      {/* Mobile Chat Sessions Overlay */}
      {showSidebar && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in" onClick={() => setShowSidebar(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border-light">
              <h3 className="font-semibold text-text">Chat History</h3>
            </div>
            <div className="p-3 space-y-1">
              {chatSessions.map((session) => (
                <button key={session.id} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors">
                  <MessageSquare size={14} className="text-text-tertiary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{session.title}</p>
                    <p className="text-xs text-text-tertiary">{session.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
