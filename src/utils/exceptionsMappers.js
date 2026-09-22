// Maps the CAP /Exceptions entity onto the Priority Exception Queue's row
// shape (same fields the priorityExceptionQueue mock in data.js carries),
// plus the extra recommendation fields the AI Review Recommendation panel
// can show when they're available.

import { money } from './matchingMappers.js'
import { vendorLabel } from './vendorNames.js'
import { priorityColor } from '../data.js'

function normalizePriority(value) {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'high') return 'High'
  if (v === 'medium') return 'Medium'
  if (v === 'low') return 'Low'
  return 'Medium'
}

function formatDue(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d)
}

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

export function buildExceptionRows(exceptions, vendorNamesByInvoice = {}) {
  return [...exceptions]
    .sort((a, b) => {
      const rankA = PRIORITY_RANK[normalizePriority(a.Priority)]
      const rankB = PRIORITY_RANK[normalizePriority(b.Priority)]
      if (rankA !== rankB) return rankA - rankB
      return new Date(a.Due ?? 0) - new Date(b.Due ?? 0)
    })
    .map((row) => {
      const priority = normalizePriority(row.Priority)
      const color = priorityColor[priority] ?? null
      const sla = Number(row.SLA)

      return {
        // An invoice can carry several distinct exceptions, so the row key
        // has to be the exception's own composite key, not the invoice
        // number — using the invoice alone produces duplicate React keys.
        id: `${row.ExceptionCode}::${row.InvoiceNumber}::${row.FiscalYear}::${row.ItemNumber}`,
        invoice: row.InvoiceNumber,
        // Not every exception is tied to a material (a header-level check,
        // like the invoice total not matching its line items, has none) — the
        // queue falls back to a 1-based position among the invoice's other
        // exceptions when this is null.
        materialNumber: row.MaterialNumber || null,
        priority,
        // Vendor comes back as a code (e.g. "USSU-LSF01"), same as Invoices —
        // the readable name comes from the extraction, keyed by invoice number.
        vendor: vendorLabel(vendorNamesByInvoice, row.InvoiceNumber, row.Vendor),
        amount: money(row.Amount),
        issue: row.Reason || '—',
        issueColor: null,
        due: formatDue(row.Due),
        // Raw, unformatted. Due is the exception's own deadline — often in the
        // future, so it can't drive a backward-looking Date Range.
        dueDate: row.Due ?? null,
        // When the pipeline raised the exception (managed aspect) — what the
        // Date Range filter reads.
        createdAt: row.createdAt ?? null,
        dueColor: color,
        owner: row.Owner || '—',
        sla: Number.isFinite(sla) ? `${sla}h` : '—',
        slaColor: color,
        // Optional — used by AiReviewRecommendation when present, falling
        // back to its generic copy otherwise (see recommendationFor).
        recommendation: row.Recommendation || null,
        confidence: Number.isFinite(Number(row.Confidence)) ? `${row.Confidence}%` : null,
        evidenceUsed: row.Evidence || null,
        requiredApproval: row.RequiredApproval || null,
        prohibitedActions: row.ProhibitedActions || null,
      }
    })
}
