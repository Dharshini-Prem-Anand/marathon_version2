export default function VendorPayeePanel({ vendorPayee = [] }) {
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
              {vendorPayee.map((v) => (
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
    </div>
  )
}
