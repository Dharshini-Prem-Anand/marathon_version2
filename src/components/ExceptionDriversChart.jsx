import { exceptionDrivers } from '../data'

const axisTicks = [0, 10, 20, 30, 40]

export default function ExceptionDriversChart() {
  const maxAxis = 40

  return (
    <section className="panel">
      <h2 className="panel-title">Exception Drivers</h2>
      <div className="exception-drivers-list">
        {exceptionDrivers.map((d) => (
          <div className="exception-driver-row" key={d.label}>
            <span className="exception-driver-label">{d.label}</span>
            <div className="exception-driver-track">
              <div className="exception-driver-fill" style={{ width: `${(d.percent / maxAxis) * 100}%` }} />
              <span className="exception-driver-value">{d.percent}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="exception-drivers-axis">
        {axisTicks.map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>
    </section>
  )
}
