import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, Crosshair, MousePointerClick, Target } from 'lucide-react';
import Sparkline from "../charts/sparkline.jsx";

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

// --- TIME FORMATTER (Converts seconds to 0m 0s) ---
const formatTime = (totalSeconds) => {
  if (!totalSeconds) return "0m 0s";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
};

export default function StatsRow({ sessionData }) {
  // 🧠 1. EXTRACT REAL DATA FROM TELEMETRY
  const signals = sessionData?.signals || {};
  const activeTime = sessionData?.activeTime || 0;
  const scores = sessionData?.interestScores || {};

  // --- SCROLL REVEAL LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.10 } // Triggers early as soon as the row peeks onto the screen
    );

    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  // 🧠 2. CALCULATE DERIVED METRICS
  const nodesCaptured = signals.totalEvents || 0;
  const dwellString = formatTime(activeTime);
  const contentEvaluated = signals.totalViews || 0;
  
  // Micro-interactions = Everything that isn't a passive view
  const microInteractions = (signals.totalLikes || 0) + 
                            (signals.totalSaves || 0) + 
                            (signals.totalExpands || 0) + 
                            (signals.totalDislikes || 0);

  // Find the category with the highest score
  let dominantTag = "ANALYZING...";
  if (Object.keys(scores).length > 0) {
    const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    if (scores[topCategory] > 0) {
      dominantTag = topCategory.replace('_', ' ').toUpperCase();
    }
  }

  // --- LIVE SIMULATOR ENGINE FOR SPARKLINE ANIMATIONS ---
  const fallbackGraph = [20, 25, 22, 30, 28, 35, 32];
  const [chartData, setChartData] = useState({
    events: [...fallbackGraph],
    time: fallbackGraph.map(v => v * 0.8),
    focus: fallbackGraph.map(v => v * 1.2),
    interactions: fallbackGraph.map(v => v * 0.9),
    depth: fallbackGraph.map(v => v * 1.1),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const step = (arr, maxVariance) => {
          const lastVal = arr[arr.length - 1];
          const newVal = Math.max(0, lastVal + (Math.random() * maxVariance - maxVariance / 2));
          return [...arr.slice(1), newVal];
        };
        return {
          events: step(prev.events, 10),
          time: step(prev.time, 15),
          focus: step(prev.focus, 4),
          interactions: step(prev.interactions, 30),
          depth: step(prev.depth, 8),
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: "Telemetry Nodes", value: nodesCaptured.toLocaleString(), increase: "CAPTURED", icon: <Activity size={16} />, 
      color: "text-blue-400", hex: "#3b82f6", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30",
      path: generateSmoothPath(chartData.events)
    },
    { 
      label: "Session Dwell", value: dwellString, increase: "TRACKED", icon: <Clock size={16} />, 
      color: "text-purple-400", hex: "#a855f7", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30",
      path: generateSmoothPath(chartData.time)
    },
    { 
      label: "Primary Focus", value: dominantTag, increase: "CONFIRMED", icon: <Crosshair size={16} />, 
      color: "text-emerald-400", hex: "#10b981", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30",
      path: generateSmoothPath(chartData.focus)
    },
    { 
      label: "Micro-Interactions", value: microInteractions.toLocaleString(), increase: "LOGGED", icon: <MousePointerClick size={16} />, 
      color: "text-orange-400", hex: "#f97316", bg: "bg-orange-500/10", border: "group-hover:border-orange-500/30",
      path: generateSmoothPath(chartData.interactions)
    },
    { 
      label: "Content Evaluated", value: contentEvaluated.toLocaleString(), increase: "ANALYZED", icon: <Target size={16} />, 
      color: "text-pink-400", hex: "#ec4899", bg: "bg-pink-500/10", border: "group-hover:border-pink-500/30",
      path: generateSmoothPath(chartData.depth)
    },
  ];

  return (
    <div 
      ref={rowRef} 
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full"
    >
      {stats.map((stat, index) => (
        <div 
          key={index} 
          style={{ 
            transitionDelay: isVisible ? `${index * 80}ms` : '0ms' 
          }}
          className={`relative bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-3.5 pb-10 overflow-hidden group cursor-pointer 
            transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
            hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0c0a18] ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-[0.98]'
            } ${stat.border}`}
        >
          {/* Sweeping Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none" />
          
          <div className="flex items-center gap-2.5 relative z-10">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 leading-tight">
                {stat.label}
              </span>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="text-sm md:text-sm lg:text-base font-black text-white uppercase tracking-wider leading-none truncate group-hover:text-slate-100 transition-colors duration-500 max-w-[80%]">
                  {stat.value}
                </span>
                <span className="text-[8px] font-bold text-emerald-400 tracking-wider shrink-0 leading-none">
                  {stat.increase}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" />

          {/* Sparkline Visual Component */}
          <Sparkline path={stat.path} hex={stat.hex} index={index} />
        </div>
      ))}
    </div>
  );
}