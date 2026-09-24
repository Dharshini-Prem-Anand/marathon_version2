// The Dashboard on live data.
//
// /touchlesscount now returns one consolidated payload — touchlessCount,
// humanReview and the businessOutcomeScorecard, mvpCapabilityPerformance,
// processBottlenecksDiagnostics and mvpValueRealization sections — and that
// payload is the single source for the Business Outcome Scorecard, MVP
// Capability Performance, Process Bottlenecks & Diagnostics and MVP Value
// Realization panels below.
//
// Two things on this page still come from elsewhere: PipelineStatus, the run
// record behind every document, which the End-to-End flow strip is a direct
// picture of; and /matchingkpis + /exceptionKpis, which fill in "Ready for
// VIM" and "Exceptions" on the flow legend. Targets are configuration, not
// data, so they stay as written. Any figure the service hasn't modelled yet
// (cost per invoice, annualised value, ...) comes back null and renders '—'.

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

// intakeToVimCycleTimeHours comes back as a fraction of an hour for a live
// run, so it needs the same Min/Hrs/Days unit-picking as cycleTimeLabel.
const hoursLabel = (hours) => {
  const h = num(hours)
  if (h == null) return NO_VALUE
  const minutes = h * 60
  if (minutes < 60) return `${minutes.toFixed(1)} Min`
  if (h < 24) return `${h.toFixed(1)} Hrs`
  return `${(h / 24).toFixed(1)} Days`
}

const decimal = (value) => {
  const n = num(value)
  return n == null ? NO_VALUE : n.toFixed(1)
}

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
export function buildScorecard(definitions, { touchlessCount }) {
  const scorecard = touchlessCount?.businessOutcomeScorecard

  const values = {
    'Touchless Invoice Processing': pending(touchlessCount, percent(scorecard?.touchlessInvoiceProcessingPercent)),
    'First-Pass VIM Readiness': pending(touchlessCount, percent(scorecard?.firstPassVimReadinessPercent)),
    'Cost per Invoice': pending(touchlessCount, money(scorecard?.costPerInvoice)),
    'Intake-to-VIM Cycle Time': pending(touchlessCount, hoursLabel(scorecard?.intakeToVimCycleTimeHours)),
    'Human Touches per Invoice': pending(touchlessCount, decimal(scorecard?.humanTouchesPerInvoice)),
    'Extraction & Validation Accuracy': pending(touchlessCount, percent(scorecard?.extractionValidationAccuracyPercent)),
  }

  return definitions.map((metric) => ({ ...metric, value: values[metric.label] ?? NO_VALUE, trend: null }))
}

// ---------------------------------------------------------------------------
// End-to-End Invoice Flow
// ---------------------------------------------------------------------------

// Email Received is the same number as Email & Attachment Triage's Emails
// Received tile (/triageKpis). The rest are the pipeline's own stages, in
// order; Ready for VIM is the one the pipeline doesn't record — that comes
// from the matching service.
export function buildFlowSteps({ funnel, matching, triage, pipelineLoaded }) {
  const stage = (name) => (pipelineLoaded ? count(funnel.stages[name]) : LOADING)

  return [
    { label: 'Email Received', value: pending(triage, count(triage?.emailsReceivedToday)) },
    { label: 'Documents Received', value: pipelineLoaded ? count(funnel.documents) : LOADING },
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

export function buildCapabilityCards(definitions, { touchlessCount }) {
  const capability = touchlessCount?.mvpCapabilityPerformance
  const triage = capability?.emailAttachmentTriage
  const extraction = capability?.documentAiExtraction
  const preValidation = capability?.preValidation
  const matching = capability?.poLineMatching
  const exceptionRecs = capability?.exceptionRecommendations
  const prioritization = capability?.prioritizationAnalytics

  const byTitle = {
    'Email & Attachment Triage': {
      value: pending(touchlessCount, percent(triage?.autoTriagedPercent)),
      stat: pending(touchlessCount, count(triage?.manualReviews)),
    },
    'Document AI & Extraction': {
      value: pending(touchlessCount, percent(extraction?.extractionAccuracyPercent)),
      // The service reports low confidence as a share of documents, so the
      // card's footer reads as a percentage here rather than a count.
      stat: pending(touchlessCount, percent(extraction?.lowConfidencePercent)),
      statLabel: 'Low-Confidence',
    },
    'Pre-Validation': {
      value: pending(touchlessCount, percent(preValidation?.firstPassReadyPercent)),
      stat: pending(touchlessCount, count(preValidation?.preventedVimExceptions)),
    },
    'PO & Line Matching': {
      value: pending(touchlessCount, percent(matching?.lineMatchPercent)),
      stat: pending(touchlessCount, count(matching?.toleranceExceptions)),
    },
    'Exception Recommendations': {
      value: pending(touchlessCount, count(exceptionRecs?.recommendations)),
      target: pending(touchlessCount, `${percent(exceptionRecs?.confidencePercent)} Confidence`),
      stat: pending(touchlessCount, count(exceptionRecs?.beyondSla)),
    },
    'Prioritization & Analytics': {
      value: pending(touchlessCount, count(prioritization?.priorityItems)),
      target: pending(touchlessCount, `${count(prioritization?.atRiskOfLatePayment)} Late-Payment Risk${
        num(prioritization?.atRiskOfLatePayment) === 1 ? '' : 's'
      }`),
      stat: pending(touchlessCount, count(prioritization?.unassigned)),
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

// The three process checks the service tracks as a share of invoices passing
// — the bars on the left of the panel.
export function buildBottlenecks(touchlessCount) {
  const diagnostics = touchlessCount?.processBottlenecksDiagnostics
  if (diagnostics == null) return null
  return [
    { label: 'PO Existence', value: Math.round(num(diagnostics.poExistencePercent) ?? 0) },
    { label: 'Duplicate Check', value: Math.round(num(diagnostics.duplicateCheckPercent) ?? 0) },
    { label: 'Total Reconciliation', value: Math.round(num(diagnostics.totalReconciliationPercent) ?? 0) },
  ]
}

// Header and line accuracy are live; vendor accuracy and corrections retained
// have no source, so they say so rather than carrying yesterday's mock.
export function buildDiagnostics(touchlessCount) {
  const diagnostics = touchlessCount?.processBottlenecksDiagnostics
  return [
    { icon: 'clipboard', label: 'Header Accuracy', value: pending(touchlessCount, percent(diagnostics?.headerAccuracyPercent)) },
    { icon: 'list', label: 'Line Accuracy', value: pending(touchlessCount, percent(diagnostics?.lineAccuracyPercent)) },
    { icon: 'search', label: 'Extraction Accuracy', value: pending(touchlessCount, percent(diagnostics?.extractionAccuracyPercent)) },
    {
      icon: 'check',
      label: 'Average Extraction Time',
      value: pending(touchlessCount, diagnostics?.averageExtractionTimeMinutes == null ? NO_VALUE : `${diagnostics.averageExtractionTimeMinutes} Min`),
    },
  ]
}

// Value at risk is the money the service has tied to its own recommendation.
export function buildIntervention(touchlessCount) {
  const intervention = touchlessCount?.processBottlenecksDiagnostics?.recommendedIntervention
  const recommendations = num(intervention?.recommendations)

  return {
    description:
      touchlessCount == null
        ? 'Loading recommendations…'
        : `Review ${count(recommendations)} evidence-based recommendation${recommendations === 1 ? '' : 's'}`,
    confidence: pending(touchlessCount, percent(intervention?.confidencePercent)),
    valueAtRisk: pending(touchlessCount, money(intervention?.valueAtRisk)),
  }
}

// ---------------------------------------------------------------------------
// MVP Value Realization
// ---------------------------------------------------------------------------

export function buildValueRealization({ touchlessCount }) {
  const value = touchlessCount?.mvpValueRealization

  return [
    { icon: 'users', value: pending(touchlessCount, decimal(value?.fteCapacityReleased)), label: 'FTEs', title: 'FTE Capacity Released' },
    { icon: 'clock', value: pending(touchlessCount, decimal(value?.manualHoursAvoidedPerDay)), label: 'Hours / Day', title: 'Manual Hours Avoided' },
    {
      icon: 'shield',
      value: pending(touchlessCount, count(value?.vimExceptionsPrevented)),
      label: 'Exceptions',
      title: 'VIM Exceptions Prevented',
    },
    {
      icon: 'trend',
      value: pending(touchlessCount, percent(value?.cycleTimeReducedPercent)),
      label: 'Improvement',
      title: 'Cycle Time Reduced',
    },
    { icon: 'dollar', value: pending(touchlessCount, money(value?.annualizedValue)), label: 'Value', title: 'Annualized Value' },
  ]
}

export function buildValueFooter({ touchlessCount }) {
  const value = touchlessCount?.mvpValueRealization
  return [
    { label: 'Late-Payment Exposure Avoided', value: pending(touchlessCount, money(value?.latePaymentExposureAvoided)) },
    { label: 'Minutes Saved per Invoice', value: pending(touchlessCount, count(value?.minutesSavedPerInvoice)) },
    { label: 'Processing Cost Reduction', value: pending(touchlessCount, money(value?.processingCostReduction)) },
    { label: 'Discount Opportunity Protected', value: pending(touchlessCount, money(value?.discountOpportunityProtected)) },
  ]
}
