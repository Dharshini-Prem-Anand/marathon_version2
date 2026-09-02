import { FileText, Clipboard, Truck, Scale, CheckCircle2, CircleDot, XCircle } from 'lucide-react'

const iconMap = {
  fileText: FileText,
  clipboard: Clipboard,
  truck: Truck,
  scale: Scale,
}

const matchStatusConfig = {
  matched: { icon: CheckCircle2, color: 'green', label: 'Matched' },
  tolerance: { icon: CircleDot, color: 'orange', label: 'In Tolerance' },
  mismatch: { icon: XCircle, color: 'red', label: 'Mismatch' },
  notfound: { icon: XCircle, color: 'gray', label: 'Not Found' },
}

export default function ThreeWayMatchReview({ summaryCards = [], matchLines = [] }) {
  return (
    <section className="panel three-way-match">
      <h2 className="panel-title">Matching review</h2>

      <div className="match-summary-grid">
        {summaryCards.map((c) => {
          const Icon = iconMap[c.icon]
          return (
            <div className="match-summary-card" key={c.label}>
              <div className="match-summary-icon">
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div>
                <div className="match-summary-label">{c.label}</div>
                <div className={`match-summary-value${c.valueColor ? ` color-${c.valueColor}` : ''}`}>
                  {c.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="table-wrap">
        <table className="table-fixed match-lines-table">
          <colgroup>
            <col style={{ width: '6%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Line</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Inv Amount</th>
              <th>PO Line</th>
              <th>PO Amt</th>
              <th>Var.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {matchLines.map((line) => {
              const cfg = matchStatusConfig[line.matchStatus]
              const Icon = cfg.icon
              return (
                <tr key={line.invLine}>
                  <td>{line.invLine}</td>
                  <td className="cell-ellipsis" title={line.description}>
                    {line.description}
                  </td>
                  <td>{line.qty}</td>
                  <td>{line.unitPrice}</td>
                  <td>{line.invAmount}</td>
                  <td>{line.proposedPoLine}</td>
                  <td>{line.poAmount}</td>
                  <td>{line.variance}</td>
                  <td>
                    <span className={`result-cell color-${cfg.color}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
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
