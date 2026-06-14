import React from 'react';
import { Sparkles, Crosshair, Target } from 'lucide-react';

// ============================================================================
// RecommendationInject
// ----------------------------------------------------------------------------
// The mid-feed "Recommended For You" card injected at index 4 of the feed
// when a dominant category has emerged and the user has been active > 10s.
//
// Includes the "Why am I seeing this?" transparency tooltip showing exactly
// how many points the dominant category accumulated and from which signals.
//
// Props:
//   dominantCategory — string   the top-scoring category from useSandboxEngine
//   metrics          — object   full metrics map to read the dominant score
// ============================================================================

export default function RecommendationInject({ dominantCategory, metrics }) {
  return (
    <div className="bg-gradient-to-br from-[#0c0a18] to-[#131027] border border-purple-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 my-4">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start mb-5 border-b border-slate-800/60 pb-4">
        <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> Recommended For You
        </h4>

        {/* Transparency tooltip */}
        <div className="group relative">
          <span className="text-[10px] text-slate-400 underline cursor-help flex items-center gap-1">
            <Crosshair size={12} /> Why am I seeing this?
          </span>
          <div className="absolute right-0 top-6 w-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-[11px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
            <span className="block text-white font-bold mb-2">Transparency Engine</span>
            This was injected because your primary affinity is{' '}
            <b className="text-emerald-400 uppercase">{dominantCategory}</b>{' '}
            (Accumulated {metrics[dominantCategory].score} points from views, reads, and saves).
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-300">
          <Target size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            Advanced {dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)} Mastery
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Curated specifically based on your engagement velocity.
          </p>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl w-full transition-colors shadow-lg shadow-purple-500/20">
        Access Curated Node
      </button>

    </div>
  );
}
