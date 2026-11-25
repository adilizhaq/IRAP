import React, { useState } from "react";
import { 
  LayoutDashboard, Activity, BarChart3, UserCheck, 
  Sparkles, Sliders, Settings, HelpCircle, ChevronLeft,
  Smartphone 
} from "lucide-react";

import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";

// 🧠 PROPS UPDATE: Added `onResetData` to the parameters
export default function Sidebar({ currentView, onNavigate, onResetData }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // --- CORE NAVIGATION ---
  const mainNav = [
    { id: "sandbox", label: "Content Sandbox", icon: <Smartphone size={18} /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "livestream", label: "Live Activity", icon: <Activity size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    
    // Future Expansion Links
    { id: "deepdive", label: "Behavior Profile", icon: <UserCheck size={18} /> },
    { id: "recommendations", label: "Recommendations", icon: <Sparkles size={18} /> },
    { id: "digital-profile", label: "Digital Profile", icon: <Sliders size={18} /> },
  ];

  // Short labels so all 7 destinations fit in the phone tab bar
  const shortLabel = {
    sandbox: "Sandbox", dashboard: "Dashboard", livestream: "Live", analytics: "Analytics",
    deepdive: "Behavior", recommendations: "For You", "digital-profile": "Profile",
  };

  const bottomNav = [
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "about", label: "About IRAP", icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      <style>{`
        @keyframes sidebar-motion-blur {
          0% { opacity: 0; transform: translateX(-50px); filter: blur(8px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0px); }
        }
        .animate-sidebar-enter {
          animation: sidebar-motion-blur 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Main Sidebar Container */}
      <div 
        className={`hidden md:block animate-sidebar-enter h-screen shrink-0 bg-[#0c0a18] border-r border-slate-800/60 select-none relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${
          isCollapsed ? "w-20" : "w-60"
        }`}
      >
        {/* Floating Toggle Border Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-8 w-7 h-7 bg-[#131027] border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all z-50 cursor-pointer"
        >
          <ChevronLeft size={16} className={`transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        {/* Internal Invisible Scroll Container */}
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col min-h-full p-4 pb-8">
            
            <SidebarLogo isCollapsed={isCollapsed} />
            
            {/* 🧠 WIRING UPDATE: Passing `onResetData` down to the Nav! */}
            <SidebarNav 
              currentView={currentView} 
              onViewChange={onNavigate} 
              isCollapsed={isCollapsed}
              mainNav={mainNav}
              bottomNav={bottomNav}
              onResetData={onResetData} 
            />
            
          </div>
        </div>
      </div>

      {/* Phone navigation: bottom tab bar (the side rail is hidden below md) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0c0a18]/95 backdrop-blur-xl border-t border-slate-800/60 flex px-1 pt-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {mainNav.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 min-h-[48px] rounded-xl transition-colors ${
                isActive ? "text-white bg-gradient-to-b from-blue-600/80 to-purple-600/80" : "text-slate-400 active:text-slate-200"
              }`}
            >
              {item.icon}
              <span className="text-[9.5px] font-semibold leading-none truncate max-w-full">{shortLabel[item.id] || item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}