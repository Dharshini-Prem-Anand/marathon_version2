import { ChevronRight } from 'lucide-react'
import { flowSteps, flowLegend } from '../data'

export default function FlowSteps() {
  return (
    <section className="panel">
      <h2 className="panel-title">End-to-End Invoice Flow</h2>
      <div className="flow-row">
        {flowSteps.map((step, i) => (
          <div className="flow-step-wrap" key={step.label}>
            <div className="flow-step">
              <div className="flow-step-label">{step.label}</div>
              <div className="flow-step-value">{step.value}</div>
            </div>
            {i < flowSteps.length - 1 && <ChevronRight size={18} className="flow-chevron" />}
          </div>
        ))}
      </div>
      <div className="flow-legend">
        {flowLegend.map((l, i) => (
          <span key={l.label} className="flow-legend-item">
            <span className={`legend-label color-${l.color}`}>{l.label}:</span>{' '}
            <span className="legend-value">{l.value}</span>
            {i < flowLegend.length - 1 && <span className="legend-divider">|</span>}
          </span>
        ))}
      </div>
    </section>
  )
}
