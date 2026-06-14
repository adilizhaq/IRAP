import React from 'react';
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// CardBody
// ----------------------------------------------------------------------------
// Renders the correct body content for a feed card based on item.type.
// Also owns the "Read More / Show Less" expand button for text-heavy types.
//
// Props:
//   item     — content node from CONTENT_DATABASE
//   state    — postState[item.id] from useSandboxEngine
//   onAction — (actionType: string) => void   bound to this card's id + category
//
// Type → renderer map:
//   'tutorial' | 'code'  → code block (monospace, pre)
//   'story' | 'article'  → prose block
//   'video'              → image thumbnail with play overlay + duration badge
//   'product'            → image with price overlay
//   'poll'               → question + option buttons (each vote fires 'like')
//
// NOTE: CONTENT_DATABASE uses type: 'tutorial' for post_01 but the original
// CardBody switch checked for 'code'. Both are handled here so either value
// in the database renders the code block correctly.
// ============================================================================

export default function CardBody({ item, state, onAction }) {
  const isTextType =
    item.type === 'code' ||
    item.type === 'tutorial' ||
    item.type === 'story'   ||
    item.type === 'article';

  return (
    <>
      {/* ── CODE / TUTORIAL ─────────────────────────────────────────────── */}
      {(item.type === 'code' || item.type === 'tutorial') && (
        <div className="bg-[#040308] p-5 rounded-xl border border-slate-800/80 font-mono text-[13px] text-slate-300 leading-loose shadow-inner">
          <pre className="whitespace-pre-wrap">
            {state.expanded ? item.content.expanded : item.content.preview}
          </pre>
        </div>
      )}

      {/* ── STORY / ARTICLE ─────────────────────────────────────────────── */}
      {(item.type === 'story' || item.type === 'article') && (
        <div className="bg-[#0c0a18] p-5 rounded-xl border border-slate-800/50 text-[14px] text-slate-300 leading-relaxed shadow-inner">
          <p>{state.expanded ? item.content.expanded : item.content.preview}</p>
        </div>
      )}

      {/* ── VIDEO ───────────────────────────────────────────────────────── */}
      {item.type === 'video' && (
        <div className="w-full h-[220px] bg-slate-900 rounded-xl relative overflow-hidden group/vid cursor-pointer border border-slate-800/50">
          <img
            src={item.content.url}
            className="w-full h-full object-cover opacity-60 group-hover/vid:scale-105 transition-transform duration-700"
            alt="Video cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={56} className="text-white/70 group-hover/vid:text-white transition-colors" />
          </div>
          <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-bold text-white border border-white/10">
            {item.content.length}
          </span>
          <span className="absolute top-3 left-3 bg-red-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg">
            Video
          </span>
        </div>
      )}

      {/* ── PRODUCT ─────────────────────────────────────────────────────── */}
      {item.type === 'product' && (
        <div className="w-full h-[220px] bg-slate-900 rounded-xl relative overflow-hidden border border-slate-800/50">
          <img
            src={item.content.url}
            className="w-full h-full object-cover opacity-70"
            alt="Product cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-4 py-3 rounded-xl border border-white/10 shadow-xl">
            <p className="text-sm font-bold text-white">{item.title}</p>
            <p className="text-sm text-emerald-400 font-mono font-bold mt-1">{item.content.price}</p>
          </div>
        </div>
      )}

      {/* ── POLL ────────────────────────────────────────────────────────── */}
      {item.type === 'poll' && (
        <div className="bg-gradient-to-br from-slate-900 to-[#0c0a18] p-6 rounded-xl border border-slate-700/50 text-center shadow-inner">
          <p className="text-sm font-bold text-white mb-6 leading-relaxed">
            {item.content.question}
          </p>
          <div className="flex flex-col gap-3">
            {item.content.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAction('like')}
                className="bg-slate-800/50 hover:bg-blue-600/30 hover:border-blue-500/50 transition-colors py-3 rounded-xl text-xs font-bold w-full text-slate-300 hover:text-white border border-slate-700"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── EXPAND BUTTON (text-heavy types only) ───────────────────────── */}
      {isTextType && (
        <button
          onClick={() => onAction('readMore')}
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 text-[11px] font-bold text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg border border-blue-500/10 transition-colors uppercase tracking-widest"
        >
          {state.expanded
            ? <><ChevronUp size={14} /> Show Less</>
            : <><ChevronDown size={14} /> Read More</>
          }
        </button>
      )}
    </>
  );
}
