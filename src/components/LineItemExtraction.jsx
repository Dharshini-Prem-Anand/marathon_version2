function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

export default function LineItemExtraction({ columns = [], rows = [], loading, error, hasDocument }) {
  const colCount = columns.length + 1

  return (
    <section className="panel line-item-extraction">
      <h2 className="panel-title">Line-Item Extraction</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasDocument ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Select a document to see its line items.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  Loading line items…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="table-empty-cell">
                  No line items extracted for this document.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.itemNumber}>
                  <td>{row.itemNumber}</td>
                  {columns.map((c) => {
                    const cell = row.cells[c.key]
                    if (!cell) return <td key={c.key}>—</td>
                    return (
                      <td key={c.key}>
                        <span className="line-item-value" title={cell.value}>
                          {cell.value}
                        </span>
                        <span className={`confidence-badge confidence-${confidenceClass(cell.confidence)}`}>
                          {cell.confidence}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

