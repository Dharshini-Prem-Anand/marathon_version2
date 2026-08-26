import { matchExplanation, matchExplanationActions } from '../data'

const variantClass = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  'outline-red': 'btn-outline btn-outline-red',
}

export default function MatchExplanation() {
  return (
    <section className="panel match-explanation">
      <h2 className="panel-title">Match Explanation</h2>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Recommended action:</div>
        <p>{matchExplanation.recommendedAction}</p>
      </div>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Confidence</div>
        <div className="match-confidence-value">{matchExplanation.confidence}</div>
      </div>

      <div className="match-explanation-block">
        <div className="match-explanation-label">Evidence:</div>
        <p>{matchExplanation.evidence}</p>
      </div>

      <div className="match-explanation-actions">
        {matchExplanationActions.map((a) => (
          <button key={a.label} className={`btn-block ${variantClass[a.variant]}`}>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  )
}
