export default function PlainStatsRow({ stats }) {
  return (
    <div className="plain-stats-row">
      {stats.map((s) => (
        <div className="plain-stat-card" key={s.label}>
          <div className="plain-stat-label">{s.label}</div>
          <div className={`plain-stat-value color-${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
