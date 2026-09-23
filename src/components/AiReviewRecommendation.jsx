import { CheckCircle2 } from 'lucide-react'
import { aiReviewRecommendation, aiReviewActions } from '../data'

// Live exceptions carry Evidence, Required Approval and Prohibited Actions as
// raw JSON strings — render them formatted instead of a wall of unformatted
// text. Falls back to plain text for the mock's canned sentences, which
// aren't JSON.
function tryParseJson(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null
  try {
    return JSON.parse(trimmed)
  } catch {
    return null
  }
}

function EvidenceNode({ label, value, depth = 0 }) {
  if (value === null || typeof value !== 'object') {
    return (
      <div className="evidence-row" style={{ paddingLeft: depth * 12 }}>
        {label != null && <span className="evidence-key">{label}:</span>}
        <span className="evidence-value">{value === null || value === undefined || value === '' ? '—' : String(value)}</span>
      </div>
    )
  }

  const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value)
  if (entries.length === 0) {
    return (
      <div className="evidence-row" style={{ paddingLeft: depth * 12 }}>
        {label != null && <span className="evidence-key">{label}:</span>}
        <span className="evidence-value">—</span>
      </div>
    )
  }

  return (
    <div className="evidence-group" style={{ paddingLeft: depth * 12 }}>
      {label != null && (
        <div className="evidence-group-label">{Array.isArray(value) ? `${label} (${value.length})` : label}</div>
      )}
      {entries.map(([key, val]) => (
        <EvidenceNode key={key} label={Array.isArray(value) ? null : key} value={val} depth={depth + 1} />
      ))}
    </div>
  )
}

function isPrimitiveArray(value) {
  return Array.isArray(value) && value.every((v) => v === null || typeof v !== 'object')
}

// Handles all three JSON-blob fields: a flat array like Required Approval /
// Prohibited Actions reads better as a plain comma list, while Evidence's
// nested invoice/PO/GR shape gets the indented tree.
function JsonOrText({ raw }) {
  const parsed = tryParseJson(raw)
  if (parsed === null || typeof parsed !== 'object') {
    return <p>{raw}</p>
  }
  if (isPrimitiveArray(parsed)) {
    return <p>{parsed.length ? parsed.join(', ') : '—'}</p>
  }
  return (
    <div className="ai-review-evidence">
      <EvidenceNode value={parsed} />
    </div>
  )
}

function recommendationFor(exception) {
  if (!exception) return aiReviewRecommendation
  if (exception.invoice === aiReviewRecommendation.invoiceId) return aiReviewRecommendation

  // Live exceptions carry their own recommendation from the CAP entity —
  // use it in place of the generic fallback below when it's there.
  if (exception.recommendation) {
    return {
      invoiceId: exception.invoice,
      vendor: exception.vendor,
      amount: exception.amount,
      issue: exception.issue,
      recommendation: exception.recommendation,
      confidence: exception.confidence ?? '—',
      evidenceUsed: exception.evidenceUsed ?? '—',
      requiredApproval: exception.requiredApproval ?? '—',
      prohibitedActions: exception.prohibitedActions ?? '—',
    }
  }

  return {
    invoiceId: exception.invoice,
    vendor: exception.vendor,
    amount: exception.amount,
    issue: exception.issue,
    recommendation: `Review required: "${exception.issue}" flagged for ${exception.vendor}. Confirm resolution before posting to SAP.`,
    confidence: '—',
    evidenceUsed: 'Invoice record, vendor master, exception log',
    requiredApproval: 'AP Processor',
    prohibitedActions: 'No autonomous posting until reviewed',
  }
}

export default function AiReviewRecommendation({ exception, posted, onPostToSap }) {
  const r = recommendationFor(exception)

  return (
    <section className="panel ai-review-recommendation">
      <h2 className="panel-title">AI Review Recommendation</h2>

      <div className="ai-review-heading">
        Invoice {r.invoiceId} | {r.vendor} | {r.amount}
      </div>

      {r.issue && (
        <div className="ai-review-block">
          <div className="ai-review-label">Exception Details:</div>
          <p>{r.issue}</p>
        </div>
      )}

      <div className="ai-review-block">
        <div className="ai-review-label">Recommendation:</div>
        <p>{r.recommendation}</p>
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Confidence:</div>
        <span className="color-green ai-review-confidence">{r.confidence}</span>
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Evidence Used:</div>
        <JsonOrText raw={r.evidenceUsed} />
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Required Approval:</div>
        <JsonOrText raw={r.requiredApproval} />
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Prohibited Actions:</div>
        <JsonOrText raw={r.prohibitedActions} />
      </div>

      <div className="ai-review-actions">
        {aiReviewActions.map((a) => (
          <button key={a.label} className={a.variant === 'primary' ? 'btn-primary' : 'btn-outline'}>
            {a.label}
          </button>
        ))}
        {posted ? (
          <span className="ai-review-posted">
            <CheckCircle2 size={14} /> Posted to SAP
          </span>
        ) : (
          <button className="btn-primary" onClick={onPostToSap}>
            Post to SAP
          </button>
        )}
      </div>
    </section>
  )
}
