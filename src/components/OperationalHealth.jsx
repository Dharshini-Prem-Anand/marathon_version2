import Sparkline from './Sparkline'
import { operationalHealth } from '../data'

export default function OperationalHealth() {
  return (
    <section className="panel">
      <h2 className="panel-title">Operational Health</h2>
      <div className="operational-health-grid">
        {operationalHealth.map((m) => (
          <div className="operational-health-card" key={m.label}>
            <div className="operational-health-label">{m.label}</div>
            <div className={`operational-health-value${m.valueColor ? ` color-${m.valueColor}` : ''}`}>
              {m.value}
            </div>
            <Sparkline data={m.sparkline} color={m.sparklineColor} />
            <div className="operational-health-delta">
              <span>vs yesterday</span>
              <span className={`color-${m.deltaColor}`}>{m.deltaText}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
