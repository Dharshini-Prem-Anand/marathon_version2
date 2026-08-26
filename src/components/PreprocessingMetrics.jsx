import { FileCog, Columns2, Layers, LayoutTemplate, ShieldCheck } from 'lucide-react'
import { preprocessingMetrics } from '../data'

const iconMap = {
  fileCog: FileCog,
  columns: Columns2,
  layers: Layers,
  layout: LayoutTemplate,
  shieldLock: ShieldCheck,
}

export default function PreprocessingMetrics() {
  return (
    <section className="panel preprocessing-metrics">
      <h2 className="panel-title">Preprocessing Metrics (Last 7 Days)</h2>
      <div className="preprocessing-grid">
        {preprocessingMetrics.map((m) => {
          const Icon = iconMap[m.icon]
          return (
            <div className="preprocessing-item" key={m.label}>
              <div className="preprocessing-icon">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div className="preprocessing-value">{m.value}</div>
              <div className="preprocessing-label">{m.label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
