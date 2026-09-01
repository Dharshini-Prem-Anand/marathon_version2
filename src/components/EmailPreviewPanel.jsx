import { FileText } from 'lucide-react'
import { triageQueue, categoryColor } from '../data'
import TriageStepper from './TriageStepper'

function buildPreview(row) {
  if (row.preview) return row.preview

  const slug = row.subject.replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return {
    from: row.vendor === '—' ? 'Unknown Sender' : `${row.vendor} <info@${row.vendor.split(' ')[0].toLowerCase()}.com>`,
    to: 'apinvoices@marathon.com',
    receivedFull: `May 18, 2025 ${row.time}`,
    source: row.source,
    attachments: Array.from({ length: row.attachments }).map((_, i) => ({
      fileName: `${slug}${i > 0 ? `_${i + 1}` : ''}.pdf`,
      type: 'PDF',
      size: '204 KB',
      category: row.category,
      confidence: row.confidence,
    })),
    proposedCategory: row.category,
    proposedConfidence: row.confidence,
  }
}

export default function EmailPreviewPanel({ selectedId }) {
  const row = triageQueue.find((r) => r.id === selectedId) ?? triageQueue[0]
  const preview = buildPreview(row)

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
            {preview.attachments.map((a) => (
              <tr key={a.fileName}>
                <td className="attachment-file cell-ellipsis" title={a.fileName}>
                  <FileText size={13} />
                  <span className="cell-ellipsis">{a.fileName}</span>
                </td>
                <td>{a.type}</td>
                <td>{a.size}</td>
                <td>
                  <span className={`badge badge-${categoryColor[a.category]}`}>{a.category}</span>
                </td>
                <td>{a.confidence}</td>
              </tr>
            ))}
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
      <TriageStepper row={row} preview={preview} />
    </section>
  )
}
