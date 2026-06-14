import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, PlayCircle, ScanFace, Code, Database, Activity } from 'lucide-react';
import { BACKGROUND_VIDEOS } from '../data/contentDatabase';



// ============================================================================
// WelcomeScreen
// ----------------------------------------------------------------------------
// The cinematic entry screen shown before the sandbox session starts.
// Owns its own local state (bgIndex, welcomeBoxVisible, welcomeBoxRef) since
// these are purely presentational — nothing in useSandboxEngine needs them.
//
// Props:
//   onStart — () => void   called when the user clicks "Initialize Environment"
// ============================================================================

export default function WelcomeScreen({ onStart }) {
  // Slideshow: cycles through BACKGROUND_VIDEOS every 10 seconds
  const [bgIndex, setBgIndex] = useState(0);

  // Scroll reveal: turns true once the feature box enters the viewport
  const welcomeBoxRef = useRef(null);
  const [welcomeBoxVisible, setWelcomeBoxVisible] = useState(false);

  // --- SCROLL OBSERVER FOR WELCOME SCREEN ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWelcomeBoxVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the box is visible
    );

    if (welcomeBoxRef.current) observer.observe(welcomeBoxRef.current);
    return () => observer.disconnect();
  }, []);

  // --- TIMERS & SLIDESHOW ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(0.95); }
        }
        @keyframes sweep-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes hero-reveal {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-hero {
          animation: hero-reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* OUTER WRAPPER: Locks background in place */}
      <div className="w-full h-full bg-[#040308] relative overflow-hidden selection:bg-purple-500/30">

        {/* ====================================================== */}
        {/* OPTIMIZED DYNAMIC VIDEO SLIDESHOW BACKGROUND */}
        {/* ====================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#040308]">
          {BACKGROUND_VIDEOS.map((src, idx) => (
            <video
              key={src}
              src={src}
              muted
              loop
              playsInline
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                  if (idx === bgIndex) {
                    el.play().catch(() => {});
                  } else {
                    setTimeout(() => el.pause(), 3000);
                  }
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
                idx === bgIndex ? 'opacity-40' : 'opacity-0'
              }`}
              style={{ willChange: 'opacity' }}
            />
          ))}

          {/* Dark 3-Color Gradient Filter for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#040308]/95 via-[#1a0f3c]/80 to-[#040308]/95 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040308] via-transparent to-[#040308]/80 z-10" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] z-10" />
        </div>

        {/* Ambient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-[float-slow_8s_ease-in-out_infinite] z-0 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none animate-[float-delayed_10s_ease-in-out_infinite] z-0 mix-blend-screen" />

        {/* HUD CORNER ACCENTS */}
        <div className="hidden md:block absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-purple-500/40 opacity-60 rounded-tl-xl z-10" />
        <div className="hidden md:block absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/40 opacity-60 rounded-tr-xl z-10" />
        <div className="hidden md:block absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-500/40 opacity-60 rounded-bl-xl z-10" />
        <div className="hidden md:block absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-purple-500/40 opacity-60 rounded-br-xl z-10" />

        {/* INNER WRAPPER: Handles the scrolling and centering */}
        <div className="absolute inset-0 overflow-y-auto hide-scroll z-20 scroll-smooth">
          <div className="flex flex-col items-center w-full px-4 md:px-6">

            {/* --- HERO SECTION (100vh) --- */}
            <div className="min-h-screen w-full flex flex-col items-center justify-center relative">

              <div className="flex flex-col items-center animate-hero" style={{ animationDelay: '200ms' }}>
                {/* ANIMATED SCANNER ICON */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-8">
                  <div className="absolute inset-0 border border-purple-500/40 border-dashed rounded-full animate-[spin_12s_linear_infinite] shadow-[0_0_15px_rgba(168,85,247,0.2)]" />
                  <div className="absolute inset-2 border-2 border-cyan-500/30 border-dotted rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-4 bg-[#040308]/60 rounded-full backdrop-blur-md" />

                  <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0c0a18]/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] relative z-10 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent -translate-y-full animate-[scan-line_2s_linear_infinite]" />
                    <ScanFace size={32} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center animate-hero" style={{ animationDelay: '400ms' }}>
                {/* TITLE & SUBTITLE */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase shadow-black drop-shadow-md">System Initialization Ready</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-cyan-300 tracking-[0.1em] uppercase mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight text-center">
                  Welcome to the <br className="hidden md:block" /> IRAP Sandbox.
                </h1>
              </div>

              {/* SCROLL INDICATOR */}
              <div className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 animate-hero" style={{ animationDelay: '1000ms' }}>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-80">Scroll to Explore</span>
                <ChevronDown size={24} className="animate-bounce text-purple-400" />
              </div>

            </div>

            {/* --- FEATURE BOX & BUTTON SECTION --- */}
            <div
              ref={welcomeBoxRef}
              className="w-full max-w-3xl flex flex-col items-center pb-32 pt-10"
            >
              {/* GLASSMORPHISM FEATURE BOX */}
              <div className={`w-full bg-[#0c0a18]/60 backdrop-blur-2xl border border-slate-700/60 rounded-2xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] mb-12 text-left relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${welcomeBoxVisible ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-24 blur-md'}`}>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                <p className="text-slate-200 leading-relaxed mb-6 text-center text-[13px] md:text-[14px] drop-shadow-md font-medium">
                  This controlled environment demonstrates how digital platforms learn from attention. As you interact with content, the system observes behavioral signals and transforms them into meaningful insights.
                </p>

                {/* 3-Step Journey */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#040308]/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <Activity size={16} />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">1. Explore</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Scroll, read, expand, save, and interact with content naturally. There are no right or wrong actions.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#040308]/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      <Database size={16} />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">2. Observe</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">The engine measures attention patterns such as engagement, dwell time, content preferences, and exploration behavior.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#040308]/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <Code size={16} />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">3. Understand</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Your interactions are translated into a transparent attention profile, revealing how digital systems interpret behavior and generate recommendations.</p>
                  </div>
                </div>
              </div>

              {/* UPGRADED BUTTON WRAPPER (So hover animations don't break from delays) */}
              <div
                className={`transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${welcomeBoxVisible ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-24 blur-md'}`}
                style={{ transitionDelay: welcomeBoxVisible ? '400ms' : '0ms' }}
              >
                <button
                  onClick={onStart}
                  className="group relative px-8 md:px-10 py-4 bg-[#0c0a18]/80 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-purple-500/50 hover:border-purple-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-cyan-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-[sweep-line_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-[1px] bg-[#040308]/90 rounded-[11px] transition-colors duration-500 group-hover:bg-transparent" />

                  <span className="relative flex items-center gap-3 font-black tracking-widest uppercase text-purple-400 group-hover:text-white transition-colors duration-500 text-[13px] md:text-[14px]">
                    <PlayCircle size={18} className="group-hover:animate-pulse drop-shadow-[0_0_5px_currentColor]" /> Initialize Environment
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
