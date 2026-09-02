import { MoreVertical } from 'lucide-react'
import TablePagination from './TablePagination'
import { usePagedRows } from '../hooks/usePagedRows'

export default function TriageQueueTable({ rows, selectedId, onSelect, loading, error }) {
  const colCount = 6
  const paging = usePagedRows(rows)

  return (
    <section className="panel triage-queue">
      <h2 className="panel-title">Triage Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
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

