import { formatPerformance } from '../data'

const gridLines = [100, 75, 50, 25, 0]

export default function FormatPerformanceChart() {
  return (
    <section className="panel format-performance">
      <h2 className="panel-title">Format Performance (Accuracy %)</h2>
      <div className="bar-chart">
        <div className="bar-chart-axis">
          {gridLines.map((g) => (
            <span key={g}>{g}%</span>
          ))}
        </div>
        <div className="bar-chart-plot">
          {gridLines.map((g) => (
            <div className="bar-chart-gridline" key={g} style={{ bottom: `${g}%` }} />
          ))}
          {formatPerformance.map((f) => (
            <div className="bar-chart-col" key={f.label}>
              <div className="bar-chart-value">{f.value}%</div>
              <div
                className={`bar-chart-bar${f.value < 80 ? ' bar-chart-bar-warn' : ''}`}
                style={{ height: `${f.value}%` }}
              />
              <div className="bar-chart-label">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn-link view-all-link">View Format Diagnostics</button>
    </section>
  )
}
