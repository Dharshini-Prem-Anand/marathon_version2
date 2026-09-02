import { FileText } from 'lucide-react'
import TablePagination from './TablePagination'
import { usePagedRows } from '../hooks/usePagedRows'

const statusColor = {
  Passed: 'green',
  Review: 'orange',
  Failed: 'red',
}

export default function PreValidationQueueTable({ rows = [], selectedId, onSelect }) {
  const colCount = 4
  const paging = usePagedRows(rows)

  return (
    <section className="panel document-queue">
      <h2 className="panel-title">Document Pre Validation Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '32%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paging.visibleRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            ) : (
              paging.visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect?.(row.id)}
                  className={`triage-row${selectedId === row.id ? ' selected' : ''}`}
                >
                  <td className="attachment-file cell-ellipsis" title={row.invoiceNumber}>
                    <FileText size={13} />
                    <span className="cell-ellipsis">{row.invoiceNumber}</span>
                  </td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={`badge badge-${statusColor[row.status] ?? 'gray'}`}>{row.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paging.showViewAll && (
        <button className="btn-link view-all-link" onClick={paging.expand}>
          View All ({paging.total})
        </button>
      )}
      {paging.expanded && <TablePagination paging={paging} />}
    </section>
  )
}
