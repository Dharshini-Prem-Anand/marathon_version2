import { CheckCircle2 } from 'lucide-react'
import { aiReviewRecommendation, aiReviewActions } from '../data'

function recommendationFor(exception) {
  if (!exception) return aiReviewRecommendation
  if (exception.invoice === aiReviewRecommendation.invoiceId) return aiReviewRecommendation

  return {
    invoiceId: exception.invoice,
    vendor: exception.vendor,
    amount: exception.amount,
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
        <p>{r.evidenceUsed}</p>
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Required Approval:</div>
        <p>{r.requiredApproval}</p>
      </div>

      <div className="ai-review-block">
        <div className="ai-review-label">Prohibited Actions:</div>
        <p>{r.prohibitedActions}</p>
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
