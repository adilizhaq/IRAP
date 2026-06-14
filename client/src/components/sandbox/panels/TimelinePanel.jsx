import React from 'react';
import { Share2, ChevronRight, ScanFace } from 'lucide-react';

// ============================================================================
// TimelinePanel
// ----------------------------------------------------------------------------
// The bottom-of-feed panel showing:
//   1. Attention drift tracker — chronological path of dominant category shifts
//   2. Event log timeline — every scored interaction with timestamp + points
//   3. "Analyze Profile" button — triggers the compile sequence
//
// Props:
//   timeline        — array    full event log from useSandboxEngine
//   attentionShifts — array    chronological dominant-category shift path
//   onCompile       — () => void   fires engine.handleCompile()
// ============================================================================

export default function TimelinePanel({ timeline, attentionShifts, onCompile }) {
  return (
    <div
      className="mt-8 bg-gradient-to-br from-[#080614] to-[#040308] border border-slate-800 rounded-2xl p-8 shadow-2xl"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <h3 className="text-base font-black text-white tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
        <Share2 size={18} className="text-blue-400" />
        Attention Journey Timeline
      </h3>

      {/* ── DRIFT TRACKER ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {attentionShifts.length > 0
          ? attentionShifts.map((cat, i) => (
              <React.Fragment key={i}>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 uppercase tracking-wider shadow-inner">
                  {cat}
                </span>
                {i < attentionShifts.length - 1 && (
                  <ChevronRight size={14} className="text-slate-600" />
                )}
              </React.Fragment>
            ))
          : (
            <span className="text-sm text-slate-500 font-mono italic">
              Interact with content above to map your journey...
            </span>
          )}
      </div>

      {/* ── EVENT LOG ───────────────────────────────────────────────────── */}
      <div className="space-y-4 max-h-[200px] overflow-y-auto hide-scroll pr-2">
        {timeline.map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-4 text-xs font-mono bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50"
          >
            <span className="text-slate-500">{event.time}</span>

            <span className={`px-2 py-0.5 rounded-md border text-[9px] uppercase font-bold tracking-widest ${
              event.event === 'save'     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              event.event === 'like'     ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'          :
              event.event === 'readMore' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'          :
              event.event === 'view'     ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'    :
              'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {event.event}
            </span>

            <span className="text-slate-200 font-sans font-bold capitalize">{event.category}</span>
            <span className="text-slate-500 ml-auto border-l border-slate-700 pl-3">{event.score} pts</span>
          </div>
        ))}
      </div>

      {/* ── ANALYZE BUTTON ──────────────────────────────────────────────── */}
      <button
        onClick={onCompile}
        className="mt-8 w-full py-4 bg-white hover:bg-slate-200 text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
      >
        <ScanFace size={18} /> Analyze Profile
      </button>
    </div>
  );
}
