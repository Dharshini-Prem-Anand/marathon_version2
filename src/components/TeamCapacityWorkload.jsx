import { Users } from 'lucide-react'
import { teamCapacity } from '../data'

export default function TeamCapacityWorkload() {
  return (
    <section className="panel team-capacity">
      <div className="panel-title-row">
        <h2 className="panel-title">
          <Users size={16} className="panel-title-icon" />
          Team Capacity &amp; Workload
        </h2>
        <div className="panel-title-actions">
          <button className="btn-outline btn-sm">Bulk Assign</button>
          <button className="btn-outline btn-sm">Balance Workload</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Role</th>
              <th>Utilization</th>
              <th>Assigned</th>
              <th>At Risk</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {teamCapacity.map((m) => (
              <tr key={m.name}>
                <td>
                  <span className="team-member-cell">
                    <span className="team-avatar">{m.initials}</span>
                    {m.name}
                  </span>
                </td>
                <td className="cell-ellipsis">{m.role}</td>
                <td>
                  <div className="inline-bar-cell">
                    <div className="inline-bar-track">
                      <div className="inline-bar-fill inline-bar-blue" style={{ width: `${m.utilization}%` }} />
                    </div>
                    <span>{m.utilization}%</span>
                  </div>
                </td>
                <td>{m.assigned} assigned</td>
                <td>
                  <span className={`badge badge-${m.atRiskColor}`}>{m.atRisk} at risk</span>
                </td>
                <td className="cell-ellipsis">{m.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
