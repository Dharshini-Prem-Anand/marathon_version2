import { priorityColor } from '../data'

export default function PriorityExceptionQueue({ rows = [], totalCount, selectedId, onSelect }) {
  const colCount = 8

  return (
    <section className="panel priority-exception-queue">
      <h2 className="panel-title">Priority Exception Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Invoice</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Issue</th>
              <th>Due</th>
              <th>Owner</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No exceptions match the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id ?? row.invoice}
                  onClick={() => onSelect?.(row.invoice)}
                  className={`triage-row${selectedId === row.invoice ? ' selected' : ''}`}
                >
                  <td>
                    <span className={`priority-dot color-${priorityColor[row.priority]}`} />
                    {row.priority}
                  </td>
                  <td className="cell-mono cell-ellipsis">{row.invoice}</td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td>{row.amount}</td>
                  <td className={`cell-ellipsis${row.issueColor ? ` color-${row.issueColor}` : ''}`} title={row.issue}>
                    {row.issue}
                  </td>
                  <td className={row.dueColor ? `color-${row.dueColor}` : undefined}>{row.due}</td>
                  <td className="cell-ellipsis">{row.owner}</td>
                  <td>
                    <span className={`priority-dot color-${row.slaColor}`} />
                    <span className={`color-${row.slaColor}`}>{row.sla}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">View All Exceptions ({totalCount ?? rows.length})</button>
    </section>
  )
}
