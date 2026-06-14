import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, GraduationCap, Gamepad2, FlaskConical, Tv, Activity, 
  Brain, Rocket, Car, DollarSign, Microscope, Lightbulb, Code ,Clock 
} from 'lucide-react';

export default function InterestScores({ sessionData }) {
  const [isWaiting, setIsWaiting] = useState(true);

  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the box is visible
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // --- INITIAL / STANDBY STATE ---
  const [interests, setInterests] = useState([
    { name: 'Technology', score: 0, icon: <Cpu size={14} />, color: 'bg-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    { name: 'Gaming', score: 0, icon: <Gamepad2 size={14} />, color: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { name: 'Entertainment', score: 0, icon: <Tv size={14} />, color: 'bg-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400' },
    { name: 'Sports', score: 0, icon: <Activity size={14} />, color: 'bg-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    { name: 'Education', score: 0, icon: <GraduationCap size={14} />, color: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  ]);

  // --- LIVE TELEMETRY PARSER ---
  useEffect(() => {
    // 🧠 1. TARGET THE NEW INTEREST SCORES OBJECT
    const scores = sessionData?.interestScores || {};
    const scoreKeys = Object.keys(scores);

    if (!sessionData || scoreKeys.length === 0) {
      setIsWaiting(true);
      return;
    }

    setIsWaiting(false);

    // Expanded Theme Map to handle all new Sandbox Categories
    const themeMap = {
      programming: { name: 'Programming', icon: <Code size={14} />, color: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
      ai: { name: 'Artificial Intelligence', icon: <Brain size={14} />, color: 'bg-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
      startups: { name: 'Startups', icon: <Rocket size={14} />, color: 'bg-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
      gaming: { name: 'Gaming', icon: <Gamepad2 size={14} />, color: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
      finance: { name: 'Finance', icon: <DollarSign size={14} />, color: 'bg-teal-500', bg: 'bg-teal-500/10', text: 'text-teal-400' },
      psychology: { name: 'Psychology', icon: <Microscope size={14} />, color: 'bg-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400' },
      cars: { name: 'Motorsports', icon: <Car size={14} />, color: 'bg-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
      entrepreneurship: { name: 'Business', icon: <Lightbulb size={14} />, color: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
      productivity: { name: 'Workflow', icon: <Clock size={14} />, color: 'bg-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400' }
    };

    // 2. Calculate total POSITIVE points (clamp negative dislikes to 0 for percentage math)
    const totalScore = scoreKeys.reduce((sum, key) => {
      return sum + Math.max(0, Number(scores[key]));
    }, 0);

    // 3. Convert points to percentages and apply themes
    const mappedInterests = scoreKeys.map(key => {
      const rawScore = Math.max(0, scores[key]); // Ignore negative scores for the progress bars
      const percentage = totalScore > 0 ? Math.round((rawScore / totalScore) * 100) : 0; 
      
      const themeKey = key.toLowerCase();
      // Auto-format name just in case a category isn't in the theme map
      const fallbackName = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
      const theme = themeMap[themeKey] || { name: fallbackName, icon: <FlaskConical size={14} />, color: 'bg-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-400' };

      return {
        ...theme,
        score: percentage
      };
    });

    // 4. Sort from highest interest to lowest
    mappedInterests.sort((a, b) => b.score - a.score);

    // 5. Fallback fill if they didn't interact enough to hit 5 categories
    while (mappedInterests.length < 5) {
      mappedInterests.push({ name: 'Processing...', score: 0, icon: <Activity size={14} />, color: 'bg-slate-800', bg: 'bg-slate-800/10', text: 'text-slate-600' });
    }

    // Apply Top 5!
    setInterests(mappedInterests.slice(0, 5));

  }, [sessionData]);

  return (
    <>
      {/* --- REVEAL ANIMATION WRAPPER --- */}
      <div 
        ref={cardRef}
        className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
      >
        {/* Inner Card (Kept h-full w-full flex structure to lock nicely into CSS Grid) */}
        <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-4 flex flex-col h-full w-full relative overflow-hidden shadow-lg group hover:border-purple-500/30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          
          {/* Ambient background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500 blur-[80px] opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity duration-700" />

          {/* Header */}
          <div className="flex justify-between items-center mb-2 z-10 relative">
            <h3 className="text-[13px] font-bold text-white tracking-wide flex items-center gap-1.5">
              Interest Scores
            </h3>

            {/* Sync Status Badge */}
            {isWaiting ? (
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">SCANNING</span>
               </div>
            ) : (
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">SYNCED</span>
               </div>
            )}
          </div>

          {/* List Container */}
          <div className="flex flex-col justify-around flex-1 min-h-0 py-1 z-10 relative">
            {interests.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="flex items-center gap-3 group/item">
                
                {/* Icon */}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-110 ${item.bg} ${item.text}`}>
                  {item.icon}
                </div>
                
                {/* Bar & Text Container */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[12px] font-medium truncate capitalize ${isWaiting ? 'text-slate-500' : 'text-slate-300'}`}>{item.name}</span>
                    <span className={`text-[12px] font-bold ml-2 transition-colors duration-500 ${isWaiting ? 'text-slate-600' : 'text-white'}`}>
                      {item.score}%
                    </span>
                  </div>
                  
                  {/* Progress Bar Track */}
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color} shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]`} 
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}