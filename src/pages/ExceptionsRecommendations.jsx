import StatsRow from '../components/StatsRow'
import PriorityExceptionQueue from '../components/PriorityExceptionQueue'
import AiReviewRecommendation from '../components/AiReviewRecommendation'
import WhatIfResolutionScenarios from '../components/WhatIfResolutionScenarios'
import InfoBanner from '../components/InfoBanner'
import { exceptionsStats, scenarioInfoText } from '../data'

export default function ExceptionsRecommendations() {
  return (
    <>
      <StatsRow stats={exceptionsStats} />

      <div className="exceptions-main-grid">
        <PriorityExceptionQueue />
        <AiReviewRecommendation />
      </div>

      <WhatIfResolutionScenarios />
      <InfoBanner text={scenarioInfoText} />
    </>
  )
}
