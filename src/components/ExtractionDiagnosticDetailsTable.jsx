import SortFilterTh from './SortFilterTh'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

function confidenceColor(pct) {
  const n = parseInt(pct, 10)
  if (n >= 65) return 'orange'
  return 'red'
}

const COLUMNS = {
  vendor: (row) => row.vendor,
  format: (row) => row.format,
  failedField: (row) => row.failedField,
  confidence: (row) => row.confidence,
  errorType: (row) => row.errorType,
  recurrence: (row) => row.recurrence,
  lastCorrection: (row) => row.lastCorrection,
  modelVersion: (row) => row.modelVersion,
  action: (row) => row.action,
}

export default function ExtractionDiagnosticDetailsTable({ rows }) {
  const ctl = useColumnSortFilter(rows, COLUMNS)

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
              <SortFilterTh columnKey="vendor" label="Vendor" ctl={ctl} />
              <SortFilterTh columnKey="format" label="Format" ctl={ctl} />
              <SortFilterTh columnKey="failedField" label="Failed Field" ctl={ctl} />
              <SortFilterTh columnKey="confidence" label="Conf." ctl={ctl} />
              <SortFilterTh columnKey="errorType" label="Error Type" ctl={ctl} />
              <SortFilterTh columnKey="recurrence" label="Recur. (30d)" ctl={ctl} />
              <SortFilterTh columnKey="lastCorrection" label="Last Correction" ctl={ctl} />
              <SortFilterTh columnKey="modelVersion" label="Model" ctl={ctl} />
              <SortFilterTh columnKey="action" label="Recommended Action" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.length === 0 && (
              <tr>
                <td colSpan={9} className="table-empty-cell">
                  No issues match the selected filters.
                </td>
              </tr>
            )}
            {ctl.rows.map((row, i) => (
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
