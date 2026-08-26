import InfoBanner from './InfoBanner'
import { workAssignmentCapacity, reassignmentBannerText } from '../data'

export default function WorkAssignmentCapacityPanel() {
  return (
    <section className="panel">
      <h2 className="panel-title">Work Assignment and Capacity</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Team</th>
              <th>Assigned</th>
              <th>Capacity</th>
              <th>At Risk</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {workAssignmentCapacity.map((row) => (
              <tr key={row.team}>
                <td className="cell-ellipsis">{row.team}</td>
                <td className="color-blue">{row.assigned}</td>
                <td>{row.capacity}</td>
                <td>{row.atRisk}</td>
                <td>{row.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="work-capacity-banner">
        <InfoBanner text={reassignmentBannerText} />
      </div>

      <button className="btn-primary btn-block">Apply Reassignment</button>
    </section>
  )
}
