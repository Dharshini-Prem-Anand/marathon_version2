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

