import { Bot, User } from 'lucide-react'
import { auditTrail, totalAuditEventsLabel } from '../data'

export default function AuditTrailTable() {
  return (
    <section className="panel audit-trail">
      <h2 className="panel-title">Audit Trail</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Event Time</th>
              <th>Invoice</th>
              <th>Stage</th>
              <th>Automated / Human</th>
              <th>Decision</th>
              <th>User / Model</th>
              <th>Evidence</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((row, i) => {
              const ActorIcon = row.actor === 'automated' ? Bot : User
              return (
                <tr key={i}>
                  <td className="cell-ellipsis">{row.time}</td>
                  <td className="cell-mono cell-ellipsis">{row.invoice}</td>
                  <td className="cell-ellipsis">{row.stage}</td>
                  <td>
                    <span className="actor-cell">
                      <ActorIcon size={14} />
                      {row.actor === 'automated' ? 'Automated' : 'Human'}
                    </span>
                  </td>
                  <td className="cell-ellipsis">{row.decision}</td>
                  <td className="cell-ellipsis" title={row.userModel}>
                    {row.userModel}
                  </td>
                  <td>
                    <button className="btn-link">View</button>
                  </td>
                  <td>
                    <span className={`result-cell color-${row.resultColor}`}>
                      <span className={`priority-dot color-${row.resultColor}`} />
                      {row.result}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">{totalAuditEventsLabel}</button>
    </section>
  )
}
