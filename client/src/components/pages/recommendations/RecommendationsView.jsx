import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Fingerprint, ArrowLeft } from 'lucide-react';

// Import our modularized files
import { DEEP_DATABASE } from './recommendationData';
import RecommendationCard from './RecommendationCard';

export default function RecommendationsView({ sessionData, onNavigate }) {
  const [isGenerating, setIsGenerating] = useState(true);

  // --- 🧠 ENGINE GENERATOR LOGIC ---
  const feed = useMemo(() => {
    // SAFELY pull scores, defaulting to an empty object if no session exists yet
    const scores = sessionData?.interestScores || {};
    let generatedFeed = [];
    
    // Sort categories by how many points the user scored
    const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    // Generate cards based on their actual behavior
    sortedCategories.forEach((cat) => {
      const normalizedCat = cat.toLowerCase(); // Map correctly to our DB
      const score = scores[cat];

      if (score > 0 && DEEP_DATABASE[normalizedCat]) {
        // If they liked it A LOT (over 30 pts), give them 2 cards from this category
        const numCards = score > 30 ? 2 : 1; 
        
        for (let i = 0; i < numCards; i++) {
          const content = DEEP_DATABASE[normalizedCat][i % DEEP_DATABASE[normalizedCat].length];
          
          // Generate the "Transparency Reason"
          let reasonText = "";
          if (score > 40) reasonText = `Primary Affinity Detected (${score} Interaction Points)`;
          else if (score > 15) reasonText = `Strong Engagement with ${cat.toUpperCase()} content`;
          else reasonText = `Passive Viewing Recorded (${score} points)`;

          generatedFeed.push({
            id: `${normalizedCat}-${i}-${Date.now()}`,
            ...content,
            category: cat,
            matchScore: Math.min(99, 60 + Math.floor(score / 2) + Math.floor(Math.random() * 10)),
            reason: reasonText
          });
        }
      }
    });

    // 🛡️ FALLBACK: If the user clicked/viewed nothing, show default algorithm picks!
    if (generatedFeed.length === 0) {
      generatedFeed.push({ ...DEEP_DATABASE.programming[0], category: 'programming', matchScore: 85, reason: "Algorithm Default Pick (No Session Data)" });
      generatedFeed.push({ ...DEEP_DATABASE.startups[0], category: 'startups', matchScore: 82, reason: "Algorithm Default Pick (No Session Data)" });
    }

    // Sort by highest match score
    return generatedFeed.sort((a, b) => b.matchScore - a.matchScore);
  }, [sessionData]);

  // Simulate the "Compiling" time for dramatic effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex-1 flex flex-col h-full relative overflow-y-auto hide-scroll bg-[#040308] animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none z-0" />
        
        <div className="max-w-[1200px] mx-auto w-full px-6 py-8 relative z-10">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-800/60 pb-6">
            <div>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-[12px] font-bold tracking-widest uppercase mb-6"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wide flex items-center gap-4">
                Curated Feed
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                  <Sparkles size={18} className="text-purple-400" />
                </div>
              </h1>
              <p className="text-slate-500 mt-2 text-sm max-w-xl">
                This is a fully transparent recommendation feed. Every item below was explicitly calculated based on your interactions in the Sandbox.
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-3 bg-[#080614] border border-slate-800 rounded-xl px-4 py-3 shadow-lg">
                <Fingerprint size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target Profile</p>
                  <p className="text-[13px] font-bold text-white capitalize">
                    {sessionData && Object.keys(sessionData?.interestScores || {}).length > 0 
                      ? Object.keys(sessionData.interestScores).reduce((a, b) => sessionData.interestScores[a] > sessionData.interestScores[b] ? a : b).replace('_', ' ') 
                      : "Scanning..."}
                  </p>
                </div>
                {isGenerating ? (
                   <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse ml-2" />
                ) : (
                   <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] ml-2" />
                )}
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {isGenerating ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <RecommendationSkeleton key={i} />
              ))}
            </div>
          ) : (
            /* LOADED FEED GRID */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
              {feed.map((item, index) => (
                <RecommendationCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// -----------------------------
// LOADING SKELETON COMPONENT
// -----------------------------
function RecommendationSkeleton() {
  return (
    <div className="h-[240px] bg-[#080614] border border-slate-800/50 rounded-2xl p-6 flex gap-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="w-[180px] h-full bg-slate-900/50 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-4 py-2">
        <div className="h-4 w-24 bg-slate-900/50 rounded-md" />
        <div className="h-6 w-3/4 bg-slate-900/50 rounded-md" />
        <div className="h-12 w-full bg-slate-900/50 rounded-md mt-2" />
        <div className="h-10 w-full bg-slate-900/30 rounded-xl mt-auto border border-slate-800/30" />
      </div>
    </div>
  );
}