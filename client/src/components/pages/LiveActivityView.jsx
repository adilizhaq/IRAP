import React, { useState, useMemo } from 'react';
import {
  MousePointerClick,
  PauseCircle,
  Search,
  Filter,
  Clock3,
  Move,
  Database,
  Terminal,
  Crosshair,
  Bookmark,
  Eye,
  ActivitySquare,
  ThumbsDown,
  Heart
} from 'lucide-react';

// --- TIME FORMATTER HELPER ---
const formatTime = (totalSeconds) => {
  if (!totalSeconds) return "0s";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export default function LiveActivityView({ sessionData }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- 🧠 TELEMETRY PARSER ENGINE ---
  const activities = useMemo(() => {
    if (!sessionData || !sessionData.events) return [];

    const rawEvents = sessionData.events;
    const formatted = [];

    // 1. Initial System Boot Event
    formatted.push({
      id: 'sys-start',
      time: '0.0s',
      action: 'Engine Initialization',
      target: 'Telemetry sensors online.',
      category: 'SYSTEM',
      icon: <Terminal size={14} />,
      theme: 'text-slate-400 bg-slate-800/30 border-slate-700/50'
    });

    // 2. Map actual interactions
    rawEvents.forEach((ev, idx) => {
      // Heavily sample dwell events so the feed isn't flooded with 100ms ticks
      if (ev.type === 'dwell' && idx % 10 !== 0) return; 

      const timeStr = `${(ev.sessionTime || 0).toFixed(1)}s`;
      const catUpper = ev.category ? ev.category.toUpperCase().replace('_', ' ') : 'UNKNOWN';

      let action = 'Interaction';
      let target = `Node Asset: [${catUpper}]`;
      let icon = <MousePointerClick size={14} />;
      let theme = 'text-slate-400 bg-slate-800/30 border-slate-700/50';

      // Map event types to specific icons and colors
      switch (ev.type) {
        case 'view':
          action = 'Visual Fixation'; icon = <Eye size={14} />; theme = 'text-purple-400 bg-purple-500/10 border-purple-500/30'; break;
        case 'hover':
          action = 'Intent to Engage'; icon = <Crosshair size={14} />; theme = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'; break;
        case 'expand':
        case 'click':
          action = 'Content Expansion'; icon = <MousePointerClick size={14} />; theme = 'text-blue-400 bg-blue-500/10 border-blue-500/30'; break;
        case 'like':
          action = 'Positive Affinity'; icon = <Heart size={14} />; theme = 'text-pink-400 bg-pink-500/10 border-pink-500/30'; break;
        case 'save':
          action = 'Profile Bookmark'; icon = <Bookmark size={14} />; theme = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'; break;
        case 'dislike':
          action = 'Negative Affinity'; icon = <ThumbsDown size={14} />; theme = 'text-red-400 bg-red-500/10 border-red-500/30'; break;
        case 'dwell':
          action = 'Sustained Attention'; icon = <Clock3 size={14} />; theme = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
          target = `Duration Logged on [${catUpper}]`;
          break;
        default:
          break;
      }

      formatted.push({
        id: ev.id || `evt-${idx}`,
        time: timeStr,
        action, target, category: catUpper, icon, theme
      });
    });

    // 3. Final System Shut-off Event
    if (sessionData.activeTime > 0) {
       formatted.push({
          id: 'sys-end',
          time: `${sessionData.activeTime.toFixed(1)}s`,
          action: 'Session Terminated',
          target: 'Telemetry lock disengaged.',
          category: 'SYSTEM',
          icon: <PauseCircle size={14} />,
          theme: 'text-slate-400 bg-slate-800/30 border-slate-700/50'
       });
    }

    return formatted.reverse(); // Reverse so newest logs are at the top
  }, [sessionData]);

  // --- DYNAMIC FILTERS ---
  const filters = useMemo(() => {
    // Automatically generate filter tabs based on the categories present in the session
    const cats = Array.from(new Set(activities.map(a => a.category)));
    // Put "All" and "SYSTEM" first
    return ['All', 'SYSTEM', ...cats.filter(c => c !== 'SYSTEM')];
  }, [activities]);

  // --- FILTERING & SEARCHING ENGINE ---
  const filteredActivities = activities.filter(a => {
    const matchesFilter = activeFilter === 'All' || a.category === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          a.action.toLowerCase().includes(searchLower) || 
                          a.target.toLowerCase().includes(searchLower) ||
                          a.category.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  // --- 🧠 EXTRACT LIVE METRICS ---
  const isWaiting = !sessionData || !sessionData.events || sessionData.events.length === 0;
  const signals = sessionData?.signals || {};
  const activeTime = sessionData?.activeTime || 0;
  const interactions = (signals.totalLikes || 0) + (signals.totalSaves || 0) + (signals.totalExpands || 0) + (signals.totalDislikes || 0);

  // --- EMPTY STATE ---
  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 mt-20 animate-in fade-in zoom-in duration-500">
        <Database size={48} className="text-slate-700 animate-pulse mb-2" />
        <h2 className="text-xl font-bold text-slate-300">Awaiting Telemetry</h2>
        <p className="font-mono text-sm tracking-widest text-center">
          Run a Sandbox Session to populate the Live Activity feed.
        </p>
      </div>
    );
  }

  // --- POPULATED STATE ---
  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto h-full flex flex-col pt-10">
        <div className="flex flex-col flex-1 bg-[#080614] border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-0">

          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

          {/* HEADER SECTION */}
          <div className="sticky top-0 z-20 bg-[#080614]/95 backdrop-blur-xl border-b border-slate-800/60 p-6 shrink-0">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Title Block */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] shrink-0">
                  <ActivitySquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-3">
                    Raw Telemetry Stream
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LIVE</span>
                    </div>
                  </h2>
                  <p className="text-[13px] text-slate-400 mt-1">
                    Chronological breakdown of Sandbox interactions and engine state changes.
                  </p>
                </div>
              </div>

              {/* REAL METRICS */}
              <div className="flex flex-wrap gap-4 lg:gap-8 bg-[#0c0a18] border border-slate-800/80 px-6 py-3 rounded-xl shadow-inner shrink-0">
                <HeaderMetric label="Session Time" value={formatTime(activeTime)} icon={<Clock3 size={14}/>} color="text-cyan-400" />
                <HeaderMetric label="Micro-Actions" value={interactions} icon={<MousePointerClick size={14}/>} color="text-purple-400" />
                <HeaderMetric label="Telemetry Nodes" value={signals.totalEvents || 0} icon={<Database size={14}/>} color="text-emerald-400" />
                <HeaderMetric label="Items Evaluated" value={signals.totalViews || 0} icon={<Move size={14}/>} color="text-orange-400" />
              </div>

            </div>

            {/* FILTERS & SEARCH BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scroll">
                <Filter size={14} className="text-slate-500 mr-2 shrink-0" />
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest uppercase shrink-0 transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                        : 'bg-[#131027] text-slate-400 border border-slate-800/60 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* 🧠 Search is now fully functional! */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search actions, categories..."
                  className="w-full bg-[#131027] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-[12px] text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* TIMELINE LIST */}
          <div className="flex-1 overflow-y-auto p-6 relative hide-scroll z-10 bg-[#040308] min-h-0">
            <div className="flex flex-col gap-3 max-w-[1200px] mx-auto">
              
              {filteredActivities.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-mono text-sm">No telemetry logs match your search.</div>
              ) : (
                filteredActivities.map((activity, i) => (
                  <div
                    key={activity.id}
                    className="group flex items-stretch gap-4 bg-[#080614] border border-slate-800/60 hover:border-slate-600 rounded-xl p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  >
                    {/* Time Column */}
                    <div className="w-16 md:w-24 shrink-0 flex items-center justify-center border-r border-slate-800/60 pr-2 md:pr-4">
                      <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                        {activity.time}
                      </span>
                    </div>

                    {/* Icon Column */}
                    <div className="shrink-0 flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${activity.theme}`}>
                        {activity.icon}
                      </div>
                    </div>

                    {/* Data Column */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                      <div className="truncate">
                        <p className="text-[14px] font-bold text-slate-200 truncate">
                          {activity.action}
                        </p>
                        <p className="text-[12px] text-slate-500 truncate mt-0.5 font-mono">
                          <span className="text-slate-600 mr-2">TARGET:</span>{activity.target}
                        </p>
                      </div>

                      {/* Category Badge */}
                      <div className="shrink-0 mt-2 sm:mt-0">
                        <span className="inline-block px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-inner">
                          {activity.category}
                        </span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// -----------------------------
// SLEEK HEADER METRIC COMPONENT
// -----------------------------
function HeaderMetric({ label, value, icon, color }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={color}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <span className={`text-lg font-black tracking-tight ${color} leading-none`}>
        {value}
      </span>
    </div>
  );
}