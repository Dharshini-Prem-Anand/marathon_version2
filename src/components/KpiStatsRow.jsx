import { kpiStats } from '../data'

export default function KpiStatsRow() {
  return (
    <div className="stats-row">
      {kpiStats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-label">{s.label}</div>
          <div className={`stat-value color-${s.valueColor}`}>{s.value}</div>
          <div className="stat-target">{s.target}</div>
          <div className="kpi-stat-bar-track">
            <div className={`kpi-stat-bar-fill inline-bar-${s.barColor}`} style={{ width: `${s.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
