import { ChevronRight } from 'lucide-react'

export default function FlowSteps({ steps = [], legend = [] }) {
  return (
    <section className="panel">
      <h2 className="panel-title">End-to-End Invoice Flow</h2>
      <div className="flow-row">
        {steps.map((step, i) => (
          <div className="flow-step-wrap" key={step.label}>
            <div className="flow-step">
              <div className="flow-step-label">{step.label}</div>
              <div className="flow-step-value">{step.value}</div>
            </div>
            {i < steps.length - 1 && <ChevronRight size={18} className="flow-chevron" />}
          </div>
        ))}
      </div>
      <div className="flow-legend">
        {legend.map((l, i) => (
          <span key={l.label} className={`flow-legend-item color-${l.color}`}>
            <span className="legend-label">{l.label}:</span>{' '}
            <span className="legend-value">{l.value}</span>
            {i < legend.length - 1 && <span className="legend-divider">|</span>}
          </span>
        ))}
      </div>
    </section>
  )
}
