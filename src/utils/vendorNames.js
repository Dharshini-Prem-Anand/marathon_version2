// Vendor display names come from the extraction, not from the invoice tables:
// Invoices.VendorNO, PurchaseOrders.Supplier, Exceptions.Vendor and
// PreValidation.VendorNo all hold codes like "USSU-LSF01", and
// PreValidation.VendorName is null on every row.
//
// ExtractedHeaderFields is an EAV table — one row per (document, field) — so an
// invoice number and its vendor name are two separate ROWS of the same
// document. They're paired up here by document key.

const INVOICE_FIELDS = new Set(['invoicenumber'])
const NAME_FIELDS = new Set(['vendorname'])
const CODE_FIELDS = new Set(['vendorno'])

// The field names are matched case-insensitively: the live schema spells them
// "InvoiceNumber", "vendorName" and "VendorNO", and Schema Configuration lets
// them be renamed.
export function buildVendorNamesByInvoice(rows = []) {
  const byDocument = new Map()

  for (const row of rows) {
    const field = String(row.FieldName ?? '').toLowerCase()
    const value = String(row.FieldValue ?? '').trim()
    if (!value) continue

    const key = `${row.MessageID}::${row.FileName}`
    const doc = byDocument.get(key) ?? {}
    if (INVOICE_FIELDS.has(field)) doc.invoice = value
    else if (NAME_FIELDS.has(field)) doc.name = value
    else if (CODE_FIELDS.has(field)) doc.code = value
    byDocument.set(key, doc)
  }

  const byInvoice = {}
  for (const doc of byDocument.values()) {
    // The same invoice can arrive twice (duplicate attachments); first wins.
    if (doc.invoice && doc.name && !byInvoice[doc.invoice]) byInvoice[doc.invoice] = doc.name
  }
  return byInvoice
}

// What to show for a vendor: the extracted name when the document had one,
// otherwise the code the invoice tables carry, so a vendor is always
// identifiable even where extraction found no name.
export function vendorLabel(namesByInvoice, invoiceNumber, fallbackCode) {
  const name = invoiceNumber ? namesByInvoice?.[String(invoiceNumber).trim()] : null
  return name || fallbackCode || '—'
}
