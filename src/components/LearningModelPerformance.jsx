import { Brain, RefreshCw, ShieldCheck, Package } from 'lucide-react'
import { learningModelPerformance } from '../data'

const iconMap = {
  brain: Brain,
  refresh: RefreshCw,
  shield: ShieldCheck,
  package: Package,
}

export default function LearningModelPerformance() {
  return (
    <section className="panel">
      <h2 className="panel-title">Learning &amp; Model Performance</h2>
      <div className="value-delivered-row">
        {learningModelPerformance.map((v) => {
          const Icon = iconMap[v.icon]
          return (
            <div className="value-delivered-item" key={v.label}>
              <div className="value-delivered-icon">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <div className="value-delivered-value">{v.value}</div>
                <div className="value-delivered-label">{v.label}</div>
              </div>
            </div>
          )
        })}
      </div>
      <button className="btn-link view-all-link">View Model Diagnostics</button>
    </section>
  )
}
