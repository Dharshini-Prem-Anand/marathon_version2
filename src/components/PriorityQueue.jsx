import { useState, useRef } from 'react'
import { Maximize2 } from 'lucide-react'
import { priorityColor } from '../data'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import TableExpandModal from './TableExpandModal'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'
import { usePagedRows } from '../hooks/usePagedRows'

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

const COLUMNS = {
  priority: (row) => PRIORITY_RANK[row.priority] ?? 1,
  invoice: (row) => row.invoice,
  vendor: (row) => row.vendor,
  amount: (row) => row.amount,
  issue: (row) => row.issue,
  due: (row) => row.due,
  sla: (row) => row.sla,
}

// Amount and SLA only show in the expanded modal; the panel keeps the
// columns that fit its width.
const COMPACT_COL_COUNT = 5
const EXPANDED_COL_COUNT = 7

// One flat row per exception — an invoice with several flagged exceptions
// shows several rows, each carrying its own amount/issue/SLA. No grouping
// or expand/collapse; every exception is visible directly in the table.
function QueueTable({ ctl, paging, expanded, selectedId, onSelect, emptyMessage }) {
  const colCount = expanded ? EXPANDED_COL_COUNT : COMPACT_COL_COUNT
  const shownRowCount = paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <div className="table-wrap">
      <table className={expanded ? 'exception-table-full' : 'queue-table-scroll'}>
        <thead>
          <tr>
            <SortFilterTh columnKey="priority" label="Priority" ctl={ctl} />
            <SortFilterTh columnKey="invoice" label="Invoice" ctl={ctl} />
            <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
            {expanded && <SortFilterTh columnKey="amount" label="Amount" ctl={ctl} />}
            <SortFilterTh columnKey="issue" label="Issue" ctl={ctl} />
            <SortFilterTh columnKey="due" label="Due" ctl={ctl} />
            {expanded && <SortFilterTh columnKey="sla" label="SLA" ctl={ctl} />}
          </tr>
        </thead>
        <tbody>
          {paging.visibleRows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="table-empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paging.visibleRows.map((row) => (
              <tr
                key={row.id ?? row.invoice}
                onClick={() => onSelect?.(row.invoice)}
                className={`triage-row${selectedId === row.invoice ? ' selected' : ''}`}
              >
                <td>
                  <span className={`priority-dot color-${priorityColor[row.priority]}`} />
                  {row.priority}
                </td>
                <td className="cell-mono">{row.invoice}</td>
                <td>{row.vendor}</td>
                {expanded && <td>{row.amount}</td>}
                <td title={row.issue}>{row.issue}</td>
                <td className={row.dueColor ? `color-${row.dueColor}` : undefined}>{row.due}</td>
                {expanded && (
                  <td>
                    <span className={`priority-dot color-${row.slaColor}`} />
                    <span className={`color-${row.slaColor}`}>{row.sla}</span>
                  </td>
                )}
              </tr>
            ))
          )}
          <TableFillerRows count={paging.pageSize - shownRowCount} colSpan={colCount} />
        </tbody>
      </table>
    </div>
  )
}

// Paging is shared between the panel and the modal, so page changes made in
// one show up in the other.
function QueueFooter({ paging }) {
  return <TablePagination paging={paging} showCollapse={false} />
}

const PAGE_SIZE = 10

export default function PriorityQueue({ rows = [], loading, title = 'Priority Action Queue', selectedId, onSelect }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)
  const paging = usePagedRows(ctl.rows, PAGE_SIZE, { alwaysExpanded: true })
  const [expanded, setExpanded] = useState(false)
  const tableAnchorRef = useRef(null)

  const emptyMessage = loading ? 'Loading exceptions…' : 'No exceptions match the selected filters.'
  const tableProps = { ctl, paging, selectedId, onSelect, emptyMessage }

  return (
    <section className="panel priority-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">{title}</h2>
        <TableSearchInput ctl={ctl} />
        <button
          className="icon-btn table-expand-btn"
          onClick={() => setExpanded(true)}
          aria-label={`Expand ${title} table`}
          title="Expand table"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div ref={tableAnchorRef}>
        <QueueTable {...tableProps} />
      </div>
      <QueueFooter paging={paging} />

      {expanded && (
        <TableExpandModal title={title} anchorRef={tableAnchorRef} centered onClose={() => setExpanded(false)}>
          <QueueTable {...tableProps} expanded />
          <QueueFooter paging={paging} />
        </TableExpandModal>
      )}
    </section>
  )
}
