import { vendorPayeeValidation, documentClassification } from '../data'

export default function VendorPayeePanel() {
  return (
    <div className="pv-vendor">
      <section className="panel">
        <h2 className="panel-title">Vendor &amp; Payee Validation</h2>
        <div className="table-wrap">
          <table className="table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '46%' }} />
              <col style={{ width: '24%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name / ID</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {vendorPayeeValidation.map((v) => (
                <tr key={v.type}>
                  <td className="cell-ellipsis" title={v.type}>
                    {v.type}
                  </td>
                  <td className={`cell-ellipsis${v.nameColor ? ` color-${v.nameColor}` : ''}`} title={v.name}>
                    {v.name}
                  </td>
                  <td>
                    <span className={`badge badge-${v.badgeColor}`}>{v.confidence}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Document Classification</h2>
        <div className="doc-classification-list">
          {documentClassification.map((d) => (
            <label className="doc-classification-row" key={d.label}>
              <span className="radio-dot">
                <span className={`radio-dot-inner${d.selected ? ' checked' : ''}`} />
              </span>
              <span className="doc-classification-label">{d.label}</span>
              <span className={`badge badge-${d.badgeColor}`}>{d.confidence}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
