import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Fingerprint, MapPin, Target, Activity, 
  Network, Database, MonitorSmartphone, Clock, 
  Cpu, AlertTriangle, User, Tag, Zap, Shield,
  Eye, MousePointerClick
} from 'lucide-react';

export default function DigitalProfileView({ sessionData, onNavigate }) {
  const [isCompiling, setIsCompiling] = useState(true);

  // Simulate heavy algorithmic processing for dramatic effect
  useEffect(() => {
    const timer = setTimeout(() => setIsCompiling(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Safe extraction of telemetry data
  const signals = sessionData?.signals || {};
  const activeTime = sessionData?.activeTime || 0;
  const interestScores = sessionData?.interestScores || {};
  
  // Sort interests to find top affinities
  const topInterests = Object.entries(interestScores).sort(([, a], [, b]) => b - a);
  const primaryInterest = topInterests[0] ? topInterests[0][0] : 'General';
  const secondaryInterest = topInterests[1] ? topInterests[1][0] : 'Media';
  
  const totalInteractions = (signals.totalLikes || 0) + (signals.totalSaves || 0) + (signals.totalExpands || 0);
  const totalViews = signals.totalEvents || 0;
  
  // Mathematical confidence score based on how much data we collected
  const confidenceScore = Math.min(99.4, 45 + (activeTime * 0.4) + (totalInteractions * 2.5)).toFixed(1);

  // Dynamic Archetype generation
  let archetype = "Passive Observer";
  if (totalInteractions >= 5 && activeTime > 60) archetype = "Deep-Dive Researcher";
  else if (totalInteractions >= 3) archetype = "Active Curator";
  else if (totalViews > 15 && activeTime < 45) archetype = "Rapid Scanner";
  else if (activeTime > 45) archetype = "Methodical Consumer";

  const formatCategory = (cat) => cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ');

  return (
      <div className="min-h-full w-full flex flex-col animate-in fade-in zoom-in-95 duration-700 p-4 md:p-6 lg:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="w-10 h-10 bg-[#0c0a18] border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 transition-colors shadow-lg shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <Fingerprint className="text-purple-500" size={28} />
                  Digital Identity Dossier
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-1">Compiled from subconscious telemetry data.</p>
              </div>
            </div>
            
            {/* Live Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-bold tracking-widest uppercase">Profile Finalized</span>
            </div>
          </div>

          {/* Loading / Compiling State */}
          {isCompiling ? (
            <div className="flex-1 flex flex-col items-center justify-center h-[60vh]">
               <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-2 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-2 border-4 border-t-transparent border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint size={32} className="text-slate-600 animate-pulse" />
                  </div>
               </div>
               <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase animate-pulse">Extracting Persona</h2>
               <p className="text-slate-500 font-mono text-sm">Cross-referencing behavioral nodes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* COLUMN 1: IDENTITY FINGERPRINT */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="bg-[#0c0a18] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="absolute top-4 right-4 text-[8px] text-slate-700 font-mono text-right opacity-50">
                       SYS.REQ: {Math.random().toString(36).substring(2, 8).toUpperCase()}<br/>
                       MEM.ALLOC: 0x00F8A
                    </div>
                    
                    <h3 className="text-slate-400 text-[11px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                      <User className="text-purple-400" size={14} />
                      Extracted Identity
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <User size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demographic Cohort</p>
                          <p className="text-slate-200 font-medium text-sm mt-0.5">Male, 18-28 Age Range</p>
                          <p className="text-[10px] text-emerald-400 mt-1">94.2% Confidence</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                          <MapPin size={18} className="text-rose-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Geospatial Origin</p>
                          <p className="text-slate-200 font-medium text-sm mt-0.5">Kerala Region (IST)</p>
                          <p className="text-[10px] text-slate-400 mt-1">IP & Timezone Mapping</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <MonitorSmartphone size={18} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hardware Signature</p>
                          <p className="text-slate-200 font-medium text-sm mt-0.5">Desktop / WebKit API</p>
                          <p className="text-[10px] text-slate-400 mt-1">Input Velocity & DPI Sync</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMNS 2 & 3: PSYCHOGRAPHIC MAPPING */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-[#0c0a18] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl h-full flex flex-col">
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h3 className="text-slate-400 text-[11px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Target className="text-cyan-400" size={14} />
                      Psychographic & Ad-Targeting Profile
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {/* Archetype Box */}
                      <div className="bg-[#131027] border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-colors relative z-10">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Behavioral Archetype</p>
                        <p className="text-cyan-400 font-black text-xl mb-3">{archetype}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          User displays high propensity for <strong className="text-slate-200">{formatCategory(primaryInterest)}</strong> content, characterized by <strong className="text-slate-200">{activeTime > 60 ? 'prolonged dwell times' : 'rapid context switching'}</strong> and <strong className="text-slate-200">{totalInteractions >= 3 ? 'frequent micro-interactions' : 'passive consumption'}</strong>.
                        </p>
                      </div>
                      
                      {/* Economic Value Box */}
                      <div className="bg-[#131027] border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-colors relative z-10">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Estimated Ad Value</p>
                        <p className="text-emerald-400 font-black text-xl mb-3">High-Tier CPM</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Prime target for premium <strong className="text-slate-200">{formatCategory(primaryInterest)}</strong> and <strong className="text-slate-200">{formatCategory(secondaryInterest)}</strong> advertisers due to demonstrated focus and deep engagement patterns.
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">Extracted Interest Vectors</p>
                    <div className="space-y-3 flex-1">
                      {topInterests.length > 0 ? topInterests.slice(0, 4).map(([interest, score], idx) => (
                        <div key={interest} className="flex items-center gap-4 bg-[#131027] border border-slate-800/80 rounded-lg p-3.5 group hover:border-slate-600 transition-colors relative z-10">
                          <div className={`text-sm font-black w-6 text-center ${idx === 0 ? 'text-purple-400' : idx === 1 ? 'text-blue-400' : 'text-slate-500'}`}>
                            0{idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-slate-200 capitalize">{formatCategory(interest)}</span>
                              <span className="text-xs font-mono text-slate-400">{score.toFixed(1)} pts</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-gradient-to-r from-purple-600 to-purple-400' : idx === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-slate-600'}`} 
                                style={{ width: `${Math.min(100, (score / (topInterests[0]?.[1] || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center p-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                          Insufficient data to extract interest vectors.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COLUMN 4: TELEMETRY & CONFIDENCE */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="bg-[#0c0a18] border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    
                    <h3 className="text-slate-400 text-[11px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Network className="text-rose-400" size={14} />
                      Data Acquisition
                    </h3>
                    
                    <div className="space-y-4 mb-8 relative z-10">
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                        <span className="text-xs text-slate-500 flex items-center gap-2"><Eye size={14}/> Nodes Captured</span>
                        <span className="text-sm font-mono text-slate-300 font-bold">{totalViews}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                        <span className="text-xs text-slate-500 flex items-center gap-2"><Clock size={14}/> Tracking Time</span>
                        <span className="text-sm font-mono text-slate-300 font-bold">{Math.floor(activeTime / 60)}m {activeTime % 60}s</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                        <span className="text-xs text-slate-500 flex items-center gap-2"><MousePointerClick size={14}/> Micro-Actions</span>
                        <span className="text-sm font-mono text-slate-300 font-bold">{totalInteractions}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                        <span className="text-xs text-slate-500 flex items-center gap-2"><Activity size={14}/> Scroll Velocity</span>
                        <span className="text-sm font-mono text-slate-300 font-bold">{totalViews > 0 ? Math.floor(totalViews * 1.5) : 0} px/s</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Confidence</span>
                        <span className="text-lg font-mono text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                          {confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                          <h4 className="text-rose-400 text-[11px] font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <AlertTriangle size={14} />
                            Shadow Profile Active
                          </h4>
                          <p className="text-[11px] text-rose-400/70 leading-relaxed">
                            This digital shadow has been compiled purely from your subconscious interactions. No forms were filled. No explicit preferences were given.
                          </p>
                        </div>
                    </div>
                  </div>
                </div>

            </div>
          )}
      </div>
  );
}