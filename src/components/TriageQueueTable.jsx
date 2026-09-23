import { MoreVertical } from 'lucide-react'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { usePagedRows } from '../hooks/usePagedRows'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

function rowDate(row) {
  return row.receivedDate instanceof Date ? row.receivedDate : new Date(row.receivedDateTime)
}

function formatDate(row) {
  const d = rowDate(row)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const COLUMNS = {
  date: (row) => rowDate(row),
  time: (row) => row.time,
  source: (row) => row.source,
  vendor: (row) => row.vendor,
  subject: (row) => row.subject,
  attachments: (row) => row.attachments,
  documents: (row) => row.documentCount,
}

export default function TriageQueueTable({ rows, selectedId, onSelect, loading, error }) {
  const colCount = 8
  const ctl = useColumnSortFilter(rows, COLUMNS, { key: 'date', dir: 'desc' })
  const paging = usePagedRows(ctl.rows, undefined, { alwaysExpanded: true })
  const shownRowCount = loading || error || paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <section className="panel triage-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Triage Queue</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '11%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="date" label="Date" ctl={ctl} />
              <SortFilterTh columnKey="time" label="Time" ctl={ctl} />
              <SortFilterTh columnKey="source" label="Source" ctl={ctl} />
              <SortFilterTh columnKey="vendor" label="Sender" ctl={ctl} />
              <SortFilterTh columnKey="subject" label="Subject" ctl={ctl} />
              <SortFilterTh columnKey="attachments" label="Attach." ctl={ctl} />
              <SortFilterTh columnKey="documents" label="Docs" ctl={ctl} />
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
                  <td>{row.documentCount}</td>
                  <td>
                    <button className="icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Row actions">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            <TableFillerRows count={paging.pageSize - shownRowCount} colSpan={colCount} />
          </tbody>
        </table>
      </div>

      <TablePagination paging={paging} showCollapse={false} />
    </section>
  )
}

