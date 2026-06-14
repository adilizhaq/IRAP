import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, Database, LockOpen, Loader2, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf'; 

export default function UdsExportWidget({ sessionData }) {
  const [downloadState, setDownloadState] = useState('idle'); // 'idle' | 'compiling' | 'success'
  const [progress, setProgress] = useState(0);
  
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

  // --- 🧠 DYNAMIC PAYLOAD METRICS (FIXED TO MATCH DASHBOARD EXACTLY) ---
  const isWaiting = !sessionData || !sessionData.signals;
  
  // Real node count (No fake multiplier math!)
  const nodeCount = isWaiting ? 0 : (sessionData.signals?.totalEvents || 0);
  
  // Estimate PDF size for the UI
  const kbSize = isWaiting ? "0.00" : ((nodeCount * 0.45) + 12.4).toFixed(2);

  // --- REAL DOWNLOAD HANDLER ---
  const handleDownload = () => {
    if (downloadState !== 'idle' || isWaiting) return;
    
    setDownloadState('compiling');
    setProgress(0);

    // Simulate data compilation process
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloadState('success');
          
          // 🧠 TRIGGER THE SYNCHRONIZED PDF GENERATION
          generateAndDownloadPDF(sessionData);

          // Reset back to idle after 3 seconds
          setTimeout(() => setDownloadState('idle'), 3000);
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 5;
      });
    }, 150);
  };

  // 🧠 THE PDF GENERATOR (SYNCHRONIZED WITH DASHBOARD MATH)
  const generateAndDownloadPDF = (data) => {
    const doc = new jsPDF();
    let yPos = 20;

    // --- HELPER: PAGE WIDTH LINE DRAWER ---
    const drawDivider = (y, r = 226, g = 232, b = 240) => {
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.5);
      doc.line(20, y, 190, y);
    };

    // --- 1. BANNER & HEADER HEADLINE ---
    doc.setFillColor(12, 10, 24); // Rich theme color
    doc.rect(0, 0, 210, 42, "F");

    doc.setFontSize(22);
    doc.setTextColor(168, 85, 247); // Luminous Purple
    doc.setFont("helvetica", "bold");
    doc.text("YOUR DIGITAL SHADOW PROFILE", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.setFont("helvetica", "normal");
    doc.text(`An educational breakdown of how the internet sees you • Generated: ${new Date().toLocaleDateString()}`, 20, 28);
    
    // --- 2. WELCOME INTRO ---
    yPos = 55;
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); // Bright Blue
    doc.setFont("helvetica", "bold");
    doc.text("Hello Explorer! What is this document?", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85); // Slate 700
    
    const introText = "Every time you use an app or browse websites, tech companies watch your subtle movements. They measure where you stop to look, how fast you scroll, and what you click on. This engine built this report using just your subconscious actions to show you exactly how platforms track your mind.";
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, yPos);
    
    yPos += (splitIntro.length * 6) + 6;
    drawDivider(yPos);

    // --- 3. SECTION 1: THE CLUES YOU LEFT BEHIND ---
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue
    doc.text("1. The Clues You Left Behind (Session Statistics)", 20, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text("Clues are tiny pieces of information generated as you navigated our feed items.", 20, yPos);

    yPos += 6;
    doc.setFillColor(248, 250, 252); // Soft Gray Card
    doc.setDrawColor(241, 245, 249);
    doc.rect(20, yPos, 170, 36, "FD");

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Dark Slate 900
    doc.text("Total Clues Collected:", 26, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${nodeCount.toLocaleString()} Telemetry Points`, 72, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Items Read/Evaluated:", 26, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.signals?.totalViews || 0} unique focus segments`, 72, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Micro-Interactions:", 26, yPos);
    doc.setFont("helvetica", "normal");
    
    // Includes dislikes to match the StatsRow exactly
    const totalInteractions = (data.signals?.totalLikes || 0) + (data.signals?.totalSaves || 0) + (data.signals?.totalExpands || 0) + (data.signals?.totalDislikes || 0);
    doc.text(`${totalInteractions} explicit focus steps (Likes/Saves/Expands/Dislikes)`, 72, yPos);

    yPos += 14;
    drawDivider(yPos);

    // --- 4. SECTION 2: YOUR HIDDEN OBSESSIONS ---
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(168, 85, 247); 
    doc.text("2. Your Hidden Obsessions (Algorithmic Affinities)", 20, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("By timing where you spend your seconds, platforms predict what you like to look at.", 20, yPos);

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);

    if (data.interestScores && Object.keys(data.interestScores).length > 0) {
      const scores = data.interestScores;
      
      // Calculate total points for exact percentage matching with InterestScores.jsx
      const totalScore = Object.values(scores).reduce((sum, val) => sum + Math.max(0, val), 0) || 1;

      const topInterests = Object.entries(scores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1]) 
        .slice(0, 4);

      topInterests.forEach(([category, rawScore], index) => {
        doc.setFillColor(233, 213, 255); // Purple block fill
        doc.rect(25, yPos - 3.5, 4, 4, "F");
        
        const percentage = Math.round((rawScore / totalScore) * 100);
        const cleanName = category.replace('_', ' ').toUpperCase();
        
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${cleanName}:`, 32, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.text(`System is highly confident you like this (${percentage}% affinity match)`, 85, yPos);
        yPos += 7;
      });
    } else {
      doc.text("• No strong obsessions found yet. Keep navigating to train our predictive models!", 25, yPos);
      yPos += 7;
    }

    yPos += 5;
    drawDivider(yPos);

    // --- 5. SECTION 3: YOUR DIGITAL BROWSER PERSONALITY ---
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(236, 72, 153); // Pink Theme
    doc.text("3. Your Secret Browser Personality (Behavioral Metrics)", 20, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("How you scroll defines who you are online. Here is how your tendencies score:", 20, yPos);

    yPos += 8;
    if (data.behavioralTraits) {
      // Replicate the exact math from BehaviorOverview.jsx
      const traits = data.behavioralTraits;
      const scores = data.interestScores || {};
      
      const totalScore = Object.values(scores).reduce((sum, val) => sum + Math.max(0, val), 0) || 1;
      const maxScore = Object.values(scores).length > 0 ? Math.max(...Object.values(scores)) : 0;
      const consistencyScore = Math.min(100, Math.max(15, (maxScore / totalScore) * 100));

      const metrics = [
        { label: 'Engagement', value: Math.max(15, Math.floor(traits.collector || 0)) },
        { label: 'Curiosity', value: Math.max(15, Math.floor(traits.scanner || 0)) },
        { label: 'Consistency', value: Math.floor(consistencyScore) },
        { label: 'Exploration', value: Math.max(15, Math.floor(traits.explorer || 0)) },
        { label: 'Attention Span', value: Math.max(15, Math.floor(traits.researcher || 0)) },
      ];

      metrics.forEach(({ label, value }) => {
        let descriptor = "Low Propensity";
        if (value > 70) descriptor = "Master Expert Intensity";
        else if (value > 40) descriptor = "Active Habit Tendency";
        else if (value > 20) descriptor = "Moderate Engagement";

        doc.setFillColor(252, 231, 243); // Pink block accent
        doc.rect(25, yPos - 3.5, 4, 4, "F");

        doc.setFont("helvetica", "bold");
        doc.text(`${label.toUpperCase()}:`, 32, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.text(`${value}% match rating — characterized as: ${descriptor}`, 78, yPos);
        yPos += 7;
      });
    }

    // --- 6. SOVEREIGNTY FOOTER WARNING ---
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 242, 170, 22, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Why This Matters:", 24, 249);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const lessonText = "Tech companies build secret profiles just like this about your family every day to lock your eyes onto apps and sell ads. IRAP protects you by shining a clear light on algorithms so you stay in control.";
    const splitLesson = doc.splitTextToSize(lessonText, 160);
    doc.text(splitLesson, 24, 254);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont("courier", "normal");
    doc.text("IRAP CORE SOFTWARE PLATFORM ENGINE // LOCAL ENCRYPTED PDF EXPORT PROTOCOL", 20, 282);

    // Save out with dynamic signature timestamp
    doc.save(`irap_digital_shadow_${Date.now()}.pdf`);
  };

  return (
    /* --- REVEAL ANIMATION WRAPPER --- */
    <div 
      ref={containerRef}
      className={`h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      }`}
    >
      {/* INNER STRUCTURE LAYOUT */}
      <div className="bg-[#0c0a18] border border-slate-800/60 rounded-2xl p-6 h-full w-full flex flex-col shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-700 ease-out">
        
        {/* Background Tech Rings Decor */}
        <div className="absolute -right-10 -top-10 w-48 h-48 border border-purple-500/10 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
        <div className="absolute -right-4 -top-4 w-36 h-36 border border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />

        {/* Header Container Layout */}
        <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
          <h3 className="text-[14px] font-bold text-white flex items-center gap-2 tracking-wide">
            Data Sovereignty Export
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 text-[10px] text-blue-400 font-mono border border-blue-900/50">
            <LockOpen size={12} />
            UDS-PROTOCOL
          </div>
        </div>

        {/* Centerpiece Panel Layout */}
        <div className="flex-1 flex flex-col justify-center relative z-10 mb-4 min-h-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className={`absolute inset-0 bg-blue-500 blur-[20px] rounded-full transition-opacity duration-500 ${downloadState === 'compiling' ? 'animate-pulse opacity-40' : isWaiting ? 'opacity-5' : 'opacity-20'}`} />
              <div className={`bg-[#070611] border p-3 rounded-xl relative transition-colors duration-500 ${isWaiting ? 'border-slate-800/50' : 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`}>
                <FileText size={28} className={isWaiting ? "text-slate-600" : "text-blue-400"} />
              </div>
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase mb-1 truncate">
                {isWaiting ? "Awaiting Telemetry" : "Payload Ready"}
              </span>
              <div className="flex items-center gap-3 text-[13px] font-bold text-slate-200">
                <span className={`flex items-center gap-1 transition-colors truncate ${isWaiting ? 'text-slate-600' : ''}`}>
                  <Database size={14} className="text-slate-500 shrink-0"/> {nodeCount.toLocaleString()} Nodes
                </span>
                <span className="text-slate-600 shrink-0">|</span>
                <span className={`font-mono transition-colors shrink-0 ${isWaiting ? 'text-slate-600' : 'text-blue-400'}`}>
                  {kbSize} KB
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Processing Progression Track */}
          <div className={`transition-all duration-300 overflow-hidden ${downloadState === 'compiling' ? 'h-8 opacity-100 mt-2 shrink-0' : 'h-0 opacity-0'}`}>
            <div className="flex justify-between text-[10px] font-mono text-blue-400 mb-1">
              <span>COMPILING_REPORT...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Formatted Trigger Action Footer */}
        <div className="mt-auto relative z-10 shrink-0">
          <button 
            onClick={handleDownload}
            disabled={downloadState !== 'idle' || isWaiting}
            className={`w-full relative group overflow-hidden rounded-xl p-[1px] transition-all duration-300 ${
              downloadState === 'idle' && !isWaiting ? 'cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'cursor-not-allowed opacity-60'
            }`}
          >
            {/* Background Kinetic Gradient Layer */}
            <span className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-70 transition-opacity duration-300 ${(downloadState === 'idle' && !isWaiting) ? 'group-hover:opacity-100' : 'opacity-30'}`} />
            
            {/* Inner Content Layer */}
            <div className={`relative rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all duration-300 ${
              downloadState === 'success' ? 'bg-emerald-900/80' : 'bg-[#0c0a18] group-hover:bg-opacity-0'
            }`}>
              
              {downloadState === 'idle' && (
                <>
                  <Download size={16} className={isWaiting ? "text-slate-500" : "text-white"} />
                  <span className={`text-sm font-bold tracking-wide ${isWaiting ? "text-slate-500" : "text-white"}`}>
                    {isWaiting ? "No Data Available" : "Download .PDF Dossier"}
                  </span>
                </>
              )}
              
              {downloadState === 'compiling' && (
                <>
                  <Loader2 size={16} className="text-blue-400 animate-spin" />
                  <span className="text-sm font-bold text-blue-400 tracking-wide">Generating PDF...</span>
                </>
              )}

              {downloadState === 'success' && (
                <>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400 tracking-wide">Dossier Secured</span>
                </>
              )}

            </div>
          </button>
        </div>

      </div>
    </div>
  );
}