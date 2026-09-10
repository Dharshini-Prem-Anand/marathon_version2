// The KPI endpoints return more than the tile row: each one also carries the
// panels that sit under it. These mappers reshape those payload sections into
// the props the existing panels render, so the panels themselves stay dumb.
//
//   /exceptionKpis      -> whatIfResolutionScenarios, recommendationSummary
//   /preValidationKpis  -> topRuleFailureDrivers, preventedDownstreamVimExceptions
//                          (tiles nested under preValidationKpis)
//   /triageKpis         -> intakeByChannel, valueDelivered

const num = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

// 0.7 -> "0.7", 4 -> "4", 0.01 -> "0.01" — no trailing zeros invented.
const decimal = (value) => {
  const n = num(value)
  if (n == null) return '—'
  return Number.isInteger(n) ? String(n) : String(n)
}

const percentText = (value) => {
  const n = num(value)
  return n == null ? '—' : `${Math.round(n)}%`
}

const currency = (value) => {
  const n = num(value)
  return n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

// Round figures read better without cents ($4,200, not $4,200.00); anything
// with a fractional part keeps them.
const currencyCompact = (value) => {
  const n = num(value)
  if (n == null) return '—'
  return Number.isInteger(n)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : currency(n)
}

// ---------------------------------------------------------------------------
// /preValidationKpis
// ---------------------------------------------------------------------------

// The tile numbers moved under their own key; older payloads had them at the
// top level, so both shapes are accepted.
export function preValidationTilePayload(payload) {
  if (!payload || typeof payload !== 'object') return payload
  return payload.preValidationKpis ?? payload
}

// Biggest drivers read hottest. Colour follows the share of failures rather
// than the row's position, so two drivers tied at 50% look alike.
function driverColor(percent) {
  const n = num(percent) ?? 0
  if (n >= 30) return 'red'
  if (n >= 15) return 'orange'
  if (n >= 5) return 'yellow'
  return 'gray'
}

export function mapRuleFailureDrivers(payload) {
  const rows = payload?.topRuleFailureDrivers
  if (!Array.isArray(rows)) return null
  return rows.map((row) => ({
    driver: row.rule ?? '—',
    invoices: num(row.invoices) ?? 0,
    percent: Math.round(num(row.percentOfFailures) ?? 0),
    color: driverColor(row.percentOfFailures),
  }))
}

export function mapPreventedExceptions(payload) {
  const rows = payload?.preventedDownstreamVimExceptions
  if (!Array.isArray(rows)) return null
  return rows.map((row) => ({
    type: row.exceptionType ?? '—',
    prevented: num(row.prevented) ?? 0,
    percent: Math.round(num(row.percentOfTotal) ?? 0),
  }))
}

// ---------------------------------------------------------------------------
// /exceptionKpis
// ---------------------------------------------------------------------------

const RISK_COLOR = { high: 'red', medium: 'orange', low: 'green' }

export function mapWhatIfScenarios(payload) {
  const rows = payload?.whatIfResolutionScenarios
  if (!Array.isArray(rows)) return null

  return rows.map((row) => {
    // A blocked scenario is called out even when it looks cheapest; the
    // recommended one is the only green row.
    const blocked = row.allowed === false
    const recommended = row.recommended === true
    const emphasis = recommended ? 'green' : blocked ? 'red' : null

    return {
      tag: recommended ? 'recommended' : blocked ? 'not-allowed' : null,
      scenario: row.scenario ?? '—',
      action: row.action ?? '—',
      cycleTime: num(row.cycleTimeDays) == null ? '—' : `${decimal(row.cycleTimeDays)} days`,
      manualMinutes: num(row.manualMinutes) == null ? '—' : `${decimal(row.manualMinutes)} min`,
      latePaymentRisk: row.latePaymentRisk ?? '—',
      latePaymentRiskColor: RISK_COLOR[String(row.latePaymentRisk ?? '').toLowerCase()] ?? 'gray',
      estimatedCost: currency(row.estimatedCost),
      controlStatus: row.controlStatus ?? '—',
      rowStyle: emphasis,
      valueColor: emphasis ?? undefined,
    }
  })
}

export function mapRecommendationSummary(payload) {
  const summary = payload?.recommendationSummary
  if (!summary || typeof summary !== 'object') return null

  const name = summary.recommendedScenario ? ` (${summary.recommendedScenario})` : ''
  const minutes = num(summary.minutesSaved)
  const reduction = num(summary.cycleTimeReductionPercent)
  const exposure = num(summary.latePaymentExposureAvoided)

  const parts = []
  if (minutes != null) parts.push(`saves ${minutes} minutes`)
  if (reduction != null) parts.push(`reduces cycle time by ${Math.round(reduction)}%`)
  if (exposure != null) parts.push(`avoids estimated late-payment exposure of ${currencyCompact(exposure)}`)
  if (parts.length === 0) return null

  const sentence = parts.length > 1 ? `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}` : parts[0]
  return `Recommended scenario${name} ${sentence}.`
}

// ---------------------------------------------------------------------------
// /triageKpis
// ---------------------------------------------------------------------------

// Fixed order and colour per channel — the donut's legend reads the same
// whichever channels happen to have volume.
const CHANNELS = [
  { key: 'email', label: 'Email', color: 'blue' },
  { key: 'vendorPortal', label: 'Vendor Portal', color: 'purple' },
  { key: 'edi', label: 'EDI', color: 'green' },
  { key: 'upload', label: 'Upload', color: 'orange' },
]

export function mapIntakeByChannel(payload) {
  const intake = payload?.intakeByChannel
  if (!intake || typeof intake !== 'object') return null

  const total = num(intake.total) ?? CHANNELS.reduce((sum, c) => sum + (num(intake[c.key]) ?? 0), 0)
  const channels = CHANNELS.map((c) => {
    const value = num(intake[c.key]) ?? 0
    return { label: c.label, value, percent: total > 0 ? Math.round((value / total) * 100) : 0, color: c.color }
  })
  return { channels, total }
}

export function mapValueDelivered(payload) {
  const value = payload?.valueDelivered
  if (!value || typeof value !== 'object') return null
  return [
    { icon: 'users', label: 'FTE Opportunity', value: decimal(value.fteEquivalent) },
    { icon: 'clock', label: 'Hours / Day Avoided', value: decimal(value.hoursPerDayAvoided) },
    { icon: 'checkCircle', label: 'Automation Captured', value: percentText(value.automationCapturedPercent) },
  ]
}

// ---------------------------------------------------------------------------
// /getExtractionKpis and /matchingkpis
// ---------------------------------------------------------------------------

export function mapFormatPerformance(payload) {
  const rows = payload?.formatPerformance
  if (!Array.isArray(rows)) return null
  return rows.map((row) => ({
    label: row.format ?? '—',
    value: Math.round(num(row.accuracy) ?? 0),
  }))
}

// Header / line match rates arrive as { percentage, matched, total }; the panel
// shows the percentage over the fraction it came from.
export function mapMatchingPerformance(payload) {
  const rates = [
    ['Header Match Rate', payload?.headerMatchRate],
    ['Line Match Rate', payload?.lineMatchRate],
  ].filter(([, rate]) => rate && typeof rate === 'object')
  if (rates.length === 0) return null

  return rates.map(([label, rate]) => {
    const pct = num(rate.percentage)
    return {
      label,
      percent: pct == null ? '—' : `${pct.toFixed(1)}%`,
      fraction: `(${(num(rate.matched) ?? 0).toLocaleString()} / ${(num(rate.total) ?? 0).toLocaleString()})`,
    }
  })
}
