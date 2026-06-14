import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Target, Database, MapPin, Crosshair, Network, Activity } from 'lucide-react';

// Fallback Standby Traits
const standbyTraits = Array(6).fill(null).map((_, i) => ({
  id: `standby-${i}`,
  icon: <Fingerprint size={10} />, 
  category: "Awaiting Data",
  text: "Scanning in progress...", 
  confidence: "--",
  source: "System Standby"
}));

export default function DigitalProfileFooter({ sessionData }) {
  const [activeScanIndex, setActiveScanIndex] = useState(0);
  const [profileTraits, setProfileTraits] = useState(standbyTraits);
  
  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  
  // 🧠 1. CHECK IF WE HAVE REAL SCORES
  const scores = sessionData?.interestScores || {};
  const hasData = Object.keys(scores).length > 0;
  const isWaiting = !hasData;

  // --- INTERSECTION OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.15 } 
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- TIME FORMATTER (Helper for Consumption Rate) ---
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "0s";
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // --- THE LIVE PROFILING ENGINE ---
  useEffect(() => {
    if (isWaiting) {
      setProfileTraits(standbyTraits);
      return;
    }

    // 🧠 2. PULL DIRECTLY FROM TELEMETRY
    const signals = sessionData.signals || {};
    const activeTime = sessionData.activeTime || 0;
    const dwell = sessionData.interestScores || {};
    
    // SAFE SORTING: Only look at categories with POSITIVE scores
    const validCategories = Object.keys(dwell)
      .filter(cat => dwell[cat] > 0)
      .sort((a, b) => dwell[b] - dwell[a]);

    // CLEAN FORMATTER: Handle abbreviations like 'ai' correctly
    const formatCategory = (cat) => {
      if (!cat) return 'General';
      if (cat.toLowerCase() === 'ai') return 'AI';
      return cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ');
    };

    const primary = formatCategory(validCategories[0]);
    const secondary = formatCategory(validCategories[1] || 'Media'); 

    // Generate the 6 highly-specific Shadow Profile nodes
    setProfileTraits([
      { 
        id: "DEMO_01",
        icon: <Fingerprint size={10} />, 
        category: "Demographic Sync",
        text: "Male, 25-Year-Old Cohort", 
        confidence: "98.4%",
        source: "Cross-Site Fingerprinting"
      },
      { 
        id: "GEO_LOC_12",
        icon: <MapPin size={10} />, 
        category: "Geospatial Nodes",
        text: "Kerala Region (Padiyam / Trivandrum)", 
        confidence: "94.2%",
        source: "IP & Cohort Mapping"
      },
      { 
        id: "AFF_PRI_01",
        icon: <Target size={10} />, 
        category: "Primary Affinity",
        text: `${primary} Focus Identified`, 
        confidence: "91.7%",
        source: "Sandbox Dwell-Time"
      },
      { 
        id: "AFF_SEC_02",
        icon: <Database size={10} />, 
        category: "Secondary Affinity",
        text: `${secondary} Content Exploration`, 
        confidence: "88.5%",
        source: "Scroll Velocity Halts"
      },
      { 
        id: "BEH_ENG_99",
        icon: <Activity size={10} />, 
        category: "Engagement Velocity",
        text: `${(signals.totalLikes || 0) + (signals.totalSaves || 0)} Micro-Interactions Logged`, 
        confidence: "100%",
        source: "Click/Hover Telemetry"
      },
      { 
        id: "BEH_SCR_44",
        icon: <Network size={10} />, 
        category: "Consumption Rate",
        text: `${signals.totalViews || 0} Nodes in ${formatTime(activeTime)}`, 
        confidence: "100%",
        source: "Session Metrics"
      }
    ]);
  }, [sessionData, isWaiting]);

  // --- SCANNING ANIMATION LOOP ---
  useEffect(() => {
    if (isWaiting) return;
    const interval = setInterval(() => {
      setActiveScanIndex((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, [isWaiting]);

  return (
    <>
      {/* Note: The entrance animation was removed, but the custom SVG 
        spinning keyframes are preserved below!
      */}
      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin { animation: reverse-spin 12s linear infinite; }
        .animate-slow-spin { animation: spin 20s linear infinite; }
        .animate-fast-spin { animation: spin 6s linear infinite; }
      `}</style>

      {/* --- REVEAL ANIMATION WRAPPER --- */}
      <div 
        ref={containerRef}
        className={`w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
      >
        <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-4 h-full flex items-center gap-5 shadow-2xl group hover:border-purple-500/40 transition-all duration-700 ease-out overflow-hidden relative">
          
          {/* Ambient Radar Glow */}
          <div className="absolute top-1/2 left-12 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-600 blur-[100px] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-1000 pointer-events-none z-0" />

          {/* LEFT SIDE: Profiling Engine Vector */}
          <div className="hidden sm:flex items-center justify-center w-20 h-20 relative shrink-0 z-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-rose-500/10 blur-md" />
            
            <svg className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="core-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isWaiting ? "#64748b" : "#3b82f6"} />
                  <stop offset="50%" stopColor={isWaiting ? "#475569" : "#8b5cf6"} />
                  <stop offset="100%" stopColor={isWaiting ? "#334155" : "#f43f5e"} />
                </linearGradient>
              </defs>
              
              {/* Targeting Reticle */}
              <g opacity="0.3">
                <line x1="50" y1="5" x2="50" y2="20" stroke="#8b5cf6" strokeWidth="1" />
                <line x1="50" y1="80" x2="50" y2="95" stroke="#8b5cf6" strokeWidth="1" />
                <line x1="5" y1="50" x2="20" y2="50" stroke="#3b82f6" strokeWidth="1" />
                <line x1="80" y1="50" x2="95" y2="50" stroke="#f43f5e" strokeWidth="1" />
              </g>

              <g className={`origin-center ${isWaiting ? 'animate-pulse' : 'animate-slow-spin'}`}>
                <circle cx="50" cy="50" r="38" stroke="url(#core-glow)" strokeWidth="1" strokeDasharray="2 6" opacity="0.5" />
                <circle cx="50" cy="50" r="34" stroke={isWaiting ? "#475569" : "#8b5cf6"} strokeWidth="0.5" strokeDasharray="40 10" opacity="0.3" />
                <circle cx="50" cy="12" r="2" fill="#fff" className="drop-shadow-[0_0_4px_#fff]" />
              </g>

              <g className={`origin-center ${isWaiting ? '' : 'animate-reverse-spin'}`}>
                <circle cx="50" cy="50" r="26" stroke="url(#core-glow)" strokeWidth="0.75" strokeDasharray="1 4" opacity="0.7" />
                <path d="M26,40 L74,60 M30,65 L70,35 M50,24 L50,76" stroke={isWaiting ? "#475569" : "#8b5cf6"} strokeWidth="0.5" opacity="0.3" />
                <circle cx="26" cy="40" r="1.5" fill={isWaiting ? "#64748b" : "#3b82f6"} />
                <circle cx="74" cy="60" r="1.5" fill={isWaiting ? "#64748b" : "#f43f5e"} />
                <circle cx="70" cy="35" r="2.5" fill="#fff" />
              </g>

              <g className={`origin-center ${isWaiting ? '' : 'animate-fast-spin'}`}>
                <circle cx="50" cy="50" r="14" stroke={isWaiting ? "#64748b" : "#3b82f6"} strokeWidth="1.5" strokeDasharray="10 5" opacity="0.6" />
              </g>

              <circle cx="50" cy="50" r="6" fill="url(#core-glow)" className={isWaiting ? "" : "animate-pulse"} opacity="0.9" />
            </svg>
          </div>

          {/* RIGHT SIDE: The Data Nodes */}
          <div className="flex-1 flex flex-col justify-between h-full min-w-0 z-10 relative">
            
            {/* Ominous Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 border-b border-slate-800/50 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-bold text-white tracking-wide flex items-center gap-1.5">
                  <Network size={14} className={isWaiting ? "text-slate-500" : "text-purple-400"} />
                  Compiled Shadow Profile
                </h3>
                
                {/* Added Sync Status Badge */}
                {isWaiting ? (
                   <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-slate-800/50 border border-slate-700/50">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                     <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">SCANNING</span>
                   </div>
                ) : (
                   <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[8px] font-bold text-emerald-400 tracking-widest uppercase">SYNCED</span>
                   </div>
                )}
              </div>
              
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest hidden md:block">
                {isWaiting ? "Awaiting Telemetry Stream" : "Telemetry Cross-Referenced"}
              </p>
            </div>

            {/* Denser, Tech-Focused Grid (Now holds 6 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1.5 flex-1 relative">
              {profileTraits.map((trait, idx) => {
                const isActive = idx === activeScanIndex && !isWaiting;

                return (
                  <div 
                    key={trait.id} 
                    className={`flex flex-col justify-center border transition-all duration-700 ease-out rounded-lg px-2 py-1 overflow-hidden relative ${
                      isActive 
                        ? 'bg-purple-950/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)] scale-[1.01]' 
                        : 'bg-[#070611]/50 border-slate-800/40 opacity-80 scale-100'
                    }`}
                  >
                    {/* Scan Line effect */}
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500 shadow-[0_0_8px_#a855f7]" />}

                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-[8px] font-mono uppercase tracking-widest flex items-center gap-1 ${isActive ? 'text-purple-400' : 'text-slate-500'}`}>
                        {trait.icon} {trait.category}
                      </span>
                      <span className={`text-[8px] font-mono ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                        CONF: {trait.confidence}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold truncate tracking-wide mb-0.5 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                      {trait.text}
                    </span>

                    <span className="text-[7px] text-slate-600 font-mono uppercase tracking-wider">
                      SRC: {trait.source}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}