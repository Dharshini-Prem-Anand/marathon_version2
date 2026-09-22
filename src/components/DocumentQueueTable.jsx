import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronRight, FileText, Mail, Maximize2 } from 'lucide-react'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TableExpandModal from './TableExpandModal'
import { usePagedRows } from '../hooks/usePagedRows'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

// One row per source email, each carrying the documents that arrived as its
// attachments. Row order follows the order documents were given in (the page
// already sorts them by received date, newest first).
function groupByEmail(rows) {
  const groups = []
  const byMessageId = new Map()

  for (const row of rows) {
    const key = row.messageId ?? row.id
    let group = byMessageId.get(key)
    if (!group) {
      group = {
        key,
        messageId: row.messageId,
        senderName: row.senderName,
        senderAddress: row.senderAddress,
        subject: row.subject,
        received: row.received,
        receivedDateTime: row.receivedDateTime,
        attachments: [],
      }
      byMessageId.set(key, group)
      groups.push(group)
    }
    group.attachments.push(row)
  }

  return groups
}

// Search/sort operate on the email group, not the individual attachment — the
// searchable text folds in every attachment's file name so filtering by a
// document still finds the email that carries it.
const GROUP_COLUMNS = {
  email: (g) =>
    [g.senderName, g.senderAddress, g.subject, ...g.attachments.map((a) => a.fileName)].filter(Boolean).join(' '),
  received: (g) => g.receivedDateTime ?? g.received,
  count: (g) => g.attachments.length,
}

function docTypeSummary(attachments) {
  const types = [...new Set(attachments.map((a) => a.category).filter((c) => c && c !== '—'))]
  return types.length ? types.join(', ') : '—'
}

// `compact` drops the Doc Types column — the tile is a quarter of the page
// wide. It reappears in the expanded modal, where there's room to read it.
function QueueTable({
  ctl,
  paging,
  compact,
  selectedId,
  onSelect,
  onOpenEmail,
  loading,
  error,
  expandedIds,
  onToggle,
}) {
  const colCount = compact ? 2 : 3
  const searching = Boolean(ctl.search.trim())
  const shownRowCount = loading || error || paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <div className="table-wrap">
      <table className={`table-fixed tree-table ${compact ? 'queue-table-compact' : 'queue-table-full'}`}>
        <colgroup>
          {compact ? (
            <>
              <col style={{ width: '64%' }} />
              <col style={{ width: '36%' }} />
            </>
          ) : (
            <>
              <col style={{ width: '46%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '34%' }} />
            </>
          )}
        </colgroup>
        <thead>
          <tr>
            <SortFilterTh columnKey="email" label="From Email" ctl={ctl} />
            <SortFilterTh columnKey="received" label="Received Date" ctl={ctl} />
            {!compact && <SortFilterTh columnKey="count" label="Doc Types" ctl={ctl} />}
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
            paging.visibleRows.map((g) => {
              const open = expandedIds.has(g.key) || searching
              const title = [g.senderName, g.senderAddress && `<${g.senderAddress}>`, g.subject]
                .filter(Boolean)
                .join(' ')

              return (
                <Fragment key={g.key}>
                  <tr
                    onClick={() => onToggle(g.key)}
                    className={`triage-row tree-parent-row${open ? ' expanded' : ''}`}
                  >
                    <td className="tree-parent-cell cell-ellipsis" title={title}>
                      <ChevronRight size={13} className={`tree-chevron${open ? ' expanded' : ''}`} />
                      <span className="tree-parent-text cell-ellipsis">
                        <strong>{g.senderName}</strong>
                        <span className="tree-parent-sub"> — {g.subject}</span>
                      </span>
                      <span className="badge badge-gray tree-count-badge">{g.attachments.length}</span>
                      {g.messageId && onOpenEmail && (
                        <button
                          type="button"
                          className="btn-link tree-open-link-btn"
                          title="Open in Email & Attachment Triage"
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenEmail(g.messageId)
                          }}
                        >
                          <Mail size={12} />
                        </button>
                      )}
                    </td>
                    <td className="cell-ellipsis">{g.received}</td>
                    {!compact && (
                      <td className="cell-ellipsis" title={docTypeSummary(g.attachments)}>
                        {docTypeSummary(g.attachments)}
                      </td>
                    )}
                  </tr>
                  {open &&
                    g.attachments.map((a) => (
                      <tr
                        key={a.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect?.(a.id)
                        }}
                        className={`tree-child-row${selectedId === a.id ? ' selected' : ''}`}
                      >
                        <td colSpan={colCount}>
                          <div className="tree-child-line">
                            <FileText size={12} />
                            <span className="cell-ellipsis tree-child-name" title={a.fileName}>
                              {a.fileName}
                            </span>
                            <span className="badge badge-blue tree-child-badge">{a.category}</span>
                            {!compact && <span className="tree-child-meta">{a.format} · {a.size}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              )
            })
          )}
          <TableFillerRows count={paging.pageSize - shownRowCount} colSpan={colCount} />
        </tbody>
      </table>
    </div>
  )
}

// Paging is shared between the tile and the modal, so page changes made in
// one show up in the other.
function QueueFooter({ paging }) {
  return <TablePagination paging={paging} showCollapse={false} />
}

export default function DocumentQueueTable({ rows = [], selectedId, onSelect, loading, error, onOpenEmail, wide }) {
  const groups = groupByEmail(rows)
  const ctl = useColumnSortFilter(groups, GROUP_COLUMNS)
  const paging = usePagedRows(ctl.rows, undefined, { alwaysExpanded: true })
  const [expanded, setExpanded] = useState(false)
  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const tableAnchorRef = useRef(null)

  // Keep the selected document's email open so the highlighted row stays
  // visible instead of being hidden inside a collapsed group.
  useEffect(() => {
    if (!selectedId) return
    const owner = groups.find((g) => g.attachments.some((a) => a.id === selectedId))
    if (!owner) return
    setExpandedIds((prev) => (prev.has(owner.key) ? prev : new Set(prev).add(owner.key)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const toggle = (key) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const tableProps = {
    ctl,
    paging,
    selectedId,
    onSelect,
    onOpenEmail,
    loading,
    error,
    expandedIds,
    onToggle: toggle,
  }

  // When there's room (the format performance chart is hidden), the table
  // shows the Doc Types column inline and the modal-expand affordance is
  // redundant.
  return (
    <section className="panel document-queue">
      <div className="panel-title-row">
        <h2 className="panel-title">Document Extraction Queue</h2>
        <TableSearchInput ctl={ctl} />
        {!wide && (
          <button
            className="icon-btn table-expand-btn"
            onClick={() => setExpanded(true)}
            aria-label="Expand Document Extraction Queue table"
            title="Expand table"
          >
            <Maximize2 size={16} />
          </button>
        )}
      </div>

      <div ref={tableAnchorRef}>
        <QueueTable {...tableProps} compact={!wide} />
      </div>
      <QueueFooter paging={paging} />

      {!wide && expanded && (
        <TableExpandModal
          title="Document Extraction Queue"
          anchorRef={tableAnchorRef}
          onClose={() => setExpanded(false)}
        >
          <QueueTable {...tableProps} />
          <QueueFooter paging={paging} />
        </TableExpandModal>
      )}
    </section>
  )
}
