import React, { useState, useEffect, useRef } from 'react';
import { Gavel, TrendingUp, ShieldAlert, Activity, Lock, Cpu, Zap, Database } from 'lucide-react';

// --- SELF-CONTAINED RTB SIMULATOR ---
const generateMockBids = (category, points) => {
  const networks = ["Google AdX", "Meta Network", "Trade Desk", "Amazon DSP", "Criteo", "AppLovin", "Index Exch"];
  const strategies = ["RETARGET", "CONTEXTUAL", "PREDICTIVE", "LOOKALIKE", "PROFILE_SYNC"];

  const numBids = Math.floor(Math.random() * 3) + 4; // 4 to 6 bids to save space
  
  // 🧠 Base value scales with telemetry interaction points
  const baseValue = 0.15;
  const pointMultiplier = Math.max(1, points / 15); 
  
  const bids = [];
  let currentBid = baseValue;

  for (let i = 0; i < numBids; i++) {
    currentBid = currentBid + (Math.random() * 0.40 * pointMultiplier) + 0.10;
    bids.push({
      bidder: networks[Math.floor(Math.random() * networks.length)],
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      amount: currentBid
    });
  }
  return bids;
};

export default function AttentionAuction({ sessionData }) {
  const [bids, setBids] = useState([]);
  const [currentTopBid, setCurrentTopBid] = useState(0.00);
  const [auctionState, setAuctionState] = useState('waiting'); // 'waiting' | 'live' | 'locked'

  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.15 } 
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 🧠 --- EXTRACT REAL TELEMETRY DATA ---
  const scores = sessionData?.interestScores || {};
  let topCategory = null;
  let topScore = 0;

  // Find the highest scoring category
  if (Object.keys(scores).length > 0) {
    topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    topScore = scores[topCategory];
  }

  const isWaiting = !topCategory || topScore === 0;
  const targetLabel = isWaiting ? 'AWAITING DATA' : topCategory.replace('_', ' ').toUpperCase();
  const targetPoints = isWaiting ? 0 : topScore;

  // --- AUCTION ENGINE EFFECT ---
  useEffect(() => {
    if (isWaiting) {
      setAuctionState('waiting');
      setBids([]);
      setCurrentTopBid(0);
      return;
    }

    const startTimer = setTimeout(() => {
      setAuctionState('live');
      
      const finalAuctionResults = generateMockBids(targetLabel, targetPoints);
      const bidQueue = [...finalAuctionResults].reverse(); 
      let currentIndex = 0;

      const ticker = setInterval(() => {
        if (currentIndex < bidQueue.length) {
          const incomingBid = bidQueue[currentIndex];
          
          setBids(prev => [
            { ...incomingBid, id: Date.now() + Math.random() }, 
            ...prev.map(b => ({ ...b, status: 'OUTBID' }))
          ]);
          
          setCurrentTopBid(incomingBid.amount);
          currentIndex++;
        } else {
          clearInterval(ticker);
          setAuctionState('locked');
        }
      }, 900);

      return () => clearInterval(ticker);
    }, 1500);

    return () => clearTimeout(startTimer);
  }, [targetLabel, isWaiting]); 

  return (
    <>
      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- REVEAL ANIMATION WRAPPER --- */}
      <div 
        ref={containerRef}
        className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
      >
        {/* INNER CONTENT CARD: Tightened up with condensed spacing (p-3.5) */}
        <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-3.5 h-full w-full flex flex-col shadow-2xl relative overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          
          {/* Ambient Radial Mesh Background */}
          <div className={`absolute top-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full blur-[100px] pointer-events-none z-0 transition-all duration-1000 ease-in-out ${
            auctionState === 'locked' ? 'bg-rose-900/20' : auctionState === 'live' ? 'bg-emerald-900/15' : 'bg-slate-900/30'
          }`} />

          {/* Header (Compressed layout margin) */}
          <div className="flex justify-between items-center mb-2 z-10 relative shrink-0">
            <h3 className="text-[12px] font-bold text-white flex items-center gap-1.5 tracking-wide">
              Attention Bidding
            </h3>
            
            {/* Status Badge */}
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase transition-colors duration-500 border ${
              auctionState === 'waiting' ? 'bg-slate-800/50 text-slate-400 border-slate-700/50' :
              auctionState === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]' :
              'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
            }`}>
              <span className={`w-1 h-1 rounded-full ${
                auctionState === 'waiting' ? 'bg-slate-500 animate-pulse' :
                auctionState === 'live' ? 'bg-emerald-500 animate-pulse' :
                'bg-rose-500'
              }`} />
              {auctionState === 'waiting' ? 'SCANNING' : auctionState === 'live' ? 'LIVE RTB' : 'LOCKED'}
            </div>
          </div>

          {/* Target Asset Box (Padding and margins reduced from p-3/mb-3 to p-2/mb-2) */}
          <div className={`backdrop-blur-md border rounded-xl p-2 mb-2 flex justify-between items-center z-10 shadow-lg transition-colors duration-500 shrink-0 ${
            isWaiting ? 'bg-[#070611]/40 border-slate-800/50' : 'bg-[#070611]/80 border-slate-700/80'
          }`}>
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[7px] text-slate-500 font-mono tracking-widest uppercase block mb-0.5 flex items-center gap-1">
                <Cpu size={9} /> Target Asset Focus
              </span>
              <span className="text-[10px] font-bold text-slate-200 flex items-center gap-1 truncate">
                <ShieldAlert size={11} className={auctionState === 'locked' ? "text-rose-500" : isWaiting ? "text-slate-600" : "text-emerald-500"} />
                <span className={`px-1 py-0.5 rounded text-[8px] truncate ${isWaiting ? 'bg-slate-800/50 text-slate-500' : 'bg-slate-800 text-white'}`}>{targetLabel}</span>
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[7px] text-slate-500 font-mono tracking-widest uppercase block mb-0.5">Top Bid</span>
              <span className={`text-fa md:text-base font-black font-mono flex items-center justify-end gap-0.5 transition-colors duration-500 ${
                isWaiting ? 'text-slate-600' :
                auctionState === 'locked' ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 
                'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              }`}>
                ${currentTopBid.toFixed(2)}
                {auctionState === 'live' && <TrendingUp size={12} className="text-emerald-500 opacity-80 animate-pulse" />}
              </span>
            </div>
          </div>

          {/* Live Ticker Feed */}
          <div className="flex-1 flex flex-col gap-1.5 z-10 overflow-hidden relative min-h-0">
            <div className="text-[8px] text-slate-400 font-mono tracking-widest uppercase flex items-center justify-between mb-0.5 pb-1 border-b border-slate-800/80 shrink-0">
              <span className="flex items-center gap-1">
                <Activity size={10} className={auctionState === 'locked' ? 'text-rose-500/40' : isWaiting ? 'text-slate-600' : 'text-emerald-500/40'} />
                {auctionState === 'locked' ? 'Final Ledger' : 'Incoming Stream'}
              </span>
              <span>LATENCY: {isWaiting ? '--' : Math.floor(Math.random() * 8 + 4)}ms</span>
            </div>
            
            {/* Added hide-scrollbar class here */}
            <div className="flex-1 flex flex-col gap-1.5 relative min-h-0 overflow-y-auto hide-scrollbar">
              
              {/* Standby State */}
              {isWaiting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 font-mono text-[8px] uppercase tracking-widest gap-1.5 opacity-50">
                  <Database size={14} />
                  Awaiting Telemetry Sync
                </div>
              )}

              {/* Compressed Bids Feed (Reduced item padding to py-1.5) */}
              {bids.map((bid, index) => {
                const isWinner = auctionState === 'locked' && index === 0;
                const isNewest = auctionState === 'live' && index === 0;
                const isOld = index > 0;
                
                return (
                  <div 
                    key={bid.id}
                    className={`flex justify-between items-center py-1.5 px-2 rounded-lg border font-mono transition-all duration-300 ease-out relative overflow-hidden shrink-0 ${
                      isWinner ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.15)] scale-100 opacity-100 z-20' :
                      isNewest ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-100 opacity-100 z-20' : 
                      isOld && index === 1 ? 'bg-[#070611] border-slate-800/40 text-slate-400 scale-[0.99] opacity-75 z-10' :
                      'bg-[#070611] border-slate-900/30 text-slate-600 scale-[0.97] opacity-35 z-0'
                    }`}
                  >
                    {(isWinner || isNewest) && (
                      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${isWinner ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                    )}

                    <div className="flex flex-col pl-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {(isWinner || isNewest) ? (
                          <Gavel size={10} className={isWinner ? 'text-rose-400' : 'text-emerald-400'} /> 
                        ) : (
                          <div className="w-2.5 shrink-0" />
                        )}
                        <span className={`text-[9px] truncate ${(isWinner || isNewest) ? 'font-black tracking-wide' : 'font-medium'}`}>{bid.bidder}</span>
                      </div>
                      <span className={`text-[6.5px] ml-4 mt-0.5 uppercase tracking-wider truncate opacity-60 ${isWinner ? 'text-rose-400' : isNewest ? 'text-emerald-400' : 'text-slate-500'}`}>
                        [{bid.strategy}]
                      </span>
                    </div>
                    
                    <div className="flex items-center shrink-0 ml-2">
                      <span className={`text-[10px] ${isWinner ? 'text-rose-400 font-black' : isNewest ? 'text-emerald-400 font-black' : 'text-slate-600 line-through'}`}>
                        ${bid.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Fade Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0c0a18] to-transparent pointer-events-none z-30" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}