import { ArrowDownRight } from 'lucide-react'
import { painPoints } from '../data'

export default function PainPointTable() {
  return (
    <section className="panel pain-point-table">
      <h2 className="panel-title">Pain-Point Baseline &amp; Improvement</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pain Point</th>
              <th>Current</th>
              <th>Prior 7 Days</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            {painPoints.map((p) => (
              <tr key={p.label}>
                <td>{p.label}</td>
                <td>{p.current}</td>
                <td>{p.prior}</td>
                <td className="color-green improvement-cell">
                  {p.improvement}
                  <ArrowDownRight size={13} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">View Improvement Trends</button>
    </section>
  )
}
