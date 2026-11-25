import React from 'react';

import { useTelemetry } from "../../hooks/TelemetryContext";

import StatsRow from "../dashboard/cards/StatsRow";
import LiveActivityStream from "../dashboard/cards/LiveActivityStream";
import InterestScores from "../dashboard/cards/InterestScores";
import SimulatedRecommendations from "../dashboard/cards/SimulatedRecommendations";

import EngagementLineChart from "../dashboard/charts/EngagementLineChart";
import BehaviorChart from "../dashboard/charts/BehaviorChart";

import GlobalFooter from "../shared/GlobalFooter";

export default function DashboardView({ onNavigate }) {
  const sessionData = useTelemetry();

  return (
    <div className="w-full pb-10">

      {/* Top stats */}
      <div className="mb-5">
        <StatsRow sessionData={sessionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">

        {/* Row 1: activity, behavior, interests */}
        <div className="h-[420px]">
          <LiveActivityStream sessionData={sessionData} />
        </div>

        <div className="h-[420px]">
          <BehaviorChart sessionData={sessionData} />
        </div>

        <div className="h-[420px] [&>*]:h-full">
          <InterestScores sessionData={sessionData} />
        </div>

        {/* Row 2: engagement trend + recommendation preview */}
        <div className="h-[380px] lg:col-span-2">
          <EngagementLineChart sessionData={sessionData} />
        </div>

        <div className="h-[380px]">
          <SimulatedRecommendations sessionData={sessionData} onNavigate={onNavigate} />
        </div>
      </div>

      <div className="mt-6 w-full">
        <GlobalFooter />
      </div>

    </div>
  );
}
