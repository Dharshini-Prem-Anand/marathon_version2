import { Sparkles } from 'lucide-react'
import { aiReassignment } from '../data'

export default function AiReassignmentPanel() {
  return (
    <section className="panel ai-reassignment-panel">
      <h2 className="panel-title ai-reassignment-title">
        <Sparkles size={16} className="color-green" />
        {aiReassignment.title}
      </h2>

      <p className="ai-reassignment-description">{aiReassignment.description}</p>
      <p className="ai-reassignment-expected">{aiReassignment.expectedResult}</p>

      <div className="ai-reassignment-actions">
        {aiReassignment.actions.map((a) => (
          <button key={a.label} className={a.variant === 'primary' ? 'btn-primary btn-block' : 'btn-outline btn-block'}>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  )
}
