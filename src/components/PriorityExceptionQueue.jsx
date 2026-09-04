import { priorityColor } from '../data'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  priority: (row) => row.priority,
  invoice: (row) => row.invoice,
  vendor: (row) => row.vendor,
  amount: (row) => row.amount,
  issue: (row) => row.issue,
  due: (row) => row.due,
  owner: (row) => row.owner,
  sla: (row) => row.sla,
}

export default function PriorityExceptionQueue({ rows = [], totalCount, selectedId, onSelect }) {
  const colCount = 8
  const ctl = useColumnSortFilter(rows, COLUMNS)

  return (
    <section className="panel priority-exception-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Priority Exception Queue</h2>
        <TableSearchInput ctl={ctl} />
      </div>
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
              <SortFilterTh columnKey="priority" label="Priority" ctl={ctl} />
              <SortFilterTh columnKey="invoice" label="Invoice" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="amount" label="Amount" ctl={ctl} />
              <SortFilterTh columnKey="issue" label="Issue" ctl={ctl} />
              <SortFilterTh columnKey="due" label="Due" ctl={ctl} />
              <SortFilterTh columnKey="owner" label="Owner" ctl={ctl} />
              <SortFilterTh columnKey="sla" label="SLA" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No exceptions match the selected filters.
                </td>
              </tr>
            ) : (
              ctl.rows.map((row) => (
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
      <button className="btn-link view-all-link">View All Exceptions ({totalCount ?? ctl.rows.length})</button>
    </section>
  )
}
