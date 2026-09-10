const colorVar = {
  blue: 'var(--blue)',
  purple: '#7a5af8',
  green: 'var(--green)',
  orange: 'var(--orange)',
}

// Data comes from /triageKpis (intakeByChannel). `channels` is null until it
// answers; a period with no intake still draws the ring, in grey.
export default function IntakeByChannel({ channels, total, rangeLabel }) {
  const rows = channels ?? []
  const hasVolume = rows.some((c) => c.value > 0)

  let cumulative = 0
  const stops = rows.map((c) => {
    const start = cumulative
    cumulative += c.percent
    return `${colorVar[c.color]} ${start}% ${cumulative}%`
  })
  const gradient = hasVolume ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(var(--border) 0% 100%)'

  return (
    <section className="panel intake-by-channel">
      <h2 className="panel-title">Intake by Channel{rangeLabel ? ` (${rangeLabel})` : ''}</h2>
      <div className="donut-row">
        <div className="donut-chart" style={{ background: gradient }}>
          <div className="donut-hole">
            <div className="donut-total">{channels ? (total ?? 0).toLocaleString() : '…'}</div>
            <div className="donut-total-label">Total</div>
          </div>
        </div>
        <div className="donut-legend">
          {rows.map((c) => (
            <div className="donut-legend-row" key={c.label}>
              <span className={`legend-dot legend-dot-${c.color}`} />
              <span className="donut-legend-label">{c.label}</span>
              <span className="donut-legend-value">{c.value.toLocaleString()}</span>
              <span className="donut-legend-percent">({c.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
