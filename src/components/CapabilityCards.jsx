import { Mail, FileText, CheckCircle2, Link2, Lightbulb, BarChart3 } from 'lucide-react'

const iconMap = {
  mail: Mail,
  fileText: FileText,
  checkCircle: CheckCircle2,
  link: Link2,
  lightbulb: Lightbulb,
  barChart: BarChart3,
}

export default function CapabilityCards({ cards = [] }) {
  return (
    <section className="panel">
      <h2 className="panel-title">MVP Capability Performance</h2>
      <div className="capability-grid">
        {cards.map((c) => {
          const Icon = iconMap[c.icon]
          return (
            <div className="capability-card" key={c.title}>
              <div className="capability-header">
                <Icon size={16} strokeWidth={1.8} />
                <span>{c.title}</span>
              </div>
              <div className="capability-value">{c.value}</div>
              <div className="capability-value-label">{c.valueLabel}</div>
              <div className="capability-target">
                {c.targetHighlight ? (
                  <>
                    <span className={`color-${c.targetColor}`}>{c.targetHighlight}</span>
                    {c.target.slice(c.targetHighlight.length)}
                  </>
                ) : c.targetColor ? (
                  <span className={`color-${c.targetColor}`}>{c.target}</span>
                ) : (
                  c.target
                )}
              </div>
              <div className="capability-footer">
                <span className={`capability-stat color-${c.statColor}`}>{c.stat}</span>
                <span className="capability-stat-label">{c.statLabel}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
