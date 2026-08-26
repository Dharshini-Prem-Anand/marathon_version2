import { channelIntake, totalTriageCount } from '../data'

const colorVar = {
  blue: 'var(--blue)',
  purple: '#7a5af8',
  green: 'var(--green)',
  orange: 'var(--orange)',
}

export default function IntakeByChannel() {
  let cumulative = 0
  const stops = channelIntake.map((c) => {
    const start = cumulative
    cumulative += c.percent
    return `${colorVar[c.color]} ${start}% ${cumulative}%`
  })
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <section className="panel intake-by-channel">
      <h2 className="panel-title">Intake by Channel (Last 7 Days)</h2>
      <div className="donut-row">
        <div className="donut-chart" style={{ background: gradient }}>
          <div className="donut-hole">
            <div className="donut-total">{totalTriageCount}</div>
            <div className="donut-total-label">Total</div>
          </div>
        </div>
        <div className="donut-legend">
          {channelIntake.map((c) => (
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
