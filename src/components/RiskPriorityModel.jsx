import { Info } from 'lucide-react'
import { priorityModel } from '../data'

const colorVar = {
  blue: 'var(--blue)',
  teal: '#0bb3a8',
  purple: '#7a5af8',
  orange: 'var(--orange)',
  yellow: '#f2c94c',
}

export default function RiskPriorityModel() {
  let cumulative = 0
  const stops = priorityModel.factors.map((f) => {
    const start = cumulative
    cumulative += f.weight
    return `${colorVar[f.color]} ${start}% ${cumulative}%`
  })
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <section className="panel risk-priority-model">
      <h2 className="panel-title">Risk-Based Priority Model</h2>

      <div className="risk-priority-body">
        <div className="priority-donut-chart" style={{ background: gradient }}>
          <div className="priority-donut-hole">
            <div className="priority-donut-score">{priorityModel.score}</div>
            <div className="priority-donut-label">{priorityModel.label}</div>
          </div>
        </div>

        <table className="factor-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {priorityModel.factors.map((f) => (
              <tr key={f.label}>
                <td>
                  <span className={`legend-dot legend-dot-${f.color}`} />
                  {f.label}
                </td>
                <td>{f.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="priority-model-note">
        <Info size={13} />
        {priorityModel.note}
      </div>
    </section>
  )
}
