import { ShieldCheck, Clock, DollarSign } from 'lucide-react'
import { reassignmentMetrics } from '../data'

const iconMap = {
  shield: ShieldCheck,
  clock: Clock,
  dollar: DollarSign,
}

export default function ReassignmentMetricsRow() {
  return (
    <div className="reassignment-metrics-row">
      {reassignmentMetrics.map((m) => {
        const Icon = iconMap[m.icon]
        return (
          <div className="reassignment-metric-card" key={m.label}>
            <div className="reassignment-metric-icon">
              <Icon size={20} strokeWidth={1.6} />
            </div>
            <div>
              <span className="reassignment-metric-value">{m.value}</span>{' '}
              <span className="reassignment-metric-label">{m.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
