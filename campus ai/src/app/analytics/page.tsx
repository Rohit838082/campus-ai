import {
  BarChart3,
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Flame,
} from "lucide-react";

export default function AnalyticsPage() {
  const attendanceData = [
    { sub: "Data Structures", att: 92, color: "bg-emerald" },
    { sub: "DBMS", att: 85, color: "bg-electric" },
    { sub: "Operating Systems", att: 68, color: "bg-amber" },
    { sub: "Mathematics", att: 58, color: "bg-danger" },
    { sub: "Computer Networks", att: 78, color: "bg-royal" },
  ];

  const weekHours = [
    { day: "Mon", hours: 4.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 5.5 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 4.0 },
    { day: "Sat", hours: 6.5 },
    { day: "Sun", hours: 3.5 },
  ];
  const maxH = Math.max(...weekHours.map((w) => w.hours));

  return (
    <div className="pb-24 lg:pb-10">
      <div className="border-b border-border-soft bg-white px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-navy md:text-3xl">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-muted">
          Your learning insights for Semester 4.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-3">
          {[
            { label: "Avg attendance", value: "76%", icon: Calendar, color: "text-electric", bg: "bg-electric/10", delta: "+4%" },
            { label: "Study hours (week)", value: "29h", icon: Clock, color: "text-emerald", bg: "bg-emerald/10", delta: "+18%" },
            { label: "Doubts solved", value: "14", icon: BookOpen, color: "text-royal", bg: "bg-royal/10", delta: "+6" },
            { label: "Readiness score", value: "62%", icon: Target, color: "text-amber", bg: "bg-amber/10", delta: "+5%" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border-soft bg-white p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
                  <TrendingUp className="h-3 w-3" /> {s.delta}
                </span>
              </div>
              <div className="mt-3 text-3xl font-bold text-navy">{s.value}</div>
              <div className="text-xs text-slate-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Attendance donut-ish */}
        <div className="rounded-2xl border border-border-soft bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Attendance by subject</h2>
            <span className="text-[11px] font-semibold text-slate-muted">Min. required: 75%</span>
          </div>
          <div className="mt-5 space-y-4">
            {attendanceData.map((s) => (
              <div key={s.sub}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{s.sub}</span>
                  <span className={`text-sm font-bold ${s.att >= 75 ? "text-emerald" : "text-danger"}`}>
                    {s.att}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${s.att}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {attendanceData.some((s) => s.att < 75) && (
            <div className="mt-5 rounded-xl bg-amber/10 p-3 text-xs text-amber">
              ⚠️ <strong>Warning:</strong> 2 subjects are below 75% minimum attendance.
            </div>
          )}
        </div>

        {/* Study heatmap */}
        <div className="rounded-2xl border border-border-soft bg-white p-5">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber" />
            <h2 className="font-bold text-ink">Study heatmap</h2>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const intensity = [0, 1, 2, 3, 2, 1, 3, 0, 2, 3, 1, 2, 3, 0, 1, 2, 3, 3, 2, 1, 0, 3, 2, 1, 3, 2, 0, 1, 3, 2, 1, 3, 2, 1, 3][i];
              const colors = ["bg-slate-100", "bg-emerald/30", "bg-emerald/60", "bg-emerald"];
              return (
                <div
                  key={i}
                  className={`aspect-square rounded ${colors[intensity]}`}
                  title={`${intensity * 2} hours`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-muted">
            <span>Last 5 weeks</span>
            <div className="flex items-center gap-1">
              Less
              {["bg-slate-100", "bg-emerald/30", "bg-emerald/60", "bg-emerald"].map((c) => (
                <div key={c} className={`h-3 w-3 rounded ${c}`} />
              ))}
              More
            </div>
          </div>
        </div>

        {/* Weekly study hours bar chart */}
        <div className="rounded-2xl border border-border-soft bg-white p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-electric" />
              <h2 className="font-bold text-ink">Study hours this week</h2>
            </div>
            <span className="text-sm font-bold text-navy">29h total</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {weekHours.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-navy">{d.hours}h</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-electric to-royal"
                  style={{ height: `${(d.hours / maxH) * 100}%` }}
                />
                <span className="text-xs font-semibold text-slate-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
