import React from 'react';

// ============================================================================
// AttentionPanel
// ----------------------------------------------------------------------------
// The right sidebar showing live per-category behavioral scores as animated
// progress bars. Only visible on lg+ screens (hidden lg:flex).
//
// Bars are sorted highest score first. Categories with zero score AND zero
// views are hidden until the user interacts — identical to original behaviour.
//
// Props:
//   metrics — object   full metrics map from useSandboxEngine
// ============================================================================

export default function AttentionPanel({ metrics }) {
  return (
    <div className="hidden lg:flex w-[280px] bg-[#0c0a18] border-l border-slate-800/40 flex-col p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] z-20 overflow-hidden relative">

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-full h-32 bg-blue-500/5 blur-[50px] pointer-events-none" />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-800/60 pb-4 relative z-10">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
        <h2 className="text-[11px] font-black tracking-widest uppercase text-slate-300">
          Live Attention Heat
        </h2>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="space-y-6 flex-1 flex flex-col min-h-0 relative z-10">
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          The engine assigns weighted scores based on intent. Viewing (+1) signals passive interest, while Saving (+12) signals strong utility.
        </p>

        {/* LIVE SCORING BARS */}
        <div className="flex flex-col gap-4">
          {Object.keys(metrics)
            .sort((a, b) => metrics[b].score - metrics[a].score)
            .map((cat) => {
              const m = metrics[cat];
              if (m.score === 0 && m.views === 0) return null;

              const topScore = Math.max(...Object.values(metrics).map(x => x.score), 1);
              const pct = Math.max(5, (m.score / topScore) * 100);

              return (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{cat}</span>
                    <span className="text-[11px] font-black text-blue-400 font-mono">{m.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}
