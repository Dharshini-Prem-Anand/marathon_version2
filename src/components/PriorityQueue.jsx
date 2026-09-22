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
  owner: (row) => row.owner,
  sla: (row) => row.sla,
}

const COL_COUNT = 8

// One flat row per exception — an invoice with several flagged exceptions
// shows several rows, each carrying its own amount/issue/SLA. No grouping
// or expand/collapse; every exception is visible directly in the table.
function QueueTable({ ctl, paging, expanded, selectedId, onSelect, emptyMessage }) {
  const clip = expanded ? '' : ' cell-ellipsis'
  const shownRowCount = paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <div className="table-wrap">
      <table className={expanded ? 'exception-table-full' : 'table-fixed'}>
        {!expanded && (
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
        )}
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
          {paging.visibleRows.length === 0 ? (
            <tr>
              <td colSpan={COL_COUNT} className="table-empty-cell">
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
                <td className={`cell-mono${clip}`}>{row.invoice}</td>
                <td className={clip.trim() || undefined} title={row.vendor}>
                  {row.vendor}
                </td>
                <td>{row.amount}</td>
                <td className={clip.trim() || undefined} title={row.issue}>
                  {row.issue}
                </td>
                <td className={row.dueColor ? `color-${row.dueColor}` : undefined}>{row.due}</td>
                <td className={clip.trim() || undefined}>{row.owner}</td>
                <td>
                  <span className={`priority-dot color-${row.slaColor}`} />
                  <span className={`color-${row.slaColor}`}>{row.sla}</span>
                </td>
              </tr>
            ))
          )}
          <TableFillerRows count={paging.pageSize - shownRowCount} colSpan={COL_COUNT} />
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
        <TableExpandModal title={title} anchorRef={tableAnchorRef} onClose={() => setExpanded(false)}>
          <QueueTable {...tableProps} expanded />
          <QueueFooter paging={paging} />
        </TableExpandModal>
      )}
    </section>
  )
}
