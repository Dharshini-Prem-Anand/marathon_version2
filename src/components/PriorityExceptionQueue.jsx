import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronRight, Maximize2 } from 'lucide-react'
import { priorityColor } from '../data'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import TableExpandModal from './TableExpandModal'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'
import { usePagedRows } from '../hooks/usePagedRows'

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

// One row per invoice, each carrying the distinct exceptions raised against
// it — an invoice can be flagged for more than one reason (see
// utils/exceptionsMappers.js). Row order follows the order exceptions were
// given in (already sorted worst-priority-first).
function groupByInvoice(rows) {
  const groups = []
  const byInvoice = new Map()

  for (const row of rows) {
    let group = byInvoice.get(row.invoice)
    if (!group) {
      group = { key: row.invoice, invoice: row.invoice, vendor: row.vendor, exceptions: [] }
      byInvoice.set(row.invoice, group)
      groups.push(group)
    }
    group.exceptions.push(row)
  }

  for (const group of groups) {
    // Rows arrive pre-sorted worst-first, but that sort runs over every
    // exception across every invoice, not within this one invoice's rows —
    // re-rank here so the group's own summary reflects its worst exception.
    const worst = [...group.exceptions].sort((a, b) => {
      const rankA = PRIORITY_RANK[a.priority] ?? 1
      const rankB = PRIORITY_RANK[b.priority] ?? 1
      if (rankA !== rankB) return rankA - rankB
      return new Date(a.dueDate ?? 0) - new Date(b.dueDate ?? 0)
    })[0]
    group.priority = worst.priority
    group.dueColor = worst.dueColor
    group.amount = worst.amount
    group.due = worst.due
    group.sla = worst.sla
    group.slaColor = worst.slaColor
    group.owner = group.exceptions.every((e) => e.owner === worst.owner) ? worst.owner : 'Multiple'
    group.issues = [...new Set(group.exceptions.map((e) => e.issue))].join(', ')
  }

  return groups
}

const GROUP_COLUMNS = {
  priority: (g) => PRIORITY_RANK[g.priority] ?? 1,
  invoice: (g) => g.invoice,
  vendor: (g) => g.vendor,
  amount: (g) => g.amount,
  issue: (g) => g.issues,
  due: (g) => g.due,
  owner: (g) => g.owner,
  sla: (g) => g.sla,
}

const COL_COUNT = 8

// In the panel every value is ellipsized to one line, because the tile shares
// its row with the AI Review panel. Zoomed, nothing is cut: the long columns
// wrap onto as many lines as they need and the table keeps its full width,
// scrolling sideways inside the modal.
function ExceptionTable({ ctl, paging, expanded, selectedId, onSelect, expandedIds, onToggle }) {
  const clip = expanded ? '' : ' cell-ellipsis'
  const searching = Boolean(ctl.search.trim())
  const shownRowCount = paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <div className="table-wrap">
      <table className={`tree-table ${expanded ? 'exception-table-full' : 'table-fixed'}`}>
        {!expanded && (
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
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
                No exceptions match the selected filters.
              </td>
            </tr>
          ) : (
            paging.visibleRows.map((g) => {
              const open = expandedIds.has(g.key) || searching

              return (
                <Fragment key={g.key}>
                  <tr onClick={() => onToggle(g.key)} className={`triage-row tree-parent-row${open ? ' expanded' : ''}`}>
                    <td>
                      <span className={`priority-dot color-${priorityColor[g.priority]}`} />
                      {g.priority}
                    </td>
                    <td className={`cell-mono${clip}`}>
                      <span className="tree-parent-cell">
                        <ChevronRight size={13} className={`tree-chevron${open ? ' expanded' : ''}`} />
                        {g.invoice}
                        <span className="badge badge-gray tree-count-badge">{g.exceptions.length}</span>
                      </span>
                    </td>
                    <td className={clip.trim() || undefined} title={g.vendor}>
                      {g.vendor}
                    </td>
                    <td>{g.amount}</td>
                    <td className={clip.trim() || undefined} title={g.issues}>
                      {g.issues}
                    </td>
                    <td className={g.dueColor ? `color-${g.dueColor}` : undefined}>{g.due}</td>
                    <td className={clip.trim() || undefined}>{g.owner}</td>
                    <td>
                      <span className={`priority-dot color-${g.slaColor}`} />
                      <span className={`color-${g.slaColor}`}>{g.sla}</span>
                    </td>
                  </tr>
                  {open &&
                    g.exceptions.map((e) => (
                      <tr
                        key={e.id}
                        onClick={(ev) => {
                          ev.stopPropagation()
                          onSelect?.(e.invoice)
                        }}
                        className={`tree-child-row${selectedId === e.invoice ? ' selected' : ''}`}
                      >
                        <td colSpan={COL_COUNT}>
                          <div className="tree-child-line">
                            <span className={`priority-dot color-${priorityColor[e.priority]}`} />
                            <span
                              className={`cell-ellipsis tree-child-name${e.issueColor ? ` color-${e.issueColor}` : ''}`}
                              title={e.issue}
                            >
                              {e.issue}
                            </span>
                            <span className={`tree-child-meta${e.dueColor ? ` color-${e.dueColor}` : ''}`}>Due {e.due}</span>
                            <span className="tree-child-meta">{e.owner}</span>
                            <span className={`badge badge-${e.slaColor} tree-child-badge`}>{e.sla}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              )
            })
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

// A page's worth of rows, rather than every exception: the queue sits beside
// the AI Review panel and a hundred rows stretched the whole page. Ten fills
// roughly the height of that panel; the rest are a page away.
const PAGE_SIZE = 10

export default function PriorityExceptionQueue({ rows = [], selectedId, onSelect }) {
  const groups = groupByInvoice(rows)
  const ctl = useColumnSortFilter(groups, GROUP_COLUMNS)
  const paging = usePagedRows(ctl.rows, PAGE_SIZE, { alwaysExpanded: true })
  const [expanded, setExpanded] = useState(false)
  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const tableAnchorRef = useRef(null)

  // Keep the selected invoice's group open so the highlighted row stays
  // visible instead of being hidden inside a collapsed group.
  useEffect(() => {
    if (!selectedId) return
    if (!groups.some((g) => g.key === selectedId)) return
    setExpandedIds((prev) => (prev.has(selectedId) ? prev : new Set(prev).add(selectedId)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const toggle = (key) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const tableProps = { ctl, paging, selectedId, onSelect, expandedIds, onToggle: toggle }

  return (
    <section className="panel priority-exception-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Priority Exception Queue</h2>
        <TableSearchInput ctl={ctl} />
        <button
          className="icon-btn table-expand-btn"
          onClick={() => setExpanded(true)}
          aria-label="Expand Priority Exception Queue table"
          title="Expand table"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div ref={tableAnchorRef}>
        <ExceptionTable {...tableProps} />
      </div>
      <QueueFooter paging={paging} />

      {expanded && (
        <TableExpandModal
          title="Priority Exception Queue"
          anchorRef={tableAnchorRef}
          onClose={() => setExpanded(false)}
        >
          <ExceptionTable {...tableProps} expanded />
          <QueueFooter paging={paging} />
        </TableExpandModal>
      )}
    </section>
  )
}
