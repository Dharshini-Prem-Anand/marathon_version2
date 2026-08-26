export default function HorizontalBarChart({ title, rows, axisMax, axisStep }) {
  const ticks = []
  for (let t = 0; t <= axisMax; t += axisStep) ticks.push(t)

  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      <div className="hbar-list">
        {rows.map((r) => (
          <div className="hbar-row" key={r.label}>
            <span className="hbar-label">{r.label}</span>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${(r.percent / axisMax) * 100}%` }} />
              <span className="hbar-value">{r.percent}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="hbar-axis" style={{ paddingLeft: 'var(--hbar-label-width, 90px)' }}>
        {ticks.map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>
    </section>
  )
}
