import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { priorityQueue } from '../data'

const priorityColor = {
  High: 'red',
  Medium: 'orange',
  Low: 'blue',
}

const PAGE_SIZE = 5

export default function PriorityQueue({ rows = priorityQueue }) {
  const [page, setPage] = useState(1)
  const rowsKey = rows.map((r) => r.invoice).join('|')

  useEffect(() => {
    setPage(1)
  }, [rowsKey])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  return (
    <section className="panel priority-queue">
      <h2 className="panel-title">Priority Action Queue</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>Invoice</th>
              <th>Vendor</th>
              <th>Issue</th>
              <th>Due</th>
              <th>Owner</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-cell">
                  No invoices match the selected filters.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.invoice}>
                  <td>
                    <span className={`priority-dot color-${priorityColor[row.priority]}`} />
                    {row.priority}
                  </td>
                  <td className="cell-mono">{row.invoice}</td>
                  <td>{row.vendor}</td>
                  <td>{row.issue}</td>
                  <td>{row.due}</td>
                  <td>{row.owner}</td>
                  <td className="cell-action">{row.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="table-pagination">
          <span>
            Showing {start + 1} to {Math.min(start + PAGE_SIZE, rows.length)} of {rows.length} entries
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
              aria-label="First page"
            >
              <ChevronLeft size={14} />
              <ChevronLeft size={14} className="pagination-btn-second" />
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`pagination-page${n === currentPage ? ' active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage === pageCount}
              onClick={() => setPage(pageCount)}
              aria-label="Last page"
            >
              <ChevronRight size={14} />
              <ChevronRight size={14} className="pagination-btn-second" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
