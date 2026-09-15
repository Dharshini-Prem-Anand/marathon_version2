// The Dashboard on live data.
//
// It is an aggregate of the five KPI endpoints (/triageKpis,
// /getExtractionKpis, /preValidationKpis, /exceptionKpis, /matchingkpis) plus
// two CAP entities: PipelineStatus — the run record behind every document,
// which the End-to-End flow strip is a direct picture of — and Exceptions,
// which is the Priority Action Queue.
//
// Three figures on this page have no source anywhere in the service: cost per
// invoice (needs a rate card), human touches per invoice (needs a touch log)
// and annualised value (needs a value model). Those render '—'. Targets are
// configuration, not data, so they stay as written.

import { PIPELINE_STAGES } from './pipelineStatus'

const NO_VALUE = '—'
const LOADING = '…'

const num = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const count = (value) => {
  const n = num(value)
  return n == null ? NO_VALUE : Math.round(n).toLocaleString()
}

const percent = (value) => {
  const n = num(value)
  return n == null ? NO_VALUE : `${Math.round(n)}%`
}

const money = (value) => {
  const n = num(value)
  return n == null
    ? NO_VALUE
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

// '…' until the call lands, '—' once it has and the number isn't in it.
const pending = (payload, formatted) => (payload == null ? LOADING : formatted)

// ---------------------------------------------------------------------------
// PipelineStatus
// ---------------------------------------------------------------------------

// One row per invoice line item, so everything here is per DOCUMENT: a stage
// counts as passed only when every row of that document says Success.
export function pipelineFunnel(rows = []) {
  const byDocument = new Map()
  for (const row of rows) {
    const key = `${row.MessageID}::${row.FileName}`
    const list = byDocument.get(key) ?? []
    list.push(row)
    byDocument.set(key, list)
  }

  const stagePassed = (docRows, stage) => {
    const values = docRows.map((row) => String(row[stage] ?? '').trim()).filter(Boolean)
    return values.length > 0 && values.every((value) => value.toLowerCase() === 'success')
  }

  const stages = {}
  for (const stage of PIPELINE_STAGES) {
    stages[stage] = [...byDocument.values()].filter((docRows) => stagePassed(docRows, stage)).length
  }

  const clean = [...byDocument.values()].filter((docRows) =>
    PIPELINE_STAGES.every((stage) => stagePassed(docRows, stage))
  ).length

  const documents = byDocument.size
  return { documents, stages, clean, touched: documents - clean }
}

// Intake to the last thing the pipeline did, averaged over the documents that
// have both timestamps. Rendered in the unit that fits: the live runs take
// about a minute, and "0.0 Days" would say nothing.
export function cycleTimeLabel(pipelineRows = [], emails = []) {
  const receivedByMessage = new Map()
  for (const email of emails) {
    if (email.MessageID && email.ReceivedDateTime) receivedByMessage.set(email.MessageID, email.ReceivedDateTime)
  }

  const lastByDocument = new Map()
  for (const row of pipelineRows) {
    const stamp = row.Timestamp ?? row.createdAt
    if (!stamp) continue
    const key = `${row.MessageID}::${row.FileName}`
    const current = lastByDocument.get(key)
    if (!current || stamp > current.stamp) lastByDocument.set(key, { stamp, messageId: row.MessageID })
  }

  const spans = []
  for (const { stamp, messageId } of lastByDocument.values()) {
    const received = receivedByMessage.get(messageId)
    if (!received) continue
    const ms = new Date(stamp) - new Date(received)
    if (Number.isFinite(ms) && ms >= 0) spans.push(ms)
  }
  if (spans.length === 0) return NO_VALUE

  const avgMs = spans.reduce((sum, ms) => sum + ms, 0) / spans.length
  const minutes = avgMs / 60000
  if (minutes < 60) return `${minutes.toFixed(1)} Min`
  if (minutes < 60 * 24) return `${(minutes / 60).toFixed(1)} Hrs`
  return `${(minutes / (60 * 24)).toFixed(1)} Days`
}

// Where each invoice stands, for the Dashboard's Status filter: the pipeline
// either posted it, failed somewhere, or is still working through it.
export function invoiceStatusFromPipeline(rows = []) {
  const byInvoice = new Map()

  for (const row of rows) {
    const invoice = String(row.InvoiceNumber ?? '').trim()
    if (!invoice) continue
    const values = PIPELINE_STAGES.map((stage) => String(row[stage] ?? '').trim()).filter(Boolean)
    const failed = values.some((value) => value.toLowerCase() !== 'success')
    const posted = String(row.InvoicePosted ?? '').trim().toLowerCase() === 'success'

    const current = byInvoice.get(invoice)
    // A failure anywhere outranks a posting: the invoice still needs someone.
    if (failed) byInvoice.set(invoice, 'Failed')
    else if (posted && current !== 'Failed') byInvoice.set(invoice, 'Posted')
    else if (!current) byInvoice.set(invoice, 'In Process')
  }

  return byInvoice
}

// ---------------------------------------------------------------------------
// Business Outcome Scorecard
// ---------------------------------------------------------------------------

// Colour and target come from the tile definitions; only the value is data.
// No trend arrows: nothing in the service carries a prior period, and an
// arrow pointing the wrong way is worse than no arrow.
export function buildScorecard(definitions, { funnel, preValidation, extraction, cycleTime, pipelineLoaded, touchlessCount }) {
  // /touchlesscount returns { touchlessCount, humanReview } — both figures
  // are shares of the same total, which is the pipeline's own document count.
  const totalInvoices = funnel.documents
  const touchlessLoaded = pipelineLoaded && touchlessCount != null
  const touchlessValue = num(touchlessCount?.touchlessCount)
  const humanReviewValue = num(touchlessCount?.humanReview)

  const touchlessPct =
    totalInvoices > 0 && touchlessValue != null ? (touchlessValue / totalInvoices) * 100 : null
  const humanTouchesPerInvoice =
    totalInvoices > 0 && humanReviewValue != null ? humanReviewValue / totalInvoices : null

  const values = {
    'Touchless Invoice Processing': touchlessLoaded ? percent(touchlessPct) : LOADING,
    'First-Pass VIM Readiness': pending(preValidation, percent(preValidation?.firstPassVimReadinessPercent)),
    // No rate card behind it anywhere in the service.
    'Cost per Invoice': NO_VALUE,
    'Intake-to-VIM Cycle Time': pipelineLoaded ? cycleTime : LOADING,
    'Human Touches per Invoice': touchlessLoaded
      ? humanTouchesPerInvoice == null
        ? NO_VALUE
        : humanTouchesPerInvoice.toFixed(1)
      : LOADING,
    'Extraction & Validation Accuracy': pending(extraction, percent(extraction?.overallExtractionAccuracy)),
  }

  return definitions.map((metric) => ({ ...metric, value: values[metric.label] ?? NO_VALUE, trend: null }))
}

// ---------------------------------------------------------------------------
// End-to-End Invoice Flow
// ---------------------------------------------------------------------------

// The six steps are the pipeline's own stages, in order. Ready for VIM is the
// one the pipeline doesn't record — that comes from the matching service.
export function buildFlowSteps({ funnel, matching, pipelineLoaded }) {
  const stage = (name) => (pipelineLoaded ? count(funnel.stages[name]) : LOADING)

  return [
    { label: 'Emails / Documents Received', value: pipelineLoaded ? count(funnel.documents) : LOADING },
    { label: 'Auto-Triaged', value: stage('EmailClassified') },
    { label: 'Extracted', value: stage('EmailExtracted') },
    { label: 'PO / Validated', value: stage('Prevalidation') },
    { label: 'Ready for VIM', value: pending(matching, count(matching?.readyForVIM)) },
    { label: 'Posted', value: stage('InvoicePosted') },
  ]
}

export function buildFlowLegend({ touchlessCount, exceptions }) {
  return [
    { label: 'Touchless', value: pending(touchlessCount, count(touchlessCount?.touchlessCount)), color: 'blue' },
    { label: 'Human Review', value: pending(touchlessCount, count(touchlessCount?.humanReview)), color: 'orange' },
    { label: 'Exceptions', value: pending(exceptions, count(exceptions?.openExceptions)), color: 'red' },
  ]
}

// ---------------------------------------------------------------------------
// MVP Capability Performance
// ---------------------------------------------------------------------------

export function buildCapabilityCards(definitions, { triage, extraction, preValidation, exceptions, matching, avgConfidence }) {
  const byTitle = {
    'Email & Attachment Triage': {
      value: pending(triage, percent(triage?.autoTriagedPercent)),
      stat: pending(triage, count(triage?.manualReviews)),
    },
    'Document AI & Extraction': {
      value: pending(extraction, percent(extraction?.overallExtractionAccuracy)),
      // The service reports low confidence as a share of documents, so the
      // card's footer reads as a percentage here rather than a count.
      stat: pending(extraction, percent(extraction?.lowConfidencePercent)),
      statLabel: 'Low-Confidence',
    },
    'Pre-Validation': {
      value: pending(preValidation, percent(preValidation?.firstPassVimReadinessPercent)),
      stat: pending(preValidation, count(preValidation?.preventedVimExceptions)),
    },
    'PO & Line Matching': {
      value: pending(matching, percent(matching?.lineMatchRate?.percentage)),
      stat: pending(matching, count(matching?.toleranceExceptions)),
    },
    'Exception Recommendations': {
      value: pending(exceptions, count(exceptions?.recommendations)),
      target: avgConfidence == null ? `Confidence ${NO_VALUE}` : `${percent(avgConfidence)} Confidence`,
      stat: pending(exceptions, count(exceptions?.beyondSla)),
    },
    'Prioritization & Analytics': {
      value: pending(exceptions, count(exceptions?.openExceptions)),
      target: pending(exceptions, `${count(exceptions?.atRiskOfLatePayment)} Late-Payment Risk${
        num(exceptions?.atRiskOfLatePayment) === 1 ? '' : 's'
      }`),
      stat: pending(exceptions, count(exceptions?.unassigned)),
    },
  }

  // targetHighlight is a slice offset into the mock's own target string, so it
  // has to go with it — left in place it re-prints the sample number.
  return definitions.map((card) => ({
    ...card,
    targetHighlight: null,
    ...(byTitle[card.title] ?? { value: NO_VALUE, stat: NO_VALUE }),
  }))
}

// ---------------------------------------------------------------------------
// Process Bottlenecks & Diagnostics
// ---------------------------------------------------------------------------

// The rules that failed pre-validation, as a share of all failures — the same
// drivers the Pre-Validation page charts.
export function buildBottlenecks(payload) {
  const drivers = payload?.topRuleFailureDrivers
  if (!Array.isArray(drivers) || drivers.length === 0) return null
  return drivers.map((row) => ({ label: row.rule ?? NO_VALUE, value: Math.round(num(row.percentOfFailures) ?? 0) }))
}

// Header and line accuracy are live; vendor accuracy and corrections retained
// have no source, so they say so rather than carrying yesterday's mock.
export function buildDiagnostics(extraction) {
  return [
    { icon: 'clipboard', label: 'Header Accuracy', value: pending(extraction, percent(extraction?.headerAccuracy)) },
    { icon: 'list', label: 'Line Accuracy', value: pending(extraction, percent(extraction?.lineAccuracy)) },
    { icon: 'search', label: 'Extraction Accuracy', value: pending(extraction, percent(extraction?.overallExtractionAccuracy)) },
    {
      icon: 'check',
      label: 'Average Extraction Time',
      value: pending(extraction, extraction?.averageExtractionTimeMinutes == null ? NO_VALUE : `${extraction.averageExtractionTimeMinutes} Min`),
    },
  ]
}

// Value at risk is the money sitting in open exceptions — the amounts on the
// rows themselves, not a modelled figure.
export function buildIntervention({ exceptions, rows = [], avgConfidence, amountAtRisk }) {
  const recommendations = num(exceptions?.recommendations)

  return {
    description:
      exceptions == null
        ? 'Loading recommendations…'
        : `Review ${count(recommendations ?? rows.length)} evidence-based recommendation${(recommendations ?? rows.length) === 1 ? '' : 's'}`,
    confidence: avgConfidence == null ? NO_VALUE : percent(avgConfidence),
    valueAtRisk: money(amountAtRisk),
  }
}

// ---------------------------------------------------------------------------
// MVP Value Realization
// ---------------------------------------------------------------------------

export function buildValueRealization({ triage, preValidation, exceptions }) {
  const value = triage?.valueDelivered
  const summary = exceptions?.recommendationSummary
  const decimal = (n) => (num(n) == null ? NO_VALUE : String(num(n)))

  return [
    { icon: 'users', value: pending(triage, decimal(value?.fteEquivalent)), label: 'FTEs', title: 'FTE Capacity Released' },
    { icon: 'clock', value: pending(triage, decimal(value?.hoursPerDayAvoided)), label: 'Hours / Day', title: 'Manual Hours Avoided' },
    {
      icon: 'shield',
      value: pending(preValidation, count(preValidation?.preventedVimExceptions)),
      label: 'Exceptions',
      title: 'VIM Exceptions Prevented',
    },
    {
      icon: 'trend',
      value: pending(exceptions, percent(summary?.cycleTimeReductionPercent)),
      label: 'Improvement',
      title: 'Cycle Time Reduced',
    },
    // No value model behind an annualised figure.
    { icon: 'dollar', value: NO_VALUE, label: 'Value', title: 'Annualized Value' },
  ]
}

export function buildValueFooter({ exceptions }) {
  const summary = exceptions?.recommendationSummary
  return [
    { label: 'Late-Payment Exposure Avoided', value: pending(exceptions, money(summary?.latePaymentExposureAvoided)) },
    { label: 'Minutes Saved per Invoice', value: pending(exceptions, count(summary?.minutesSaved)) },
    { label: 'Processing Cost Reduction', value: NO_VALUE },
    { label: 'Discount Opportunity Protected', value: NO_VALUE },
  ]
}
