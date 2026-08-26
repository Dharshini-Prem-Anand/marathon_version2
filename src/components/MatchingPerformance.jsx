import { matchingPerformance } from '../data'

export default function MatchingPerformance() {
  return (
    <section className="panel">
      <h2 className="panel-title">Matching Performance</h2>
      <div className="matching-performance-grid">
        {matchingPerformance.map((m) => (
          <div className="matching-performance-card" key={m.label}>
            <div className="matching-performance-label">{m.label}</div>
            <div className="matching-performance-percent color-blue">{m.percent}</div>
            <div className="matching-performance-fraction">{m.fraction}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
