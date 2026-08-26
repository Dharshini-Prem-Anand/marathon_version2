export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header-row">
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && (
        <div className="page-header-actions">
          {actions.map((a) => (
            <button key={a.label} className={a.variant === 'primary' ? 'btn-primary' : 'btn-outline'}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
