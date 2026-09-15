import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const priorityColor = {
  High: 'red',
  Medium: 'orange',
  Low: 'blue',
}

const PAGE_SIZE = 5

const COLUMNS = {
  priority: (row) => row.priority,
  invoice: (row) => row.invoice,
  vendor: (row) => row.vendor,
  issue: (row) => row.issue,
  due: (row) => row.due,
  owner: (row) => row.owner,
  action: (row) => row.action,
}

export default function PriorityQueue({ rows = [], loading }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)
  const [page, setPage] = useState(1)
  const rowsKey = ctl.rows.map((r) => r.invoice).join('|')

  useEffect(() => {
    setPage(1)
  }, [rowsKey])

  const pageCount = Math.max(1, Math.ceil(ctl.rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = ctl.rows.slice(start, start + PAGE_SIZE)

  return (
    <section className="panel priority-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Priority Action Queue</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        {/* Fixed columns: live issue text and recommendations are sentences,
            and an auto-layout table lets one of them squeeze the rest of the
            row into nothing. Each cell keeps its full text in a tooltip. */}
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '9%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="priority" label="Priority" ctl={ctl} />
              <SortFilterTh columnKey="invoice" label="Invoice" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="issue" label="Issue" ctl={ctl} />
              <SortFilterTh columnKey="due" label="Due" ctl={ctl} />
              <SortFilterTh columnKey="owner" label="Owner" ctl={ctl} />
              <SortFilterTh columnKey="action" label="Recommended Action" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {loading || ctl.rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-cell">
                  {loading ? 'Loading exceptions…' : 'No exceptions match the selected filters.'}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id ?? row.invoice}>
                  <td>
                    <span className={`priority-dot color-${priorityColor[row.priority]}`} />
                    {row.priority}
                  </td>
                  <td className="cell-mono">{row.invoice}</td>
                  <td className="cell-ellipsis" title={row.vendor}>
                    {row.vendor}
                  </td>
                  <td className="cell-ellipsis" title={row.issue}>
                    {row.issue}
                  </td>
                  <td>{row.due}</td>
                  <td>{row.owner}</td>
                  <td className="cell-action cell-ellipsis" title={row.action}>
                    {row.action}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && ctl.rows.length > 0 && (
        <div className="table-pagination">
          <span>
            Showing {start + 1} to {Math.min(start + PAGE_SIZE, ctl.rows.length)} of {ctl.rows.length} entries
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
