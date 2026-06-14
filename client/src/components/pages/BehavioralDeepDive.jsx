import React, { useState, useEffect } from 'react';
import { Activity, Target, Brain, Compass, Users, ChevronLeft, BarChart3 } from 'lucide-react';

export default function BehavioralDeepDive({ sessionData, onNavigate }) {
  const [isWaiting, setIsWaiting] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [persona, setPersona] = useState({ title: "Analyzing...", desc: "" });

  useEffect(() => {
    // 🧠 1. CHECK FOR REAL DATA
    if (!sessionData || !sessionData.behavioralTraits) {
      setIsWaiting(true);
      // Setup standby blank nodes
      setNodes([
        { title: "Engagement", icon: <Activity />, score: 0, desc: "Frequency of interactions against content nodes." },
        { title: "Curiosity", icon: <Brain />, score: 0, desc: "Breadth of exploration across varied categories." },
        { title: "Consistency", icon: <Target />, score: 0, desc: "Pattern stability in interaction frequency." },
        { title: "Exploration", icon: <Compass />, score: 0, desc: "Depth of content consumption relative to feed length." },
        { title: "Attention Span", icon: <Users />, score: 0, desc: "Duration of focus on primary content assets." }
      ]);
      return;
    }

    setIsWaiting(false);

    // 🧠 2. EXTRACT EXACT MATH FROM TELEMETRY (Matches the Radar Chart!)
    const traits = sessionData.behavioralTraits;
    const scores = sessionData.interestScores || {};

    const totalScore = Object.values(scores).reduce((sum, val) => sum + Math.max(0, val), 0) || 1;
    const maxScore = Object.values(scores).length > 0 ? Math.max(...Object.values(scores)) : 0;
    const consistencyScore = Math.min(100, Math.max(15, (maxScore / totalScore) * 100));

    const engagement = Math.max(15, Math.floor(traits.collector || 0));
    const curiosity = Math.max(15, Math.floor(traits.scanner || 0));
    const consistency = Math.floor(consistencyScore);
    const exploration = Math.max(15, Math.floor(traits.explorer || 0));
    const attentionSpan = Math.max(15, Math.floor(traits.researcher || 0));

    setNodes([
      { title: "Engagement", icon: <Activity />, score: engagement, desc: "Measures deliberate micro-interactions (Likes, Saves). High scores indicate strong algorithmic conversion potential." },
      { title: "Curiosity", icon: <Brain />, score: curiosity, desc: "Evaluates your scroll velocity and visual fixation rate. Algorithms use this to test your vulnerability to new content." },
      { title: "Consistency", icon: <Target />, score: consistency, desc: "Calculates how strictly you stay within your preferred niche. High scores lock you into tighter algorithmic filter bubbles." },
      { title: "Exploration", icon: <Compass />, score: exploration, desc: "Tracks how many vastly different categories you view. High scores trigger broader recommendation tests." },
      { title: "Attention Span", icon: <Users />, score: attentionSpan, desc: "Measures average dwell time per post. Determines whether you are served short-form dopamine loops or long-form content." }
    ]);

    // 🧠 3. DYNAMIC PERSONA GENERATION
    const traitArray = [
      { name: 'Collector', val: engagement, title: "High-Intent Collector", desc: "You don't just browse; you curate. The algorithm marks you as a high-value target for conversion because when you find something you like, you explicitly save and engage with it." },
      { name: 'Scanner', val: curiosity, title: "Rapid Content Scanner", desc: "You consume information at high velocity. You prefer scrolling through large volumes of content rather than getting bogged down in the details. The algorithm will target you with short-form, high-dopamine content." },
      { name: 'Consistent', val: consistency, title: "Hyper-Focused Specialist", desc: "You stick strictly to what you know and like. Because your interactions are highly concentrated in a specific niche, the algorithm can easily predict your behavior and has likely placed you in a tightly curated filter bubble." },
      { name: 'Explorer', val: exploration, title: "Broad-Spectrum Explorer", desc: "Your digital footprint spans across multiple, vastly different categories. You are harder to pigeonhole, meaning the algorithm will continuously test you with varied content to see where you finally settle." },
      { name: 'Researcher', val: attentionSpan, title: "Deep-Dive Researcher", desc: "You have a massive attention span compared to the average user. When a topic catches your eye, you stop and evaluate it thoroughly. The algorithm profiles you as a deliberate consumer who prefers long-form, analytical content." }
    ];

    // Find the trait with the highest score
    const dominant = traitArray.reduce((prev, current) => (prev.val > current.val) ? prev : current);
    setPersona(dominant);

  }, [sessionData]);

  // Confidence index goes up if they spent more time in the sandbox
  const confidence = sessionData?.activeTime > 30 ? "98.7%" : sessionData?.activeTime > 10 ? "84.2%" : "41.5%";

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto hide-scroll animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-[12px] font-bold tracking-widest uppercase mb-6"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800/60 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Psychometric Analysis</h1>
            <p className="text-slate-500 mt-2 text-sm">Translating interaction telemetry into a human behavioral model.</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-lg w-fit">
             <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Confidence Index</p>
             <p className="text-xl font-black text-white">{isWaiting ? '--%' : confidence}</p>
          </div>
        </div>

        {/* Detailed Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {nodes.map((node, i) => (
            <div key={i} className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-6 group hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-purple-400 border border-slate-800 transition-transform group-hover:scale-110 duration-500">
                  {node.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">{node.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Metric Coefficient</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] mb-2 font-mono text-slate-400">
                  <span>Score</span>
                  <span className="text-white font-bold">{isWaiting ? '--' : node.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${node.score}%` }} 
                  />
                </div>
              </div>

              <p className="text-[12px] text-slate-400 leading-relaxed bg-[#070611] p-3 rounded-lg border border-slate-800/50">
                {node.desc}
              </p>
            </div>
          ))}

          {/* AI Summary Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mt-4">
            <div className="p-4 bg-purple-500/20 rounded-full shrink-0 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <BarChart3 size={32} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Behavioral Persona: 
                <span className="text-purple-400">{isWaiting ? 'Awaiting Data...' : persona.title}</span>
              </h3>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                {isWaiting ? 'Please complete a session in the Sandbox to generate your behavioral breakdown.' : persona.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}