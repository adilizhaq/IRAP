import React, { useEffect } from 'react';

// Engine
import useSandboxEngine from './hooks/useSandboxEngine';

// Screens
import WelcomeScreen   from './screens/WelcomeScreen';
import CompilingScreen from './screens/CompilingScreen';

// Feed
import FeedCard              from './feed/FeedCard';
import RecommendationInject  from './feed/RecommendationInject';

// Panels
import AttentionPanel from './panels/AttentionPanel';
import TimelinePanel  from './panels/TimelinePanel';

// Data
import { CONTENT_DATABASE } from './data/contentDatabase';

// 🧠 Hook
import { useTelemetry } from '../../hooks/TelemetryContext';

export default function SandboxView({ onSessionComplete }) {

  const { resumeTracking, pauseTracking } = useTelemetry();

  useEffect(() => {
    resumeTracking(); 
    return () => {
      pauseTracking(); 
    };
  }, [resumeTracking, pauseTracking]);

  const engine = useSandboxEngine(onSessionComplete);

  // ── 1. COMPILING SCREEN ───────────────────────────────────────────────────
  if (engine.isCompiling) {
    return <CompilingScreen compileText={engine.compileText} />;
  }

  // ── 2. WELCOME SCREEN ─────────────────────────────────────────────────────
  if (!engine.isStarted) {
    return <WelcomeScreen onStart={() => engine.setIsStarted(true)} />;
  }

  // ── 3. MAIN FEED ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Container - Full height, no outer scroll */}
      <div className="flex flex-col h-full w-full bg-[#040308] text-white font-sans overflow-hidden animate-in fade-in duration-1000">

        {/* ── FIXED TOP BAR (Like Instagram's Header) ─────────────────────── */}
        <div className="h-16 w-full border-b border-slate-800/60 bg-[#040308]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Simulation Feed
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
              Live
            </span>
          </div>

          {/* 🎯 THE NEW FIXED COMPILE BUTTON */}
          <button
            onClick={engine.handleCompile}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            Analyze Profile
          </button>
        </div>

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        <div className="flex-1 flex justify-center w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none z-0" />

          {/* CENTER COLUMN: Dense Feed Scroll Area */}
          <div className="flex-1 w-full max-w-[650px] h-full overflow-y-auto hide-scroll scroll-smooth relative z-10 border-r border-slate-800/40">
            
            {/* Tighter wrapper for the IG feel (470px max-width) */}
            <div className="py-6 px-4 sm:px-0 flex flex-col gap-6 w-full max-w-[470px] mx-auto pb-32">
              
              <p className="text-[12px] text-slate-500 font-medium text-center mb-2">
                Interact genuinely. The engine is observing your decisions.
              </p>

              {/* Feed loop */}
              {CONTENT_DATABASE.map((item, index) => {
                const state = engine.postState[item.id];
                if (state.disliked) return null;

                return (
                  <React.Fragment key={item.id}>
                    {index === 4 && engine.dominantCategory && engine.activeTime > 10 && (
                      <div className="my-2">
                        <RecommendationInject
                          dominantCategory={engine.dominantCategory}
                          metrics={engine.metrics}
                        />
                      </div>
                    )}

                    <FeedCard
                      item={item}
                      state={state}
                      onMouseEnter={() => engine.handleMouseEnter(item.category, item.id)}
                      onMouseLeave={() => engine.handleMouseLeave(item.category)}
                      onAction={(actionType) => engine.handleAction(item.id, item.category, actionType)}
                    />
                  </React.Fragment>
                );
              })}

               {/* Bottom Timeline Log */}
              <div className="mt-8 border-t border-slate-800/40 pt-8">
                 <TimelinePanel
                  timeline={engine.timeline}
                  attentionShifts={engine.attentionShifts}
                  onCompile={engine.handleCompile} 
                 />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Live attention heat */}
          <div className="hidden lg:block w-[350px] shrink-0 h-full overflow-y-auto hide-scroll bg-[#080612]/30 relative z-10">
            <AttentionPanel metrics={engine.metrics} />
          </div>

        </div>
      </div>
    </>
  );
}