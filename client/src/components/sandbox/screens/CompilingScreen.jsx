import React from 'react';
import { Loader2 } from 'lucide-react';

// ============================================================================
// CompilingScreen
// ----------------------------------------------------------------------------
// Full-screen overlay shown during the 4-second compile sequence after the
// user clicks "Analyze Profile". Pure display — no state, no effects.
//
// Props:
//   compileText — string   the animated status line driven by useSandboxEngine
// ============================================================================

export default function CompilingScreen({ compileText }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#040308] relative overflow-hidden text-center z-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <Loader2 className="animate-spin text-purple-500 mb-8" size={64} />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Algorithm Compiling</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider animate-pulse">{compileText}</p>

        <div className="w-64 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden relative">
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-purple-500 to-cyan-400 animate-[loading_3s_ease-in-out_forwards]"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0%  { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
