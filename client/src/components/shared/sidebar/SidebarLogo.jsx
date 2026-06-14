import React from "react";

export default function SidebarLogo({ isCollapsed }) {
  return (
    <div className={`flex items-center h-32 border-b border-slate-800/40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
      
      {/* PURE INLINE "i" LOGO */}
      {/* ADDED: Dynamic w-10/h-10 sizing and smooth transition properties */}
      <div className={`flex items-center justify-center relative shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-10 h-10' : 'w-20 h-20'}`}>
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md animate-pulse" />
        <svg 
          className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" 
          viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" stroke="url(#iGrad)" strokeWidth="4" strokeDasharray="40 20" strokeLinecap="round" className="origin-center animate-[spin_10s_linear_infinite]" opacity="0.6"/>
          <circle cx="50" cy="50" r="42" stroke="url(#iGrad)" strokeWidth="1" opacity="0.2"/>
          <circle cx="50" cy="32" r="8" fill="url(#iGrad)" />
          <rect x="42" y="46" width="16" height="30" rx="8" fill="url(#iGrad)" />
          <circle cx="47" cy="29" r="3" fill="#ffffff" opacity="0.6" />
          <rect x="45" y="49" width="4" height="24" rx="2" fill="#ffffff" opacity="0.3" />
        </svg>
      </div>

      {/* Liquid transition wrapper for the text */}
      <div className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-center ${
        isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'
      }`}>
        <h1 className="text-[15px] font-black tracking-widest text-white leading-none">iRAP</h1>
        <p className="text-[8px] font-bold text-slate-500 tracking-tight uppercase mt-1">Recommendation Engine</p>
      </div>

    </div>
  );
}