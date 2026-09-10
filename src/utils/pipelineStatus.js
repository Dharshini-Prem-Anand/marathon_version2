// PipelineStatus, the run record behind a received document.
//
// It holds one row per invoice line item rather than one per document: the same
// (MessageID, FileName, InvoiceNumber) repeats, and every row carries the whole
// pipeline's outcome. The live data also shows the same FileName arriving under
// two different MessageIDs with different outcomes, so rows are always narrowed
// by MessageID first (the service does that) before anything else is compared.

export const PIPELINE_STAGES = [
  'EmailRetrieved',
  'EmailClassified',
  'EmailExtracted',
  'ExceptionCheck',
  'Prevalidation',
  'ThreeWayMatching',
  'InvoicePosted',
]

const norm = (value) => (value == null ? '' : String(value).trim())

// Rows belonging to one document, out of that document's MessageID rows.
// FileName pairs a row with the queue's document key; the invoice number is
// matched as well, since a row can be written against the invoice with no file
// name of its own — and the document-only fallback row leaves InvoiceNumber
// null, so neither test alone covers both.
export function pipelineRowsForDocument(rows = [], { fileName, invoiceNumber } = {}) {
  const file = norm(fileName)
  const invoice = norm(invoiceNumber)
  if (!file && !invoice) return []

  return rows.filter((row) => {
    const rowFile = norm(row.FileName)
    const rowInvoice = norm(row.InvoiceNumber)
    return (file && rowFile === file) || (invoice && rowInvoice === invoice)
  })
}

// 'success' when every stage of every one of the document's rows succeeded,
// 'failed' as soon as one didn't, and 'unknown' when the pipeline has nothing
// on this document yet. A stage left null isn't applicable to that row (the
// fallback row carries only the three email stages) and is skipped rather than
// counted as a failure.
export function pipelineOutcome(rows = []) {
  let stagesSeen = 0

  for (const row of rows) {
    for (const stage of PIPELINE_STAGES) {
      const value = norm(row[stage])
      if (!value) continue
      stagesSeen += 1
      if (value.toLowerCase() !== 'success') return 'failed'
    }
  }

  return stagesSeen ? 'success' : 'unknown'
}
