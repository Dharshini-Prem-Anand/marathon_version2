import PageHeader from '../components/PageHeader'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import TeamCapacityWorkload from '../components/TeamCapacityWorkload'
import RiskPriorityModel from '../components/RiskPriorityModel'
import PriorityWorkQueue from '../components/PriorityWorkQueue'
import AiReassignmentPanel from '../components/AiReassignmentPanel'
import ReassignmentMetricsRow from '../components/ReassignmentMetricsRow'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { workAssignmentPageHeader, workAssignmentFilters, workAssignmentStats, teamCapacity, priorityWorkQueue } from '../data'

function slaStatus(sla) {
  const hours = parseInt(sla, 10)
  return hours <= 4 ? 'At Risk' : 'On Track'
}

export default function WorkAssignment() {
  const { draft, applied, setField } = useFilters(workAssignmentFilters, { live: true })

  const filteredTeam = teamCapacity.filter(
    (m) => matchesOption(applied['Team'], m.team) && matchesOption(applied['Role'], m.role)
  )

  const filteredQueue = priorityWorkQueue.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Priority'], row.scoreLabel) &&
      matchesOption(applied['SLA Status'], slaStatus(row.sla))
  )

  return (
    <>
      <PageHeader title={workAssignmentPageHeader.title} subtitle={workAssignmentPageHeader.subtitle} />
      <FilterBar
        fields={workAssignmentFilters}
        values={draft}
        onFieldChange={setField}
        dateFieldLabel="Date"
        dateRangeLabel="05/15/2025"
        hideGoButton
        hideAdaptLink
      />
      <StatsRow stats={workAssignmentStats} />

      <div className="work-assignment-grid-1">
        <TeamCapacityWorkload rows={filteredTeam} />
        <RiskPriorityModel />
      </div>

      <div className="work-assignment-grid-2">
        <PriorityWorkQueue rows={filteredQueue} />
        <AiReassignmentPanel />
      </div>

      <ReassignmentMetricsRow />
    </>
  )
}
