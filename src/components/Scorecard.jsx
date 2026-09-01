import { TrendingUp, TrendingDown } from 'lucide-react'

export default function Scorecard({ title, metrics }) {
  return (
    <section className={title ? 'panel' : undefined}>
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="scorecard-grid">
        {metrics.map((m) => (
          <div className="scorecard-card" key={m.label}>
            <div className="scorecard-main">
              <div className="scorecard-label">{m.label}</div>
              <span className={`scorecard-value color-${m.color}`}>{m.value}</span>
              {m.target && <div className="scorecard-target">{m.target}</div>}
            </div>
            {m.trend === 'up' && <TrendingUp size={44} strokeWidth={2.25} className={`scorecard-trend-icon color-${m.color}`} />}
            {m.trend === 'down' && <TrendingDown size={44} strokeWidth={2.25} className={`scorecard-trend-icon color-${m.color}`} />}
          </div>
        ))}
      </div>
    </section>
  )
}
