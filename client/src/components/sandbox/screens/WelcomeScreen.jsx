import { useState } from 'react';
import { Eye, Fingerprint, Sparkles, ShieldCheck, PlayCircle } from 'lucide-react';

const STEPS = [
  { icon: Eye, title: 'Scroll a feed', text: 'Browse a short feed. Likes, saves, expands and time spent on each card are recorded.' },
  { icon: Fingerprint, title: 'See your profile form', text: 'Those signals become interest scores and behavioral traits on the dashboard.' },
  { icon: Sparkles, title: 'Understand the picks', text: 'Recommendations show why each item was chosen and how confident the engine is.' },
];

export default function WelcomeScreen({ onStart }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setTimeout(() => onStart?.(), 400);
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center bg-[#040308] text-white p-6">
      <div className={`max-w-2xl w-full text-center transition-opacity duration-500 ${isLaunching ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-xs tracking-[0.3em] text-purple-400 font-bold mb-3">IRAP</p>
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          See how a feed learns <span className="text-purple-400">you</span>
        </h1>
        <p className="text-slate-400 mb-10">
          A short simulation of how recommendation systems turn behavior into a profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <Icon size={20} className="text-purple-400 mb-2" />
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleLaunch}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:opacity-90 transition-opacity"
        >
          <PlayCircle size={18} /> Start simulation
        </button>

        <p className="mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={12} /> Simulation only. Nothing leaves your browser.
        </p>
      </div>
    </div>
  );
}
