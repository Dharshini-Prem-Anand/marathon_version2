import { preValidationActions } from '../data'

export default function ActionButtonsRow() {
  return (
    <div className="pv-actions">
      {preValidationActions.map((a) => (
        <button key={a.label} className={a.variant === 'primary' ? 'btn-primary' : 'btn-outline'}>
          {a.label}
        </button>
      ))}
    </div>
  )
}
