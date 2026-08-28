import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import TouchlessByMonthChart from '../components/TouchlessByMonthChart'
import ExceptionDriversChart from '../components/ExceptionDriversChart'
import ValueDeliveredBreakdown from '../components/ValueDeliveredBreakdown'
import WhatIfBusinessScenarios from '../components/WhatIfBusinessScenarios'
import NetValueByTouchlessRate from '../components/NetValueByTouchlessRate'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode } from '../hooks/useFilters'
import { operationalAnalyticsFilters, operationalAnalyticsScorecard, analyticsDisclaimer, analyticsCopyright } from '../data'

export default function OperationalAnalytics() {
  const { draft, applied, setField, apply } = useFilters(operationalAnalyticsFilters)

  // These figures are portfolio-wide aggregates (all vendors, all channels, all
  // statuses combined) — there's no per-vendor/channel/status breakdown to slice
  // them by, so narrowing any of those dimensions means "no sliced data exists."
  const matchesFilters =
    matchesCompanyCode(applied['Company Code']) &&
    applied['Invoice Channel'] === 'All' &&
    applied['Vendor'] === 'All' &&
    applied['Status'] === 'All'

  return (
    <>
      <FilterBar fields={operationalAnalyticsFilters} values={draft} onFieldChange={setField} onGo={apply} />

      {matchesFilters ? (
        <>
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
      ) : (
        <FilterEmptyState message="These analytics are only available as an all-vendor, all-channel portfolio view. Set Invoice Channel, Vendor and Status back to 'All' to see them." />
      )}
    </>
  )
}
