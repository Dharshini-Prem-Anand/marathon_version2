import { Users } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  name: (row) => row.name,
  role: (row) => row.role,
  utilization: (row) => row.utilization,
  assigned: (row) => row.assigned,
  atRisk: (row) => row.atRisk,
  available: (row) => row.available,
}

export default function TeamCapacityWorkload({ rows }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)
  return (
    <section className="panel team-capacity">
      <div className="panel-title-row">
        <h2 className="panel-title">
          <Users size={16} className="panel-title-icon" />
          Team Capacity &amp; Workload
        </h2>
        <div className="panel-title-actions">
          <TableSearchInput ctl={ctl} />
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
              <SortFilterTh columnKey="name" label="Team Member" ctl={ctl} />
              <SortFilterTh columnKey="role" label="Role" ctl={ctl} />
              <SortFilterTh columnKey="utilization" label="Utilization" ctl={ctl} />
              <SortFilterTh columnKey="assigned" label="Assigned" ctl={ctl} />
              <SortFilterTh columnKey="atRisk" label="At Risk" ctl={ctl} />
              <SortFilterTh columnKey="available" label="Available" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty-cell">
                  No team members match the selected filters.
                </td>
              </tr>
            )}
            {ctl.rows.map((m) => (
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
