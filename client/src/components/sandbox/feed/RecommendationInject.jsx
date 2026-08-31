import React from 'react';
import { Sparkles, Crosshair, Target } from 'lucide-react';

export default function RecommendationInject({
  dominantCategory,
  metrics,
}) {
  const data = metrics?.[dominantCategory] || {};

  const confidence = Math.min(
    100,
    Math.round((data.score || 0) * 10)
  );

  return (
    <div className="bg-gradient-to-br from-[#0c0a18] to-[#131027] border border-purple-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 my-4">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-5 border-b border-slate-800/60 pb-4">
        <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} />
          Recommended For You
        </h4>

        {/* Transparency Tooltip */}
        <div className="group relative">
          <span className="text-[10px] text-slate-400 underline cursor-help flex items-center gap-1">
            <Crosshair size={12} />
            Why am I seeing this?
          </span>

          <div className="absolute right-0 top-6 w-72 bg-slate-900 border border-slate-700 rounded-xl p-4 text-[11px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">

            <span className="block text-white font-bold mb-3">
              Transparency Engine
            </span>

            <div className="space-y-2">

              <div>
                Category:
                <span className="text-emerald-400 ml-2 uppercase font-bold">
                  {dominantCategory}
                </span>
              </div>

              <div>
                Views:
                <span className="text-white ml-2">
                  {data.views || 0}
                </span>
              </div>

              <div>
                Hovers:
                <span className="text-white ml-2">
                  {data.hovers || 0}
                </span>
              </div>

              <div>
                Likes:
                <span className="text-white ml-2">
                  {data.likes || 0}
                </span>
              </div>

              <div>
                Saves:
                <span className="text-white ml-2">
                  {data.saves || 0}
                </span>
              </div>

              <div>
                Dwell Time:
                <span className="text-white ml-2">
                  {Math.floor((data.dwellTime || 0) / 1000)}s
                </span>
              </div>

              <hr className="border-slate-700 my-2" />

              <div className="text-purple-300 font-bold">
                Interest Score:
                <span className="ml-2 text-white">
                  {(data.score || 0).toFixed(1)}
                </span>
              </div>

              <div className="text-cyan-300 font-bold">
                Confidence:
                <span className="ml-2 text-white">
                  {confidence}%
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-300">
          <Target size={18} />
        </div>

        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            Advanced{" "}
            {dominantCategory.charAt(0).toUpperCase() +
              dominantCategory.slice(1)}{" "}
            Mastery
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Curated specifically from your observed engagement patterns.
          </p>
        </div>
      </div>

      {/* QUICK SIGNALS */}
      <div className="grid grid-cols-3 gap-2 mb-4">

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-center">
          <div className="text-purple-400 text-xs font-bold">
            {data.views || 0}
          </div>
          <div className="text-[9px] text-slate-500 uppercase">
            Views
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-center">
          <div className="text-purple-400 text-xs font-bold">
            {Math.floor((data.dwellTime || 0) / 1000)}s
          </div>
          <div className="text-[9px] text-slate-500 uppercase">
            Dwell
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-center">
          <div className="text-purple-400 text-xs font-bold">
            {confidence}%
          </div>
          <div className="text-[9px] text-slate-500 uppercase">
            Confidence
          </div>
        </div>

      </div>

      {/* CTA */}
      <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl w-full transition-colors shadow-lg shadow-purple-500/20">
        Access Curated Node
      </button>

    </div>
  );
}