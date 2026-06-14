import React from 'react';
import { Shield, FileCode2, Radio, CheckCircle2, Cpu } from 'lucide-react';

export default function GlobalFooter() {
  return (
    // Added w-full to ensure it always tries to stretch across the container
    <footer className="w-full mt-8 border-t border-slate-800/60 pt-5 pb-3 flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10">
      
      {/* Left Side: Modern Server Node Status */}
      <div className="flex flex-wrap items-center justify-center gap-5 shrink-0">
        
        {/* Sleek Data Node Pill */}
        <div className="flex items-center gap-3 bg-[#070611] border border-slate-700/60 px-3 py-1.5 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] shrink-0">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800/50 border border-slate-600/50 shadow-inner">
             <Cpu size={10} className="text-slate-300" />
          </div>
          
          <div className="flex flex-col">
             <span className="text-[8px] text-slate-500 font-mono tracking-widest leading-none mb-0.5 whitespace-nowrap">IRAP_ENGINE</span>
             <span className="text-[10px] font-bold text-slate-200 tracking-wider leading-none whitespace-nowrap">SECURE_UPLINK</span>
          </div>

          {/* Animated Data Equalizer */}
          <div className="flex gap-[2px] ml-2 items-end h-3">
             <div className="w-[2px] bg-blue-500 rounded-t-sm animate-[pulse_1s_ease-in-out_infinite]" style={{ height: '60%' }} />
             <div className="w-[2px] bg-blue-400 rounded-t-sm animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
             <div className="w-[2px] bg-blue-600 rounded-t-sm animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '40%' }} />
             <div className="w-[2px] bg-blue-500 rounded-t-sm animate-[pulse_1.1s_ease-in-out_infinite_0.1s]" style={{ height: '80%' }} />
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2 px-2 py-1 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest whitespace-nowrap">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Right Side: Links & Versioning */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 shrink-0">
        
        {/* Nav Links */}
        <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest uppercase text-slate-500 shrink-0">
          <a href="#" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors whitespace-nowrap">
            <Shield size={10} /> Privacy
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors whitespace-nowrap">
            <FileCode2 size={10} /> API Docs
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors whitespace-nowrap">
            <Radio size={10} /> Telemetry
          </a>
        </div>

        {/* Version Info (Added whitespace-nowrap to prevent the 3-line squish!) */}
        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0">
          <p className="text-[9px] text-slate-400 font-mono mb-1 tracking-wider whitespace-nowrap">
            &copy; 2026 iRAP Analytics.
          </p>
          <p className="text-[8px] text-slate-600 font-mono tracking-widest uppercase flex items-center justify-center md:justify-end gap-1 whitespace-nowrap">
            <CheckCircle2 size={8} className="text-slate-500" />
            V. 2.4.1 (Stable)
          </p>
        </div>

      </div>
    </footer>
  );
}