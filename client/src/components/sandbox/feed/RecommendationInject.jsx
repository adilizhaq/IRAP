import React, { useState } from 'react';
import {
  Sparkles,
  Crosshair,
  Target,
  ChevronRight,
  Heart,
  Bookmark,
  ShieldCheck,
  Eye,
  Clock,
  Zap
} from 'lucide-react';
import { useTelemetry } from '../../../hooks/TelemetryContext';

export default function RecommendationInject({
  dominantCategory,
  metrics,
}) {
  const { handleAction, interestScores } = useTelemetry() || {};
  const [showTransparency, setShowTransparency] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [accessed, setAccessed] = useState(false);

  const data = metrics?.[dominantCategory] || {};

  // Compatible with both TelemetryContext (ms) and useSandboxEngine (s)
  const dwellSeconds = data.dwellTime
    ? Math.floor(data.dwellTime / 1000)
    : Math.floor(data.time || 0);

  const rawScore =
    data.score !== undefined
      ? data.score
      : interestScores?.[dominantCategory] || 0;

  const confidence = Math.min(100, Math.max(15, Math.round(rawScore * 10)));

  const formattedCategory = dominantCategory
    ? dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)
    : 'General';

  const triggerTelemetry = (actionType) => {
    if (handleAction && dominantCategory) {
      handleAction(actionType, dominantCategory);
    }
  };

  return (
    <article className="bg-[#050509] border border-purple-500/35 hover:border-purple-500/60 rounded-2xl overflow-hidden shadow-[0_8px_35px_rgba(168,85,247,0.16)] transition-all duration-300 animate-in fade-in zoom-in-95 my-2">

      {/* ── 1. INSTAGRAM SPONSORED HEADER ───────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Glowing Algorithmic Story Ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <div className="w-8 h-8 rounded-full bg-[#080614] flex items-center justify-center text-purple-300 border-2 border-[#050509]">
              <Sparkles size={14} />
            </div>
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-white tracking-tight">
                irap_algorithm
              </span>
              <ShieldCheck size={13} className="text-purple-400 fill-purple-500/20" />
            </div>
            <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mt-0.5">
              Recommended For You • {confidence}% Match
            </p>
          </div>
        </div>

        {/* Why am I seeing this? Button (Works on Hover + Tap) */}
        <button
          type="button"
          onClick={() => setShowTransparency((prev) => !prev)}
          onMouseEnter={() => setShowTransparency(true)}
          className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-purple-500/20 border border-slate-700/80 hover:border-purple-500/40 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
        >
          <Crosshair size={12} className="text-purple-400" />
          <span>Why this?</span>
        </button>
      </div>

      {/* ── 2. EDGE-TO-EDGE ALGORITHMIC CANVAS ──────────────────────────── */}
      <div
        onMouseLeave={() => setShowTransparency(false)}
        className="relative w-full min-h-[250px] bg-gradient-to-br from-[#120b29] via-[#090714] to-[#0c192c] border-y border-slate-800/80 p-6 flex flex-col justify-between overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Affinity Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
            <Target size={12} className="text-purple-400" />
            Target: {dominantCategory}
          </span>

          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full">
            Score: {rawScore.toFixed(1)} pts
          </span>
        </div>

        {/* Center Visual Title */}
        <div className="relative z-10 my-5">
          <h3 className="text-xl font-black text-white tracking-tight leading-snug">
            Advanced {formattedCategory} Mastery
          </h3>
          <p className="text-xs text-slate-300/90 mt-1.5 leading-relaxed max-w-sm">
            Curated specifically from your observed engagement patterns and viewport dwell telemetry.
          </p>
        </div>

        {/* Quick Signal Pills */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5">
          <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
            <div className="text-purple-300 text-xs font-black flex items-center justify-center gap-1">
              <Eye size={12} className="text-purple-400" />
              {data.views || 0}
            </div>
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">
              Views
            </div>
          </div>

          <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
            <div className="text-cyan-300 text-xs font-black flex items-center justify-center gap-1">
              <Clock size={12} className="text-cyan-400" />
              {dwellSeconds}s
            </div>
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">
              Dwell
            </div>
          </div>

          <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
            <div className="text-emerald-300 text-xs font-black flex items-center justify-center gap-1">
              <Zap size={12} className="text-emerald-400" />
              {confidence}%
            </div>
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">
              Confidence
            </div>
          </div>
        </div>

        {/* ── TRANSPARENCY ENGINE OVERLAY (Hover or Tap) ────────────────── */}
        {showTransparency && (
          <div className="absolute inset-0 bg-[#070510]/95 backdrop-blur-xl p-5 flex flex-col justify-between z-30 animate-in fade-in duration-200 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-white font-bold flex items-center gap-2">
                <Crosshair size={14} className="text-purple-400" />
                Transparency Engine
              </span>
              <button
                type="button"
                onClick={() => setShowTransparency(false)}
                className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-300 my-auto py-2">
              <div>
                Category:
                <span className="text-emerald-400 ml-1.5 uppercase font-bold">
                  {dominantCategory}
                </span>
              </div>
              <div>
                Views: <span className="text-white font-bold">{data.views || 0}</span>
              </div>
              <div>
                Hovers: <span className="text-white font-bold">{data.hovers || 0}</span>
              </div>
              <div>
                Likes: <span className="text-white font-bold">{data.likes || 0}</span>
              </div>
              <div>
                Saves: <span className="text-white font-bold">{data.saves || 0}</span>
              </div>
              <div>
                Dwell Time: <span className="text-white font-bold">{dwellSeconds}s</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2.5 flex items-center justify-between">
              <div className="text-purple-300 font-bold">
                Interest Score: <span className="text-white">{rawScore.toFixed(1)}</span>
              </div>
              <div className="text-cyan-300 font-bold">
                Confidence: <span className="text-white">{confidence}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. INSTAGRAM SPONSORED CTA BANNER ───────────────────────────── */}
      <button
        type="button"
        onClick={() => {
          setAccessed(true);
          triggerTelemetry('expand');
        }}
        className={`w-full px-4 py-3 flex items-center justify-between text-xs font-bold transition-colors border-b border-slate-800/80 ${
          accessed
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white'
        }`}
      >
        <span>{accessed ? 'Curated Node Unlocked (+5 pts)' : 'Access Curated Node'}</span>
        <ChevronRight size={16} />
      </button>

      {/* ── 4. INSTAGRAM ACTION BAR & CAPTION ───────────────────────────── */}
      <div className="px-4 pt-3 pb-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setLiked((prev) => !prev);
                triggerTelemetry('like');
              }}
              className="transition-transform active:scale-125"
            >
              <Heart
                size={21}
                className={
                  liked
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : 'text-slate-200 hover:text-slate-400'
                }
              />
            </button>

            <button
              type="button"
              onClick={() => setShowTransparency((prev) => !prev)}
              className="text-slate-200 hover:text-purple-400 transition-colors"
              title="Inspect Telemetry Weights"
            >
              <Crosshair size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setSaved((prev) => !prev);
              triggerTelemetry('save');
            }}
            className="transition-transform active:scale-125"
          >
            <Bookmark
              size={20}
              className={
                saved
                  ? 'text-emerald-400 fill-emerald-400'
                  : 'text-slate-200 hover:text-slate-400'
              }
            />
          </button>
        </div>

        <p className="text-[12px] text-slate-300 leading-snug">
          <span className="font-bold text-white mr-1.5">irap_algorithm</span>
          Injected dynamically because your highest affinity is{' '}
          <span className="text-purple-400 font-semibold uppercase">{dominantCategory}</span>.
        </p>
      </div>
    </article>
  );
}