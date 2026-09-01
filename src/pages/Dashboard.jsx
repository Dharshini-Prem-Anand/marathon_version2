import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import FlowSteps from '../components/FlowSteps'
import CapabilityCards from '../components/CapabilityCards'
import PriorityQueue from '../components/PriorityQueue'
import Bottlenecks from '../components/Bottlenecks'
import ValueRealization from '../components/ValueRealization'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesOption } from '../hooks/useFilters'
import {
  scorecardMetrics,
  flowSteps,
  flowLegend,
  capabilityCards,
  bottlenecks,
  dashboardIntervention,
  valueRealization,
  valueFooter,
  dashboardFilters,
  dashboardPersonaField,
  priorityQueue,
} from '../data'
import { computeDashboardMetrics } from '../utils/dashboardMetrics'

export default function Dashboard({ onNavigate }) {
  const { draft, applied, setField, apply } = useFilters(dashboardFilters)

  const isFiltered = dashboardFilters.some((f) => applied[f.label] !== f.value)

  const filteredQueue = priorityQueue.filter(
    (row) =>
      matchesOption(applied['Company Code'], row.companyCode) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Invoice Channel'], row.channel) &&
      matchesOption(applied['Status'], row.status)
  )

  const computed = isFiltered ? computeDashboardMetrics(filteredQueue, priorityQueue.length) : null
  const metrics =
    computed ?? { scorecardMetrics, flowSteps, flowLegend, capabilityCards, bottlenecks, intervention: dashboardIntervention, valueRealization, valueFooter }
  const noResults = isFiltered && filteredQueue.length === 0

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
        {!noResults && <Scorecard title="Business Outcome Scorecard" metrics={metrics.scorecardMetrics} />}
        {!noResults && <FlowSteps steps={metrics.flowSteps} legend={metrics.flowLegend} />}
      </div>
      {noResults ? (
        <FilterEmptyState message="No invoices match the selected filters. Adjust the filters above to see dashboard results." />
      ) : (
        <>
          <CapabilityCards cards={metrics.capabilityCards} />
          <div className="dashboard-queue-row">
            <PriorityQueue rows={filteredQueue} />
            <Bottlenecks
              bottlenecks={metrics.bottlenecks}
              intervention={metrics.intervention}
              onReviewRecommendations={() => onNavigate?.('Exceptions & Recommendations')}
            />
          </div>
          <ValueRealization items={metrics.valueRealization} footer={metrics.valueFooter} />
        </>
      )}
    </>
  )
}
