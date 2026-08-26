import { learningGovernance } from '../data'

export default function LearningGovernanceRow() {
  return (
    <section className="panel">
      <h2 className="panel-title">Learning &amp; Governance</h2>
      <div className="learning-governance-grid">
        {learningGovernance.map((m) => (
          <div className="learning-governance-card" key={m.label}>
            <div className="learning-governance-label">{m.label}</div>
            <div className={`learning-governance-value${m.valueColor ? ` color-${m.valueColor}` : ''}`}>
              {m.value}
            </div>
            <div className="learning-governance-target">{m.target}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
