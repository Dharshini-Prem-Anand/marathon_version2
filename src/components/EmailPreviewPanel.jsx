import { FileText } from 'lucide-react'
import { categoryColor } from '../data'
import TriageStepper from './TriageStepper'

export default function EmailPreviewPanel({
  row,
  preview,
  loadingAttachments,
  attachmentsError,
  documentId,
  onNavigateToDocument,
}) {
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

      <h3 className="preview-subheading">Attachments</h3>
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
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Category</th>
              <th>Conf.</th>
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
            ) : preview.attachments.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty-cell">
                  No attachments on this email.
                </td>
              </tr>
            ) : (
              preview.attachments.map((a, i) => (
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
