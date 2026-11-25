import React from 'react';

export default function Sparkline({ path, hex, index }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-40 group-hover:opacity-100 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sparkline-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hex} stopOpacity="0.35" />
            <stop offset="100%" stopColor={hex} stopOpacity="0" />
          </linearGradient>
          
          {/* Subtle glow filter for the main stroke */}
          <filter id={`glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Fill area underneath the line */}
        <path d={`${path} L 100 30 L 0 30 Z`} fill={`url(#sparkline-grad-${index})`} className="transition-all duration-500" />
        
        {/* The actual stroke line with neon glow */}
        <path 
          d={path} 
          fill="none" 
          stroke={hex} 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke" 
          strokeLinecap="round" 
          filter={`url(#glow-${index})`}
        />
      </svg>
    </div>
  );
}