import React, { useEffect, useState, useMemo } from 'react';
import { Sparkles, Layers, Radio, X } from 'lucide-react';

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
import { CONTENT_DATABASE, STORY_ITEMS } from './data/contentDatabase';

// 🧠 Hook
import { useTelemetry } from '../../hooks/TelemetryContext';

const STORY_RING_MAP = {
  blue:    'from-blue-500 via-cyan-400 to-indigo-600',
  purple:  'from-purple-500 via-fuchsia-500 to-pink-500',
  orange:  'from-amber-400 via-orange-500 to-red-500',
  emerald: 'from-emerald-400 via-teal-500 to-cyan-500',
  teal:    'from-teal-400 via-emerald-500 to-blue-500',
  rose:    'from-amber-400 via-rose-500 to-fuchsia-600',
  red:     'from-red-500 via-orange-500 to-amber-500',
  amber:   'from-yellow-400 via-amber-500 to-orange-600',
};

export default function SandboxView({ onSessionComplete }) {
  const { resumeTracking, pauseTracking, handleTouch, activeTime } = useTelemetry();
  const engine = useSandboxEngine(onSessionComplete);

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Ensure one unique story ring per category even if STORY_ITEMS is not exported
  const storyNodes = useMemo(() => {
    if (STORY_ITEMS && STORY_ITEMS.length > 0) return STORY_ITEMS;
    return [...new Map(CONTENT_DATABASE.map((item) => [item.category, item])).values()];
  }, []);

  // 🛑 Only run global telemetry timers when inside the active feed
  useEffect(() => {
    if (engine.isStarted && !engine.isCompiling) {
      resumeTracking();
    } else {
      pauseTracking();
    }
    return () => pauseTracking();
  }, [engine.isStarted, engine.isCompiling, resumeTracking, pauseTracking]);

  // ── 1. COMPILING SCREEN ───────────────────────────────────────────────────
  if (engine.isCompiling) {
    return <CompilingScreen compileText={engine.compileText} />;
  }

  // ── 2. WELCOME SCREEN ─────────────────────────────────────────────────────
  if (!engine.isStarted) {
    return <WelcomeScreen onStart={() => engine.setIsStarted(true)} />;
  }

  // Filter visible posts (excluding disliked ones and applying Story filter)
  const visiblePosts = CONTENT_DATABASE.filter((item) => {
    const state = engine.postState[item.id];
    if (state?.disliked) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleStorySelect = (category, id) => {
    const nextCategory = selectedCategory === category ? 'all' : category;
    setSelectedCategory(nextCategory);

    if (nextCategory !== 'all') {
      engine.handleMouseEnter(category, id);
      if (handleTouch) handleTouch(category, 'tap');
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ── 3. MAIN FEED ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Container - Full height, no outer scroll */}
      <div className="flex flex-col h-full w-full bg-[#030207] text-white font-sans overflow-hidden animate-in fade-in duration-700">

        {/* ── FIXED TOP BAR (Instagram Dark Header) ───────────────────────── */}
        <header className="h-16 w-full border-b border-slate-800/60 bg-[#040308]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 z-50">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-300 tracking-tight">
              IRAPgram
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {formatTimer(activeTime || engine.activeTime || 0)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dominant Affinity Pill */}
            {engine.dominantCategory && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                <Radio size={12} className="text-purple-400 animate-pulse" />
                <span>Lock: <b className="uppercase text-white">{engine.dominantCategory}</b></span>
              </div>
            )}

            {/* Compile Button */}
            <button
              onClick={engine.handleCompile}
              className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] active:scale-95 flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>Analyze Profile</span>
            </button>
          </div>
        </header>

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        <div className="flex-1 flex justify-center w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none z-0" />

          {/* CENTER COLUMN: Dense Feed Scroll Area */}
          <div className="flex-1 w-full max-w-[650px] h-full overflow-y-auto hide-scroll scroll-smooth relative z-10 border-r border-slate-800/40">

            {/* 470px Instagram Desktop Feed Container */}
            <div className="py-4 px-2 sm:px-0 flex flex-col gap-5 w-full max-w-[470px] mx-auto pb-32">

              {/* ── INSTAGRAM STORIES CATEGORY TRAY ───────────────────────── */}
              <div className="bg-[#050509] border border-slate-800/70 rounded-2xl p-3.5 overflow-x-auto hide-scroll">
                <div className="flex items-center gap-4 min-w-max">
                  {/* "All" Story Reset Button */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="flex flex-col items-center gap-1.5 group focus:outline-none"
                  >
                    <div className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
                        : 'bg-slate-800'
                    }`}>
                      <div className="w-12 h-12 rounded-full bg-[#090812] flex items-center justify-center text-white border-2 border-[#050509]">
                        <Layers size={18} className={selectedCategory === 'all' ? 'text-rose-400' : 'text-slate-400'} />
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold tracking-tight ${
                      selectedCategory === 'all' ? 'text-white font-bold' : 'text-slate-400'
                    }`}>
                      For You
                    </span>
                  </button>

                  {/* Unique Category Story Rings */}
                  {storyNodes.map((item) => {
                    const isSelected = selectedCategory === item.category;
                    const isDominant = engine.dominantCategory === item.category;
                    const ringGradient = STORY_RING_MAP[item.color] || STORY_RING_MAP.rose;

                    return (
                      <button
                        key={item.category}
                        onClick={() => handleStorySelect(item.category, item.id)}
                        className="flex flex-col items-center gap-1.5 group focus:outline-none"
                      >
                        <div className={`p-[2.5px] rounded-full transition-all duration-300 group-hover:scale-105 ${
                          isSelected || isDominant
                            ? `bg-gradient-to-tr ${ringGradient} shadow-[0_0_12px_rgba(236,72,153,0.35)]`
                            : 'bg-gradient-to-tr from-slate-700 to-slate-800 opacity-80 group-hover:opacity-100'
                        }`}>
                          <div className="w-12 h-12 rounded-full bg-[#090812] flex items-center justify-center text-white border-2 border-[#050509]">
                            <item.icon size={18} />
                          </div>
                        </div>
                        <span className={`text-[10px] capitalize tracking-tight max-w-[60px] truncate ${
                          isSelected ? 'text-white font-bold' : 'text-slate-400'
                        }`}>
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Category Filter Indicator */}
              {selectedCategory !== 'all' && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs">
                  <span className="text-slate-300">
                    Filtering by <b className="text-white uppercase">{selectedCategory}</b> ({visiblePosts.length} posts)
                  </span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-purple-300 hover:text-white flex items-center gap-1 font-bold text-[11px]"
                  >
                    <X size={13} />
                    Show All
                  </button>
                </div>
              )}

              {/* ── FEED CARDS LOOP ───────────────────────────────────────── */}
              {visiblePosts.length > 0 ? (
                visiblePosts.map((item, visibleIndex) => {
                  const state = engine.postState[item.id] || {
                    liked: false,
                    saved: false,
                    disliked: false,
                    expanded: false,
                  };

                  return (
                    <React.Fragment key={item.id}>
                      {/* Inject Algorithmic Suggestion after 3rd card */}
                      {selectedCategory === 'all' &&
                        visibleIndex === 3 &&
                        engine.dominantCategory &&
                        engine.activeTime > 10 && (
                          <div className="my-1">
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
                })
              ) : (
                <div className="bg-[#050509] border border-slate-800/70 rounded-2xl p-8 text-center">
                  <p className="text-sm font-bold text-slate-300 mb-2">
                    No active posts remaining in this filter.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                  >
                    Return to For You Feed
                  </button>
                </div>
              )}

              {/* Bottom Timeline Log */}
              <div className="mt-6 border-t border-slate-800/40 pt-6">
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