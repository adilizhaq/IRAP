import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, HelpCircle, RefreshCw, ChevronRight } from 'lucide-react';

// --- DYNAMIC RECOMMENDATION DATABASE (MASSIVELY EXPANDED) ---
const recommendationDB = {
  programming: [
    { title: "Node.js & MongoDB Server Setup", cat: "Backend Dev", basePct: 95 },
    { title: "GitHub Copilot for Python", cat: "Productivity", basePct: 88 },
    { title: "Advanced React Patterns", cat: "Frontend", basePct: 82 },
    { title: "Rust vs Go Performance Benchmarks", cat: "Systems", basePct: 91 },
    { title: "Kubernetes Microservices Guide", cat: "DevOps", basePct: 86 },
    { title: "GraphQL API Design Best Practices", cat: "Architecture", basePct: 89 },
    { title: "Vim/Neovim Workflow Setup", cat: "Tooling", basePct: 79 },
    { title: "WebAssembly in Production", cat: "Web Tech", basePct: 84 },
    { title: "PostgreSQL Query Optimization", cat: "Databases", basePct: 93 },
    { title: "Writing Clean TypeScript", cat: "Frontend", basePct: 87 },
    { title: "Docker Container Security", cat: "Security", basePct: 90 },
    { title: "Building CI/CD Pipelines from Scratch", cat: "DevOps", basePct: 85 }
  ],
  gaming: [
    { title: "PS5 Pro Hardware Benchmarks", cat: "Gaming Hardware", basePct: 98 },
    { title: "eFootball Tactical Deep Dive", cat: "Esports", basePct: 92 },
    { title: "Mini Militia Route Strategies", cat: "Mobile Gaming", basePct: 78 },
    { title: "Unreal Engine 5 Nanite Breakdown", cat: "Game Dev", basePct: 89 },
    { title: "Speedrunning Strats: Elden Ring", cat: "Speedrunning", basePct: 84 },
    { title: "Evolution of Fighting Game Metas", cat: "Analysis", basePct: 81 },
    { title: "Mechanical Keyboard Modding", cat: "Hardware", basePct: 94 },
    { title: "Input Latency Optimization", cat: "Competitive", basePct: 96 },
    { title: "RTS APM Training Routines", cat: "Training", basePct: 83 },
    { title: "Sim Racing Rig Builds", cat: "Hardware", basePct: 88 },
    { title: "Retro Console Emulation Guide", cat: "Emulation", basePct: 79 },
    { title: "Indie Game Dev Post-Mortem", cat: "Industry", basePct: 85 }
  ],
  anime: [
    { title: "Vinland Saga Arc Breakdown", cat: "Manga Analysis", basePct: 96 },
    { title: "One Piece World Building", cat: "Lore Theory", basePct: 89 },
    { title: "Demon Slayer Animation Specs", cat: "Production", basePct: 85 },
    { title: "Jujutsu Kaisen Fight Choreography", cat: "Animation", basePct: 94 },
    { title: "Studio Trigger Art Style Analysis", cat: "Art Direction", basePct: 88 },
    { title: "Evangelion Soundtrack Breakdown", cat: "Music", basePct: 82 },
    { title: "Classic Mecha Anime History", cat: "History", basePct: 77 },
    { title: "Makoto Shinkai Background Art", cat: "Visuals", basePct: 91 },
    { title: "Gundam Model Kit Building (Gunpla)", cat: "Hobbies", basePct: 86 },
    { title: "Manga Paneling Techniques", cat: "Illustration", basePct: 89 },
    { title: "Voice Acting (Seiyuu) Highlights", cat: "Industry", basePct: 80 },
    { title: "Anime Industry Working Conditions", cat: "Analysis", basePct: 84 }
  ],
  sports: [
    { title: "Premier League Stat Predictors", cat: "Sports Analytics", basePct: 94 },
    { title: "IPL Historical Data Models", cat: "Data Science", basePct: 87 },
    { title: "Tactical Shifts in Football", cat: "Analysis", basePct: 81 },
    { title: "F1 Aerodynamics Explained", cat: "Motorsport", basePct: 91 },
    { title: "NBA Advanced Shot Metrics", cat: "Basketball", basePct: 88 },
    { title: "Tennis Biomechanics", cat: "Training", basePct: 82 },
    { title: "Marathon Pacing Strategies", cat: "Endurance", basePct: 85 },
    { title: "NFL Draft Predictive Modeling", cat: "Analytics", basePct: 89 },
    { title: "UFC Playbook Analysis", cat: "Combat Sports", basePct: 84 },
    { title: "Golf Swing Physics", cat: "Biomechanics", basePct: 79 },
    { title: "Cricket Spin Bowling Physics", cat: "Analysis", basePct: 86 },
    { title: "Olympic Lifting Techniques", cat: "Training", basePct: 90 }
  ],
  ai: [
    { title: "Local LLM Inference on Mac", cat: "AI Hardware", basePct: 95 },
    { title: "Retrieval-Augmented Generation (RAG)", cat: "Architecture", basePct: 92 },
    { title: "Transformers Math Explained", cat: "Machine Learning", basePct: 88 },
    { title: "Prompt Engineering Frameworks", cat: "Techniques", basePct: 85 },
    { title: "Training LoRA Models", cat: "Fine-Tuning", basePct: 91 },
    { title: "AI Image Diffusion Techniques", cat: "Generative AI", basePct: 89 },
    { title: "Voice Cloning Architecture", cat: "Audio Models", basePct: 84 },
    { title: "Open Source AI vs Proprietary", cat: "Industry", basePct: 87 },
    { title: "Building Autonomous Agents", cat: "Development", basePct: 94 },
    { title: "Neural Network Debugging", cat: "Engineering", basePct: 86 },
    { title: "Vector Databases Explained", cat: "Data", basePct: 90 },
    { title: "AI Agent Frameworks (LangChain)", cat: "Development", basePct: 93 }
  ],
  startups: [
    { title: "Finding Product-Market Fit", cat: "Growth", basePct: 96 },
    { title: "Y Combinator Application Tips", cat: "Funding", basePct: 88 },
    { title: "B2B SaaS Pricing Strategies", cat: "Strategy", basePct: 92 },
    { title: "Bootstrap vs Venture Capital", cat: "Finance", basePct: 85 },
    { title: "Building a Waitlist", cat: "Marketing", basePct: 89 },
    { title: "Cold Email Outreach Tactics", cat: "Sales", basePct: 91 },
    { title: "Hiring the First Engineer", cat: "Management", basePct: 84 },
    { title: "Creating a Pitch Deck", cat: "Fundraising", basePct: 87 },
    { title: "Customer Discovery Interviews", cat: "Product", basePct: 94 },
    { title: "Acquisition and Exit Strategies", cat: "Business", basePct: 82 },
    { title: "SaaS Churn Reduction Tactics", cat: "Growth", basePct: 90 },
    { title: "Building in Public Guide", cat: "Marketing", basePct: 86 }
  ],
  finance: [
    { title: "Index Fund Investing 101", cat: "Personal Finance", basePct: 95 },
    { title: "Crypto Defi Protocols Explained", cat: "Web3", basePct: 84 },
    { title: "Real Estate Market Trends", cat: "Investing", basePct: 88 },
    { title: "Options Trading Strategies", cat: "Trading", basePct: 81 },
    { title: "Personal Tax Optimization", cat: "Wealth", basePct: 92 },
    { title: "Analyzing Company Balance Sheets", cat: "Analysis", basePct: 89 },
    { title: "Venture Capital Deal Structures", cat: "Business", basePct: 86 },
    { title: "Inflation and Interest Rates", cat: "Macroeconomics", basePct: 90 },
    { title: "Algorithmic Trading Bots", cat: "FinTech", basePct: 93 },
    { title: "FIRE Movement Principles", cat: "Lifestyle", basePct: 87 },
    { title: "Dividend Stock Portfolios", cat: "Investing", basePct: 85 },
    { title: "Emerging Market Economies", cat: "Global Finance", basePct: 82 }
  ],
  psychology: [
    { title: "Cognitive Behavioral Therapy Tools", cat: "Mental Health", basePct: 92 },
    { title: "Neuroplasticity and Habit Formation", cat: "Neuroscience", basePct: 96 },
    { title: "The Psychology of Persuasion", cat: "Behavior", basePct: 89 },
    { title: "Overcoming Imposter Syndrome", cat: "Career", basePct: 91 },
    { title: "Attachment Styles in Adulthood", cat: "Relationships", basePct: 85 },
    { title: "Memory Consolidation Techniques", cat: "Learning", basePct: 88 },
    { title: "Jungian Archetypes Explained", cat: "Theory", basePct: 79 },
    { title: "The Flow State Formula", cat: "Performance", basePct: 94 },
    { title: "Emotional Intelligence (EQ)", cat: "Development", basePct: 87 },
    { title: "Decision Fatigue Management", cat: "Productivity", basePct: 90 },
    { title: "The Psychology of UI Design", cat: "Design", basePct: 93 },
    { title: "Cognitive Biases in Investing", cat: "Behavioral Econ", basePct: 86 }
  ],
  cars: [
    { title: "EV Battery Chemistry Evolution", cat: "Engineering", basePct: 92 },
    { title: "Tuning ECU for Track Days", cat: "Modding", basePct: 88 },
    { title: "Rally Cross Suspension Setups", cat: "Motorsport", basePct: 85 },
    { title: "Rotary Engine Rebuild Guide", cat: "Mechanics", basePct: 81 },
    { title: "Aerodynamic Downforce Math", cat: "Physics", basePct: 89 },
    { title: "Classic Car Restoration", cat: "Hobby", basePct: 84 },
    { title: "Dual-Clutch Transmission Specs", cat: "Hardware", basePct: 90 },
    { title: "Drift Car Angle Mods", cat: "Modding", basePct: 87 },
    { title: "Hypercar Weight Reduction", cat: "Engineering", basePct: 93 },
    { title: "F1 Tire Compound Analysis", cat: "Motorsport", basePct: 95 },
    { title: "AWD vs RWD Track Times", cat: "Analysis", basePct: 86 },
    { title: "Forced Induction Systems", cat: "Mechanics", basePct: 88 }
  ],
  entrepreneurship: [
    { title: "Building a Personal Brand", cat: "Marketing", basePct: 91 },
    { title: "Delegation and Outsourcing", cat: "Management", basePct: 88 },
    { title: "Navigating Founder Burnout", cat: "Mental Health", basePct: 94 },
    { title: "Networking for Introverts", cat: "Career", basePct: 86 },
    { title: "Crafting a Mission Statement", cat: "Strategy", basePct: 82 },
    { title: "Managing Cash Flow", cat: "Finance", basePct: 93 },
    { title: "The Lean Startup Methodology", cat: "Frameworks", basePct: 95 },
    { title: "Negotiation Tactics", cat: "Business", basePct: 89 },
    { title: "Creating B2B Flywheels", cat: "Growth", basePct: 90 },
    { title: "Legal Structures (LLC vs C-Corp)", cat: "Legal", basePct: 85 },
    { title: "Effective Board Meetings", cat: "Leadership", basePct: 81 },
    { title: "Remote Team Culture", cat: "Management", basePct: 87 }
  ],
  productivity: [
    { title: "Zettelkasten Note-Taking System", cat: "Knowledge", basePct: 94 },
    { title: "Pomodoro Technique Variations", cat: "Time Management", basePct: 89 },
    { title: "Inbox Zero Methodology", cat: "Workflow", basePct: 85 },
    { title: "Time Blocking for Creatives", cat: "Planning", basePct: 91 },
    { title: "Obsidian vs Notion Setups", cat: "Tools", basePct: 96 },
    { title: "Optimizing Sleep Architecture", cat: "Health", basePct: 93 },
    { title: "Automating Repetitive Tasks", cat: "Workflow", basePct: 90 },
    { title: "Managing ADHD in Tech", cat: "Focus", basePct: 88 },
    { title: "Daily Standup Formats", cat: "Teamwork", basePct: 82 },
    { title: "The Two-Minute Rule", cat: "Habits", basePct: 87 },
    { title: "Digital Minimalism Guide", cat: "Lifestyle", basePct: 86 },
    { title: "Goal Setting Frameworks (OKRs)", cat: "Planning", basePct: 89 }
  ],
  technology: [
    { title: "Quantum Computing Basics", cat: "Future Tech", basePct: 90 },
    { title: "Solid State Battery Timeline", cat: "Energy", basePct: 88 },
    { title: "AR/VR Optical Lenses", cat: "Hardware", basePct: 85 },
    { title: "5G and Edge Computing", cat: "Networks", basePct: 87 },
    { title: "Silicon Wafer Manufacturing", cat: "Engineering", basePct: 92 },
    { title: "SpaceX Rocket Avionics", cat: "Aerospace", basePct: 95 },
    { title: "Cybersecurity Zero-Trust", cat: "Security", basePct: 91 },
    { title: "Biometric Authentication Tech", cat: "Privacy", basePct: 86 },
    { title: "Graphene Processors", cat: "Hardware", basePct: 89 },
    { title: "Brain-Computer Interfaces", cat: "Biotech", basePct: 93 },
    { title: "RISC-V Architecture", cat: "Systems", basePct: 84 },
    { title: "Web3 Infrastructure", cat: "Decentralization", basePct: 82 }
  ]
};

const standbyRecs = [
  { id: 'sb1', title: "Awaiting Session Data...", cat: "Standby", pct: "--", match: "Scanning", badgeStyle: "text-slate-400 bg-slate-800/50 border-slate-700/50" },
  { id: 'sb2', title: "Calibrating Algorithm...", cat: "Standby", pct: "--", match: "Scanning", badgeStyle: "text-slate-400 bg-slate-800/50 border-slate-700/50" },
  { id: 'sb3', title: "Analyzing Node Links...", cat: "Standby", pct: "--", match: "Scanning", badgeStyle: "text-slate-400 bg-slate-800/50 border-slate-700/50" }
];

export default function SimulatedRecommendations({ sessionData, onNavigate }) {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState(standbyRecs);
  
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

  // --- LIVE TELEMETRY PARSER & GENERATOR ---
  useEffect(() => {
    if (!sessionData || !sessionData.interestScores || Object.keys(sessionData.interestScores).length === 0) {
      setIsWaiting(true);
      setSuggestions(standbyRecs);
      return;
    }

    setIsWaiting(false);
    const scores = sessionData.interestScores;

    const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const topCategories = sortedCategories.filter(cat => scores[cat] > 0).slice(0, 3);

    let generatedRecs = [];

    if (topCategories.length > 0) {
      topCategories.forEach((rawCat, index) => {
        const cat = rawCat.toLowerCase(); 
        
        if (recommendationDB[cat]) {
          const dbLength = recommendationDB[cat].length;
          const randomOffset = Math.floor(Math.random() * dbLength);
          const rec = recommendationDB[cat][(index + randomOffset) % dbLength];
          
          const matchScore = Math.min(99, rec.basePct + Math.floor(Math.random() * 5));
          const matchText = matchScore >= 90 ? "High Match" : "Medium Match";
          const badgeStyle = matchScore >= 90 
            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40"
            : "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40";

          generatedRecs.push({
            id: `rec-${cat}-${Date.now()}-${index}`,
            title: rec.title,
            cat: `${rec.cat} • Just now`,
            match: matchText,
            pct: `${matchScore}%`,
            badgeStyle: badgeStyle,
            explanation: {
              confidence: matchScore,
              reasons: [
                `Strong interest in ${rawCat}`,
                `${scores[rawCat].toFixed(1)} engagement score`,
                "High dwell time on similar content"
              ]
            }
          });
        }
      });
    }

    while (generatedRecs.length < 3) {
      const fallbackList = recommendationDB['technology'];
      const fallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      generatedRecs.push({
        id: `fallback-${Date.now()}-${generatedRecs.length}`,
        title: fallback.title,
        cat: `${fallback.cat} • Promoted`,
        match: "Algorithm Pick",
        pct: "85%",
        badgeStyle: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/40",
        explanation: {
          confidence: 85,
          reasons: [
            "Popular among similar users",
            "Platform-wide engagement trend",
            "Fallback recommendation engine"
          ]
        }
      });
    }

    setSuggestions(generatedRecs);
  }, [sessionData, isRefreshing]);

  const handleRefresh = () => {
    if (isWaiting) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleCardClick = (item) => {
    if (isWaiting) return;
    console.log(`[Router] Redirecting to Recommendation View for: ${item.title}`);
    if (onNavigate) {
      onNavigate('recommendations');
    }
  };

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
        {/* INNER CONTENT CARD */}
        <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-5 flex flex-col h-[380px] w-full justify-between select-none shadow-xl group hover:border-purple-500/20 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-purple-500 blur-[90px] opacity-5 pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700" />

          {/* Top Header Controls */}
          <div className="flex justify-between items-center mb-3 relative z-10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Sparkles size={12} />
              </div>
              <h3 className="text-[14px] font-bold text-white tracking-wide flex items-center gap-2">
                Recommendations
              </h3>
              
              {/* Sync Status Badge */}
              {isWaiting ? (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50 ml-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                   <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">SCANNING</span>
                 </div>
              ) : (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)] ml-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">LIVE</span>
                 </div>
              )}
            </div>
            
            <button className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group/btn">
              Why these?
              <HelpCircle size={11} className="text-blue-400/70 group-hover/btn:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Main List Core with hide-scrollbar applied */}
          <div className="flex flex-col gap-2.5 my-1.5 flex-1 justify-center relative z-10 min-h-0 overflow-y-auto hide-scrollbar">
            {suggestions.map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => handleCardClick(item)}
                className={`group/card flex items-center justify-between bg-slate-900/30 border border-slate-800/50 hover:border-purple-500/50 hover:bg-purple-950/30 rounded-xl p-2.5 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-right-8 ${isWaiting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/40 flex-shrink-0 flex items-center justify-center font-mono font-bold text-[12px] transition-colors duration-300 shadow-sm ${isWaiting ? 'text-slate-600' : 'text-purple-400 group-hover/card:border-purple-500/40 group-hover/card:text-purple-300'}`}>
                    {idx + 1}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-slate-200 group-hover/card:text-white transition-colors truncate tracking-wide">
                      {item.title}
                    </p>

                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-tight">
                      {item.cat}
                    </p>

                    {item.explanation && (
                      <div className="mt-1">
                        {item.explanation.reasons.slice(0, 2).map((reason, i) => (
                          <p key={i} className="text-[9px] text-slate-600 truncate">
                            • {reason}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all duration-300 shadow-sm ${item.badgeStyle}`}>
                    <span className="opacity-80 tracking-wide text-[9px] uppercase hidden sm:inline">
                      {item.match.split(' ')[0]}
                    </span>
                    <span className="text-white font-extrabold font-mono">
                      {item.pct}
                    </span>
                  </div>
                  {!isWaiting && (
                    <ChevronRight size={14} className="text-slate-600 group-hover/card:text-purple-400 group-hover/card:translate-x-1 transition-all duration-300" />
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Footer Interactive Action Link */}
          <div className="relative z-10 mt-1 shrink-0">
            <button 
              onClick={handleRefresh}
              className={`flex items-center gap-2 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors pt-3 border-t border-slate-800/40 w-fit group/refresh ${isWaiting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw 
                size={12} 
                className={`text-slate-500 group-hover/refresh:text-purple-400 transition-all duration-300 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} 
              /> 
              <span>Refresh Recommendations</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}