import { FileText } from 'lucide-react'
import { categoryColor } from '../data'
import TriageStepper from './TriageStepper'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const COLUMNS = {
  fileName: (row) => row.fileName,
  type: (row) => row.type,
  size: (row) => row.size,
  category: (row) => row.category,
  confidence: (row) => row.confidence,
}

export default function EmailPreviewPanel({
  row,
  preview,
  loadingAttachments,
  attachmentsError,
  documentId,
  onNavigateToDocument,
}) {
  const ctl = useColumnSortFilter(preview?.attachments || [], COLUMNS)

  if (!row || !preview) return null

  return (
    <section className="panel email-preview">
      <h2 className="panel-title">Selected Email Preview</h2>

      <div className="preview-meta">
        <div>
          <span className="preview-meta-label">From:</span> {preview.from}
        </div>
        <div>
          <span className="preview-meta-label">To:</span> {preview.to}
        </div>
        <div>
          <span className="preview-meta-label">Subject:</span> {row.subject}
        </div>
        <div>
          <span className="preview-meta-label">Received:</span> {preview.receivedFull}
        </div>
        <div>
          <span className="preview-meta-label">Source:</span> {preview.source}
        </div>
        <div>
          <span className="preview-meta-label">Attachments:</span> {row.attachments}
        </div>
      </div>

      <div className="panel-title-row">
        <h3 className="preview-subheading">Attachments</h3>
        <TableSearchInput ctl={ctl} placeholder="Search attachments..." />
      </div>
      <div className="table-wrap">
        <table className="attachments-table table-fixed">
          <colgroup>
            <col style={{ width: '34%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="fileName" label="File Name" ctl={ctl} />
              <SortFilterTh columnKey="type" label="Type" ctl={ctl} />
              <SortFilterTh columnKey="size" label="Size" ctl={ctl} />
              <SortFilterTh columnKey="category" label="Category" ctl={ctl} />
              <SortFilterTh columnKey="confidence" label="Conf." ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {loadingAttachments ? (
              <tr>
                <td colSpan={5} className="table-empty-cell">
                  Loading attachments…
                </td>
              </tr>
            ) : attachmentsError ? (
              <tr>
                <td colSpan={5} className="table-empty-cell">
                  {attachmentsError}
                </td>
              </tr>
            ) : ctl.rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty-cell">
                  No attachments on this email.
                </td>
              </tr>
            ) : (
              ctl.rows.map((a, i) => (
                <tr key={`${a.fileName}-${i}`}>
                  <td className="attachment-file cell-ellipsis" title={a.fileName}>
                    <FileText size={13} />
                    <span className="cell-ellipsis">{a.fileName}</span>
                  </td>
                  <td>{a.type}</td>
                  <td>{a.size}</td>
                  <td>
                    <span className={`badge badge-${categoryColor[a.category] ?? 'gray'}`}>{a.category}</span>
                  </td>
                  <td>{a.confidence}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="proposed-classification">
        <div className="proposed-classification-title">Proposed Classification</div>
        <div className="proposed-classification-body">
          <FileText size={18} />
          <div>
            <div className="proposed-classification-category">{preview.proposedCategory}</div>
            <div className="proposed-classification-confidence">Confidence: {preview.proposedConfidence}</div>
          </div>
        </div>
      </div>

      <h3 className="preview-subheading">Processing Pipeline</h3>
      <TriageStepper
        row={row}
        documentId={documentId}
        onNavigateToDocument={onNavigateToDocument}
      />
    </section>
  )
}
