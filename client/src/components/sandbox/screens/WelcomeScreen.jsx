import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  PlayCircle,
  ScanFace,
  Code,
  Database,
  Activity,
  Fingerprint,
  Cpu,
  Radio,
  Sparkles,
  ShieldCheck,
  Crosshair,
  Zap,
  Eye,
  Lock
} from 'lucide-react';
import { BACKGROUND_VIDEOS } from '../data/contentDatabase';

const SYSTEM_TICKER = [
  'BIOMETRIC_VIEWPORT_OBSERVER :: ARMED [THRESHOLD: 0.60]',
  'DWELL_ENGINE_CLOCK :: SYNCHRONIZED AT 100MS INTERVALS',
  'TOUCH_VELOCITY_VECTORS :: CALIBRATED [SWIPE / TAP / HOLD]',
  'RTB_ATTENTION_AUCTION :: STANDBY FOR SHADOW PROFILE',
  'NEURAL_WEIGHT_MATRIX :: READY [10 CATEGORIES LOADED]',
];

export default function WelcomeScreen({ onStart }) {
  // 1. Background Video Cycling (every 10s)
  const [bgIndex, setBgIndex] = useState(0);

  // 2. Scroll Reveal Observer
  const welcomeBoxRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [welcomeBoxVisible, setWelcomeBoxVisible] = useState(false);

  // 3. Interactive Mouse Parallax & HUD Telemetry
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5, rawX: 960, rawY: 540 });
  const [tickerIndex, setTickerIndex] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWelcomeBoxVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (welcomeBoxRef.current) observer.observe(welcomeBoxRef.current);
    return () => observer.disconnect();
  }, []);

  // Video Slideshow Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Live Status Ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % SYSTEM_TICKER.length);
    }, 3200);
    return () => clearInterval(ticker);
  }, []);

  // Initial Boot Counter Animation
  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1400;

    const animateBoot = (now) => {
      const elapsed = now - start;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setBootProgress(progress);
      if (progress < 100) {
        frame = requestAnimationFrame(animateBoot);
      }
    };

    frame = requestAnimationFrame(animateBoot);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mouse / Touch Parallax Handler
  const handlePointerMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    setMousePos({
      x,
      y,
      rawX: Math.round(clientX),
      rawY: Math.round(clientY),
    });
  };

  // Smooth Scroll to Architecture Section
  const scrollToDetails = () => {
    welcomeBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cinematic Launch Sequence
  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setTimeout(() => {
      if (onStart) onStart();
    }, 650);
  };

  // Subtle 3D tilt math for the central scanner core
  const tiltX = (mousePos.y - 0.5) * -18;
  const tiltY = (mousePos.x - 0.5) * 18;

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-24px) scale(1.06); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(24px) scale(0.94); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes sweep-line {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        @keyframes glass-glare {
          0%, 100% { transform: translateX(-150%) rotate(25deg); opacity: 0; }
          45% { opacity: 0; }
          50% { opacity: 0.7; }
          55% { transform: translateX(250%) rotate(25deg); opacity: 0; }
        }
        @keyframes hero-reveal {
          0% { opacity: 0; transform: translateY(36px) scale(0.94); filter: blur(12px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.75; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes grid-drift {
          0% { background-position: 0px 0px; }
          100% { background-position: 40px 40px; }
        }
        .animate-hero {
          animation: hero-reveal 1.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-glare-sweep {
          animation: glass-glare 7s ease-in-out infinite;
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* OUTER MASTER CONTAINER */}
      <div
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className={`w-full h-full bg-[#030207] relative overflow-hidden selection:bg-purple-500/30 transition-all duration-700 ${
          isLaunching ? 'scale-105 opacity-0 blur-md' : 'scale-100 opacity-100'
        }`}
      >
        {/* ================================================================ */}
        {/* 1. DYNAMIC VIDEO SLIDESHOW & MULTI-LAYER ATMOSPHERE              */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#030207]">
          {BACKGROUND_VIDEOS.map((src, idx) => (
            <video
              key={src}
              src={src}
              muted
              loop
              playsInline
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                  if (idx === bgIndex) {
                    el.play().catch(() => {});
                  } else {
                    setTimeout(() => el.pause(), 3000);
                  }
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[3000ms] ease-in-out ${
                idx === bgIndex ? 'opacity-45 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ willChange: 'opacity, transform' }}
            />
          ))}

          {/* Deep Vignette & Cyberpunk Color Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#030207]/95 via-[#13092d]/80 to-[#030207]/95 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#030207_90%)] z-10" />

          {/* Interactive Mouse-Tracking Spotlight */}
          <div
            className="absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(650px circle at ${mousePos.x * 100}% ${
                mousePos.y * 100
              }%, rgba(168, 85, 247, 0.14), rgba(34, 211, 238, 0.06) 40%, transparent 70%)`,
            }}
          />

          {/* Drifting Blueprint Telemetry Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18] animate-[grid-drift_12s_linear_infinite] z-10" />
        </div>

        {/* Ambient Floating Plasma Orbs */}
        <div className="absolute top-1/4 left-1/5 w-[520px] h-[520px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none animate-[float-slow_9s_ease-in-out_infinite] z-0 mix-blend-screen" />
        <div className="absolute bottom-1/5 right-1/5 w-[440px] h-[440px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none animate-[float-delayed_11s_ease-in-out_infinite] z-0 mix-blend-screen" />

        {/* ================================================================ */}
        {/* 2. FIXED SCI-FI VIEWPORT HUD FRAME                               */}
        {/* ================================================================ */}
        <div className="pointer-events-none absolute inset-0 z-30 p-5 md:p-8 flex flex-col justify-between">
          {/* Top HUD Bar */}
          <div className="flex items-start justify-between">
            {/* Top-Left Corner Bracket + System ID */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 border-t-2 border-l-2 border-purple-500/60 rounded-tl-lg" />
              <div className="hidden sm:flex flex-col font-mono text-[10px] tracking-widest uppercase">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Radio size={11} className="text-emerald-400 animate-pulse" />
                  IRAP_CORE // V4.2
                </span>
                <span className="text-slate-500 mt-0.5">
                  BOOT_SYNC: {bootProgress}% • FEED_0{bgIndex + 1}
                </span>
              </div>
            </div>

            {/* Top-Center Live Telemetry Ticker */}
            <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#090714]/80 border border-slate-800/80 backdrop-blur-xl shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-[10px] text-slate-300 tracking-widest uppercase">
                {SYSTEM_TICKER[tickerIndex]}
              </span>
            </div>

            {/* Top-Right Corner Bracket + Live Cursor Vector */}
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex flex-col items-end font-mono text-[10px] tracking-widest uppercase">
                <span className="text-cyan-300 font-bold flex items-center gap-1">
                  <Crosshair size={11} className="text-cyan-400" />
                  VEC_X:{mousePos.rawX} Y:{mousePos.rawY}
                </span>
                <span className="text-slate-500 mt-0.5">SENSOR_RATE: 100MS</span>
              </div>
              <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-500/60 rounded-tr-lg" />
            </div>
          </div>

          {/* Bottom HUD Corners */}
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
              <span className="hidden md:inline-block font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                ZERO-ASSUMPTION COLD START // LOCAL SANDBOX
              </span>
            </div>
            <div className="w-8 h-8 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg" />
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. SCROLLABLE FOREGROUND CONTENT                                 */}
        {/* ================================================================ */}
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto hide-scroll z-20 scroll-smooth"
        >
          <div className="flex flex-col items-center w-full px-4 md:px-6">

            {/* ── SECTION 1: FULL-VIEWPORT HERO (100vh) ───────────────────── */}
            <div className="min-h-screen w-full max-w-5xl flex flex-col items-center justify-center relative py-20">

              {/* 3D PARALLAX BIOMETRIC SCANNER CORE */}
              <div
                className="flex flex-col items-center animate-hero mb-8"
                style={{ animationDelay: '150ms' }}
              >
                <div
                  className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-200 ease-out"
                  style={{
                    transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                  }}
                >
                  {/* Expanding Sonar Pulse Rings */}
                  <div className="absolute inset-4 rounded-full border border-purple-500/30 animate-[pulse-ring_3.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div
                    className="absolute inset-4 rounded-full border border-cyan-400/25 animate-[pulse-ring_3.5s_cubic-bezier(0,0,0.2,1)_infinite]"
                    style={{ animationDelay: '1.75s' }}
                  />

                  {/* Outer SVG Telemetry Degree Ring */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_22s_linear_infinite]"
                    viewBox="0 0 160 160"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      fill="none"
                      stroke="rgba(168,85,247,0.35)"
                      strokeWidth="1.2"
                      strokeDasharray="6 8 22 8"
                    />
                    <circle
                      cx="80"
                      cy="6"
                      r="3"
                      fill="#c084fc"
                    />
                    <circle
                      cx="80"
                      cy="154"
                      r="3"
                      fill="#22d3ee"
                    />
                  </svg>

                  {/* Counter-Rotating Inner Gimbal Ring */}
                  <svg
                    className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-[spin_14s_linear_infinite_reverse]"
                    viewBox="0 0 140 140"
                  >
                    <circle
                      cx="70"
                      cy="70"
                      r="62"
                      fill="none"
                      stroke="rgba(34,211,238,0.35)"
                      strokeWidth="1.5"
                      strokeDasharray="2 6"
                    />
                  </svg>

                  {/* Frosted Core Housing */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0b0818]/90 backdrop-blur-2xl border border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.45),inset_0_0_25px_rgba(34,211,238,0.2)] flex items-center justify-center overflow-hidden group">
                    {/* Vertical Laser Scan Line */}
                    <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-purple-400/40 to-cyan-400/60 animate-[scan-line_2.4s_ease-in-out_infinite] pointer-events-none" />

                    {/* Corner Micro-Crosshairs */}
                    <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-purple-400/70" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-cyan-400/70" />
                    <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-cyan-400/70" />
                    <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-purple-400/70" />

                    <ScanFace
                      size={40}
                      className="text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] relative z-10"
                    />
                  </div>
                </div>
              </div>

              {/* STATUS BADGE & CINEMATIC HERO TYPOGRAPHY */}
              <div
                className="flex flex-col items-center text-center animate-hero"
                style={{ animationDelay: '320ms' }}
              >
                {/* Live Pill Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-6 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] md:text-[11px] font-mono font-bold text-emerald-300 tracking-[0.22em] uppercase">
                    System Initialization Ready
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[1.05] mb-5">
                  <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                    Welcome to the
                  </span>
                  <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-cyan-300 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                    IRAP Sandbox.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-slate-300/90 text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-8 px-2">
                  An interactive algorithmic mirror. Step inside a live social feed where every millisecond of viewport dwell, touch velocity, and micro-hesitation is quantified in real time.
                </p>

                {/* Live Telemetry Spec Strip */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c0a18]/80 border border-slate-800/90 text-[11px] font-mono text-slate-300 backdrop-blur-md">
                    <Eye size={13} className="text-purple-400" />
                    <span>18 Seed Nodes</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c0a18]/80 border border-slate-800/90 text-[11px] font-mono text-slate-300 backdrop-blur-md">
                    <Zap size={13} className="text-cyan-400" />
                    <span>100ms Dwell Precision</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c0a18]/80 border border-slate-800/90 text-[11px] font-mono text-slate-300 backdrop-blur-md">
                    <Fingerprint size={13} className="text-rose-400" />
                    <span>Touch + Mouse Sensors</span>
                  </div>
                </div>

                {/* Quick-Start Primary CTA in Hero (Optional Immediate Entry) */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleLaunch}
                    className="group relative px-8 py-4 bg-[#0c0a18]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:shadow-[0_0_60px_rgba(168,85,247,0.65)] transition-all duration-300 hover:scale-105 active:scale-95 border border-purple-500/60 hover:border-cyan-400"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 -left-[120%] w-[55%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[sweep-line_1.4s_ease-in-out_infinite]" />
                    <div className="absolute inset-[1px] bg-[#05040d]/90 rounded-[15px] transition-colors duration-500 group-hover:bg-transparent" />

                    <span className="relative flex items-center gap-3 font-black tracking-[0.18em] uppercase text-white text-xs sm:text-sm">
                      <PlayCircle
                        size={19}
                        className="text-purple-400 group-hover:text-white transition-colors"
                      />
                      {isLaunching ? 'Engaging Sensors...' : 'Initialize Environment'}
                    </span>
                  </button>

                  <button
                    onClick={scrollToDetails}
                    className="px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <span>Inspect Architecture</span>
                    <ChevronDown size={15} className="text-purple-400" />
                  </button>
                </div>
              </div>

              {/* SCROLL TO EXPLORE INDICATOR */}
              <button
                onClick={scrollToDetails}
                className="absolute bottom-6 flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors animate-hero focus:outline-none"
                style={{ animationDelay: '850ms' }}
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] opacity-80">
                  Scroll to Calibrate
                </span>
                <ChevronDown size={22} className="animate-bounce text-purple-400" />
              </button>
            </div>

            {/* ── SECTION 2: SCROLL-REVEAL ARCHITECTURE MATRIX ────────────── */}
            <div
              ref={welcomeBoxRef}
              className="w-full max-w-4xl flex flex-col items-center pb-36 pt-8"
            >
              {/* HYPER-REALISTIC GLASSMORPHISM COMMAND CARD */}
              <div
                className={`w-full bg-[#0a0816]/75 backdrop-blur-2xl border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.75)] mb-12 relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  welcomeBoxVisible
                    ? 'opacity-100 translate-y-0 blur-none'
                    : 'opacity-0 translate-y-24 blur-md'
                }`}
              >
                {/* Sweeping Glass Glare Overlay */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-20 mix-blend-overlay">
                  <div className="absolute -top-1/2 -left-full w-1/2 h-[220%] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-glare-sweep" />
                </div>

                {/* Top Neon Hairline Accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                        Behavioral Telemetry Pipeline
                        <ShieldCheck size={15} className="text-emerald-400" />
                      </h2>
                      <p className="text-[11px] font-mono text-slate-400">
                        Transparent Algorithmic Profiling • Zero Black-Box Scoring
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                    3-Stage Loop
                  </span>
                </div>

                <p className="text-slate-200/95 leading-relaxed mb-8 text-center text-xs sm:text-sm max-w-2xl mx-auto font-medium relative z-10">
                  This controlled environment demonstrates how modern recommendation engines monetize human attention. As you browse the feed, our telemetry sensors convert your subconscious habits into a live shadow dossier.
                </p>

                {/* 3-Step Interactive Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                  {/* STAGE 1 */}
                  <div className="group bg-[#06050f]/90 hover:bg-[#0d0a1f]/90 border border-slate-800/90 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          <Activity size={18} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-400/90 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                          STAGE 01
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                        1. Explore Naturally
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Scroll the Instagram-style stream, double-tap visuals, expand code threads, vote in polls, or pass on topics that bore you.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>SENSORS</span>
                      <span className="text-blue-300 font-bold">VIEW • TAP • SWIPE</span>
                    </div>
                  </div>

                  {/* STAGE 2 */}
                  <div className="group bg-[#06050f]/90 hover:bg-[#0d0a1f]/90 border border-slate-800/90 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                          <Database size={18} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-purple-400/90 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                          STAGE 02
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                        2. Quantify Signals
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The global brain scores every micro-action with weighted multipliers and injects targeted nodes directly into your active feed.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>WEIGHTS</span>
                      <span className="text-purple-300 font-bold">+1 VIEW TO +15 SAVE</span>
                    </div>
                  </div>

                  {/* STAGE 3 */}
                  <div className="group bg-[#06050f]/90 hover:bg-[#0d0a1f]/90 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                          <Code size={18} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                          STAGE 03
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                        3. Decode Dossier
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Compile your session to unlock the full analytics dashboard, RTB ad-auction simulator, and downloadable UDS PDF/JSON dossier.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>OUTPUT</span>
                      <span className="text-cyan-300 font-bold">SHADOW PROFILE + RTB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM LAUNCH BUTTON */}
              <div
                className={`flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  welcomeBoxVisible
                    ? 'opacity-100 translate-y-0 blur-none'
                    : 'opacity-0 translate-y-24 blur-md'
                }`}
                style={{ transitionDelay: welcomeBoxVisible ? '300ms' : '0ms' }}
              >
                <button
                  onClick={handleLaunch}
                  className="group relative px-10 md:px-14 py-5 bg-[#0c0a18]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:shadow-[0_0_70px_rgba(34,211,238,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 border border-purple-500/60 hover:border-cyan-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 -left-[120%] w-[55%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[sweep-line_1.4s_ease-in-out_infinite]" />
                  <div className="absolute inset-[1px] bg-[#040308]/90 rounded-[15px] transition-colors duration-500 group-hover:bg-transparent" />

                  <span className="relative flex items-center gap-3 font-black tracking-[0.2em] uppercase text-purple-300 group-hover:text-white transition-colors duration-500 text-xs md:text-sm">
                    <Sparkles
                      size={18}
                      className="text-cyan-400 group-hover:text-white group-hover:rotate-12 transition-transform"
                    />
                    {isLaunching ? 'Calibrating Telemetry...' : 'Initialize Environment'}
                  </span>
                </button>

                <span className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock size={11} className="text-emerald-400" />
                  Client-Side Telemetry Sandbox • Press to Begin Session
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}