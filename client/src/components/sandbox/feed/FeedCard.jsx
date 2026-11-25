import React, { useRef, useEffect, useState } from 'react';
import {
  Heart,
  Bookmark,
  ThumbsDown,
  MoreHorizontal,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import CardBody from './CardBody';

// 🧠 1. IMPORT THE TELEMETRY SENSOR
import { useTelemetry } from '../../../hooks/TelemetryContext';

const RING_MAP = {
  blue:    'from-blue-500 via-cyan-400 to-indigo-600',
  purple:  'from-purple-500 via-fuchsia-500 to-pink-500',
  orange:  'from-amber-400 via-orange-500 to-red-500',
  emerald: 'from-emerald-400 via-teal-500 to-cyan-500',
  teal:    'from-teal-400 via-emerald-500 to-blue-500',
  rose:    'from-amber-400 via-rose-500 to-fuchsia-600',
  red:     'from-red-500 via-orange-500 to-amber-500',
  amber:   'from-yellow-400 via-amber-500 to-orange-600',
};

const getRingGradient = (color) => RING_MAP[color] || RING_MAP.rose;

export default function FeedCard({ item, state, onMouseEnter, onMouseLeave, onAction }) {
  // 🧠 2. GRAB TELEMETRY FUNCTIONS FROM THE BRAIN
  const { handleView, handleHover, handleTouch, handleAction: trackAction } = useTelemetry();

  const cardRef = useRef(null);
  const hasBeenViewedRef = useRef(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Deterministic baseline like count per post
  const baseLikes = (item.id.charCodeAt(item.id.length - 1) * 37) + 124;
  const totalLikes = state.liked ? baseLikes + 1 : baseLikes;

  // 3. INTERSECTION OBSERVER (60% visibility triggers a view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenViewedRef.current) {
          hasBeenViewedRef.current = true;
          handleView(item.category);
        }
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [item.category, handleView]);

  // 4. TELEMETRY + UI WRAPPERS
  const handleCardHover = () => {
    handleHover(item.category);
    if (onMouseEnter) onMouseEnter();
  };

  const handleCardTouch = () => {
    if (handleTouch) handleTouch(item.category, 'tap');
    if (onMouseEnter) onMouseEnter();
  };

  const handleInteraction = (actionType) => {
    trackAction(actionType, item.category);
    if (onAction) onAction(actionType);
  };

  // 5. INSTAGRAM DOUBLE-TAP TO LIKE
  const handleDoubleTap = () => {
    setShowHeartBurst(true);
    if (!state.liked) {
      handleInteraction('like');
    }
    setTimeout(() => setShowHeartBurst(false), 850);
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleCardHover}
      onMouseLeave={onMouseLeave}
      onTouchStart={handleCardTouch}
      className="bg-[#050509] border border-slate-800/70 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.45)]"
    >
      {/* ── 1. INSTAGRAM HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Gradient Story Ring */}
          <div className={`p-[2px] rounded-full bg-gradient-to-tr ${getRingGradient(item.color)}`}>
            <div className="w-8 h-8 rounded-full bg-[#080614] flex items-center justify-center text-white border-2 border-[#050509]">
              <item.icon size={15} />
            </div>
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-100 tracking-tight">
                {item.category.toLowerCase()}_hub
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 uppercase tracking-wider">
                {item.difficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
          </div>
        </div>

        <button
          onClick={() => handleInteraction('dislike')}
          title="Hide / Pass Post"
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* ── 2. FULL-BLEED MEDIA CONTAINER (Double-Click to Like) ────────── */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative w-full bg-[#090812] border-y border-slate-900 select-none overflow-hidden"
      >
        <CardBody
          item={item}
          state={state}
          onAction={handleInteraction}
        />

        {/* Floating Heart Burst on Double-Tap */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/10">
            <Heart
              size={84}
              className="text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)] animate-ping"
              style={{ animationDuration: '600ms', animationIterationCount: 1 }}
            />
          </div>
        )}
      </div>

      {/* ── 3. INSTAGRAM ACTION BAR ─────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => handleInteraction('like')}
              className="group flex items-center gap-1.5 focus:outline-none transition-transform active:scale-125"
            >
              <Heart
                size={23}
                className={`transition-colors ${
                  state.liked
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'text-slate-200 hover:text-slate-400'
                }`}
              />
            </button>

            {/* Expand / Inspect Button */}
            <button
              onClick={() => handleInteraction('expand')}
              title="Expand Details"
              className="text-slate-200 hover:text-slate-400 transition-transform active:scale-110"
            >
              <MessageCircle size={22} />
            </button>

            {/* Pass / Not Interested Button */}
            <button
              onClick={() => handleInteraction('dislike')}
              title="Not Interested"
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 text-[11px] font-semibold"
            >
              <ThumbsDown size={19} />
            </button>
          </div>

          {/* Save / Bookmark Button (Pinned Right) */}
          <button
            onClick={() => handleInteraction('save')}
            className="transition-transform active:scale-125 focus:outline-none"
          >
            <Bookmark
              size={22}
              className={`transition-colors ${
                state.saved
                  ? 'text-emerald-400 fill-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                  : 'text-slate-200 hover:text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* ── 4. LIKES & LIVE TELEMETRY PILL ────────────────────────────── */}
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[12px] font-bold text-slate-100">
            {totalLikes.toLocaleString()} likes
          </p>

          {(state.liked || state.saved || state.expanded) && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              <Sparkles size={10} />
              Signal Logged
            </span>
          )}
        </div>

        {/* ── 5. INSTAGRAM CAPTION ──────────────────────────────────────── */}
        <div className="text-[13px] text-slate-200 leading-snug">
          <span className="font-bold text-white mr-2">
            {item.category.toLowerCase()}_hub
          </span>
          <span className="text-slate-300 font-medium">{item.title}</span>
        </div>

        {/* Subtle Category Hashtags */}
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-blue-400/80 font-medium">
          <span>#{item.category.toLowerCase()}</span>
          <span>#{item.type.toLowerCase()}</span>
          <span>#irap</span>
        </div>
      </div>
    </article>
  );
}