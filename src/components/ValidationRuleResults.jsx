import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

const resultConfig = {
  passed: { icon: CheckCircle2, color: 'green', label: 'Passed' },
  review: { icon: AlertTriangle, color: 'orange', label: 'Review' },
  failed: { icon: XCircle, color: 'red', label: 'Failed' },
}

export default function ValidationRuleResults({ rules = [] }) {
  return (
    <section className="panel pv-rules">
      <h2 className="panel-title">Validation Rule Results</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Category</th>
              <th>Rule</th>
              <th>Result</th>
              <th>Conf.</th>
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => {
              const cfg = resultConfig[r.result]
              const Icon = cfg.icon
              return (
                <tr key={r.category}>
                  <td className="cell-ellipsis" title={r.category}>
                    {r.category}
                  </td>
                  <td className="cell-ellipsis" title={r.rule}>
                    {r.rule}
                  </td>
                  <td>
                    <span className={`result-cell color-${cfg.color}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
                  </td>
                  <td>{r.confidence}</td>
                  <td className={`cell-ellipsis${r.issue !== '—' ? ' color-red' : ''}`} title={r.issue}>
                    {r.issue}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
