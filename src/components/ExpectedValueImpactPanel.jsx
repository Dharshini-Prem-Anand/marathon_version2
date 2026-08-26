import { BarChart3, Clock, TrendingDown, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { expectedValueImpact, expectedValueFootnote } from '../data'

const iconMap = {
  clock: Clock,
  trendDown: TrendingDown,
  dollar: DollarSign,
  shield: ShieldCheck,
  checkCircle: CheckCircle2,
}

export default function ExpectedValueImpactPanel() {
  return (
    <section className="panel expected-value-impact">
      <h2 className="panel-title">
        <BarChart3 size={16} className="panel-title-icon" />
        Expected Value Impact
      </h2>

      <div className="expected-value-list">
        {expectedValueImpact.map((v) => {
          const Icon = iconMap[v.icon]
          return (
            <div className="expected-value-row" key={v.value}>
              <span className="expected-value-icon">
                <Icon size={15} />
              </span>
              <span className="color-blue expected-value-value">{v.value}</span>
              {v.label && <span className="expected-value-label">{v.label}</span>}
            </div>
          )
        })}
      </div>

      <p className="expected-value-footnote">{expectedValueFootnote}</p>
    </section>
  )
}
