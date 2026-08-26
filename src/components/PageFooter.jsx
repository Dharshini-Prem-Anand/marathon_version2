export default function PageFooter({ platformLabel }) {
  return (
    <div className="page-footer">
      <span>Powered by</span>
      <span className="sap-logo sap-logo-sm">SAP</span>
      {platformLabel && <span>{platformLabel}</span>}
      <span className="page-footer-divider">|</span>
      <span>Built by Sierra Digital</span>
    </div>
  )
}
