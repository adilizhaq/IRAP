import React, { useState } from 'react';

// --- SHARED UI ---
import Sidebar from './components/shared/sidebar/Sidebar';
import Topbar from './components/shared/Topbar';

// --- VIEWS ---
import SandboxView from './components/sandbox/SandboxView';
import DashboardView from './components/pages/DashboardView';
import AnalyticsView from './components/pages/AnalyticsView';
import LiveActivityView from './components/pages/LiveActivityView';
import RecommendationsView from './components/pages/recommendations/RecommendationsView';
import BehavioralDeepDive from './components/pages/BehavioralDeepDive';
import DigitalProfileView from './components/pages/DigitalProfileView';

// --- HOOKS ---
import { TelemetryProvider, useTelemetry } from './hooks/TelemetryContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('sandbox');
  
  // Hook into global brain, defaulting to empty object to prevent crashes
  const telemetry = useTelemetry() || {};

  // Package telemetry data for components
  const sessionData = {
    signals: telemetry?.signals || {},
    events: telemetry?.events || [],
    interestScores: telemetry?.interestScores || {},
    behavioralTraits: telemetry?.behavioralTraits || {},
    activeTime: Math.floor(telemetry?.activeTime || 0),
    rawLogs: telemetry?.logs || [],
    
    stats: {
      activeTime: Math.floor(telemetry?.activeTime || 0),
      interactions: (telemetry?.signals?.totalLikes || 0) + (telemetry?.signals?.totalSaves || 0) + (telemetry?.signals?.totalExpands || 0) + (telemetry?.signals?.totalDislikes || 0),
      nodesCaptured: telemetry?.signals?.totalEvents || 0,
      scrollDepth: telemetry?.metrics?.scrollDepth || 0,
    },
    
    dominantInterest: telemetry?.interestScores && Object.keys(telemetry.interestScores).length > 0 
      ? Object.keys(telemetry.interestScores).reduce((a, b) => telemetry.interestScores[a] > telemetry.interestScores[b] ? a : b) 
      : "Analyzing..."
  };

  const handleSessionComplete = () => setCurrentScreen('dashboard');
  
  const handleResetData = () => {
    // Forces clean state reset
    window.location.reload();
  };

  const isImmersiveMode = currentScreen === 'sandbox' || currentScreen === 'welcome';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#040308] text-white font-sans selection:bg-purple-500/30">
      
      {!isImmersiveMode && (
        <Sidebar 
          currentView={currentScreen} 
          onNavigate={setCurrentScreen} 
          onResetData={handleResetData}
        />
      )}

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#040308]">
        {!isImmersiveMode && <Topbar sessionData={sessionData} />}

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {currentScreen === 'sandbox' && (
            <SandboxView onSessionComplete={handleSessionComplete} />
          )}

          {currentScreen === 'dashboard' && (
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
              <DashboardView sessionData={sessionData} onNavigate={setCurrentScreen} />
            </div>
          )}

          {currentScreen === 'analytics' && <AnalyticsView sessionData={sessionData} />}

          {(currentScreen === 'livestream' || currentScreen === 'live-activity') && (
            <LiveActivityView sessionData={sessionData} />
          )}

          {currentScreen === 'recommendations' && (
            <RecommendationsView sessionData={sessionData} onNavigate={setCurrentScreen} />
          )}

          {(currentScreen === 'deepdive' || currentScreen === 'behavioral-deep-dive') && (
            <div className="p-4 md:p-8 h-full">
              <BehavioralDeepDive sessionData={sessionData} onNavigate={setCurrentScreen} />
            </div>
          )}

          {currentScreen === 'digital-profile' && (
            <DigitalProfileView sessionData={sessionData} onNavigate={setCurrentScreen} />
            )}

        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}