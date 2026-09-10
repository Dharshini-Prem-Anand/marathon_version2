// Maps the OData EmailMetadata / EmailAttachments payloads onto the shapes the
// triage components already consume.

function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${formatTime(iso)}`
}

function formatSize(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatConfidence(score) {
  const n = Number(score)
  if (!Number.isFinite(n)) return '—'
  return `${Math.round(n)}%`
}

function fileType(contentType, fileName) {
  if (contentType?.includes('pdf')) return 'PDF'
  const ext = fileName?.split('.').pop()
  return ext ? ext.toUpperCase() : '—'
}

export function mapEmailMetadata(record) {
  return {
    id: record.MessageID,
    messageId: record.MessageID,
    time: formatTime(record.ReceivedDateTime),
    receivedDateTime: record.ReceivedDateTime,
    source: record.Source || 'Email',
    vendor: record.SenderName || record.SenderAddress || '—',
    senderAddress: record.SenderAddress,
    subject: record.Subject || '(no subject)',
    attachments: record.AttachmentCount ?? 0,
    priority: record.Priority || null,
    status: record.Status || null,
    isRemote: true,
  }
}

export function mapEmailAttachment(record) {
  return {
    fileName: record.FileName,
    type: fileType(record.ContentType, record.FileName),
    size: formatSize(record.FileSizeBytes),
    category: record.ProposedCategory || '—',
    confidence: formatConfidence(record.ConfidenceScore),
    classificationReason: record.ClassificationReason || null,
    classificationStatus: record.ClassificationStatus || null,
  }
}

// EmailMetadata carries no recipient, so the preview shows the mailbox the
// email agent polls — every row in the queue was fetched from it. Change this
// if the agent is pointed at a different inbox (or drop it once the service
// returns the actual To address).
const POLLED_MAILBOX = 'alerts@sierradigitalinc.com'

// The preview panel needs a header block plus the attachment rows.
export function buildRemotePreview(row, attachments) {
  const primary = attachments[0]
  return {
    from: row.senderAddress ? `${row.vendor} <${row.senderAddress}>` : row.vendor,
    to: POLLED_MAILBOX,
    receivedFull: formatDateTime(row.receivedDateTime),
    source: row.source,
    attachments,
    proposedCategory: primary?.category ?? '—',
    proposedConfidence: primary?.confidence ?? '—',
  }
}
