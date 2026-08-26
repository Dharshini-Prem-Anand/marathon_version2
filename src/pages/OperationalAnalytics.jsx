import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import TouchlessByMonthChart from '../components/TouchlessByMonthChart'
import ExceptionDriversChart from '../components/ExceptionDriversChart'
import ValueDeliveredBreakdown from '../components/ValueDeliveredBreakdown'
import WhatIfBusinessScenarios from '../components/WhatIfBusinessScenarios'
import NetValueByTouchlessRate from '../components/NetValueByTouchlessRate'
import { operationalAnalyticsFilters, operationalAnalyticsScorecard, analyticsDisclaimer, analyticsCopyright } from '../data'

export default function OperationalAnalytics() {
  return (
    <>
      <FilterBar fields={operationalAnalyticsFilters} />
      <Scorecard metrics={operationalAnalyticsScorecard} />

      <div className="analytics-grid-1">
        <TouchlessByMonthChart />
        <ExceptionDriversChart />
        <ValueDeliveredBreakdown />
      </div>

      <div className="analytics-grid-2">
        <WhatIfBusinessScenarios />
        <NetValueByTouchlessRate />
      </div>

      <div className="analytics-footnote">
        <p>{analyticsDisclaimer}</p>
        <p>{analyticsCopyright}</p>
      </div>
    </>
  )
}
