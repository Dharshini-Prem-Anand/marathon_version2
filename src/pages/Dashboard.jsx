import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import FlowSteps from '../components/FlowSteps'
import CapabilityCards from '../components/CapabilityCards'
import PriorityQueue from '../components/PriorityQueue'
import Bottlenecks from '../components/Bottlenecks'
import ValueRealization from '../components/ValueRealization'
import { scorecardMetrics } from '../data'

const filters = [
  { label: 'Company Code', value: 'All' },
  { label: 'Invoice Channel', value: 'All' },
  { label: 'Vendor', value: 'All' },
  { label: 'Status', value: 'All' },
]

export default function Dashboard() {
  return (
    <>
      <FilterBar fields={filters} personaField={{ label: 'Persona', value: 'Executive' }} />
      <Scorecard title="Business Outcome Scorecard" metrics={scorecardMetrics} />
      <FlowSteps />
      <CapabilityCards />
      <PriorityQueue />
      <Bottlenecks />
      <ValueRealization />
    </>
  )
}
