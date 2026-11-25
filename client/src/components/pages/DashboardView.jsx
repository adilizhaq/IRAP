import React from 'react';

import { useTelemetry } from "../../hooks/TelemetryContext";

import StatsRow from "../dashboard/cards/StatsRow";
import InterestScores from "../dashboard/cards/InterestScores";
import SimulatedRecommendations from "../dashboard/cards/SimulatedRecommendations";
import LiveActivityStream from "../dashboard/cards/LiveActivityStream";

import EngagementLineChart from "../dashboard/charts/EngagementLineChart";
import BehaviorChart from "../dashboard/charts/BehaviorChart";

import GlobalFooter from "../shared/GlobalFooter";

/*
  Layout (cards are ordered by importance, which is also the mobile order):

  mobile  : 1 column, cards stack
  tablet  : 2 columns, wide cards span both
  desktop : 3 columns (xl, >=1280px; narrower cards get cramped)

    [ stats row ..................................... ]
    [ Interest Scores ][ Behavior ][ Recommendations ]
    [ Engagement Over Time (2 cols) ][ Recent Actions ]

  Cards fill their wrapper (h-full), so heights are set here, in one place.
*/
const CARD = "h-[360px] xl:h-[380px]";

export default function DashboardView({ onNavigate }) {
  const sessionData = useTelemetry();

  return (
    <div className="w-full pb-6 md:pb-10">

      <div className="mb-4 md:mb-5">
        <StatsRow sessionData={sessionData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">

        <div className={CARD}>
          <InterestScores sessionData={sessionData} />
        </div>

        <div className={CARD}>
          <BehaviorChart sessionData={sessionData} />
        </div>

        <div className={`${CARD} md:col-span-2 xl:col-span-1`}>
          <SimulatedRecommendations sessionData={sessionData} onNavigate={onNavigate} />
        </div>

        <div className={`${CARD} md:col-span-2`}>
          <EngagementLineChart sessionData={sessionData} />
        </div>

        <div className={`${CARD} md:col-span-2 xl:col-span-1`}>
          <LiveActivityStream sessionData={sessionData} />
        </div>

      </div>

      <div className="mt-6 w-full">
        <GlobalFooter />
      </div>

    </div>
  );
}
