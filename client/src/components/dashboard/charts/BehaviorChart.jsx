import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radar } from 'lucide-react';
// 🧠 Import the global brain! (Adjust path if necessary based on your folder structure)
import { useTelemetry } from '../../../hooks/TelemetryContext';

export default function BehaviorOverview() {
  // 1. Pull data directly from the global context, NO PROPS NEEDED!
  const { behavioralTraits, interestScores, activeTime } = useTelemetry();

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

  const [metrics, setMetrics] = useState([
    { label: 'Engagement', value: 15 },
    { label: 'Curiosity', value: 15 },
    { label: 'Consistency', value: 15 },
    { label: 'Exploration', value: 15 },
    { label: 'Attention Span', value: 15 },
  ]);

  // If the user hasn't spent any time in the sandbox yet, we are waiting
  const isWaiting = activeTime === 0;

  const size = 260;
  const center = size / 2;
  const radius = 90;

  // --- THE MATH ENGINE & IDLE ANIMATION ---
  useEffect(() => {
    // 🧠 1. CHECK FOR NEW TELEMETRY TRAITS
    if (isWaiting) {
      const idleInterval = setInterval(() => {
        setMetrics(prev => prev.map(m => ({
          ...m,
          value: 15 + Math.random() * 5 
        })));
      }, 1500);
      return () => clearInterval(idleInterval);
    }

    // 🧠 2. Calculate "Consistency" based on how heavily focused they are on their top interest
    const totalScore = Object.values(interestScores).reduce((sum, val) => sum + Math.max(0, val), 0) || 1;
    const maxScore = Object.values(interestScores).length > 0 ? Math.max(...Object.values(interestScores)) : 0;
    const consistencyScore = Math.min(100, Math.max(15, (maxScore / totalScore) * 100));

    // 🧠 3. MAP BRAIN TRAITS TO RADAR POINTS
    setMetrics([
      // Engagement = "Collector" trait (High saves/likes)
      { label: 'Engagement', value: Math.max(15, Math.floor(behavioralTraits.collector || 0)) },
      
      // Curiosity = "Scanner" trait (High view rate across feed)
      { label: 'Curiosity', value: Math.max(15, Math.floor(behavioralTraits.scanner || 0)) },
      
      // Consistency = Algorithmic focus metric calculated above
      { label: 'Consistency', value: Math.floor(consistencyScore) },
      
      // Exploration = "Explorer" trait (Many different categories visited)
      { label: 'Exploration', value: Math.max(15, Math.floor(behavioralTraits.explorer || 0)) },
      
      // Attention Span = "Researcher" trait (High dwell time)
      { label: 'Attention Span', value: Math.max(15, Math.floor(behavioralTraits.researcher || 0)) },
    ]);
  }, [behavioralTraits, interestScores, isWaiting]);

  // --- SVG RADAR COORDINATE MATH ---
  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const distance = (value / 100) * radius;
    return { x: center + distance * Math.cos(angle), y: center + distance * Math.sin(angle) };
  };

  const dataPoints = metrics.map((m, i) => getPoint(m.value, i, metrics.length));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <>
      {/* --- REVEAL ANIMATION WRAPPER --- */}
      <div 
        ref={cardRef}
        className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
        }`}
      >
        {/* SLEEK INNER WRAPPER: Matches grid column height perfectly */}
        <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-5 flex flex-col h-full w-full shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-2 z-10 relative shrink-0">
            <h3 className="text-[13px] font-bold text-white tracking-wide flex items-center gap-1.5">
              <Activity size={15} className="text-purple-400" />
              Behavior Overview
            </h3>
            
            {/* Clean Status Badge */}
            {isWaiting ? (
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">SCANNING</span>
               </div>
            ) : (
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">LIVE DATA</span>
               </div>
            )}
          </div>

          {/* Radar Chart Area */}
          <div className="flex-1 flex items-center justify-center relative -mt-2 z-10">
            
            {/* THE STANDBY OVERLAY */}
            {isWaiting && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0c0a18]/60 backdrop-blur-[2px] rounded-xl transition-opacity duration-500">
                <Radar className="text-purple-500 animate-spin mb-3 opacity-80" size={28} />
                <p className="text-[11px] font-black text-purple-400 tracking-widest uppercase">Awaiting Telemetry</p>
                <p className="text-[9px] font-mono text-slate-400 mt-1.5 uppercase tracking-wide">Enter Sandbox to Begin</p>
              </div>
            )}

            <div style={{ width: size, height: size }} className="relative">
              <svg width={size} height={size} className="overflow-visible absolute inset-0">
                
                {/* Background Grid Circles */}
                {[0.25, 0.5, 0.75, 1].map((level, index) => (
                  <circle
                    key={index} cx={center} cy={center} r={radius * level}
                    fill="none" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4"
                  />
                ))}

                {/* Background Grid Web Lines */}
                {metrics.map((_, index) => {
                  const outerPoint = getPoint(100, index, metrics.length);
                  return (
                    <line
                      key={index} x1={center} y1={center} x2={outerPoint.x} y2={outerPoint.y}
                      stroke="#1e1b4b" strokeWidth="1"
                    />
                  );
                })}

                {/* DYNAMIC DATA SHAPE (Clean Purple) */}
                <polygon
                  points={dataPolygon}
                  fill="rgba(139, 92, 246, 0.2)"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  className={`drop-shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${isWaiting ? 'duration-1000' : 'duration-[1.5s]'}`}
                />

                {/* DYNAMIC DOTS */}
                {dataPoints.map((point, index) => (
                  <circle
                    key={index} cx={point.x} cy={point.y} r="4"
                    fill="#c084fc" stroke="#0c0a18" strokeWidth="1.5"
                    className={`transition-all ease-[cubic-bezier(0.4,0,0.2,1)] hover:r-[6] cursor-crosshair ${isWaiting ? 'duration-1000' : 'duration-[1.5s]'}`}
                  />
                ))}
              </svg>

              {/* DYNAMIC LABELS */}
              {metrics.map((metric, index) => {
                const labelPoint = getPoint(135, index, metrics.length);
                return (
                  <div
                    key={metric.label}
                    className="absolute flex flex-col items-center justify-center pointer-events-none"
                    style={{
                      left: `${labelPoint.x}px`,
                      top: `${labelPoint.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-widest">{metric.label}</p>
                    <p className={`text-[12px] font-black leading-tight transition-colors duration-500 ${isWaiting ? 'text-slate-600' : 'text-white'}`}>
                      {isWaiting ? '--%' : `${metric.value}%`}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
          
          {/* Background Ambient Glow (Subtle) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-purple-600 blur-[80px] opacity-10 pointer-events-none" />
        </div>
      </div>
    </>
  );
}