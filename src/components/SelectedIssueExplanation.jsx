import { selectedIssueExplanation } from '../data'

export default function SelectedIssueExplanation() {
  const d = selectedIssueExplanation
  const li = d.evidenceLine

  return (
    <section className="panel selected-issue">
      <h2 className="panel-title">Selected Issue Explanation</h2>

      <div className="issue-meta">
        <div>
          <span className="issue-meta-label">Vendor:</span> {d.vendor}
        </div>
        <div>
          <span className="issue-meta-label">Document:</span> {d.document}
        </div>
        <div>
          <span className="issue-meta-label">Failed Field:</span> {d.failedField}
        </div>
        <div>
          <span className="issue-meta-label">Confidence:</span> {d.confidence}
        </div>
        <div>
          <span className="issue-meta-label">Error Type:</span> {d.errorType}
        </div>
      </div>

      <h3 className="issue-evidence-heading">Evidence</h3>
      <div className="table-wrap">
        <table className="issue-evidence-table">
          <thead>
            <tr>
              <th>Line</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{li.line}</td>
              <td>
                <span className="issue-error-highlight">{li.description}</span>
              </td>
              <td>{li.qty}</td>
              <td>{li.unitPrice}</td>
              <td>{li.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="issue-read-block">
        <div>
          <span className="issue-meta-label">Model Read:</span>
          <div>{d.modelRead}</div>
        </div>
        <div>
          <span className="issue-meta-label">Corrected To:</span>
          <div className="color-green">{d.correctedTo}</div>
        </div>
      </div>

      <div className="issue-actions">
        {d.actions.map((a) => (
          <button key={a.label} className={a.variant === 'primary' ? 'btn-primary' : 'btn-outline'}>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  )
}
