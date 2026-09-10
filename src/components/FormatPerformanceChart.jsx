// Extraction accuracy per document format, from /getExtractionKpis.
//
// `rows` is [{ label, value }] straight out of mapFormatPerformance: null
// while the call is in flight or if it failed, empty when the service
// returned no formats for the window. Only the bars are data — the axis and
// its grid lines are fixed at 0-100%, because these are percentages.
const GRID_LINES = [100, 75, 50, 25, 0]

// Below the 80% target a bar is called out in orange, matching the tile.
const WARN_BELOW = 80

function Placeholder({ text }) {
  return <div className="bar-chart-empty">{text}</div>
}

export default function FormatPerformanceChart({ rows, loading, onClose }) {
  const bars = Array.isArray(rows) ? rows.filter((row) => Number.isFinite(Number(row?.value))) : null

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

      {loading ? (
        <Placeholder text="Loading format accuracy…" />
      ) : !bars ? (
        <Placeholder text="Format accuracy is unavailable." />
      ) : bars.length === 0 ? (
        <Placeholder text="No format accuracy for the selected period." />
      ) : (
        <div className="bar-chart">
          <div className="bar-chart-axis">
            {GRID_LINES.map((g) => (
              <span key={g}>{g}%</span>
            ))}
          </div>
          <div className="bar-chart-plot">
            {/* The grid layer stops where the bars do, above the strip the
                format labels sit in, so a bar's top meets its own value on
                the axis instead of floating a label's height above it. */}
            <div className="bar-chart-grid">
              {GRID_LINES.map((g) => (
                <div className="bar-chart-gridline" key={g} style={{ bottom: `${g}%` }} />
              ))}
            </div>
            {bars.map((bar) => {
              // Clamped so a value the service reports above 100 can't grow
              // the bar out of the plot.
              const value = Math.max(0, Math.min(100, Number(bar.value)))
              return (
                <div className="bar-chart-col" key={bar.label} title={`${bar.label}: ${value}%`}>
                  <div className="bar-chart-value">{value}%</div>
                  <div
                    className={`bar-chart-bar${value < WARN_BELOW ? ' bar-chart-bar-warn' : ''}`}
                    style={{ height: `${value}%` }}
                  />
                  <div className="bar-chart-label">{bar.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
