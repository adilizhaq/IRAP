import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Eye, Activity, MousePointerClick, Bookmark, 
  ChevronDown, ListPlus, Heart, ThumbsDown, ScanFace 
} from 'lucide-react';

export default function LiveActivityStream({ sessionData }) {
  
  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the box is visible
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Parse and translate the raw logs into human-readable actions
  const formattedLogs = useMemo(() => {
    // 🧠 1. EXTRACT REAL EVENTS (Filter out the 100ms dwell spam!)
    const rawEvents = sessionData?.events 
      ? sessionData.events.filter(e => e.type !== 'dwell')
      : [];

    const isWaiting = rawEvents.length === 0;

    // 2. STANDBY FALLBACK DATA
    if (isWaiting) {
      return Array(5).fill(null).map((_, index) => ({
        id: `standby-${index}`,
        action: "Scanning...",
        detail: "Awaiting telemetry node sync",
        time: "--:--:--",
        icon: <Activity size={14} />,
        isHighlight: false,
        colorTheme: "text-slate-500 bg-slate-800/30 shadow-none"
      }));
    }

    // 3. MAP REAL EVENTS (Reverse so newest is at the top)
    return rawEvents.reverse().slice(0, 50).map((eventData) => {
      // Use the actual timestamp from the Sandbox event!
      const d = new Date(eventData.timestamp);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Clean category name
      const categoryName = eventData.category 
        ? eventData.category.charAt(0).toUpperCase() + eventData.category.slice(1).replace('_', ' ') 
        : "Content";

      let action = "Activity Logged";
      let detail = "System interaction recorded";
      let icon = <ChevronDown size={14} />;
      let isHighlight = true;
      let colorTheme = "text-slate-400 bg-slate-800/50 shadow-none";
      let scoreStr = "";

      // 🧠 Map the exact event types from your TelemetryContext
      switch(eventData.type) {
        case 'view':
          action = "Visual Fixation";
          scoreStr = " (+1 pts)";
          detail = `Paused on ${categoryName}${scoreStr}`;
          icon = <Eye size={14} />;
          colorTheme = "text-purple-400 bg-purple-500/10 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]";
          break;
        case 'hover':
          action = "Intent to Engage";
          scoreStr = " (+2 pts)";
          detail = `Hovered on ${categoryName}${scoreStr}`;
          icon = <ScanFace size={14} />;
          colorTheme = "text-cyan-400 bg-cyan-500/10 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]";
          break;
        case 'expand': // Matches your Sandbox "read more" logic
          action = "Content Expansion";
          scoreStr = " (+5 pts)";
          detail = `Reading deeper into ${categoryName}${scoreStr}`;
          icon = <ListPlus size={14} />;
          colorTheme = "text-blue-400 bg-blue-500/10 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]";
          break;
        case 'like':
          action = "Positive Affinity";
          scoreStr = " (+10 pts)";
          detail = `Liked ${categoryName} content${scoreStr}`;
          icon = <Heart size={14} />;
          colorTheme = "text-pink-400 bg-pink-500/10 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]";
          break;
        case 'save':
          action = "High-Value Storage";
          scoreStr = " (+15 pts)";
          detail = `Bookmarked ${categoryName} for later${scoreStr}`;
          icon = <Bookmark size={14} />;
          colorTheme = "text-emerald-400 bg-emerald-500/10 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]";
          break;
        case 'dislike':
          action = "Negative Affinity";
          scoreStr = " (-10 pts)";
          detail = `Dismissed ${categoryName} content${scoreStr}`;
          icon = <ThumbsDown size={14} />;
          colorTheme = "text-red-400 bg-red-500/10 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]";
          break;
        case 'click':
          action = "Direct Interaction";
          scoreStr = " (+5 pts)";
          detail = `Clicked content about ${categoryName}${scoreStr}`;
          icon = <MousePointerClick size={14} />;
          colorTheme = "text-blue-400 bg-blue-500/10 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]";
          break;
        default:
          isHighlight = false;
          action = "System Event";
          detail = `Logged ${categoryName} interaction`;
          break;
      }

      return { id: eventData.id || `event-${eventData.timestamp}`, action, detail, time: timeStr, icon, isHighlight, colorTheme };
    });
  }, [sessionData]);

  const hasData = sessionData?.events && sessionData.events.length > 0;

  return (
    <>
      <style>{`
        /* 1. The Breathing 3D Shadow */
        @keyframes hyper-breathe {
          0%, 100% { box-shadow: 0 10px 30px -10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(30,41,59,0.4); }
          50% { box-shadow: 0 10px 40px -5px rgba(59,130,246,0.15), inset 0 0 0 1px rgba(59,130,246,0.3); transform: translateY(-1px); }
        }
        
        /* 2. The Glass Glare Reflection */
        @keyframes glass-glare {
          0% { transform: translateX(-150%) rotate(-45deg); }
          20%, 100% { transform: translateX(300%) rotate(-45deg); }
        }

        .animate-hyper-box {
          animation: hyper-breathe 4s ease-in-out infinite;
        }
        .animate-glare {
          animation: glass-glare 6s ease-in-out infinite;
        }

        /* 3. Invisible Scrollbar for a seamless packed look */
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- REVEAL ANIMATION WRAPPER --- */}
      <div 
        ref={cardRef}
        className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
      >
        {/* OUTER WRAPPER: Handles the Hyper-Realistic animations */}
        <div className="h-full w-full rounded-2xl animate-hyper-box relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-[1px]">
          
          {/* The Sweeping Light Glare */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20 mix-blend-overlay">
            <div className="absolute top-0 -left-[100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glare" />
          </div>

          {/* INNER CONTENT BOX: Solid and perfectly rigid */}
          <div className="bg-[#0c0a18] w-full h-full rounded-[15px] p-5 flex flex-col relative z-10">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
                <ListPlus size={15} className="text-blue-400" />
                Recent Actions
              </h3>
              
              {/* Dynamic Status Badge */}
              {hasData ? (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">CAPTURED</span>
                 </div>
              ) : (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                   <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">WAITING</span>
                 </div>
              )}
            </div>

            {/* Packed List Area */}
            <div className="flex-1 overflow-y-auto hide-scroll flex flex-col gap-2.5 relative">
              
              {/* Fade overlay for the top/bottom so scrolling looks clean */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0c0a18] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#0c0a18] to-transparent z-10 pointer-events-none" />

              {formattedLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl bg-[#110e24] border transition-colors shrink-0 ${
                    log.isHighlight ? 'border-slate-700 hover:border-slate-500' : 'border-slate-800/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Icon Block */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.colorTheme}`}>
                    {log.icon}
                  </div>

                  {/* Text Block */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-200 truncate">
                      {log.action}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {log.detail}
                    </p>
                  </div>

                  {/* Time Block */}
                  <div className="text-[9px] text-slate-600 font-mono whitespace-nowrap pt-1">
                    {log.time}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}