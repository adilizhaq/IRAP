import React from "react";
import { ShieldCheck } from "lucide-react";

// WIRING UPDATE: Added onResetData to the props
export default function SidebarNav({ currentView, onViewChange, isCollapsed, mainNav, bottomNav, onResetData }) {
  
  const renderNavLink = (item) => {
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        title={isCollapsed ? item.label : ""}
        className={`flex items-center h-10 rounded-xl text-[12px] font-medium transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group relative overflow-hidden ${
          isCollapsed ? "justify-center w-10 mx-auto px-0" : "w-full justify-start px-3.5"
        } ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-bold"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
        }`}
      >
        <div className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-purple-400 transition-colors"} shrink-0 flex items-center justify-center w-5 h-5`}>
          {item.icon}
        </div>
        
        <span className={`tracking-wide whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[140px] opacity-100 ml-3"
        }`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col justify-between flex-1 mt-6">
      
      {/* SAFETY UPDATE: Array.isArray() prevents mapping crashes if props fail to load */}
      <nav className="flex flex-col gap-1">
        {Array.isArray(mainNav) && mainNav.map(renderNavLink)}
      </nav>

      <div className="flex flex-col gap-3 mt-auto">
        <nav className="flex flex-col gap-1 border-b border-slate-800/40 pb-3">
          {Array.isArray(bottomNav) && bottomNav.map(renderNavLink)}
        </nav>

        {/* SECURITY WIDGET */}
        <div className={`relative mx-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 ${
          isCollapsed ? "w-10 h-10 rounded-full cursor-help shadow-[0_0_8px_rgba(59,130,246,0.15)]" : "w-full h-[146px] rounded-xl"
        }`}>
          
          <div className={`absolute inset-0 bg-gradient-to-b from-purple-950/10 to-indigo-950/20 border border-purple-900/30 rounded-xl transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-full transition-opacity duration-500 ${isCollapsed ? 'opacity-100' : 'opacity-0'}`} />

          {/* Expanded State Content */}
          <div className={`absolute inset-0 flex flex-col items-center p-3.5 transition-all duration-500 ${isCollapsed ? 'scale-75 opacity-0 pointer-events-none' : 'scale-100 opacity-100 delay-100'}`}>
            <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
              <ShieldCheck size={14} />
            </div>
            <h4 className="text-[11px] font-bold text-white whitespace-nowrap mt-2">You are in Control</h4>
            <p className="text-[9px] text-slate-400 leading-normal px-1 text-center mt-1 w-full whitespace-normal">
              This is a simulation. Data is not shared with any third parties.
            </p>
            
            {/* WIRING UPDATE: Added onClick={onResetData} to trigger the safe reset */}
            <button 
              onClick={onResetData}
              className="w-full mt-2 py-1.5 border border-red-500/30 hover:border-red-500/60 text-red-400 rounded-lg text-[10px] font-bold bg-red-500/5 hover:bg-red-500/10 transition-colors whitespace-nowrap"
            >
              Clear My Data
            </button>
          </div>

          {/* Collapsed State Icon */}
          <div 
            className={`absolute inset-0 flex items-center justify-center text-blue-400 transition-all duration-500 ${isCollapsed ? 'scale-100 opacity-100 delay-100' : 'scale-150 opacity-0 pointer-events-none'}`} 
            title="Simulation Active. Data is securely local."
          >
            <ShieldCheck size={18} />
          </div>

        </div>

      </div>
    </div>
  );
}