import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import { useColumnSortFilter } from '../hooks/useColumnSortFilter'

const resultConfig = {
  passed: { icon: CheckCircle2, color: 'green', label: 'Passed' },
  review: { icon: AlertTriangle, color: 'orange', label: 'Review' },
  failed: { icon: XCircle, color: 'red', label: 'Failed' },
}

const COLUMNS = {
  category: (row) => row.category,
  rule: (row) => row.rule,
  result: (row) => resultConfig[row.result]?.label ?? row.result,
  confidence: (row) => row.confidence,
  issue: (row) => row.issue,
}

export default function ValidationRuleResults({ rules = [] }) {
  const ctl = useColumnSortFilter(rules, COLUMNS)

  return (
    <section className="panel pv-rules">
      <div className="panel-title-row">
        <h2 className="panel-title">Validation Rule Results</h2>
        <TableSearchInput ctl={ctl} />
      </div>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortFilterTh columnKey="category" label="Category" ctl={ctl} />
              <SortFilterTh columnKey="rule" label="Rule" ctl={ctl} />
              <SortFilterTh columnKey="result" label="Result" ctl={ctl} />
              <SortFilterTh columnKey="confidence" label="Conf." ctl={ctl} />
              <SortFilterTh columnKey="issue" label="Issue" ctl={ctl} />
            </tr>
          </thead>
          <tbody>
            {ctl.rows.map((r, i) => {
              // Real rule sets repeat categories, so the category alone isn't a
              // stable key; an unknown result must not crash the table.
              const cfg = resultConfig[r.result] ?? resultConfig.review
              const Icon = cfg.icon
              return (
                <tr key={`${r.category}-${r.rule}-${i}`}>
                  <td className="cell-ellipsis" title={r.category}>
                    {r.category}
                  </td>
                  <td className="cell-ellipsis" title={r.rule}>
                    {r.rule}
                  </td>
                  <td>
                    <span className={`result-cell color-${cfg.color}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
                  </td>
                  <td>{r.confidence}</td>
                  <td className={`cell-ellipsis${r.issue !== '—' ? ' color-red' : ''}`} title={r.issue}>
                    {r.issue}
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
