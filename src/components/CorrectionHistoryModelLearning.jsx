import { CheckCircle2 } from 'lucide-react'
import { correctionHistory } from '../data'

export default function CorrectionHistoryModelLearning() {
  return (
    <section className="panel">
      <h2 className="panel-title">Correction History &amp; Model Learning</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '46%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Field</th>
              <th>Previous Correction (Example)</th>
              <th>Recur. (30d)</th>
              <th>Retained</th>
            </tr>
          </thead>
          <tbody>
            {correctionHistory.map((c) => (
              <tr key={c.field}>
                <td>{c.field}</td>
                <td className="cell-ellipsis" title={c.example}>
                  {c.example}
                </td>
                <td>{c.recurrence}</td>
                <td>
                  {c.retained && (
                    <span className="retained-yes">
                      <CheckCircle2 size={14} /> Yes
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
