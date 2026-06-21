"use client";

import { useState, useEffect, useRef } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Monitor,
  Video,
  CheckCircle2,
  Brain,
  Coffee,
  Sparkles,
} from "lucide-react";

export default function FocusRoomPage() {
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [hideComments, setHideComments] = useState(true);
  const [hideShorts, setHideShorts] = useState(true);
  const [hideRecs, setHideRecs] = useState(true);
  const [timerMode, setTimerMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");

  // Timer values in seconds: Pomodoro (25m), Short Break (5m), Long Break (15m)
  const timerSettings = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro);

  // When timer mode changes, reset timeLeft
  useEffect(() => {
    setTimeLeft(timerSettings[timerMode]);
    setFocusActive(false);
  }, [timerMode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (focusActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setFocusActive(false);
            // Play alert sound if wanted, or just reset
            return timerSettings[timerMode];
          }
          return prev - 1;
        });
        setFocusTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusActive, timerMode]);

  const formatTimeLeft = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const studyVideos = [
    { title: "Data Structures & Algorithms in 10 Hours", channel: "freeCodeCamp", duration: "10:03:27", url: "https://www.youtube.com/watch?v=8hly31x4li0" },
    { title: "Operating Systems Lecture Series", channel: "Gate Smashers", duration: "45 Lectures", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
    { title: "DBMS Complete College Syllabus", channel: "Apna College", duration: "4:12:08", url: "https://www.youtube.com/watch?v=dl00fOOYLOM" },
  ];

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <section className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-royal">
          <Brain className="w-3.5 h-3.5" />
          Focus Room · Distraction-free Study Space
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy">
          Study Focus Room
        </h1>
        <p className="text-sm text-slate-muted max-w-xl mx-auto">
          Set a Pomodoro timer, hide online distractions, and dive deep into your study sessions.
        </p>
      </section>

      {/* Focus Timer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Timer & Controls */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 md:p-8 text-center relative overflow-hidden">
            {focusActive && <div className="absolute inset-0 bg-royal/5 animate-pulse" />}
            <div className="relative z-10 space-y-6">
              {/* Mode Selectors */}
              <div className="flex justify-center gap-2">
                {([
                  { id: "pomodoro", label: "Focus Session" },
                  { id: "shortBreak", label: "Short Break" },
                  { id: "longBreak", label: "Long Break" },
                ] as const).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTimerMode(mode.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      timerMode === mode.id
                        ? "bg-royal text-white shadow-md shadow-royal/20"
                        : "bg-slate-50 text-slate-muted hover:bg-slate-100"
                    }`}
                  >
                    {mode.id === "pomodoro" ? "🎯 " : "☕ "}
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Large Timer Display */}
              <div>
                <p className="text-6xl md:text-7xl font-mono font-bold tracking-wider text-navy">
                  {formatTimeLeft(timeLeft)}
                </p>
                <p className="text-xs text-slate-muted mt-2">
                  Total Focus Registered This Session:{" "}
                  <span className="font-semibold text-royal">{formatTime(focusTime)}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setFocusActive(!focusActive)}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    focusActive
                      ? "bg-white border border-border-soft text-navy hover:bg-slate-50"
                      : "bg-royal text-white shadow-lg shadow-royal/25 hover:brightness-110"
                  }`}
                >
                  {focusActive ? (
                    <>
                      <Pause size={16} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Start Timer
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFocusActive(false);
                    setTimeLeft(timerSettings[timerMode]);
                  }}
                  className="p-3.5 rounded-xl bg-slate-50 border border-border-soft text-slate-muted hover:bg-slate-100 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {focusActive && (
                <p className="text-xs text-royal font-semibold animate-pulse">
                  ✨ Focus session active. Minimize notifications and concentrate!
                </p>
              )}
            </div>
          </div>

          {/* YouTube distraction controls */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-soft pb-3">
              <Shield size={18} className="text-royal" />
              <h3 className="font-bold text-navy text-sm">YouTube Distraction Shield</h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Hide Recommendations",
                  desc: "Blocks recommended sidebar feeds to stop impulse clicking",
                  state: hideRecs,
                  setter: setHideRecs,
                },
                {
                  label: "Hide Comments",
                  desc: "Closes the comment thread to save focus",
                  state: hideComments,
                  setter: setHideComments,
                },
                {
                  label: "Hide Shorts Tab",
                  desc: "Disables addictive infinite scroll short clips",
                  state: hideShorts,
                  setter: setHideShorts,
                },
              ].map((control) => (
                <div key={control.label} className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <p className="text-sm font-bold text-ink">{control.label}</p>
                    <p className="text-xs text-slate-muted">{control.desc}</p>
                  </div>
                  <button
                    onClick={() => control.setter(!control.state)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
                      control.state ? "bg-royal" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                        control.state ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Study Videos */}
        <div className="space-y-6">
          {/* Focus statistics */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-soft pb-3">
              <Monitor size={18} className="text-electric" />
              <h3 className="font-bold text-navy text-sm">Focus Metrics</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Sessions", val: "12", color: "text-royal" },
                { label: "Total Hours", val: "18.5h", color: "text-emerald" },
                { label: "Avg Session", val: "92m", color: "text-amber" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center border border-border-soft/40">
                  <p className={`text-lg font-extrabold ${stat.color}`}>{stat.val}</p>
                  <p className="text-[10px] text-slate-muted font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Distraction-free playlists */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-soft pb-3">
              <Video size={18} className="text-danger" />
              <h3 className="font-bold text-navy text-sm">Distraction-Free Videos</h3>
            </div>
            <div className="space-y-3">
              {studyVideos.map((video, idx) => (
                <a
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border border-border-soft bg-white hover:border-royal/40 hover:shadow-md transition group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger transition group-hover:bg-danger group-hover:text-white">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-ink truncate group-hover:text-royal transition">
                      {video.title}
                    </div>
                    <div className="text-[10px] text-slate-muted mt-0.5">
                      {video.channel} · {video.duration}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
