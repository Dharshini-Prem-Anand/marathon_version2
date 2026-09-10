import { apiGet, apiGetBlob, apiGetJson, apiPostJson } from './client'
import { PDF_SERVICE_BASE_URL, PYTHON_SERVICE_BASE_URL } from './config'

// Escapes a value for use inside an OData string literal.
function odataString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function documentKeyFilter(messageId, fileName) {
  return `MessageID eq ${odataString(messageId)} and FileName eq ${odataString(fileName)}`
}

export function fetchEmailMetadata() {
  return apiGet('/EmailMetadata').then((res) => res?.value ?? [])
}

export function fetchEmailAttachments(messageId) {
  return apiGet('/EmailAttachments', {
    $filter: `MessageID eq ${odataString(messageId)}`,
  }).then((res) => res?.value ?? [])
}

// Document AI queue: one row per received document, with its parent email
// joined in so the sender / subject / received time come back in one call.
export function fetchDocumentQueue() {
  return apiGet('/EmailAttachments', { $expand: 'email' }).then((res) => res?.value ?? [])
}

export function fetchExtractedHeaderFields(messageId, fileName) {
  return apiGet('/ExtractedHeaderFields', {
    $filter: documentKeyFilter(messageId, fileName),
  }).then((res) => res?.value ?? [])
}

export function fetchExtractedLineItemFields(messageId, fileName) {
  return apiGet('/ExtractedLineItemFields', {
    $filter: documentKeyFilter(messageId, fileName),
  }).then((res) => res?.value ?? [])
}

// Extracted header fields for one invoice, with their line items — the source
// for Pre-Validation's Selected Invoice Preview.
//
// The deployed service rejects both halves of this today: "Property
// InvoiceNumber does not exist in ExtractedHeaderFields" and "Navigation
// property lineItemFields is not defined". Callers must therefore treat a
// failure as "no extracted preview" and fall back, not as a page error. It
// starts working as soon as the service exposes the denormalized
// InvoiceNumber column and the lineItemFields association.
export function fetchExtractedHeaderFieldsByInvoice(invoiceNumber) {
  return apiGet('/ExtractedHeaderFields', {
    $filter: `InvoiceNumber eq ${odataString(invoiceNumber)}`,
    $expand: 'lineItemFields',
  }).then((res) => res?.value ?? [])
}

// Vendor names for the queues, from the extraction rather than the invoice
// tables (which carry only vendor codes).
//
// NOT the documented shape — ?$filter=InvoiceNumber eq '<no>'&$expand=lineItemFields
// is rejected by the deployed service, which has neither the denormalized
// InvoiceNumber column ("Property InvoiceNumber does not exist") nor the
// lineItemFields navigation. Until those ship, the invoice number is itself an
// extracted field, so both rows are pulled in one call and paired up by
// document (see buildVendorNamesByInvoice).
//
// Both casings of each field name are requested: the live schema spells them
// "vendorName" and "VendorNO", and Schema Configuration lets them be renamed.
const VENDOR_NAME_FILTER = [
  'InvoiceNumber',
  'vendorName',
  'VendorName',
  'VendorNO',
  'VendorNo',
]
  .map((name) => `FieldName eq ${odataString(name)}`)
  .join(' or ')

export function fetchVendorNameFields() {
  return apiGet('/ExtractedHeaderFields', { $filter: VENDOR_NAME_FILTER }).then((res) => res?.value ?? [])
}

// PO & Line Matching. The CAP associations Invoices.purchaseOrder /
// Invoices.goodsReceipt resolve to null (PurchaseOrderItem, GRNumber,
// MaterialDocYear and MaterialDocItem are empty on every invoice row), so
// $expand is useless here — these three sets are fetched whole and joined
// client-side on PurchaseOrder + ItemNumber. Volumes are small (tens of rows).
export function fetchInvoices() {
  return apiGet('/Invoices').then((res) => res?.value ?? [])
}

export function fetchPurchaseOrders() {
  return apiGet('/PurchaseOrders').then((res) => res?.value ?? [])
}

export function fetchGoodsReceipts() {
  return apiGet('/GoodsReceipts').then((res) => res?.value ?? [])
}

// Exceptions & Recommendations queue.
export function fetchExceptions() {
  return apiGet('/Exceptions').then((res) => res?.value ?? [])
}

// Match Explanation for one invoice, from the Python service.
// Returns { recommendedAction, confidence, evidence }. The route may not be
// deployed yet, so callers must treat any failure as "not ready" rather than
// as a page error.
export function fetchMatchExplanation(invoiceNumber) {
  if (!PYTHON_SERVICE_BASE_URL) {
    return Promise.reject(new Error('Python service URL is not configured'))
  }
  return apiGetJson(
    `${PYTHON_SERVICE_BASE_URL}/matchExplanation?invNo=${encodeURIComponent(invoiceNumber)}`
  )
}

// Pre-Validation. PrevalidationRules is a LargeString holding a JSON array, so
// it comes back as text and is parsed client-side (see preValidationRules.js).
export function fetchPreValidation() {
  return apiGet('/PreValidation').then((res) => res?.value ?? [])
}

export function fetchPreValidationByInvoice(invoiceNumber) {
  return apiGet('/PreValidation', {
    $filter: `InvoiceNumber eq ${odataString(invoiceNumber)}`,
  }).then((res) => res?.value ?? [])
}

// KPI tiles for Email Triage, Pre-Validation and Exceptions. One call per
// page, from the Python service; the window is inclusive on both ends and the
// service falls back to today when it's omitted, so both params are always sent.
function kpiQuery(path, { dateFrom, dateTo }) {
  if (!PYTHON_SERVICE_BASE_URL) {
    return Promise.reject(new Error('Python service URL is not configured'))
  }
  const query = `dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`
  return apiGetJson(`${PYTHON_SERVICE_BASE_URL}${path}?${query}`)
}

export function fetchTriageKpis(range) {
  return kpiQuery('/triageKpis', range)
}

export function fetchPreValidationKpis(range) {
  return kpiQuery('/preValidationKpis', range)
}

export function fetchExceptionKpis(range) {
  return kpiQuery('/exceptionKpis', range)
}

// Document Information Extraction schema (header + line-item field
// definitions) behind the Schema Configuration dialog. Python service, not CAP.
export function fetchDieSchema() {
  if (!PYTHON_SERVICE_BASE_URL) {
    return Promise.reject(new Error('Python service URL is not configured'))
  }
  return apiGetJson(`${PYTHON_SERVICE_BASE_URL}/getDieSchema`)
}

// Adds or edits schema fields. Only the field being saved is sent — the
// arrays are a delta, not the full schema, so an unrelated field can't be
// dropped by a save. Shape:
//   { schema_id, version, header_fields: [...], line_item_fields: [...] }
// where each entry is { name, description, data_type, setup_type }.
export function updateDieSchemaFields(payload) {
  if (!PYTHON_SERVICE_BASE_URL) {
    return Promise.reject(new Error('Python service URL is not configured'))
  }
  return apiPostJson(`${PYTHON_SERVICE_BASE_URL}/updateDieSchemaFields`, payload)
}

// Re-runs Document AI extraction for an already-processed document.
//
// DIE jobs are one-shot, so the service creates a NEW job and deletes the old
// one on success — meaning the document's DieDocumentID changes. Callers must
// reload the document queue afterwards, not just the extracted fields, or the
// PDF pane will keep pointing at a deleted job.
export function reprocessExtraction(dieDocumentId) {
  if (!PYTHON_SERVICE_BASE_URL) {
    return Promise.reject(new Error('Python service URL is not configured'))
  }
  return apiPostJson(
    `${PYTHON_SERVICE_BASE_URL}/reprocessExtraction?document_id=${encodeURIComponent(dieDocumentId)}`,
    {}
  )
}

export const isPdfServiceConfigured = () => Boolean(PDF_SERVICE_BASE_URL)

// The original PDF lives in DIE, not CAP — the Python service proxies it.
export function fetchDocumentPdf(dieDocumentId) {
  if (!PDF_SERVICE_BASE_URL) {
    return Promise.reject(
      new Error('PDF service URL is not configured — set VITE_PDF_SERVICE_BASE_URL')
    )
  }
  const url = `${PDF_SERVICE_BASE_URL}/getExtractedDocument?document_id=${encodeURIComponent(dieDocumentId)}`
  return apiGetBlob(url)
}

// Intelligent AP Agent chat — same Python service as the PDF proxy above.
export function sendAssistantChatMessage(sessionId, message) {
  if (!PDF_SERVICE_BASE_URL) {
    return Promise.reject(
      new Error('AI assistant service URL is not configured — set VITE_PDF_SERVICE_BASE_URL')
    )
  }
  return apiPostJson(`${PDF_SERVICE_BASE_URL}/chat`, { session_id: sessionId, message })
}

