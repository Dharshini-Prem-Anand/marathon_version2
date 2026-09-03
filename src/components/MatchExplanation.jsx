import { Loader2 } from 'lucide-react'

export default function MatchExplanation({ explanation, loading }) {
  if (loading) {
    return (
      <section className="panel match-explanation">
        <h2 className="panel-title">Match Explanation</h2>
        <div className="match-explanation-loading">
          <Loader2 size={20} className="spin-icon" />
          <span>Loading match explanation…</span>
        </div>
      </section>
    )
  }

  if (!explanation) {
    return (
      <section className="panel match-explanation">
        <h2 className="panel-title">Match Explanation</h2>
        <div className="table-empty-cell">Select an invoice from the queue.</div>
      </section>
    )
  }

  return (
    <section className="panel match-explanation">
      <h2 className="panel-title">Match Explanation</h2>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Recommended action:</div>
        <p>{explanation.recommendedAction}</p>
      </div>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Confidence</div>
        <div className="match-confidence-value">{explanation.confidence}</div>
      </div>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Evidence:</div>
        <p>{explanation.evidence}</p>
      </div>
    </section>
  )
}
