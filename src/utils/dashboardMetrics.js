// Derives the Dashboard's scorecard, flow, capability, bottleneck and value-realization
// widgets from whatever subset of priorityQueue rows survives the active filters. When no
// filter is applied, Dashboard.jsx uses the hand-tuned baseline data from data.js instead
// (so the default view stays pixel-identical to the designed mock) — this function only runs
// once the user has narrowed the data with the filter bar.

const flowStepLabels = [
  'Email Received',
  'Documents Received',
  'Auto-Triaged',
  'Extracted',
  'PO / Validated',
  'Ready for VIM',
  'Posted',
]
const flowStepBaseline = [2600, 2600, 2314, 2244, 2180, 1928, 1874]

const valueRealizationBaseline = {
  fte: 4.2,
  hours: 6800,
  exceptions: 1240,
  cycleTimeImprovementPct: 31,
  annualValue: 1200000,
}

const valueFooterBaseline = {
  processingCostReduction: 420000,
  latePaymentExposureAvoided: 124000,
  discountOpportunityProtected: 86000,
}

function formatMoney(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  return `$${Math.max(1, Math.round(value / 1000))}K`
}

export function computeDashboardMetrics(rows, totalRowCount) {
  const n = rows.length
  if (n === 0) return null

  const count = (predicate) => rows.filter(predicate).length
  const pct = (c) => Math.round((c / n) * 100)
  const avg = (key) => rows.reduce((sum, r) => sum + r[key], 0) / n

  const touchlessCount = count((r) => r.touchless)
  const triagedCount = count((r) => r.triaged)
  const vimReadyCount = count((r) => r.vimReady)
  const lineMatchCount = count((r) => r.lineMatch)
  const exceptionCount = count((r) => r.exception)
  const lateRiskCount = count((r) => r.lateRisk)
  const lowConfidenceCount = count((r) => r.extractionConfidence < 90)
  const unassignedCount = count((r) => !r.owner)
  const avgConfidence = Math.round(avg('extractionConfidence'))

  const scorecardMetrics = [
    { label: 'Touchless Invoice Processing', value: `${pct(touchlessCount)}%`, target: 'Target 80%', trend: 'up', color: 'blue' },
    { label: 'First-Pass VIM Readiness', value: `${pct(vimReadyCount)}%`, target: 'Target 95%', trend: 'up', color: 'green' },
    { label: 'Cost per Invoice', value: `$${avg('costPerInvoice').toFixed(2)}`, target: 'Target $5.50', trend: 'down', color: 'orange' },
    { label: 'Intake-to-VIM Cycle Time', value: `${avg('cycleTimeDays').toFixed(1)} Days`, target: 'Target 1.5', trend: 'down', color: 'blue' },
    { label: 'Human Touches per Invoice', value: avg('humanTouches').toFixed(1), target: 'Target 0.8', trend: 'down', color: 'red' },
    { label: 'Extraction & Validation Accuracy', value: `${avgConfidence}%`, target: 'Target 98%', trend: 'up', color: 'green' },
  ]

  const ratio = n / totalRowCount
  const scaleCount = (base) => Math.max(1, Math.round(base * ratio)).toLocaleString()

  const flowSteps = flowStepLabels.map((label, i) => ({ label, value: scaleCount(flowStepBaseline[i]) }))

  const postedValue = Math.max(1, Math.round(flowStepBaseline[5] * ratio))
  const touchlessLegend = Math.round((postedValue * touchlessCount) / n)
  const exceptionsLegend = Math.round((postedValue * exceptionCount) / n)
  const humanReviewLegend = Math.max(0, postedValue - touchlessLegend - exceptionsLegend)
  const flowLegend = [
    { label: 'Touchless', value: touchlessLegend.toLocaleString(), color: 'blue' },
    { label: 'Human Review', value: humanReviewLegend.toLocaleString(), color: 'orange' },
    { label: 'Exceptions', value: exceptionsLegend.toLocaleString(), color: 'red' },
  ]

  const capabilityCards = [
    {
      icon: 'mail', title: 'Email & Attachment Triage', value: `${pct(triagedCount)}%`, valueLabel: 'Auto-Triaged',
      target: 'Target 95%', stat: String(n - triagedCount), statLabel: 'Manual Reviews', statColor: 'red',
    },
    {
      icon: 'fileText', title: 'Document AI & Extraction', value: `${avgConfidence}%`, valueLabel: 'Extraction Accuracy',
      target: 'Target 98%', stat: String(lowConfidenceCount), statLabel: 'Low-Confidence', statColor: 'orange',
    },
    {
      icon: 'checkCircle', title: 'Pre-Validation', value: `${pct(vimReadyCount)}%`, valueLabel: 'First-Pass Ready',
      target: 'Target 95%', stat: String(vimReadyCount), statLabel: 'Prevented VIM Exceptions', statColor: 'green',
    },
    {
      icon: 'link', title: 'PO & Line Matching', value: `${pct(lineMatchCount)}%`, valueLabel: 'Line Match',
      target: 'Target 90%', stat: String(n - lineMatchCount), statLabel: 'Exceptions', statColor: 'red',
    },
    {
      icon: 'lightbulb', title: 'Exception Recommendations', value: String(exceptionCount), valueLabel: 'Recommendations',
      target: '92% Confidence', targetColor: 'green',
      stat: String(count((r) => r.exception && r.lateRisk)), statLabel: 'Beyond SLA', statColor: 'red',
    },
    {
      icon: 'barChart', title: 'Prioritization & Analytics', value: String(n), valueLabel: 'Priority Items',
      target: `${lateRiskCount} Late-Payment Risks`, targetHighlight: String(lateRiskCount), targetColor: 'orange',
      stat: String(unassignedCount), statLabel: 'Unassigned', statColor: 'orange',
    },
  ]

  const issueCounts = {}
  rows.forEach((r) => {
    issueCounts[r.issue] = (issueCounts[r.issue] || 0) + 1
  })
  const bottlenecks = Object.entries(issueCounts)
    .map(([label, c]) => ({ label, value: pct(c) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const exceptionRows = rows.filter((r) => r.exception)
  const recommendationConfidence = exceptionRows.length
    ? Math.round(exceptionRows.reduce((sum, r) => sum + r.extractionConfidence, 0) / exceptionRows.length)
    : avgConfidence
  const intervention = {
    description: bottlenecks[0]
      ? `Review ${exceptionCount} evidence-based recommendation${exceptionCount === 1 ? '' : 's'} for ${bottlenecks[0].label}`
      : `Review ${exceptionCount} evidence-based recommendations`,
    confidence: `${recommendationConfidence}%`,
    valueAtRisk: formatMoney(valueFooterBaseline.processingCostReduction * ratio),
  }

  const valueRealization = [
    { icon: 'users', value: (valueRealizationBaseline.fte * ratio).toFixed(1), label: 'FTEs', title: 'FTE Capacity Released' },
    { icon: 'clock', value: scaleCount(valueRealizationBaseline.hours), label: 'Hours', title: 'Manual Hours Avoided' },
    { icon: 'shield', value: scaleCount(valueRealizationBaseline.exceptions), label: 'Exceptions', title: 'VIM Exceptions Prevented' },
    { icon: 'trend', value: `${Math.max(1, Math.round(valueRealizationBaseline.cycleTimeImprovementPct * ratio))}%`, label: 'Improvement', title: 'Cycle Time Reduced' },
    { icon: 'dollar', value: formatMoney(valueRealizationBaseline.annualValue * ratio), label: 'Value', title: 'Annualized Value' },
  ]

  const valueFooter = [
    { label: 'Processing Cost Reduction', value: formatMoney(valueFooterBaseline.processingCostReduction * ratio) },
    { label: 'Late-Payment Exposure Avoided', value: formatMoney(valueFooterBaseline.latePaymentExposureAvoided * ratio) },
    { label: 'Discount Opportunity Protected', value: formatMoney(valueFooterBaseline.discountOpportunityProtected * ratio) },
    { label: 'Reconciliation', value: '100%' },
  ]

  return { scorecardMetrics, flowSteps, flowLegend, capabilityCards, bottlenecks, intervention, valueRealization, valueFooter }
}
