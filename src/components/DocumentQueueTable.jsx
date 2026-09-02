import { FileText } from 'lucide-react'
import TablePagination from './TablePagination'
import { usePagedRows } from '../hooks/usePagedRows'

export default function DocumentQueueTable({ rows = [], selectedId, onSelect, loading, error }) {
  const colCount = 4
  const paging = usePagedRows(rows)

  return (
    <section className="panel document-queue">
      <h2 className="panel-title">Document Extraction Queue</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '44%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Document</th>
              <th>Date</th>
              <th>Format</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Loading documents…
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
                  No documents match the selected filters.
                </td>
              </tr>
            ) : (
              paging.visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect?.(row.id)}
                  className={`triage-row${selectedId === row.id ? ' selected' : ''}`}
                >
                  <td className="attachment-file cell-ellipsis" title={row.fileName}>
                    <FileText size={13} />
                    <span className="cell-ellipsis">{row.fileName}</span>
                  </td>
                  <td className="cell-ellipsis">{row.received}</td>
                  <td>{row.format}</td>
                  <td>{row.size}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paging.showViewAll && (
        <button className="btn-link view-all-link" onClick={paging.expand}>
          View All Documents ({paging.total})
        </button>
      )}
      {paging.expanded && <TablePagination paging={paging} />}
    </section>
  )
}

