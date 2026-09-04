import { Bot, User } from 'lucide-react'
import { auditTrail, totalAuditEventsLabel } from '../data'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  time: (row) => row.time,
  invoice: (row) => row.invoice,
  stage: (row) => row.stage,
  actor: (row) => (row.actor === 'automated' ? 'Automated' : 'Human'),
  decision: (row) => row.decision,
  userModel: (row) => row.userModel,
  result: (row) => row.result,
}

export default function AuditTrailTable() {
  const ctl = useColumnSortFilter(auditTrail, COLUMNS)

  return (
    <section className="panel audit-trail">
      <div className="panel-title-row">
        <h2 className="panel-title">Audit Trail</h2>
        <TableSearchInput ctl={ctl} />
      </div>
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
              <SortFilterTh columnKey="time" label="Event Time" ctl={ctl} />
              <SortFilterTh columnKey="invoice" label="Invoice" ctl={ctl} />
              <SortFilterTh columnKey="stage" label="Stage" ctl={ctl} />
              <SortFilterTh columnKey="actor" label="Automated / Human" ctl={ctl} />
              <SortFilterTh columnKey="decision" label="Decision" ctl={ctl} />
              <SortFilterTh columnKey="userModel" label="User / Model" ctl={ctl} />
              <th>Evidence</th>
              <SortFilterTh columnKey="result" label="Result" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.map((row, i) => {
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
