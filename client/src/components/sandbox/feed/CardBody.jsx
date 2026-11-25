import React, { useState } from 'react';
import { Play, Terminal, Sparkles, ShoppingBag, BookOpen, CheckCircle2 } from 'lucide-react';

export default function CardBody({ item, state, onAction }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { type, content } = item;

  // 1. VIDEO / REEL CARD
  if (type === 'video') {
    return (
      <div className="relative aspect-[4/5] max-h-[460px] w-full overflow-hidden group cursor-pointer" onClick={() => onAction('expand')}>
        <img
          src={content.url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl">
            <Play size={24} className="fill-white ml-1" />
          </div>
        </div>

        {/* Top-Right Reel Duration */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10">
          {content.length}
        </span>

        {/* Bottom Overlay Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[12px] font-bold text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
            {content.overlay}
          </span>
        </div>
      </div>
    );
  }

  // 2. PRODUCT / SHOPPING POST
  if (type === 'product') {
    return (
      <div className="relative aspect-square max-h-[440px] w-full overflow-hidden group">
        <img
          src={content.url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Instagram Shopping Floating Tag */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/75 backdrop-blur-xl border border-white/15 p-3 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white leading-tight">{content.overlay}</p>
              <p className="text-[10px] text-slate-400">Tap to inspect specs</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-white text-black font-black text-[12px]">
            {content.price}
          </span>
        </div>
      </div>
    );
  }

  // 3. CODE / TUTORIAL SLIDE
  if (type === 'tutorial' || type === 'code') {
    return (
      <div className="p-5 bg-gradient-to-br from-[#0b091a] via-[#070610] to-[#0c1222] min-h-[260px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
            <Terminal size={12} /> snippet.py
          </span>
        </div>

        <pre className="text-[12px] font-mono text-cyan-300 overflow-x-auto leading-relaxed py-2">
          <code>{state.expanded ? content.expanded : content.preview}</code>
        </pre>

        <button
          onClick={() => onAction('expand')}
          className="mt-4 w-full py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-wide transition-colors"
        >
          {state.expanded ? 'Collapse Code' : 'View Full Implementation (+5 pts)'}
        </button>
      </div>
    );
  }

  // 4. INTERACTIVE POLL POST
  if (type === 'poll') {
    return (
      <div className="p-6 bg-gradient-to-br from-[#130b1c] via-[#090712] to-[#0f172a] min-h-[260px] flex flex-col justify-center">
        <p className="text-[15px] font-bold text-white leading-snug mb-5">
          {content.question}
        </p>
        <div className="flex flex-col gap-2.5">
          {content.options.map((opt, idx) => {
            const isPicked = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedOption(idx);
                  onAction('expand');
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border text-[12px] font-bold transition-all flex items-center justify-between ${
                  isPicked
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span>{opt}</span>
                {isPicked && <CheckCircle2 size={16} className="text-orange-400" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. STORY / ARTICLE VISUAL QUOTE CARD
  return (
    <div className="p-6 bg-gradient-to-br from-[#0d0a1a] via-[#07060e] to-[#110c1d] min-h-[250px] flex flex-col justify-between relative">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3">
        <BookOpen size={13} />
        <span>{type === 'story' ? 'Creator Story' : 'Deep Dive Note'}</span>
      </div>

      <p className="text-[14px] text-slate-200 leading-relaxed font-normal">
        {state.expanded ? content.expanded : content.preview}
      </p>

      {!state.expanded && (
        <button
          onClick={() => onAction('expand')}
          className="mt-5 self-start inline-flex items-center gap-1.5 text-[12px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Sparkles size={13} />
          Read full thread
        </button>
      )}
    </div>
  );
}