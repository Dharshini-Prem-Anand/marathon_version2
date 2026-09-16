// KPI tiles for Email & Attachment Triage, Pre-Validation and Exceptions &
// Recommendations.
//
// Each page's tile row comes from a single Python endpoint (/triageKpis,
// /preValidationKpis, /exceptionKpis), which take an inclusive date window and
// return one number per tile.

import { ALL_DATES_RANGE, dateRangeBounds } from './dateRange'

function toApiDate(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// The endpoints want an inclusive [dateFrom, dateTo]; dateRangeBounds returns a
// half-open [start, end), so the last day is `end` minus one CALENDAR day —
// subtracting 24h would land on the wrong date across a DST change.
//
// 'Custom Range' and unknown labels come back unbounded (1970 → year 275760),
// so both ends are clamped to something a service can answer for.
const EARLIEST_QUERYABLE_YEAR = 2000

export function kpiDateParams(rangeLabel, now = new Date()) {
  const { start, end } = dateRangeBounds(rangeLabel, now)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const earliest = new Date(EARLIEST_QUERYABLE_YEAR, 0, 1)
  const lastDay = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1)

  const from = start < earliest ? earliest : start
  const to = lastDay > today ? today : lastDay

  return { dateFrom: toApiDate(from), dateTo: toApiDate(to < from ? from : to) }
}

const count = (n) => Math.round(n).toLocaleString()
const percent = (n) => `${Math.round(n)}%`
const decimal = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

// Tile label -> the response field it reads, and how that number renders.
// The label is the join key because it's what the tile definitions in data.js
// carry; their icon, colour and target text are left untouched.
export const TRIAGE_KPI_FIELDS = {
  'Emails Received': { key: 'emailsReceivedToday', format: count },
  'Auto-Triaged': { key: 'autoTriagedPercent', format: percent },
  'Attachments Downloaded': { key: 'attachmentsDownloaded', format: count },
  'Manual Reviews': { key: 'manualReviews', format: count },
  'Duplicate Attachments': { key: 'duplicateAttachments', format: count },
  // Lower-case unit here — it's what this page's tile has always shown.
  'Average Triage Time': { key: 'averageTriageTimeMinutes', format: (n) => `${decimal(n)} min` },
}

export const PRE_VALIDATION_KPI_FIELDS = {
  'Pre-Validated Invoices': { key: 'prevalidatedInvoices', format: count },
  'Pending Pre-Validation': { key: 'pendingPreValidation', format: count },
  'Auto-Validated': { key: 'autoValidated', format: count },
  'First-Pass VIM Readiness': { key: 'firstPassVimReadinessPercent', format: percent },
  'Low Confidence': { key: 'lowConfidence', format: count },
  'Prevented VIM Exceptions': { key: 'preventedVimExceptions', format: count },
  'Average Validation Time': { key: 'averageValidationTimeMinutes', format: (n) => `${decimal(n)} Min` },
}

export const EXCEPTION_KPI_FIELDS = {
  'Exceptioned Invoices': { key: 'exceptionedInvoices', format: count },
  'Open Exceptions': { key: 'openExceptions', format: count },
  'At Risk of Late Payment': { key: 'atRiskOfLatePayment', format: count },
  Unassigned: { key: 'unassigned', format: count },
  'Beyond SLA': { key: 'beyondSla', format: count },
  Recommendations: { key: 'recommendations', format: count },
  'Average Resolution': { key: 'averageResolutionHours', format: (n) => `${decimal(n)} Hours` },
}

export const DOCUMENT_AI_KPI_FIELDS = {
  'Overall Extraction Accuracy': { key: 'overallExtractionAccuracy', format: percent },
  'Header Accuracy': { key: 'headerAccuracy', format: percent },
  'Line Accuracy': { key: 'lineAccuracy', format: percent },
  // A share of documents, not a count — the tile's "< 80% confidence" subtitle
  // still reads correctly against a percentage.
  'Low Confidence': { key: 'lowConfidencePercent', format: percent },
  'Average Extraction Time': { key: 'averageExtractionTimeMinutes', format: (n) => `${decimal(n)} Min` },
}

export const MATCHING_KPI_FIELDS = {
  'Total Invoices': { key: 'totalInvoices', format: count },
  'PO Invoices': { key: 'poInvoices', format: count },
  'Fully Matched': { key: 'fullyMatched', format: count },
  'Partial Match': { key: 'partialMatch', format: count },
  'Non PO invoices': { key: 'nonPoInvoices', format: count },
  'Tolerance Exceptions': { key: 'toleranceExceptions', format: count },
  'Ready for VIM': { key: 'readyForVIM', format: count },
}

// Shown while the call is in flight. The tile definitions carry sample numbers
// for the tiles that still have no live source, and those must never appear on
// a bound tile — a number the service hasn't returned yet reads as real data.
const LOADING = '…'
// Shown once the service has answered but this tile's number isn't in it.
const NO_VALUE = '—'

// Pass this instead of the payload when the call failed, so the tiles settle on
// "no value" rather than sitting on the loading placeholder forever.
export const KPI_UNAVAILABLE = Object.freeze({})

// The window a tile's number covers, for the small line under it. Every tile is
// scoped to the applied Date Range, so a label like "Emails Received Today"
// would be wrong the moment another range is picked — the window goes here
// rather than into the label.
export function kpiRangeSubtitle(rangeLabel) {
  return rangeLabel === ALL_DATES_RANGE ? 'All dates' : rangeLabel
}

// Overlays a KPI response onto the tile definitions, keeping their icon, colour
// and target text. Every tile with a mapped field takes its value from the
// response: a placeholder until it arrives, and per-tile if the response comes
// back partial, so one missing number degrades one tile rather than the row.
export function mergeKpiStats(stats, fields, payload) {
  const pending = payload == null || typeof payload !== 'object'

  return stats.map((stat) => {
    const field = fields[stat.label]
    if (!field) return stat
    if (pending) return { ...stat, value: LOADING }
    const value = Number(payload[field.key])
    if (!Number.isFinite(value)) return { ...stat, value: NO_VALUE }
    return { ...stat, value: field.format(value) }
  })
}

// What a tile with no local source should read while the service hasn't
// answered ('…') or can't ('—').
export function kpiPlaceholder(payload) {
  return payload == null || typeof payload !== 'object' ? LOADING : NO_VALUE
}

// Like mergeKpiStats, but for a row whose tiles were already computed from
// loaded rows: a field the response doesn't carry leaves the computed value
// alone instead of blanking it. Used where the endpoint isn't deployed yet and
// the page can still count for itself.
export function overlayKpiStats(stats, fields, payload) {
  if (!payload || typeof payload !== 'object') return stats

  return stats.map((stat) => {
    const field = fields[stat.label]
    if (!field) return stat
    const value = Number(payload[field.key])
    if (!Number.isFinite(value)) return stat
    return { ...stat, value: field.format(value) }
  })
}
