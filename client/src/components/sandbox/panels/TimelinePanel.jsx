import React from 'react';
import { Share2, ChevronRight } from 'lucide-react';

export default function TimelinePanel({ timeline = [], attentionShifts = [], onCompile }) {
  return (
    <div className="bg-[#080614] border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-black text-white tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
        <Share2 size={16} className="text-purple-400" />
        Attention Drift Analysis
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {attentionShifts.length > 0 ? (
          attentionShifts.map((shift, i) => {
            // Safely handle both string categories and { from, to } objects
            const label =
              typeof shift === 'object' && shift !== null
                ? shift.to || shift.from || 'unknown'
                : String(shift);

            return (
              <React.Fragment key={i}>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 uppercase tracking-wider shadow-inner">
                  {label}
                </span>
                {i < attentionShifts.length - 1 && (
                  <ChevronRight size={14} className="text-slate-600" />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <span className="text-xs text-slate-500 font-mono">
            Gathering telemetry...
          </span>
        )}
      </div>

      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
        Your Interaction Journey
      </h4>

      <div className="space-y-3 h-[150px] overflow-y-auto hide-scroll">
        {timeline.map((event, i) => (
          <div key={i} className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">{event.time}</span>
            <span
              className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-widest ${
                event.event === 'save'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : event.event === 'like'
                  ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                  : event.event === 'readMore' || event.event === 'expand'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : event.event === 'view'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {event.event}
            </span>
            <span className="text-slate-300 font-sans font-bold capitalize">
              {event.category}
            </span>
            {event.score !== undefined && (
              <span className="text-slate-500 ml-auto">{event.score} pts</span>
            )}
          </div>
        ))}
      </div>

      {onCompile && (
        <button
          onClick={onCompile}
          className="mt-8 w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          Compile Subconscious Profile
        </button>
      )}
    </div>
  );
}