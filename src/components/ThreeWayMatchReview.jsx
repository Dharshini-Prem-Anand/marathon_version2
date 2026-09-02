import { FileText, Clipboard, Truck, Scale, CheckCircle2, CircleDot, XCircle } from 'lucide-react'
import { matchSummaryCards, threeWayMatchLines } from '../data'
import PoMatchingPipelineStepper from './PoMatchingPipelineStepper'

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
}

export default function ThreeWayMatchReview({ onNavigate }) {
  return (
    <section className="panel three-way-match">
      <h2 className="panel-title">Three-Way Match Review</h2>

      <div className="match-summary-grid">
        {matchSummaryCards.map((c) => {
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
            <col style={{ width: '5%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '19%' }} />
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
              <th>Tol.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {threeWayMatchLines.map((line) => {
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
                  <td>{line.tolerance}</td>
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

      <h3 className="preview-subheading">Processing Pipeline</h3>
      <PoMatchingPipelineStepper onNavigate={onNavigate} />
    </section>
  )
}
