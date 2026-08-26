import { CheckCircle2, CircleEllipsis, Clock, TrendingUp, Undo2, Scale } from 'lucide-react'
import { vimProcessingTimeline, vimTimelineMetrics } from '../data'

const statusConfig = {
  complete: { icon: CheckCircle2, color: 'green', label: 'Complete' },
  inprogress: { icon: CircleEllipsis, color: 'blue', label: 'In Progress' },
  pending: { icon: Clock, color: 'muted', label: 'Pending' },
}

const metricIconMap = {
  trend: TrendingUp,
  undo: Undo2,
  scale: Scale,
}

export default function VimProcessingTimeline() {
  return (
    <section className="panel">
      <h2 className="panel-title">VIM Processing Timeline</h2>

      <div className="timeline-row">
        {vimProcessingTimeline.map((step, i) => {
          const cfg = statusConfig[step.status]
          const Icon = cfg.icon
          return (
            <div className="timeline-step-wrap" key={step.label}>
              <div className="timeline-step">
                <span className={`timeline-icon color-${cfg.color}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <div className="timeline-label">{step.label}</div>
                <div className={`timeline-status color-${cfg.color}`}>{cfg.label}</div>
              </div>
              {i < vimProcessingTimeline.length - 1 && <div className="timeline-connector" />}
            </div>
          )
        })}
      </div>

      <div className="value-delivered-row timeline-metrics">
        {vimTimelineMetrics.map((m) => {
          const Icon = metricIconMap[m.icon]
          return (
            <div className="value-delivered-item" key={m.label}>
              <div className="value-delivered-icon">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <div className="value-delivered-value">{m.value}</div>
                <div className="value-delivered-label">{m.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
