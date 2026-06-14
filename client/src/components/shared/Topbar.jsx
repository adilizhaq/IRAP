import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, ChevronDown, LogOut, Settings, User, 
  History, Activity, Radio 
} from 'lucide-react';

export default function Topbar() {
  // --- DROPDOWN STATES ---
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- CLICK OUTSIDE HANDLERS ---
  const sessionRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sessionRef.current && !sessionRef.current.contains(event.target)) {
        setIsSessionOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* THE MOTION BLUR ENGINE */}
      <style>{`
        @keyframes topbar-drop-blur {
          0% { opacity: 0; transform: translateY(-30px); filter: blur(12px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        .animate-topbar-enter {
          animation: topbar-drop-blur 1.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>

      {/* FIXED WRAPPER: 
        Added w-full, max-w-[1600px] and mx-auto to perfectly align with the dashboard grid below. 
      */}
      <div className="animate-topbar-enter w-full max-w-[1600px] mx-auto flex justify-between items-end mb-1 pt-10 relative z-50">
        
        {/* LEFT: Page Title 
            FIXED: Added pl-12 (padding-left) to push it safely past the sidebar arrow 
        */}
        <div className="pl-12 md:pl-10">
          <h6 className="text-[32px] font-extrabold tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
          Live Analytics
          </h6>
        </div>
        
        {/* RIGHT: Top Right Controls 
            FIXED: Added pr-6 md:pr-10 (padding-right) to pull the elements leftward away from the screen edge
        */}
        <div className="flex items-center gap-5 pr-6 md:pr-10">
          
          {/* Theme Toggle Icon */}
          <button className="text-slate-400 hover:text-purple-400 transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:rotate-90">
            <Sun size={20} />
          </button>

          {/* --- SESSION DROPDOWN WRAPPER --- */}
          <div className="relative" ref={sessionRef}>
            {/* Main Button */}
            <button 
              onClick={() => setIsSessionOpen(!isSessionOpen)}
              className={`flex items-center gap-3 bg-[#0c0a18] border rounded-xl px-4 py-2 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSessionOpen ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-slate-700/60 hover:border-purple-500/40'
              }`}
            >
              <span className="text-[13px] font-bold text-slate-200 tracking-wide">Session 01</span>
              
              {/* Inner LIVE Badge */}
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 rounded-full bg-emerald-500 opacity-75 animate-ping"></span>
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider">LIVE</span>
              </div>

              <ChevronDown size={16} className={`text-slate-500 ml-1 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSessionOpen ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {/* Session Dropdown Window */}
            <div 
              className={`absolute right-0 top-full mt-3 w-56 bg-[#0c0a18]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] origin-top-right transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSessionOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-500/10 text-white font-medium text-[12px] transition-colors border border-purple-500/20">
                  <Radio size={14} className="text-emerald-400" />
                  Session 01 (Active)
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 font-medium text-[12px] hover:bg-slate-800/50 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <History size={14} />
                  Historical Data
                </button>
                <div className="h-[1px] bg-slate-800/60 my-1 mx-2" />
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 font-medium text-[12px] hover:bg-slate-800/50 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <Activity size={14} />
                  Manage Connections
                </button>
              </div>
            </div>
          </div>

          {/* --- PROFILE DROPDOWN WRAPPER --- */}
          <div className="relative" ref={profileRef}>
            {/* Avatar Button */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-lg shadow-purple-900/10 active:scale-95 ${
                isProfileOpen ? 'border-purple-400 scale-105' : 'border-slate-700 hover:border-purple-400/50'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </button>

            {/* Profile Dropdown Window */}
            <div 
              className={`absolute right-0 top-full mt-3 w-64 bg-[#0c0a18]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] origin-top-right transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
              }`}
            >
              {/* User Identity Header */}
              <div className="px-3 py-3 border-b border-slate-800/60 mb-2">
                <p className="text-[14px] font-bold text-white tracking-wide">Adil Izhaq</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Dashboard Administrator</p>
              </div>

              {/* Links List */}
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 font-medium text-[12px] hover:bg-slate-800/50 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <User size={14} className="text-slate-400" />
                  My Profile
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 font-medium text-[12px] hover:bg-slate-800/50 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <Settings size={14} className="text-slate-400" />
                  Account Settings
                </button>
                
                <div className="h-[1px] bg-slate-800/60 my-1 mx-2" />
                
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 font-medium text-[12px] hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:translate-x-1">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </>
  );
}