import React from 'react';
import { PlayCircle, Bookmark, ThumbsDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

const getColorClasses = (colorName) => {
  const maps = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]",
    green: "text-green-400 bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
    fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
  };
  return maps[colorName] || maps.purple;
};

const getMatchBadge = (score) => {
  if (score >= 90) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 75) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-blue-400 bg-blue-500/10 border-blue-500/20";
};

export default function RecommendationCard({ item, index }) {
  return (
    <div 
      className="group bg-[#080614] border border-slate-800/60 hover:border-slate-600/80 rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-bottom-8"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      
      {/* Left Thumbnail Area */}
      <div className="w-full sm:w-[220px] h-[180px] sm:h-auto shrink-0 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080614] via-transparent to-transparent z-10 sm:bg-gradient-to-r" />
        <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
        
        {/* Category Badge overlaying image */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border backdrop-blur-md ${getColorClasses(item.color)}`}>
            {item.icon}
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            {item.type}
          </span>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col relative">
        
        {/* Match Score */}
        <div className="flex justify-between items-start mb-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black tracking-widest shadow-sm ${getMatchBadge(item.matchScore)}`}>
            <CheckCircle2 size={12} />
            {item.matchScore}% MATCH
          </div>
        </div>

        <h2 className="text-lg font-black text-slate-100 leading-tight mb-2 group-hover:text-white transition-colors line-clamp-2">
          {item.title}
        </h2>
        <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 mb-6">
          {item.desc}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          
          {/* THE TRANSPARENCY ENGINE BOX */}
          <div className="bg-[#040308] border border-slate-800/80 rounded-xl p-3 flex items-start gap-3">
            <ShieldCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Algorithm Logic</p>
              <p className="text-[11px] text-slate-300 font-medium">
                {item.reason}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 bg-slate-100 hover:bg-white text-slate-900 text-[12px] font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95">
              <PlayCircle size={16} /> Open
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 flex items-center justify-center transition-all active:scale-95">
              <Bookmark size={16} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 flex items-center justify-center transition-all active:scale-95">
              <ThumbsDown size={16} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}