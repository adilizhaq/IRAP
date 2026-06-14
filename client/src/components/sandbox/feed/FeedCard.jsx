import React, { useRef, useEffect } from 'react';
import { Heart, Bookmark, ThumbsDown } from 'lucide-react';
import CardBody from './CardBody';

// 🧠 1. IMPORT THE TELEMETRY SENSOR
import { useTelemetry } from '../../../hooks/TelemetryContext';

const COLOR_MAP = {
  blue:    'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60',
  purple:  'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60',
  orange:  'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60',
  teal:    'text-teal-400 bg-teal-500/10 border-teal-500/30 hover:border-teal-500/60',
  rose:    'text-rose-400 bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60',
  red:     'text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-500/60',
  amber:   'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60',
};

const getColor = (color) => COLOR_MAP[color] || COLOR_MAP.blue;

export default function FeedCard({ item, state, onMouseEnter, onMouseLeave, onAction }) {
  // 🧠 2. GRAB TELEMETRY FUNCTIONS FROM THE BRAIN
  const { handleView, handleHover, handleAction: trackAction } = useTelemetry();
  
  // 3. Create a reference to this specific DOM element
  const cardRef = useRef(null);

  // 4. INTERSECTION OBSERVER (The "Eyes" of the Sensor)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If at least 60% of this card is on the screen...
        if (entry.isIntersecting) {
          handleView(item.category); // Tell the brain what they are looking at!
        }
      },
      { 
        threshold: 0.6, // 60% visibility required to trigger a "view"
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [item.category, handleView]);

  // 5. WRAPPER FUNCTIONS (Fires telemetry + original UI updates)
  const handleCardHover = () => {
    handleHover(item.category);
    if (onMouseEnter) onMouseEnter(); // Keep original props working
  };

  const handleInteraction = (actionType) => {
    trackAction(actionType, item.category); // Log it to the brain
    if (onAction) onAction(actionType);     // Update the local UI (pink hearts, etc.)
  };

  return (
    <div
      ref={cardRef} // Attach the observer here!
      onMouseEnter={handleCardHover}
      onMouseLeave={onMouseLeave}
      className="bg-[#080614] border border-slate-800/80 hover:border-slate-600/80 rounded-2xl p-6 transition-all duration-500 shadow-sm"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getColor(item.color)}`}>
          <item.icon size={18} />
        </div>
        <div>
          <p className="text-[15px] font-bold text-slate-100">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-medium text-slate-500">{item.subtitle}</span>
            <span className="text-slate-700">•</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.difficulty}</span>
          </div>
        </div>
      </div>

      {/* ── BODY (type-switched content + expand button) ─────────────────── */}
      <CardBody
        item={item}
        state={state}
        onAction={handleInteraction} // Use wrapped handler for expands/clicks inside body
      />

      {/* ── ACTION BAR ──────────────────────────────────────────────────── */}
      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleInteraction('like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              state.liked
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
            }`}
          >
            <Heart size={16} className={state.liked ? 'fill-current' : ''} />
            {state.liked ? 'Liked' : 'Like'}
          </button>

          <button
            onClick={() => handleInteraction('save')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
              state.saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
            }`}
          >
            <Bookmark size={16} className={state.saved ? 'fill-current' : ''} />
            {state.saved ? 'Saved' : 'Save'}
          </button>
        </div>

        <button
          onClick={() => handleInteraction('dislike')}
          title="Not Interested"
          className="px-4 py-2 text-slate-500 hover:text-red-400 bg-slate-800/20 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 text-[12px] font-bold"
        >
          <ThumbsDown size={14} />
          <span className="hidden sm:inline">Pass</span>
        </button>
      </div>
    </div>
  );
}