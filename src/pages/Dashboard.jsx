import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import FlowSteps from '../components/FlowSteps'
import CapabilityCards from '../components/CapabilityCards'
import PriorityQueue from '../components/PriorityQueue'
import Bottlenecks from '../components/Bottlenecks'
import ValueRealization from '../components/ValueRealization'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { scorecardMetrics, dashboardFilters, dashboardPersonaField, priorityQueue } from '../data'

export default function Dashboard() {
  const { draft, applied, setField, apply } = useFilters(dashboardFilters)

  const filteredQueue = priorityQueue.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Invoice Channel'], row.channel) &&
      matchesOption(applied['Status'], row.status)
  )

  return (
    <>
      <div className="dashboard-top-zoom">
        <FilterBar
          fields={dashboardFilters}
          values={draft}
          onFieldChange={setField}
          onGo={apply}
          personaField={dashboardPersonaField}
          personaValue={draft.Persona ?? dashboardPersonaField.value}
          onPersonaChange={(v) => setField('Persona', v)}
        />
        <Scorecard title="Business Outcome Scorecard" metrics={scorecardMetrics} />
        <FlowSteps />
      </div>
      <CapabilityCards />
      <PriorityQueue rows={filteredQueue} />
      <Bottlenecks />
      <ValueRealization />
    </>
  )
}
