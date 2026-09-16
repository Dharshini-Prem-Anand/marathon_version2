import { useRef, useState } from 'react'
import { FileText, Mail, Maximize2 } from 'lucide-react'
import TablePagination from './TablePagination'
import TableFillerRows from './TableFillerRows'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TableExpandModal from './TableExpandModal'
import { usePagedRows } from '../hooks/usePagedRows'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  fileName: (row) => row.fileName,
  received: (row) => row.received,
  sourceEmail: (row) => row.subject,
  category: (row) => row.category,
  format: (row) => row.format,
  size: (row) => row.size,
}

// The email a document arrived on. The row carries the MessageID the triage
// queue is keyed by, so it opens straight in Email & Attachment Triage.
function SourceEmailCell({ row, onOpenEmail }) {
  const title = [row.senderName, row.senderAddress && `<${row.senderAddress}>`, row.subject]
    .filter(Boolean)
    .join(' ')

  if (!row.messageId || !onOpenEmail) {
    return (
      <td className="cell-ellipsis" title={title}>
        {row.subject || '—'}
      </td>
    )
  }

  return (
    <td className="cell-ellipsis">
      <button
        type="button"
        className="btn-link source-email-link"
        title={`${title} — open in Email & Attachment Triage`}
        onClick={(e) => {
          e.stopPropagation()
          onOpenEmail(row.messageId)
        }}
      >
        <Mail size={12} />
        <span className="cell-ellipsis">{row.subject || '(no subject)'}</span>
      </button>
    </td>
  )
}

// `compact` shows just Document, Received Date and Doc Type — the tile is a
// quarter of the page wide. Source Email, Format and Size only appear in the
// expanded modal, where there's room to read them.
function QueueTable({ ctl, paging, compact, selectedId, onSelect, onOpenEmail, loading, error }) {
  const colCount = compact ? 3 : 6
  const shownRowCount = loading || error || paging.visibleRows.length === 0 ? 1 : paging.visibleRows.length

  return (
    <div className="table-wrap">
      <table className={`table-fixed ${compact ? 'queue-table-compact' : 'queue-table-full'}`}>
        <colgroup>
          {compact ? (
            <>
              <col style={{ width: '46%' }} />
              <col style={{ width: '31%' }} />
              <col style={{ width: '23%' }} />
            </>
          ) : (
            <>
              <col style={{ width: '26%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
            </>
          )}
        </colgroup>
        <thead>
          <tr>
            <SortFilterTh columnKey="fileName" label="Document" ctl={ctl} />
            <SortFilterTh columnKey="received" label="Received Date" ctl={ctl} />
            {!compact && <SortFilterTh columnKey="sourceEmail" label="Source Email" ctl={ctl} />}
            <SortFilterTh columnKey="category" label="Doc Type" ctl={ctl} />
            {!compact && <SortFilterTh columnKey="format" label="Format" ctl={ctl} />}
            {!compact && <SortFilterTh columnKey="size" label="Size" ctl={ctl} />}
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
                {!compact && <SourceEmailCell row={row} onOpenEmail={onOpenEmail} />}
                <td className="cell-ellipsis" title={row.category}>
                  {row.category}
                </td>
                {!compact && <td>{row.format}</td>}
                {!compact && <td>{row.size}</td>}
              </tr>
            ))
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
  const ctl = useColumnSortFilter(rows, COLUMNS)
  const paging = usePagedRows(ctl.rows, undefined, { alwaysExpanded: true })
  const [expanded, setExpanded] = useState(false)
  const tableAnchorRef = useRef(null)

  const tableProps = { ctl, paging, selectedId, onSelect, onOpenEmail, loading, error }

  // When there's room (the format performance chart is hidden), the table
  // shows all six columns inline and the modal-expand affordance is redundant.
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
