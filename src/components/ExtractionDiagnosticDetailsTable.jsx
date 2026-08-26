import { extractionDiagnosticDetails } from '../data'

function confidenceColor(pct) {
  const n = parseInt(pct, 10)
  if (n >= 65) return 'orange'
  return 'red'
}

export default function ExtractionDiagnosticDetailsTable() {
  return (
    <section className="panel extraction-diagnostic-details">
      <h2 className="panel-title">Extraction Diagnostic Details</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Format</th>
              <th>Failed Field</th>
              <th>Conf.</th>
              <th>Error Type</th>
              <th>Recur. (30d)</th>
              <th>Last Correction</th>
              <th>Model</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {extractionDiagnosticDetails.map((row, i) => (
              <tr key={i}>
                <td className="cell-ellipsis" title={row.vendor}>
                  {row.vendor}
                </td>
                <td>{row.format}</td>
                <td className="cell-ellipsis" title={row.failedField}>
                  {row.failedField}
                </td>
                <td>
                  <span className={`badge badge-${confidenceColor(row.confidence)}`}>{row.confidence}</span>
                </td>
                <td className="cell-ellipsis" title={row.errorType}>
                  {row.errorType}
                </td>
                <td>{row.recurrence}</td>
                <td className="cell-ellipsis">{row.lastCorrection}</td>
                <td className="cell-mono cell-ellipsis">{row.modelVersion}</td>
                <td className="cell-ellipsis" title={row.action}>
                  {row.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
