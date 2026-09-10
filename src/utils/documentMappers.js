// Maps the Document AI OData payloads (EmailAttachments $expand=email,
// ExtractedHeaderFields, ExtractedLineItemFields) onto view models.

export function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatConfidence(score) {
  const n = Number(score)
  if (!Number.isFinite(n)) return '—'
  return `${Math.round(n)}%`
}

export function formatReceived(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit' }
  )}`
}

const FORMAT_BY_CONTENT_TYPE = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'text/csv': 'CSV',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/tiff': 'TIFF',
}

export function fileFormat(contentType, fileName) {
  const mapped = FORMAT_BY_CONTENT_TYPE[contentType]
  if (mapped) return mapped
  const ext = fileName?.includes('.') ? fileName.split('.').pop() : null
  return ext ? ext.toUpperCase() : '—'
}

// FieldName values come straight from the DIE schema, so the label has to be
// derived from the name rather than looked up in a table — a field added to
// the schema has to render readably without a frontend change.
//
// Words are split on a lower-to-upper boundary only, and each word gets its
// first letter capitalised without the rest being touched, so a run of
// capitals survives intact:
//   vendorName     -> Vendor Name
//   PurchaseOrder  -> Purchase Order
//   vendorNNsa     -> Vendor NNsa   (not "Vendor N Nsa")
export function fieldLabel(fieldName) {
  if (!fieldName) return '—'
  const words = String(fieldName)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  return words.length ? words.join(' ') : '—'
}

export function mapDocumentRow(record) {
  const email = record.email ?? {}
  return {
    id: `${record.MessageID}::${record.FileName}`,
    messageId: record.MessageID,
    fileName: record.FileName,
    dieDocumentId: record.DieDocumentID ?? null,
    contentType: record.ContentType,
    format: fileFormat(record.ContentType, record.FileName),
    size: formatBytes(record.FileSizeBytes),
    category: record.ProposedCategory || '—',
    confidence: formatConfidence(record.ConfidenceScore),
    confidenceValue: Number(record.ConfidenceScore),
    classificationReason: record.ClassificationReason || null,
    classificationStatus: record.ClassificationStatus || null,
    objectStoreKey: record.ObjectStoreKey || null,
    vendor: email.SenderName || email.SenderAddress || '—',
    senderAddress: email.SenderAddress || null,
    subject: email.Subject || '(no subject)',
    received: formatReceived(email.ReceivedDateTime),
    receivedDateTime: email.ReceivedDateTime ?? null,
    channel: email.Source || 'Email',
    status: email.Status || null,
    isRemote: true,
  }
}

// Header fields render one row per array element — FIELD | VALUE | CONFIDENCE.
export function mapHeaderField(record) {
  return {
    key: record.FieldName,
    field: fieldLabel(record.FieldName),
    value: record.FieldValue ?? '—',
    confidence: formatConfidence(record.ConfidenceScore),
  }
}

// The Item column comes from the grouping key and is always first; these
// follow it in a fixed order so the table reads the same whatever order the
// service returns fields in (OData sorts them alphabetically, which puts
// Amount before Description). Anything not listed keeps its arrival order
// after these, so a new DIE field still shows up without a change here.
const LINE_ITEM_COLUMN_ORDER = ['MaterialNumber', 'MaterialDescription']

function orderLineItemColumns(names) {
  const preferred = LINE_ITEM_COLUMN_ORDER.filter((n) => names.includes(n))
  const rest = names.filter((n) => !LINE_ITEM_COLUMN_ORDER.includes(n))
  return [...preferred, ...rest]
}

// Line items come back flat (EAV): one row per (ItemNumber, FieldName). Group
// by ItemNumber into a row, and let the field names define the columns so any
// new field DIE returns shows up without a frontend change.
export function groupLineItemFields(records) {
  const columns = []
  const byItem = new Map()

  for (const record of records) {
    const item = String(record.ItemNumber ?? '')
    // DIE also returns ItemNumber as a field; the Item column already shows it.
    if (record.FieldName === 'ItemNumber') continue
    if (!columns.includes(record.FieldName)) columns.push(record.FieldName)
    if (!byItem.has(item)) byItem.set(item, { itemNumber: item, cells: {} })
    byItem.get(item).cells[record.FieldName] = {
      value: record.FieldValue ?? '—',
      confidence: formatConfidence(record.ConfidenceScore),
    }
  }

  const rows = [...byItem.values()].sort(
    (a, b) => Number(a.itemNumber) - Number(b.itemNumber) || a.itemNumber.localeCompare(b.itemNumber)
  )

  return { columns: orderLineItemColumns(columns).map((name) => ({ key: name, label: fieldLabel(name) })), rows }
}
