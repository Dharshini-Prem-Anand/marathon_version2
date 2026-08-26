import { aiReviewRecommendation, aiReviewActions } from '../data'

export default function AiReviewRecommendation() {
  const r = aiReviewRecommendation

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
      </div>
    </section>
  )
}
