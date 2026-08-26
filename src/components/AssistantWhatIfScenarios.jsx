import { Scale, CheckCircle2, XCircle } from 'lucide-react'
import { assistantWhatIfScenarios } from '../data'

export default function AssistantWhatIfScenarios() {
  const { columns, rows } = assistantWhatIfScenarios

  return (
    <section className="panel">
      <h2 className="panel-title">
        <Scale size={16} className="panel-title-icon" />
        What-if Resolution Scenarios
      </h2>

      <div className="table-wrap">
        <table className="whatif-scenario-table">
          <thead>
            <tr>
              <th></th>
              {columns.map((c) => (
                <th key={c.num} className={c.highlight ? 'whatif-col-highlight' : undefined}>
                  <span className="whatif-col-num">{c.num}</span>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="whatif-row-label">{row.label}</td>
                {row.values.map((v, i) => {
                  const highlight = columns[i].highlight
                  const cellClass = highlight ? 'whatif-col-highlight' : undefined
                  if (row.badge) {
                    const color = v === 'High' ? 'red' : 'green'
                    return (
                      <td key={i} className={cellClass}>
                        <span className={`badge badge-${color}`}>{v}</span>
                      </td>
                    )
                  }
                  if (row.status) {
                    const isCompliant = v === 'Compliant'
                    const Icon = isCompliant ? CheckCircle2 : XCircle
                    return (
                      <td key={i} className={cellClass}>
                        <span className={`result-cell color-${isCompliant ? 'green' : 'red'}`}>
                          <Icon size={14} />
                          {v}
                        </span>
                      </td>
                    )
                  }
                  return (
                    <td key={i} className={cellClass}>
                      {v}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
