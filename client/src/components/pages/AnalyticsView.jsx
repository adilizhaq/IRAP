import React, { useState, useEffect } from 'react';
import { 
  History, Clock, Target, Eye, 
  MousePointerClick, Heart, Bookmark, ThumbsDown, ScanFace, FileText, CheckCircle2, Activity 
} from 'lucide-react';

// --- HISTORICAL BASELINE DATA (Human Readable) ---
const generateHistoricalData = () => {
  return [
    {
      id: "Session on Oct 12",
      status: "Archived",
      affinity: "Gaming",
      nodes: 312,
      interactions: 45,
      startTime: "Yesterday, 2:22 PM",
      duration: "3m 14s",
      events: [
        { time: "+0s", type: "system", log: "Session started. Algorithm began observing behavior." },
        { time: "+4s", type: "system", log: "Algorithm detected an early interest in Gaming." },
        { time: "+18s", type: "view", log: "You stopped scrolling to look at a Gaming post." },
        { time: "+42s", type: "click", log: "You clicked to read more about Gaming hardware." },
        { time: "+3m 14s", type: "system", log: "Session ended. Profile saved." },
      ]
    },
    {
      id: "Session on Oct 11",
      status: "Archived",
      affinity: "Programming",
      nodes: 184,
      interactions: 12,
      startTime: "Yesterday, 9:15 AM",
      duration: "1m 42s",
      events: [
        { time: "+0s", type: "system", log: "Session started. Algorithm began observing behavior." },
        { time: "+12s", type: "system", log: "Algorithm detected an early interest in Programming." },
        { time: "+45s", type: "save", log: "You saved a Programming tutorial for later." },
        { time: "+1m 42s", type: "system", log: "Session ended. Profile saved." },
      ]
    }
  ];
};

// --- TIME FORMATTER HELPER ---
const formatTime = (totalSeconds) => {
  if (!totalSeconds) return "0s";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

// --- PLAIN ENGLISH TRANSLATOR ---
const getFriendlyLogMessage = (event, categoryName) => {
  switch(event.type) {
    case 'view': return `You paused your screen on a ${categoryName} post.`;
    case 'hover': return `You hovered your mouse over a ${categoryName} post.`;
    case 'expand': return `You expanded a ${categoryName} article to read more.`;
    case 'click': return `You clicked on a ${categoryName} post.`;
    case 'like': return `You liked a post about ${categoryName}.`;
    case 'save': return `You bookmarked a ${categoryName} post for later.`;
    case 'dislike': return `You skipped or dismissed a ${categoryName} post.`;
    case 'dwell': return `You spent time reading about ${categoryName}.`;
    default: return `You interacted with ${categoryName} content.`;
  }
};

const getEventStyle = (type) => {
  switch(type) {
    case 'view': return { icon: <Eye size={14} />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
    case 'hover': return { icon: <ScanFace size={14} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    case 'expand': case 'click': return { icon: <MousePointerClick size={14} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    case 'like': return { icon: <Heart size={14} />, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' };
    case 'save': return { icon: <Bookmark size={14} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    case 'dislike': return { icon: <ThumbsDown size={14} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
    case 'system': return { icon: <CheckCircle2 size={14} />, color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700/50' };
    default: return { icon: <FileText size={14} />, color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700/50' };
  }
};

export default function AnalyticsView({ sessionData }) {
  const [sessions, setSessions] = useState(generateHistoricalData());
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0].id);

  // --- 🧠 INJECT THE REAL SANDBOX DATA ---
  useEffect(() => {
    if (sessionData && sessionData.events && sessionData.events.length > 0) {
      
      const signals = sessionData.signals || {};
      const scores = sessionData.interestScores || {};
      const activeTime = sessionData.activeTime || 0;
      const interactions = (signals.totalLikes || 0) + (signals.totalSaves || 0) + (signals.totalExpands || 0) + (signals.totalDislikes || 0);

      // Find Dominant Affinity
      let dominantTag = "Still Analyzing...";
      if (Object.keys(scores).length > 0) {
        const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        if (scores[topCategory] > 0) {
          dominantTag = topCategory.charAt(0).toUpperCase() + topCategory.slice(1).replace('_', ' ');
        }
      }

      // Rebuild Real Events into a "Human" format
      const formattedEvents = [];
      formattedEvents.push({ time: "0s", type: "system", log: "Session started. The algorithm is now tracking your behavior." });

      // Convert actual interaction objects into plain english
      sessionData.events.forEach((ev) => {
        // Filter out the 100ms dwell events so the timeline isn't spammed
        if (ev.type === 'dwell') return; 

        const timeStr = `${Math.floor(ev.sessionTime || 0)}s`;
        const categoryName = ev.category 
          ? ev.category.charAt(0).toUpperCase() + ev.category.slice(1).replace('_', ' ') 
          : "content";

        formattedEvents.push({
          id: ev.id,
          time: timeStr,
          type: ev.type,
          log: getFriendlyLogMessage(ev, categoryName)
        });
      });

      formattedEvents.push({ time: `${activeTime}s`, type: "system", log: `Algorithm concluded you are highly interested in: ${dominantTag}.` });

      // Construct the Final Live Session Object
      const realSandboxSession = {
        id: "Current Session",
        status: "Live Data", 
        affinity: dominantTag,
        nodes: signals.totalEvents || 0,
        interactions: interactions,
        startTime: "Just Now",
        duration: formatTime(activeTime),
        events: formattedEvents
      };

      setSessions(prev => {
        if (prev.find(s => s.id === realSandboxSession.id)) return prev; 
        return [realSandboxSession, ...prev];
      });
      setSelectedSessionId(realSandboxSession.id);
    }
  }, [sessionData]);

  const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  return (
    <>
      <style>{`
        @keyframes view-zoom-blur {
          0% { opacity: 0; transform: scale(0.98) translateY(10px); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        .animate-view-enter {
          animation: view-zoom-blur 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .clean-scroll::-webkit-scrollbar { width: 6px; }
        .clean-scroll::-webkit-scrollbar-track { background: transparent; }
        .clean-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto h-full flex flex-col pt-10">
        <div className="animate-view-enter flex flex-col flex-1 bg-[#0c0a18] border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden relative group min-h-0">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

          {/* --- HEADER --- */}
          <div className="shrink-0 bg-[#0c0a18]/90 backdrop-blur-xl border-b border-slate-800/60 p-5 md:p-6 z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] shrink-0">
                <History size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-white tracking-wide">Behavioral Timeline</h2>
                <p className="text-[13px] text-slate-400 mt-0.5 font-medium">A step-by-step breakdown of how the algorithm interpreted your actions.</p>
              </div>
            </div>
          </div>

          {/* --- DUAL PANE BODY --- */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            
            {/* LEFT PANE: History List */}
            <div className="w-full md:w-[320px] shrink-0 border-r border-slate-800/60 bg-[#070611] flex flex-col h-[35vh] md:h-full overflow-y-auto clean-scroll">
              <div className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 sticky top-0 bg-[#070611]/95 backdrop-blur z-10 flex items-center gap-2">
                Session History
              </div>
              
              <div className="p-3 flex flex-col gap-2">
                {sessions.map((session) => (
                  <button 
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-start gap-3 ${
                      selectedSessionId === session.id 
                        ? 'bg-blue-900/20 border border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                        : 'border border-slate-800/40 hover:bg-slate-800/40 hover:border-slate-700/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[14px] font-bold tracking-tight truncate ${selectedSessionId === session.id ? 'text-blue-400' : 'text-slate-200'}`}>
                          {session.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${
                          session.status === 'Live Data' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-[11px] text-slate-500">{session.startTime}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT PANE: Human-Readable Timeline */}
            {activeSession && (
              <div className="flex-1 flex flex-col bg-[#040308] relative min-h-0">
                
                {/* Clean Header Stats */}
                <div className="shrink-0 p-5 md:p-6 border-b border-slate-800/60 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#080614]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><Target size={12}/> Predicted Interest</span>
                    <span className="text-[15px] font-bold text-slate-200">{activeSession.affinity}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><Activity size={12}/> Data Points</span>
                    <span className="text-[15px] font-medium text-slate-200">{activeSession.nodes} captured</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><MousePointerClick size={12}/> Actions Taken</span>
                    <span className="text-[15px] font-medium text-slate-200">{activeSession.interactions} actions</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><Clock size={12}/> Time Tracked</span>
                    <span className="text-[15px] font-medium text-slate-200">{activeSession.duration}</span>
                  </div>
                </div>

                {/* Event Stream */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto clean-scroll flex flex-col bg-[#0c0a18]">
                  <div className="flex flex-col max-w-[800px] ml-4 md:ml-12 border-l border-slate-800/80">
                    {activeSession.events.map((ev, idx) => {
                      const style = getEventStyle(ev.type);
                      const isSystem = ev.type === 'system';
                      
                      return (
                        <div key={ev.id || idx} className="relative pl-8 pb-8 group">
                          
                          {/* Timeline Node */}
                          <div className={`absolute -left-[14px] top-0 w-7 h-7 rounded-full flex items-center justify-center border bg-[#0c0a18] shadow-sm transition-transform duration-300 group-hover:scale-110 ${style.color} ${style.bg}`}>
                            {style.icon}
                          </div>
                          
                          {/* Content */}
                          <div className="flex flex-col gap-1.5 -mt-1">
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              At {ev.time}
                            </span>
                            <div className={`text-[15px] leading-relaxed ${isSystem ? 'text-slate-400 font-medium italic' : 'text-slate-200'}`}>
                              {ev.log}
                            </div>
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}