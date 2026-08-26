import {
  X,
  ArrowLeft,
  FileText,
  Users,
  GitBranch,
  CheckCircle2,
  BarChart3,
  DollarSign,
  Database,
  UserCheck,
  Scale,
  FileCheck2,
  Target,
  Settings,
  ExternalLink,
  Clock,
  AlertTriangle,
} from 'lucide-react'

const sectionIconMap = {
  fileText: FileText,
  users: Users,
  gitBranch: GitBranch,
  checkCircle: CheckCircle2,
  barChart: BarChart3,
  dollar: DollarSign,
  database: Database,
  userCheck: UserCheck,
  scale: Scale,
  fileCheck: FileCheck2,
  target: Target,
  settings: Settings,
  clock: Clock,
  alertTriangle: AlertTriangle,
}

function SectionHeading({ icon, heading }) {
  const Icon = sectionIconMap[icon]
  return (
    <h3>
      {Icon && <Icon size={13} className="guidance-heading-icon" />}
      <span>{heading}</span>
    </h3>
  )
}

function Section({ section }) {
  return (
    <div className="guidance-section">
      <SectionHeading icon={section.icon} heading={section.heading} />

      {section.type === 'text' && <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>}

      {section.type === 'pills' && (
        <div className="pill-row">
          {section.items.map((p) => (
            <span className="pill" key={p}>
              {p}
            </span>
          ))}
        </div>
      )}

      {section.type === 'bullets' && (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {section.type === 'numbered' && (
        <ol>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )}

      {section.type === 'table' && (
        <table className="guidance-table">
          <thead>
            <tr>
              <th>Measure</th>
              <th>Current</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td className="color-blue">{row.current}</td>
                <td>{row.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {section.type === 'keyvalue' && (
        <>
          {section.items.map((item) => (
            <div className="ownership-row" key={item.label}>
              <span className="ownership-label">{item.label}</span>
              <span className="ownership-value">{item.value}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default function GuidancePanel({ guidance, onClose }) {
  const CloseIcon = guidance.closeIcon === 'arrowLeft' ? ArrowLeft : X

  return (
    <aside className="guidance-panel">
      <div className={`guidance-header${guidance.closeIcon === 'arrowLeft' ? ' guidance-header-leading' : ''}`}>
        {guidance.closeIcon === 'arrowLeft' && (
          <button className="icon-btn" onClick={onClose} aria-label="Back">
            <CloseIcon size={18} />
          </button>
        )}
        <h2>{guidance.title}</h2>
        {guidance.closeIcon !== 'arrowLeft' && (
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {guidance.sections.map((section) => (
        <Section section={section} key={section.heading} />
      ))}

      <button className="btn-primary btn-block btn-icon-label">
        {guidance.footerButton}
        <ExternalLink size={14} />
      </button>
    </aside>
  )
}
