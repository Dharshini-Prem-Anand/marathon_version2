import { preventedExceptionsByType } from '../data'

export default function PreventedExceptionsByType() {
  return (
    <section className="panel">
      <h2 className="panel-title">Prevented Downstream VIM Exceptions by Type</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '48%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '36%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Exception Type</th>
              <th>Prevented</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {preventedExceptionsByType.map((e) => (
              <tr key={e.type}>
                <td className="cell-ellipsis" title={e.type}>
                  {e.type}
                </td>
                <td>{e.prevented}</td>
                <td>
                  <div className="inline-bar-cell">
                    <div className="inline-bar-track">
                      <div className="inline-bar-fill inline-bar-green" style={{ width: `${e.percent}%` }} />
                    </div>
                    <span>{e.percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
