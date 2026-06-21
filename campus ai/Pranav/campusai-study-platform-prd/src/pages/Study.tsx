import { useState } from 'react';
import { useApp } from '../App';
import {
  FileText,
  Upload,
  Brain,
  Target,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  BarChart3,
  BookOpen,
  Star,
  Eye,
  Download,
  Search,
  Grid3X3,
  List,
  RotateCcw,
  Play,
  Clock,
  Award,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';

type StudyTab = 'exam' | 'notes';
type NoteView = 'grid' | 'list';

export default function Study() {
  const [activeTab, setActiveTab] = useState<StudyTab>('exam');

  return (
    <div className="px-4 md:px-8 py-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">Study Center</h1>
          <p className="text-sm text-text-secondary mt-0.5">Analyze exams & manage your notes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'exam' as const, label: 'Exam Analysis', icon: <BarChart3 size={16} /> },
          { id: 'notes' as const, label: 'Smart Notes', icon: <BookOpen size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'bg-white border border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'exam' ? <ExamAnalysis /> : <SmartNotes />}
    </div>
  );
}

function ExamAnalysis() {
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleUpload = () => {
    setUploaded(true);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setAnalyzed(true);
    }, 2000);
  };

  const importantTopics = [
    { topic: 'Binary Trees & BST', subject: 'DSA', probability: 92, frequency: '8/10 papers', trend: 'up' },
    { topic: 'Deadlocks', subject: 'OS', probability: 88, frequency: '7/10 papers', trend: 'up' },
    { topic: 'SQL Queries', subject: 'DBMS', probability: 85, frequency: '9/10 papers', trend: 'stable' },
    { topic: 'TCP/IP Model', subject: 'CN', probability: 78, frequency: '6/10 papers', trend: 'up' },
    { topic: 'Sorting Algorithms', subject: 'DSA', probability: 76, frequency: '7/10 papers', trend: 'stable' },
    { topic: 'Normalization', subject: 'DBMS', probability: 72, frequency: '5/10 papers', trend: 'down' },
  ];

  const predictedQuestions = [
    { question: 'Explain Banker\'s Algorithm with example', probability: 94, marks: 10 },
    { question: 'Implement BST insertion & deletion', probability: 90, marks: 15 },
    { question: 'Compare TCP vs UDP with examples', probability: 82, marks: 8 },
    { question: 'Normalization forms with examples', probability: 80, marks: 10 },
  ];

  const topicWeightage = [
    { topic: 'Trees & Graphs', weight: 25 },
    { topic: 'Process Management', weight: 20 },
    { topic: 'SQL & NoSQL', weight: 18 },
    { topic: 'Network Layers', weight: 15 },
    { topic: 'Sorting & Searching', weight: 12 },
    { topic: 'File Systems', weight: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
            <Upload size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text">Upload Question Paper or Syllabus</h3>
            <p className="text-sm text-text-secondary mt-0.5">AI will analyze patterns, detect repeated questions, and predict important topics</p>
          </div>
          <button
            onClick={handleUpload}
            className="gradient-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] shrink-0"
          >
            <Upload size={16} />
            Choose File
          </button>
        </div>

        {/* Processing Animation */}
        {processing && (
          <div className="mt-4 pt-4 border-t border-border-light animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Brain size={16} className="text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">Analyzing document...</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full gradient-primary rounded-full animate-shimmer" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Summary */}
      {analyzed && (
        <>
          <div className="grid grid-cols-3 gap-4 stagger">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-primary">23</p>
              <p className="text-xs text-text-tertiary mt-1">Papers Analyzed</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-error-500">15</p>
              <p className="text-xs text-text-tertiary mt-1">Repeated Qs</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-success-500">87%</p>
              <p className="text-xs text-text-tertiary mt-1">Prediction Rate</p>
            </div>
          </div>

          {/* Important Topics with Confidence */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Brain size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text text-sm">AI Predicted Important Topics</h3>
                  <p className="text-[10px] text-text-tertiary">Based on 10+ previous year papers</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {importantTopics.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    item.probability >= 85 ? 'bg-error-50 text-error-500' :
                    item.probability >= 75 ? 'bg-warning-50 text-warning-500' :
                    'bg-secondary-50 text-secondary'
                  }`}>
                    {item.probability}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{item.topic}</p>
                    <p className="text-xs text-text-tertiary">{item.subject} • {item.frequency}</p>
                  </div>
                  <TrendingUp size={14} className={item.trend === 'up' ? 'text-success-500' : 'text-text-tertiary'} />
                </div>
              ))}
            </div>
          </div>

          {/* Topic Weightage Chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-text text-sm flex items-center gap-2 mb-4">
              <Layers size={16} className="text-primary" />
              Topic Weightage
            </h3>
            <div className="space-y-3">
              {topicWeightage.map((item) => (
                <div key={item.topic}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text">{item.topic}</span>
                    <span className="text-xs font-semibold text-primary">{item.weight}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-700"
                      style={{ width: `${item.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predicted Questions */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                <Zap size={16} className="text-warning-500" />
              </div>
              <div>
                <h3 className="font-semibold text-text text-sm">Predicted Exam Questions</h3>
                <p className="text-[10px] text-text-tertiary">AI-generated expected questions</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {predictedQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-warning-50/30 rounded-xl border border-warning-50">
                  <span className="w-6 h-6 rounded-md bg-warning-50 text-warning-500 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-text">{q.question}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-tertiary">{q.marks} marks</span>
                      <span className={`text-xs font-semibold ${q.probability >= 90 ? 'text-error-500' : 'text-warning-500'}`}>
                        {q.probability}% likely
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Report */}
          <button className="w-full card card-interactive p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Download size={18} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-text text-sm">Download Analysis Report</p>
                <p className="text-xs text-text-tertiary">PDF with complete analysis</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-text-tertiary" />
          </button>
        </>
      )}
    </div>
  );
}

function SmartNotes() {
  const [viewMode, setViewMode] = useState<NoteView>('grid');
  const [noteType, setNoteType] = useState<'all' | 'summary' | 'flash' | 'revision' | 'formula'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);

  const notes = [
    { id: 1, title: 'Binary Trees Complete Notes', subject: 'DSA', type: 'summary', updated: '2h ago', color: 'bg-indigo-50 border-indigo-100' },
    { id: 2, title: 'OS Deadlocks Flashcards', subject: 'OS', type: 'flash', updated: '1d ago', color: 'bg-emerald-50 border-emerald-100' },
    { id: 3, title: 'DBMS Formula Sheet', subject: 'DBMS', type: 'formula', updated: '3d ago', color: 'bg-amber-50 border-amber-100' },
    { id: 4, title: 'CN Revision Notes', subject: 'CN', type: 'revision', updated: '5d ago', color: 'bg-purple-50 border-purple-100' },
    { id: 5, title: 'Graph Algorithms Summary', subject: 'DSA', type: 'summary', updated: '1w ago', color: 'bg-blue-50 border-blue-100' },
    { id: 6, title: 'SQL Joins Cheat Sheet', subject: 'DBMS', type: 'formula', updated: '1w ago', color: 'bg-rose-50 border-rose-100' },
  ];

  const flashcards = [
    { front: 'What is a Deadlock?', back: 'A situation where a set of processes are blocked because each process holds a resource and waits for another resource acquired by some other process.' },
    { front: 'Conditions for Deadlock', back: '1. Mutual Exclusion\n2. Hold & Wait\n3. No Preemption\n4. Circular Wait' },
    { front: 'Banker\'s Algorithm', back: 'A resource allocation and deadlock avoidance algorithm that tests for safety by simulating allocation of predetermined maximum amounts of all resources.' },
    { front: 'What is Virtual Memory?', back: 'A memory management technique that creates the illusion of a large, contiguous address space using both RAM and disk storage.' },
  ];

  const filteredNotes = notes.filter(n => {
    if (noteType !== 'all' && n.type !== noteType) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'summary': return <BookOpen size={16} className="text-indigo-500" />;
      case 'flash': return <Star size={16} className="text-emerald-500" />;
      case 'formula': return <Zap size={16} className="text-amber-500" />;
      case 'revision': return <Eye size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-text-tertiary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'summary': return 'Summary';
      case 'flash': return 'Flashcards';
      case 'formula': return 'Formula Sheet';
      case 'revision': return 'Revision';
      default: return type;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2.5">
          <Search size={16} className="text-text-tertiary shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-tertiary hover:bg-gray-50'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-tertiary hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all' as const, label: 'All' },
          { id: 'summary' as const, label: '📝 Summaries' },
          { id: 'flash' as const, label: '🃏 Flashcards' },
          { id: 'revision' as const, label: '👁 Revision' },
          { id: 'formula' as const, label: '⚡ Formulas' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setNoteType(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              noteType === f.id
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Flashcard Practice Section */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text text-sm flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Quick Flashcard Practice
          </h3>
          <span className="text-xs text-text-tertiary">{flashIndex + 1}/{flashcards.length}</span>
        </div>
        <div
          onClick={() => setFlashFlipped(!flashFlipped)}
          className="min-h-[160px] rounded-2xl border-2 border-dashed border-primary/20 bg-primary-50/30 flex items-center justify-center cursor-pointer transition-all hover:border-primary/40 p-6"
        >
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-2">{flashFlipped ? 'Answer' : 'Question'}</p>
            <p className={`text-base text-text leading-relaxed ${!flashFlipped ? 'font-medium' : ''}`}>
              {flashFlipped ? flashcards[flashIndex].back : flashcards[flashIndex].front}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => { setFlashIndex(Math.max(0, flashIndex - 1)); setFlashFlipped(false); }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-white border border-border text-text-secondary hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setFlashFlipped(!flashFlipped)}
            className="px-4 py-2 rounded-xl text-xs font-medium gradient-primary text-white"
          >
            {flashFlipped ? 'Show Question' : 'Show Answer'}
          </button>
          <button
            onClick={() => { setFlashIndex(Math.min(flashcards.length - 1, flashIndex + 1)); setFlashFlipped(false); }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-white border border-border text-text-secondary hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Notes Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filteredNotes.map((note) => (
            <div key={note.id} className={`card card-interactive p-4 border ${note.color}`}>
              <div className="flex items-center gap-2 mb-3">
                {getTypeIcon(note.type)}
                <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">{getTypeLabel(note.type)}</span>
              </div>
              <h4 className="font-medium text-text text-sm mb-1">{note.title}</h4>
              <p className="text-xs text-text-tertiary">{note.subject} • {note.updated}</p>
              <div className="flex items-center gap-2 mt-3">
                <button className="text-xs text-primary font-medium hover:underline">Open</button>
                <button className="text-xs text-text-tertiary hover:text-text">Download</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card card-interactive p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${note.color}`}>
                {getTypeIcon(note.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text text-sm truncate">{note.title}</p>
                <p className="text-xs text-text-tertiary">{note.subject} • {getTypeLabel(note.type)} • {note.updated}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2 rounded-lg hover:bg-gray-50 text-text-tertiary">
                  <Download size={14} />
                </button>
                <ChevronRight size={16} className="text-text-tertiary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Chat */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Brain size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text text-sm">Chat with PDF</h3>
            <p className="text-[10px] text-text-tertiary">Upload a PDF and ask questions about its content</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Ask about your document..."
            className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-text border border-transparent focus:border-primary focus:bg-white outline-none transition-all"
          />
          <button className="gradient-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0">
            <Sparkles size={14} />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
