import { groupLineItemFields } from './documentMappers'
import { vendorName as resolveVendorCode } from './vendorNames'

// Maps an editable header field on the Selected Invoice Preview to the
// Validation Rule Results category it stands for. When that rule's result
// isn't "passed" (review/failed — i.e. low confidence), the field shows a
// Correct Field control.
export const FIELD_RULE_CATEGORY = {
  invoiceNumber: 'Mandatory Fields',
  poNumber: 'PO Existence',
  grossAmount: 'Total Reconciliation',
}

export function ruleForField(rules, fieldKey) {
  const category = FIELD_RULE_CATEGORY[fieldKey]
  if (!category) return null
  return rules.find((r) => r.category === category) ?? null
}

// ---------------------------------------------------------------------------
// Selected Invoice Preview, built from ExtractedHeaderFields (?$expand=
// lineItemFields) — the DIE-extracted data. Unlike /PreValidation (which for
// some invoices carries no vendor name and no line-item description/UOM —
// see preValidationRules.js), this is the same rich source already proven
// out on the Document AI & Extraction page.
// ---------------------------------------------------------------------------

function fieldValue(rows, fieldName) {
  return rows.find((r) => r.FieldName === fieldName)?.FieldValue ?? null
}

function formatInvoiceDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const numeric = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const money = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(numeric(value))

// `headerRows` is the raw ExtractedHeaderFields array for one invoice (each
// row carrying the same expanded `lineItemFields`). Returns an object with
// the same shape as the `invoice` prop InvoicePreviewValidation expects —
// minus `confidenceBadge`, which the caller derives from validation rules
// and should merge in on top (e.g. `{ ...builtInvoice, confidenceBadge }`).
export function buildInvoicePreviewFromExtractedFields(headerRows, fallbackInvoiceNumber) {
  if (!headerRows || headerRows.length === 0) return null

  const currency = fieldValue(headerRows, 'DocumentCurrency') || 'USD'
  const gross = fieldValue(headerRows, 'GrossAmount')
  // Falls back through the same code->name lookup used elsewhere when the
  // extraction only resolved a vendor code (e.g. "USSU-FFC10"), not a name.
  const vendorLabel = fieldValue(headerRows, 'VendorName') || resolveVendorCode(fieldValue(headerRows, 'VendorNO'))
  const grossFormatted = gross != null ? `${money(gross, currency)} ${currency}` : '—'

  const lineItemRows = headerRows[0]?.lineItemFields ?? []
  const { rows: groupedLines } = groupLineItemFields(lineItemRows)
  const lineItems = groupedLines.map((row, i) => ({
    line: row.itemNumber || i + 1,
    description: row.cells.MaterialDescription?.value ?? '—',
    quantity: row.cells.Quantity?.value ?? '—',
    uom: row.cells.UnitOfMeasure?.value ?? '—',
    unitPrice: row.cells.UnitPrice?.value != null ? money(row.cells.UnitPrice.value, currency) : '—',
    amount:
      row.cells.AmountInDocCurrency?.value != null ? money(row.cells.AmountInDocCurrency.value, currency) : '—',
  }))

  return {
    vendorName: String(vendorLabel).toUpperCase(),
    invoiceNumber: fieldValue(headerRows, 'InvoiceNumber') || fallbackInvoiceNumber,
    invoiceDate: formatInvoiceDate(fieldValue(headerRows, 'CreationDate')),
    poNumber: fieldValue(headerRows, 'PurchaseOrder') || '—',
    grossAmount: grossFormatted,
    lineItems,
    totalAmountDue: grossFormatted,
  }
}
