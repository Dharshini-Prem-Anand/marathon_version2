import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import ThreeWayMatchReview from '../components/ThreeWayMatchReview'
import MatchExplanation from '../components/MatchExplanation'
import MatchingPerformance from '../components/MatchingPerformance'
import VimProcessingTimeline from '../components/VimProcessingTimeline'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { poMatchingFilters, poMatchingStats, poMatchingContext } from '../data'

export default function PoLineMatching({ onNavigate }) {
  const { draft, applied, setField, apply } = useFilters(poMatchingFilters)

  const matchesFilters =
    matchesCompanyCode(applied['Company Code']) &&
    matchesOption(applied['Invoice Channel'], poMatchingContext.channel) &&
    matchesOption(applied['Vendor'], poMatchingContext.vendor) &&
    matchesOption(applied['Status'], poMatchingContext.status)

  return (
    <>
      <FilterBar fields={poMatchingFilters} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={poMatchingStats} />

      {matchesFilters ? (
        <>
          <div className="po-main-grid">
            <ThreeWayMatchReview onNavigate={onNavigate} />
            <MatchExplanation />
          </div>

          <MatchingPerformance />
          <VimProcessingTimeline />
        </>
      ) : (
        <FilterEmptyState message="No PO match record matches the selected filters." />
      )}
    </>
  )
}
