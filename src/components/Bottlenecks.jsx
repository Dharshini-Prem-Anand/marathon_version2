import { ClipboardList, List, Search, CheckSquare } from 'lucide-react'

const iconMap = {
  clipboard: ClipboardList,
  list: List,
  search: Search,
  check: CheckSquare,
}

export default function Bottlenecks({
  bottlenecks,
  diagnostics = [],
  intervention = {},
  onReviewRecommendations,
}) {
  // null while /preValidationKpis is in flight, [] when it came back with no
  // failing rules — neither can be scaled against a maximum.
  const bars = Array.isArray(bottlenecks) ? bottlenecks : []
  const maxValue = Math.max(1, ...bars.map((b) => b.value))

  return (
    <section className="panel bottlenecks">
      <h2 className="panel-title">Process Bottlenecks &amp; Diagnostics</h2>
      <div className="bottlenecks-grid">
        <div className="bottleneck-bars">
          {bars.length === 0 && (
            <div className="table-empty-cell">
              {bottlenecks == null ? 'Loading rule failures…' : 'No rule failures in this period.'}
            </div>
          )}
          {bars.map((b) => (
            <div className="bottleneck-row" key={b.label}>
              <span className="bottleneck-label">{b.label}</span>
              <div className="bottleneck-bar-track">
                <div
                  className="bottleneck-bar-fill"
                  style={{ width: `${(b.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="bottleneck-value">{b.value}%</span>
            </div>
          ))}
        </div>

        <div className="diagnostics-list">
          {diagnostics.map((d) => {
            const Icon = iconMap[d.icon]
            return (
              <div className="diagnostic-row" key={d.label}>
                <Icon size={15} strokeWidth={1.8} />
                <span className="diagnostic-label">{d.label}</span>
                <span className="diagnostic-value">{d.value}</span>
              </div>
            )
          })}
        </div>

        <div className="intervention-panel">
          <div className="intervention-title">Recommended Intervention</div>
          <div className="intervention-desc">{intervention.description}</div>
          <div className="intervention-stats">
            <div>
              <div className="intervention-stat-label">Confidence</div>
              <div className="intervention-stat-value color-green">{intervention.confidence}</div>
            </div>
            <div>
              <div className="intervention-stat-label">Value at Risk</div>
              <div className="intervention-stat-value color-orange">{intervention.valueAtRisk}</div>
            </div>
          </div>
          <button className="btn-primary" onClick={onReviewRecommendations}>
            Review Recommendations
          </button>
        </div>
      </div>
    </section>
  )
}
