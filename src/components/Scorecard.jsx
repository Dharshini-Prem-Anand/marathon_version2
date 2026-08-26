import { ArrowUp, ArrowDown } from 'lucide-react'

export default function Scorecard({ title, metrics }) {
  return (
    <section className={title ? 'panel' : undefined}>
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="scorecard-grid">
        {metrics.map((m) => (
          <div className="scorecard-card" key={m.label}>
            <div className="scorecard-label">{m.label}</div>
            <div className="scorecard-value-row">
              <span className={`scorecard-value color-${m.color}`}>{m.value}</span>
              {m.trend === 'up' && <ArrowUp size={18} className="trend-up" />}
              {m.trend === 'down' && <ArrowDown size={18} className="trend-down" />}
            </div>
            {m.target && <div className="scorecard-target">{m.target}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
