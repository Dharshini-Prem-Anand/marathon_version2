import { ListOrdered } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  score: (row) => row.score,
  invoice: (row) => row.invoice,
  vendor: (row) => row.vendor,
  amount: (row) => row.amount,
  due: (row) => row.due,
  exception: (row) => row.exception,
  owner: (row) => row.owner,
  sla: (row) => row.sla,
  recommendation: (row) => row.recommendation,
}

export default function PriorityWorkQueue({ rows }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)
  return (
    <section className="panel priority-work-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">
          <ListOrdered size={16} className="panel-title-icon" />
          Priority Work Queue
        </h2>
        <div className="panel-title-actions">
          <button className="btn-primary btn-sm">Apply Reassignment</button>
          <button className="btn-outline btn-sm">Bulk Assign</button>
          <button className="btn-outline btn-sm">Balance Workload</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '24%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="score" label="Score" ctl={ctl} />
              <SortFilterTh columnKey="invoice" label="Invoice" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="amount" label="Amt" ctl={ctl} />
              <SortFilterTh columnKey="due" label="Due" ctl={ctl} />
              <SortFilterTh columnKey="exception" label="Exception" ctl={ctl} />
              <SortFilterTh columnKey="owner" label="Owner" ctl={ctl} />
              <SortFilterTh columnKey="sla" label="SLA" ctl={ctl} />
              <SortFilterTh columnKey="recommendation" label="Recommendation" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 && (
              <tr>
                <td colSpan={9} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            )}
            {ctl.rows.map((row) => (
              <tr key={row.invoice}>
                <td>
                  <span className={`priority-score-badge priority-score-${row.scoreColor}`}>
                    {row.score} {row.scoreLabel}
                  </span>
                </td>
                <td className="cell-mono color-blue cell-ellipsis">{row.invoice}</td>
                <td className="cell-ellipsis" title={row.vendor}>
                  {row.vendor}
                </td>
                <td>{row.amount}</td>
                <td className={row.dueColor ? `color-${row.dueColor}` : undefined}>{row.due}</td>
                <td className="cell-ellipsis" title={row.exception}>
                  {row.exception}
                </td>
                <td className="cell-ellipsis">{row.owner}</td>
                <td>{row.sla}</td>
                <td className="cell-ellipsis" title={row.recommendation}>
                  {row.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
