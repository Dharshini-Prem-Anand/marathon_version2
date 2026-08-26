import { lineItemExtraction } from '../data'

function confidenceClass(pct) {
  const n = parseInt(pct, 10)
  if (n >= 95) return 'green'
  if (n >= 85) return 'blue'
  return 'orange'
}

export default function LineItemExtraction() {
  return (
    <section className="panel line-item-extraction">
      <h2 className="panel-title">Line-Item Extraction</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {lineItemExtraction.map((li) => (
              <tr key={li.idx}>
                <td>{li.idx}</td>
                <td>{li.description}</td>
                <td>{li.quantity}</td>
                <td>{li.uom}</td>
                <td>{li.unitPrice}</td>
                <td>{li.amount}</td>
                <td>
                  <span className={`confidence-badge confidence-${confidenceClass(li.confidence)}`}>
                    {li.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-link view-all-link">View All Line Items</button>
    </section>
  )
}
