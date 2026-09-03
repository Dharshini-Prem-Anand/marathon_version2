import { useMemo } from 'react'
import { MoreVertical } from 'lucide-react'
import TablePagination from './TablePagination'
import { usePagedRows } from '../hooks/usePagedRows'

function rowDate(row) {
  return row.receivedDate instanceof Date ? row.receivedDate : new Date(row.receivedDateTime)
}

function formatDate(row) {
  const d = rowDate(row)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TriageQueueTable({ rows, selectedId, onSelect, loading, error }) {
  const colCount = 7
  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => rowDate(b).getTime() - rowDate(a).getTime()),
    [rows]
  )
  const paging = usePagedRows(sortedRows)

  return (
    <section className="panel triage-queue">
      <h2 className="panel-title">Triage Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '11%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Source</th>
              <th>Sender / Vendor</th>
              <th>Subject</th>
              <th>Attach.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Loading emails…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  {error}
                </td>
              </tr>
            ) : paging.visibleRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No emails match the selected filters.
                </td>
              </tr>
            ) : (
              paging.visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row.id)}
                  className={`triage-row${selectedId === row.id ? ' selected' : ''}${
                    row.category === 'Duplicate' && selectedId !== row.id ? ' flagged' : ''
                  }`}
                >
                  <td>{formatDate(row)}</td>
                  <td>{row.time}</td>
                  <td className="cell-ellipsis">{row.source}</td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td className="cell-ellipsis" title={row.subject}>
                    {row.subject}
                  </td>
                  <td>{row.attachments}</td>
                  <td>
                    <button className="icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Row actions">
                      <MoreVertical size={16} />
                    </button>
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

