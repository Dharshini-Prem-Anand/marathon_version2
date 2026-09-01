import { Users, Clock, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react'
import { valueRealization as defaultValueRealization, valueFooter as defaultValueFooter } from '../data'

const iconMap = {
  users: Users,
  clock: Clock,
  shield: ShieldCheck,
  trend: TrendingUp,
  dollar: DollarSign,
}

export default function ValueRealization({ items = defaultValueRealization, footer = defaultValueFooter }) {
  return (
    <section className="panel">
      <h2 className="panel-title">MVP Value Realization</h2>
      <div className="value-grid">
        {items.map((v) => {
          const Icon = iconMap[v.icon]
          return (
            <div className="value-card" key={v.title}>
              <div className="value-icon">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div className="value-text">
                <div className="value-value">{v.value}</div>
                <div className="value-label">{v.label}</div>
              </div>
              <div className="value-title">{v.title}</div>
            </div>
          )
        })}
      </div>
      <div className="value-footer">
        {footer.map((f, i) => (
          <span key={f.label} className="value-footer-item">
            {f.label} <strong>{f.value}</strong>
            {i < footer.length - 1 && <span className="legend-divider">|</span>}
          </span>
        ))}
      </div>
    </section>
  )
}
