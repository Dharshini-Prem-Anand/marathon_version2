import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import ThreeWayMatchReview from '../components/ThreeWayMatchReview'
import MatchExplanation from '../components/MatchExplanation'
import MatchingPerformance from '../components/MatchingPerformance'
import VimProcessingTimeline from '../components/VimProcessingTimeline'
import { poMatchingFilters, poMatchingStats } from '../data'

export default function PoLineMatching() {
  return (
    <>
      <FilterBar fields={poMatchingFilters} />
      <StatsRow stats={poMatchingStats} />

      <div className="po-main-grid">
        <ThreeWayMatchReview />
        <MatchExplanation />
      </div>

      <MatchingPerformance />
      <VimProcessingTimeline />
    </>
  )
}
