import { apiGet, apiGetBlob } from './client'
import { PDF_SERVICE_BASE_URL } from './config'

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

