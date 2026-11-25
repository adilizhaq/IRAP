import React from 'react';
import {
  Activity,
  Cpu,
  Database,
  Fingerprint,
  Radio,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BACKGROUND_VIDEOS } from '../data/contentDatabase';

export default function CompilingScreen({ compileText }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#030207] text-center text-white selection:bg-purple-500/30">
      <style>{`
        @keyframes compile-grid-drift {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        @keyframes compile-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes compile-ring {
          0% { transform: scale(.82); opacity: .7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes compile-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Shared cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030207]">
        <video
          src={BACKGROUND_VIDEOS[0]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030207]/95 via-[#13092d]/80 to-[#030207]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#030207_85%)]" />
        <div className="absolute inset-0 animate-[compile-grid-drift_12s_linear_infinite] bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18]" />
        <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-[110px]" />
      </div>

      {/* HUD frame */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-5 md:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-purple-500/60" />
            <div className="hidden flex-col font-mono text-[10px] uppercase tracking-widest sm:flex">
              <span className="flex items-center gap-1.5 font-bold text-purple-300">
                <Radio size={11} className="animate-pulse text-emerald-400" />
                IRAP_CORE // V4.2
              </span>
              <span className="mt-0.5 text-slate-500">PROFILE COMPILER: ACTIVE</span>
            </div>
          </div>
          <div className="hidden items-center gap-2.5 rounded-full border border-slate-800/80 bg-[#090714]/80 px-4 py-1.5 shadow-lg backdrop-blur-xl sm:flex">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
              BEHAVIORAL MATRIX // PROCESSING
            </span>
          </div>
          <div className="h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-cyan-500/60" />
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-cyan-500/50" />
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-slate-500 md:inline-block">
              SESSION DATA // LOCAL PROCESSING
            </span>
          </div>
          <div className="h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-purple-500/50" />
        </div>
      </div>

      {/* Compile status panel */}
      <main className="relative z-10 mx-4 flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-700/70 bg-[#0a0816]/75 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:mx-6 sm:p-10">
        <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

        <div className="relative mb-8 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
          <div className="absolute inset-3 animate-[compile-ring_2.4s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-purple-500/35" />
          <div className="absolute inset-3 animate-[compile-ring_2.4s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-cyan-400/25 [animation-delay:1.2s]" />
          <svg className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]" viewBox="0 0 160 160" aria-hidden="true">
            <circle cx="80" cy="80" r="73" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1.2" strokeDasharray="6 8 22 8" />
            <circle cx="80" cy="7" r="3" fill="#c084fc" />
            <circle cx="80" cy="153" r="3" fill="#22d3ee" />
          </svg>
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-purple-500/50 bg-[#0b0818]/90 shadow-[0_0_45px_rgba(168,85,247,0.35),inset_0_0_24px_rgba(34,211,238,0.18)] sm:h-24 sm:w-24">
            <div className="pointer-events-none absolute inset-x-0 h-10 animate-[compile-scan_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-purple-400/40 to-cyan-400/60" />
            <Cpu size={38} className="relative z-10 text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
          </div>
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          <Sparkles size={13} className="text-purple-300" />
          Synthesizing Session
        </div>

        <h1 className="mb-3 text-2xl font-black uppercase tracking-[0.16em] sm:text-3xl">
          <span className="bg-gradient-to-r from-purple-200 via-fuchsia-100 to-cyan-200 bg-clip-text text-transparent">
            Compiling Profile
          </span>
        </h1>
        <p aria-live="polite" className="min-h-6 max-w-md font-mono text-xs leading-relaxed tracking-wide text-cyan-300 sm:text-sm">
          {compileText || 'Initializing Behavioral Matrix...'}
        </p>

        <div className="mt-8 w-full max-w-sm">
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5"><Activity size={11} className="text-purple-400" /> Signal analysis</span>
            <span>In progress</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-800/90">
            <div className="absolute inset-y-0 left-0 animate-[compile-progress_2.7s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.55)]" />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-wider text-slate-400 sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#06050f]/80 px-2.5 py-1.5"><Database size={12} className="text-purple-400" /> Signals</span>
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#06050f]/80 px-2.5 py-1.5"><Fingerprint size={12} className="text-cyan-400" /> Profile</span>
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#06050f]/80 px-2.5 py-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Secure</span>
        </div>
      </main>
    </div>
  );
}
