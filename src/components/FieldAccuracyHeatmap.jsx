import { fieldAccuracyByVendor } from '../data'

function heatClass(v) {
  if (v >= 90) return 'heat-green'
  if (v >= 80) return 'heat-yellow'
  return 'heat-red'
}

export default function FieldAccuracyHeatmap() {
  return (
    <section className="panel field-accuracy-heatmap">
      <h2 className="panel-title">Field Accuracy by Vendor</h2>
      <div className="table-wrap">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '18%' }} />
            {fieldAccuracyByVendor.vendors.map((v) => (
              <col key={v} style={{ width: `${82 / fieldAccuracyByVendor.vendors.length}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th>Field</th>
              {fieldAccuracyByVendor.vendors.map((v) => (
                <th key={v} className="cell-ellipsis" title={v}>
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fieldAccuracyByVendor.rows.map((row) => (
              <tr key={row.field}>
                <td>{row.field}</td>
                {row.values.map((v, i) => (
                  <td key={i}>
                    <span className={`heat-cell ${heatClass(v)}`}>{v}%</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
