"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, Circle, Search, Printer, Target, AlertCircle, TrendingUp, Sparkles, X, Filter } from "lucide-react";

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  contentBase64: string;
};

type ExamQuestion = {
  id: string;
  topic: string;
  question: string;
  priority: "High" | "Medium" | "Low";
  frequency: number;
  completed: boolean;
  modelAnswer: string;
};

export function ExamPrepDashboard() {
  const [activeTab, setActiveTab] = useState<"upload" | "questions">("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        setFiles(prev => [
          ...prev, 
          {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type || "unknown",
            size: file.size,
            contentBase64: base64
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/exam-prep/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: files.map(f => ({ name: f.name, type: f.type, base64: f.contentBase64 })) }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
        setActiveTab("questions");
      } else {
        console.error("Failed to analyze documents");
        alert("Failed to analyze documents. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleComplete = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "All" || q.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-rose-100 text-rose-700 border-rose-200";
    if (priority === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "High") return <AlertCircle className="w-3.5 h-3.5 mr-1 inline" />;
    if (priority === "Medium") return <TrendingUp className="w-3.5 h-3.5 mr-1 inline" />;
    return <Target className="w-3.5 h-3.5 mr-1 inline" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-center sm:self-start print:hidden">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === "upload" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-ink"}`}
        >
          Uploaded Files ({files.length})
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === "questions" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-ink"}`}
        >
          Important Questions ({questions.length})
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="animate-fade-in flex flex-col gap-6">
          <div className="border-2 border-dashed border-electric/30 bg-electric/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition hover:border-electric/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Upload className="w-8 h-8 text-electric" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Upload PYQs & Notes</h3>
            <p className="text-sm text-slate-muted max-w-md mb-6">
              Select multiple PDFs, Word documents, or Text files. We'll analyze them to find the most important, frequently asked questions.
            </p>
            <label className="btn-press cursor-pointer bg-navy text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-navy-dark transition">
              Browse Files
              <input type="file" multiple accept=".pdf,.doc,.docx,.txt,image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {files.length > 0 && (
            <div className="bg-white border border-border-soft rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-navy mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-electric" /> Ready to Analyze
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {files.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 border border-border-soft rounded-xl bg-slate-50">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-semibold text-ink truncate">{file.name}</p>
                      <p className="text-xs text-slate-muted">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn-press bg-ai-gradient text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-pulse" /> Analyzing Documents...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Extract Important Questions
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "questions" && (
        <div className="animate-fade-in flex flex-col gap-6">
          {questions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border-soft rounded-2xl shadow-sm">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-navy">No Questions Extracted Yet</h3>
              <p className="text-sm text-slate-muted mt-2 mb-6">Upload your PYQs and notes to generate important questions.</p>
              <button onClick={() => setActiveTab("upload")} className="text-electric font-semibold hover:underline">
                Go to Upload
              </button>
            </div>
          ) : (
            <>
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-border-soft shadow-sm print:hidden">
                <div className="flex flex-1 w-full gap-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search topics or questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border-soft rounded-lg text-sm focus:outline-none focus:border-electric"
                  />
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  <div className="relative">
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as any)}
                      className="pl-9 pr-8 py-2 bg-slate-50 border border-border-soft rounded-lg text-sm focus:outline-none focus:border-electric appearance-none font-semibold text-navy"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🟢 Low Priority</option>
                    </select>
                  </div>
                  <button onClick={handlePrint} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg font-semibold hover:bg-navy-dark transition shrink-0">
                    <Printer className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="print:block space-y-4">
                {filteredQuestions.length === 0 ? (
                  <p className="text-center text-slate-muted py-10 font-medium">No questions match your filters.</p>
                ) : (
                  filteredQuestions.map((q) => (
                    <div key={q.id} className={`flex gap-4 p-5 rounded-xl border transition ${q.completed ? 'bg-slate-50 border-border-soft opacity-70' : 'bg-white border-border-soft shadow-sm hover:shadow-md'}`}>
                      <button onClick={() => toggleComplete(q.id)} className="shrink-0 mt-1 print:hidden">
                        {q.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 hover:text-electric transition" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityColor(q.priority)}`}>
                            {getPriorityIcon(q.priority)} {q.priority} Priority
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                            {q.topic}
                          </span>
                          {q.frequency > 1 && (
                            <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              Repeated {q.frequency}x
                            </span>
                          )}
                        </div>
                        <p className={`text-base font-medium ${q.completed ? 'text-slate-500 line-through' : 'text-navy'}`}>
                          {q.question}
                        </p>
                        {q.modelAnswer && (
                          <div className={`mt-3 p-3 rounded-lg text-sm border ${q.completed ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-50 border-border-soft text-ink'}`}>
                            <span className="font-bold flex items-center gap-1 mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-royal" /> Model Answer
                            </span>
                            {q.modelAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:hidden { display: none !important; }
          .print\\:block { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
    </div>
  );
}
