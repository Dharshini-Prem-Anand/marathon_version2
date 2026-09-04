import { FileText, Clipboard, Truck, Scale, CheckCircle2, CircleDot, XCircle } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

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

const COLUMNS = {
  invLine: (row) => row.invLine,
  description: (row) => row.description,
  qty: (row) => row.qty,
  unitPrice: (row) => row.unitPrice,
  invAmount: (row) => row.invAmount,
  proposedPoLine: (row) => row.proposedPoLine,
  poAmount: (row) => row.poAmount,
  variance: (row) => row.variance,
  matchStatus: (row) => matchStatusConfig[row.matchStatus]?.label,
}

export default function ThreeWayMatchReview({ summaryCards = [], matchLines = [] }) {
  const ctl = useColumnSortFilter(matchLines, COLUMNS)
  return (
    <section className="panel three-way-match">
      <div className="panel-title-row">
        <h2 className="panel-title">Matching review</h2>
        <TableSearchInput ctl={ctl} placeholder="Search line items..." />
      </div>

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
              <SortFilterTh columnKey="invLine" label="Line" ctl={ctl} />
              <SortFilterTh columnKey="description" label="Description" ctl={ctl} />
              <SortFilterTh columnKey="qty" label="Qty" ctl={ctl} />
              <SortFilterTh columnKey="unitPrice" label="Unit Price" ctl={ctl} />
              <SortFilterTh columnKey="invAmount" label="Inv Amount" ctl={ctl} />
              <SortFilterTh columnKey="proposedPoLine" label="PO Line" ctl={ctl} />
              <SortFilterTh columnKey="poAmount" label="PO Amt" ctl={ctl} />
              <SortFilterTh columnKey="variance" label="Var." ctl={ctl} />
              <SortFilterTh columnKey="matchStatus" label="Status" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.map((line) => {
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
