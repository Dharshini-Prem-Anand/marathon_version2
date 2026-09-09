import { useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Maximize2 } from 'lucide-react'
import SortFilterTh from './SortFilterTh'
import TableSearchInput from './TableSearchInput'
import TableExpandModal from './TableExpandModal'
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

// `compact` shows just Rule and Result — the rest (Category, Confidence,
// Issue) only appears in the expanded modal, where there's room to read it.
function RulesTable({ ctl, compact }) {
  return (
    <div className="table-wrap">
      <table className="table-fixed">
        <colgroup>
          {compact ? (
            <>
              <col style={{ width: '60%' }} />
              <col style={{ width: '40%' }} />
            </>
          ) : (
            <>
              <col style={{ width: '22%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '20%' }} />
            </>
          )}
        </colgroup>
        <thead>
          <tr>
            {!compact && <SortFilterTh columnKey="category" label="Category" ctl={ctl} />}
            <SortFilterTh columnKey="rule" label="Rule" ctl={ctl} />
            <SortFilterTh columnKey="result" label="Result" ctl={ctl} />
            {!compact && <SortFilterTh columnKey="confidence" label="Conf." ctl={ctl} />}
            {!compact && <SortFilterTh columnKey="issue" label="Issue" ctl={ctl} />}
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
                {!compact && (
                  <td className="cell-ellipsis" title={r.category}>
                    {r.category}
                  </td>
                )}
                <td className="cell-ellipsis" title={r.rule}>
                  {r.rule}
                </td>
                <td>
                  <span className={`result-cell color-${cfg.color}`}>
                    <Icon size={14} />
                    {cfg.label}
                  </span>
                </td>
                {!compact && <td>{r.confidence}</td>}
                {!compact && (
                  <td className={`cell-ellipsis${r.issue !== '—' ? ' color-red' : ''}`} title={r.issue}>
                    {r.issue}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ValidationRuleResults({ rules = [] }) {
  const ctl = useColumnSortFilter(rules, COLUMNS)
  const [expanded, setExpanded] = useState(false)
  const tableAnchorRef = useRef(null)

  return (
    <section className="panel pv-rules">
      <div className="panel-title-row">
        <h2 className="panel-title">Validation Rule Results</h2>
        <TableSearchInput ctl={ctl} />
        <button
          className="icon-btn table-expand-btn"
          onClick={() => setExpanded(true)}
          aria-label="Expand Validation Rule Results table"
        >
          <Maximize2 size={16} />
        </button>
      </div>
      <div ref={tableAnchorRef}>
        <RulesTable ctl={ctl} compact />
      </div>

      {expanded && (
        <TableExpandModal
          title="Validation Rule Results"
          anchorRef={tableAnchorRef}
          onClose={() => setExpanded(false)}
        >
          <RulesTable ctl={ctl} />
        </TableExpandModal>
      )}
    </section>
  )
}
