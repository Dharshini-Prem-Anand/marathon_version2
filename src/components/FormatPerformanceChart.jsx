import { formatPerformance } from '../data'

const gridLines = [100, 75, 50, 25, 0]

export default function FormatPerformanceChart({ onClose }) {
  return (
    <section className="panel format-performance">
      <div className="panel-title-row">
        <h2 className="panel-title">Format Performance (Accuracy %)</h2>
        {onClose && (
          <button className="btn-link" onClick={onClose}>
            Hide
          </button>
        )}
      </div>
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
    </section>
  )
}
