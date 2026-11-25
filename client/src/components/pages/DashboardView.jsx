import React from 'react';

// 🧠 1. IMPORT THE TELEMETRY BRAIN
import { useTelemetry } from "../../hooks/TelemetryContext";

import StatsRow from "../dashboard/cards/StatsRow";
import LiveActivityStream from "../dashboard/cards/LiveActivityStream";
import InterestScores from "../dashboard/cards/InterestScores";
import TopCategories from "../dashboard/cards/TopCategories";

import AttentionAuction from "../dashboard/cards/AttentionAuction";
import SimulatedRecommendations from "../dashboard/cards/SimulatedRecommendations";
import DigitalProfileFooter from "../dashboard/cards/DigitalProfileFooter";
import UdsExportWidget from "../dashboard/cards/UdsExportWidget";

import EngagementLineChart from "../dashboard/charts/EngagementLineChart";
import BehaviorChart from "../dashboard/charts/BehaviorChart";

import GlobalFooter from "../shared/GlobalFooter";

export default function DashboardView({ onNavigate }) {
  // 🧠 2. TAP DIRECTLY INTO THE LIVE DATA
  // We rename it to sessionData here so we don't have to rewrite all your component props below!
  const sessionData = useTelemetry();

  return (
    <div className="w-full pb-10">
      
      {/* ROW 1: TOP STATS */}
      <div className="mb-5">
        <StatsRow sessionData={sessionData} />
      </div>

      {/* THE MASTER GRID (3 Columns for Top & Middle) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        
        {/* --- ROW 2: The Top Vertical Cards --- */}
        <div className="h-[420px]">
          <LiveActivityStream sessionData={sessionData} />
        </div>
        
        <div className="h-[420px]">
          <BehaviorChart sessionData={sessionData} />
        </div>
        
        {/* COLUMN 3: The 70/30 Stack */}
        <div className="h-[420px] flex flex-col gap-4 md:gap-5">
          <div className="flex-[7] min-h-0 [&>*]:h-full">
            <InterestScores sessionData={sessionData} />
          </div>
          <div className="flex-[3] min-h-0 [&>*]:h-full">
            <TopCategories sessionData={sessionData} />
          </div>
        </div>

        {/* --- ROW 3: The 3 Equal Middle Cards --- */}
        <div className="h-[380px]">
          <EngagementLineChart sessionData={sessionData} />
        </div>
        
        <div className="h-[380px]">
          <AttentionAuction sessionData={sessionData} />
        </div>
        
        <div className="h-[380px]">
          <div className="h-[380px]">
          <SimulatedRecommendations sessionData={sessionData} onNavigate={onNavigate} />
          </div>
        </div>
      </div>

      {/* --- ROW 4: The Bottom Profile Data & Export --- */}
      <div className="mt-4 md:mt-5 grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
        
        {/* Profile Footer takes 60% */}
        <div className="lg:col-span-3 h-[260px]">
          <DigitalProfileFooter sessionData={sessionData} />
        </div>
        
        {/* Export Widget takes 40% */}
        <div className="lg:col-span-2 h-[260px]">
          <UdsExportWidget sessionData={sessionData} />
        </div>

      </div> {/* <--- CRITICAL: Make sure this grid closes BEFORE the footer! */}

      {/* --- ROW 5: YOUR GLOBAL FOOTER --- */}
      <div className="mt-6 w-full">
        <GlobalFooter />
      </div>

    </div> /* <--- Master wrapper closing div */
  );
}