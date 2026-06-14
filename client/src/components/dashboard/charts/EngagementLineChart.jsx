import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
// 🧠 Import the global brain!
import { useTelemetry } from '../../../hooks/TelemetryContext';

// --- MATH HELPER: Converts an array of raw data numbers into a smooth SVG curve ---
const generateSmoothPath = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return "";
  
  const max = Math.max(...dataArray);
  const min = Math.min(...dataArray);
  const range = max - min || 1;
  const stepX = 100 / (dataArray.length - 1);

  return dataArray.reduce((pathString, val, i) => {
    const x = i * stepX;
    const y = 25 - ((val - min) / range) * 20; 

    if (i === 0) return `M ${x} ${y}`;
    
    const prevX = (i - 1) * stepX;
    const prevY = 25 - ((dataArray[i - 1] - min) / range) * 20;
    const cp1x = prevX + (stepX / 2);
    const cp2x = x - (stepX / 2);
    
    return `${pathString} C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
  }, "");
};

export default function EngagementLineChart() {
  // 1. Pull data directly from the context! No props needed.
  const { events, activeTime } = useTelemetry();

  // --- REAL-TIME DATA ENGINE ---
  const [dataPoints, setDataPoints] = useState(() => {
    const defaultVals = [0, 0, 0, 0, 0, 0, 0];
    return defaultVals.map((val, i) => {
      const time = new Date(Date.now() - (6 - i) * 60000);
      return {
        id: `init-${i}`,
        value: val,
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    });
  });

  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const isWaiting = activeTime === 0 || events.length === 0;

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

  // --- 🧠 TELEMETRY DATA BUCKETING ENGINE ---
  useEffect(() => {
    if (events && events.length > 0) {
      const numBuckets = 7;
      const bucketedScores = Array(numBuckets).fill(0);
      const safeActiveTime = activeTime || 1; 
      
      // Calculate how many seconds each of the 7 buckets represents
      const bucketSize = Math.max(safeActiveTime / numBuckets, 1);

      // Loop through every single interaction from the global state
      events.forEach(e => {
        const eTime = e.sessionTime || 0;
        const bIdx = Math.min(numBuckets - 1, Math.floor(eTime / bucketSize));
        
        let pts = 0;
        switch(e.type) {
          case 'dwell': pts = 0.5; break; 
          case 'view': pts = 10; break;
          case 'hover': pts = 15; break;
          case 'expand': case 'click': pts = 25; break;
          case 'like': case 'dislike': pts = 40; break;
          case 'save': pts = 50; break;
          default: pts = 5; break;
        }
        
        bucketedScores[bIdx] += pts;
      });

      setDataPoints(prev => {
        return bucketedScores.map((score, i) => {
          // Calculate the real clock time for this specific bucket
          const bucketRealTime = Date.now() - ((safeActiveTime - (i * bucketSize)) * 1000);
          
          // Cap the score at 100 for the SVG scale. Add a small baseline (+5) so active buckets aren't totally flat.
          const finalScore = Math.min(100, Math.max(0, score + (score > 0 ? 5 : 0)));
          
          return {
            id: `real-${i}`, 
            value: finalScore,
            time: new Date(bucketRealTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
          };
        });
      });
    }
  }, [events, activeTime]);

  // --- SVG MATH CALCULATOR ---
  const calculateCoordinates = (data) => {
    return data.map((point, index) => {
      // Space the dots horizontally
      const cx = 15 + (index * 45);
      // Calculate vertical position (Y). 115 is the bottom, 20 is the top.
      const cy = 115 - ((point.value / 100) * 95);
      return { ...point, cx, cy };
    });
  };

  const nodes = calculateCoordinates(dataPoints);

  const linePath = nodes.reduce((acc, node, i, arr) => {
    if (i === 0) return `M ${node.cx} ${node.cy}`;
    const prev = arr[i - 1];
    // Curve control points adjusted for the tighter spacing
    return `${acc} C ${prev.cx + 20} ${prev.cy}, ${node.cx - 20} ${node.cy}, ${node.cx} ${node.cy}`;
  }, "");

  const areaPath = `${linePath} L ${nodes[nodes.length - 1].cx} 150 L ${nodes[0].cx} 150 Z`;

  return (
    /* --- REVEAL ANIMATION WRAPPER --- */
    <div 
      ref={containerRef}
      className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      }`}
    >
      {/* INNER CONTENT CARD: Solid design and dimensions */}
      <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-5 flex flex-col h-full w-full justify-between select-none shadow-xl group hover:border-purple-500/30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden">
        
        {/* Top Header Block */}
        <div className="flex justify-between items-center mb-1 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <TrendingUp size={14} />
            </div>
            <h3 className="text-[14px] font-bold text-white tracking-wide flex items-center gap-2">
              Engagement Over Time
            </h3>
          </div>
          
          {/* Sync Status Badge */}
          {isWaiting ? (
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
               <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">SCANNING</span>
             </div>
          ) : (
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">LIVE DATA</span>
             </div>
          )}
        </div>

        {/* Subtitle Value Tracker */}
        <div className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10 shrink-0">
          Engagement Score
        </div>
        
        {/* Interactive Chart Canvas */}
        <div className="flex-1 flex items-end gap-3 relative min-h-0 pt-2 z-10">
          
          {/* Y Axis Numeric Scale Labels */}
          <div className="flex flex-col justify-between h-[82%] text-[10px] font-semibold text-slate-500 font-mono w-6 text-right select-none pb-5">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Main Vector Graphics Container Area */}
          <div className="flex-1 h-[82%] relative border-l border-b border-slate-800/30 pb-5 overflow-hidden rounded-bl-sm">
            {/* ViewBox width adjusted to 300 to match the tighter point spacing */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
              
              <defs>
                <linearGradient id="area-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#070611" stopOpacity="0.00" />
                </linearGradient>
                
                <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Background Static Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#1e1b4b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="43.75" x2="300" y2="43.75" stroke="#1e1b4b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="67.5" x2="300" y2="67.5" stroke="#1e1b4b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="91.25" x2="300" y2="91.25" stroke="#1e1b4b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />

              {/* 1. Translucent Gradient Backdrop Shading Area */}
              <path
                d={areaPath}
                fill="url(#area-glow)"
                className="transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
              />

              {/* 2. Primary Luminous Cyber-Stroke Wave Line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
              />

              {/* 3. Glowing Core Interactive Node Points */}
              {nodes.map((node, idx) => (
                <g key={idx} className="cursor-pointer group/node">
                  <circle 
                    cx={node.cx} cy={node.cy} r="7" fill="#c084fc" opacity="0.2" 
                    className="transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/node:opacity-40 group-hover/node:r-9"
                  />
                  <circle 
                    cx={node.cx} cy={node.cy} r="4" fill="#0c0a18" stroke={isWaiting ? "#475569" : "#d8b4fe"} strokeWidth="1.5"
                    className="transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/node:stroke-white"
                  />
                  
                  {/* Micro Tooltip Indicator */}
                  <g className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <rect 
                      x={node.cx - 16} y={node.cy - 24} width="32" height="14" rx="4" 
                      fill="#16132a" stroke="#8b5cf6" strokeWidth="1" 
                      className="transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-md" 
                    />
                    <text 
                      x={node.cx} y={node.cy - 14} 
                      fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace"
                      className="transition-all duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    >
                      {node.value}%
                    </text>
                  </g>
                </g>
              ))}
            </svg>
            
            {/* X Axis Timestamps Labels Layout */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between text-[9px] font-bold text-slate-500 font-mono select-none px-[5px]">
              {nodes.map((node, i) => (
                <span key={node.id} className={`${i % 2 !== 0 ? 'hidden md:block' : ''} animate-in fade-in duration-1000`}>
                  {node.time}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}