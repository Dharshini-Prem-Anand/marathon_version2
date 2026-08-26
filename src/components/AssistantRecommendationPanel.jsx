import { CheckCircle2, FileText, Users, ShoppingCart, History, ShieldCheck, User, Ban, Pencil, X } from 'lucide-react'
import { assistantRecommendation } from '../data'

const evidenceIconMap = {
  fileText: FileText,
  users: Users,
  cart: ShoppingCart,
  history: History,
  shield: ShieldCheck,
}

const actionIconMap = {
  check: CheckCircle2,
  pencil: Pencil,
  x: X,
  fileText: FileText,
}

const variantClass = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  'outline-red': 'btn-outline btn-outline-red',
}

export default function AssistantRecommendationPanel() {
  const r = assistantRecommendation

  return (
    <section className="panel assistant-recommendation">
      <div className="assistant-rec-header">
        <div className="assistant-rec-heading">
          <CheckCircle2 size={22} className="color-green" />
          <div>
            <h2 className="panel-title assistant-rec-title">{r.title}</h2>
            <p className="assistant-rec-text">{r.recommendation}</p>
          </div>
        </div>
        <div className="assistant-rec-confidence">
          <div className="assistant-rec-confidence-value">{r.confidence}</div>
          <div className="assistant-rec-confidence-label">confidence</div>
        </div>
      </div>

      <div className="assistant-rec-columns">
        <div className="assistant-rec-col">
          <h3 className="assistant-rec-col-heading">Evidence Used</h3>
          <ol className="assistant-evidence-list">
            {r.evidenceUsed.map((e, i) => {
              const Icon = evidenceIconMap[e.icon]
              return (
                <li key={e.text}>
                  <Icon size={14} />
                  <span className="assistant-evidence-num">{i + 1}</span>
                  {e.text}
                </li>
              )
            })}
          </ol>
        </div>

        <div className="assistant-rec-col">
          <h3 className="assistant-rec-col-heading">Required Approvals</h3>
          <ul className="assistant-approval-list">
            {r.requiredApprovals.map((a) => (
              <li key={a}>
                <User size={14} />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="assistant-rec-col">
          <h3 className="assistant-rec-col-heading color-red">Prohibited Actions</h3>
          <ul className="assistant-prohibited-list">
            {r.prohibitedActions.map((a) => (
              <li key={a}>
                <Ban size={14} />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="assistant-rec-actions">
        {r.actions.map((a) => {
          const Icon = actionIconMap[a.icon]
          return (
            <button key={a.label} className={`btn-icon-label ${variantClass[a.variant]}`}>
              <Icon size={14} />
              {a.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
