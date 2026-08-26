import PageHeader from '../components/PageHeader'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TeamCapacityWorkload from '../components/TeamCapacityWorkload'
import RiskPriorityModel from '../components/RiskPriorityModel'
import PriorityWorkQueue from '../components/PriorityWorkQueue'
import AiReassignmentPanel from '../components/AiReassignmentPanel'
import ReassignmentMetricsRow from '../components/ReassignmentMetricsRow'
import { workAssignmentPageHeader, workAssignmentFilters, workAssignmentStats } from '../data'

export default function WorkAssignment() {
  return (
    <>
      <PageHeader title={workAssignmentPageHeader.title} subtitle={workAssignmentPageHeader.subtitle} />
      <FilterBar
        fields={workAssignmentFilters}
        dateFieldLabel="Date"
        dateRangeLabel="05/15/2025"
        hideGoButton
        hideAdaptLink
      />
      <StatsRow stats={workAssignmentStats} />

      <div className="work-assignment-grid-1">
        <TeamCapacityWorkload />
        <RiskPriorityModel />
      </div>

      <div className="work-assignment-grid-2">
        <PriorityWorkQueue />
        <AiReassignmentPanel />
      </div>

      <ReassignmentMetricsRow />
    </>
  )
}
