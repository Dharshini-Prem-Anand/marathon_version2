import { vendorName } from './vendorNames'

// Parses PreValidation.PrevalidationRules into rows for the Validation Rule
// Results table.
//
// The field is a LargeString holding a JSON array like:
//   [{ "category": "Mandatory Fields", "rule": "Required fields present",
//      "result": "Passed", "confidence": 95, "issue": null }, ...]
//
// ValidationRuleResults looks the result up in a lowercase-keyed config and
// reads `cfg.icon` without guarding, so an unrecognised value would crash the
// page. Everything below normalises to one of passed/review/failed.

const RESULT_ALIASES = {
  passed: 'passed',
  pass: 'passed',
  success: 'passed',
  ok: 'passed',
  review: 'review',
  warning: 'review',
  warn: 'review',
  'review required': 'review',
  failed: 'failed',
  fail: 'failed',
  error: 'failed',
}

// Unknown values fall back to 'review' rather than crashing the table.
function normaliseResult(value) {
  const key = String(value ?? '').trim().toLowerCase()
  return RESULT_ALIASES[key] ?? 'review'
}

// Accepts 95, "95", 0.95, "95%" — renders as "95%". Blank when absent.
function formatConfidence(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'string' && value.trim().endsWith('%')) return value.trim()
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  const pct = n > 0 && n <= 1 ? n * 100 : n
  return `${Math.round(pct)}%`
}

// The table styles the issue cell red whenever it isn't the em dash.
function formatIssue(value) {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null' || text === '-') return '—'
  return text
}

// PrevalidationRules may arrive as a JSON string or already-parsed array.
export function parsePrevalidationRules(raw) {
  if (!raw) return []

  let parsed = raw
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(parsed)) return []

  return parsed.map((entry) => ({
    category: entry?.category ?? '—',
    rule: entry?.rule ?? '—',
    result: normaliseResult(entry?.result),
    confidence: formatConfidence(entry?.confidence),
    issue: formatIssue(entry?.issue),
  }))
}

// A PreValidation invoice is line-level, so several rows share one
// InvoiceNumber. The rules JSON is a header-level attribute — take it from the
// first row that actually carries one.
export function rulesForInvoice(rows) {
  const withRules = rows.find((r) => r?.PrevalidationRules)
  return parsePrevalidationRules(withRules?.PrevalidationRules)
}

// ---------------------------------------------------------------------------
// Record builder: turns PreValidation rows into the shape PreValidation.jsx
// already consumes — { invoice, validationRuleResults, vendorPayeeValidation,
// documentClassification } keyed by invoice number.
// ---------------------------------------------------------------------------

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const money = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num(value))

const unitPrice = (amount, quantity, currency = 'USD') => {
  const q = num(quantity)
  if (q === 0) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num(amount) / q)
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// PreValidation.VendorName is often blank, leaving only the vendor code
// (VendorNo, e.g. "USSU-FFC10"). Resolve that through the same code->name
// lookup the other live pages (PO & Line Matching, Exceptions) already use,
// instead of showing the raw code.
function resolveVendorName(head) {
  return head.VendorName || vendorName(head.VendorNo)
}

// The badge mirrors the mock wording so the existing styling still applies.
function confidenceBadge(rules) {
  const values = rules
    .map((r) => parseInt(r.confidence, 10))
    .filter((n) => Number.isFinite(n))
  if (values.length === 0) return 'HIGH CONFIDENCE'
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  if (avg >= 90) return 'HIGH CONFIDENCE'
  if (avg >= 70) return 'MEDIUM CONFIDENCE'
  return 'LOW CONFIDENCE'
}

// PreValidation has no document-type field, so this stays fixed.
const DEFAULT_DOCUMENT_CLASSIFICATION = [
  { label: 'Invoice', confidence: '—', badgeColor: 'green', selected: true },
]

function buildVendorPayee(head) {
  const active = head.IsActive === true || String(head.VendorStatus ?? '').toLowerCase() === 'active'
  return [
    {
      type: 'Proposed Vendor',
      name: resolveVendorName(head),
      confidence: '—',
      badgeColor: 'gray',
    },
    {
      type: 'SAP Vendor',
      name: head.SAPVendorNumber || head.VendorNo || '—',
      confidence: head.SAPVendorNumber ? '100%' : '—',
      badgeColor: head.SAPVendorNumber ? 'green' : 'gray',
    },
    {
      type: 'Vendor Status',
      name: head.VendorStatus || (head.IsActive === false ? 'Inactive' : '—'),
      confidence: '—',
      badgeColor: active ? 'green' : 'red',
      nameColor: active ? undefined : 'red',
    },
    {
      type: 'Payee',
      name: head.PayeeName || 'Review Required',
      confidence: head.PayeeName ? '100%' : '0%',
      badgeColor: head.PayeeName ? 'green' : 'red',
      nameColor: head.PayeeName ? undefined : 'red',
    },
    {
      type: 'Remit-To Address',
      name: head.RemitToAddress || '—',
      confidence: '—',
      badgeColor: 'gray',
    },
  ]
}

export function buildPreValidationRecords(rows) {
  const grouped = new Map()
  for (const row of rows) {
    const key = row.InvoiceNumber
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(row)
  }

  const ids = []
  const records = {}

  for (const [invoiceNumber, lines] of grouped) {
    const head = lines[0]
    const currency = head.Currency || head.DocumentCurrency || head.CurrencyKey || 'USD'
    const validationRuleResults = rulesForInvoice(lines)

    const lineTotal = lines.reduce((sum, l) => sum + num(l.AmountInDocCurrency), 0)
    // HeaderAmount can be null, so fall back to the sum of the lines.
    const gross = num(head.HeaderAmount) || lineTotal

    ids.push(invoiceNumber)
    records[invoiceNumber] = {
      invoice: {
        vendorName: resolveVendorName(head).toUpperCase(),
        confidenceBadge: confidenceBadge(validationRuleResults),
        invoiceNumber,
        invoiceDate: formatDate(head.CreationDate),
        poNumber: head.PurchaseOrder || '—',
        grossAmount: `${money(gross, currency)} ${currency}`,
        lineItems: lines.map((l, i) => ({
          line: l.ItemNumber ?? i + 1,
          // PreValidation carries no material description — only the number.
          description: l.MaterialNumber || '—',
          quantity: num(l.Quantity),
          uom: '—',
          unitPrice: unitPrice(l.AmountInDocCurrency, l.Quantity, currency),
          amount: money(l.AmountInDocCurrency, currency),
        })),
        totalAmountDue: `${money(gross, currency)} ${currency}`,
      },
      validationRuleResults,
      vendorPayeeValidation: buildVendorPayee(head),
      documentClassification: DEFAULT_DOCUMENT_CLASSIFICATION,
      // Kept for the queue row.
      vendor: resolveVendorName(head),
      amount: money(gross, currency),
    }
  }

  return { ids, records }
}
