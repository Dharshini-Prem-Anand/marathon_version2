import sapLogo from '../../images/sap-logo-png_seeklogo-465583.png'

export default function PageFooter({ platformLabel }) {
  return (
    <div className="page-footer">
      <span>Powered by</span>
      <img src={sapLogo} alt="SAP" className="sap-logo-sm" />
      {platformLabel && <span>{platformLabel}</span>}
      <span className="page-footer-divider">|</span>
      <span>Built by Sierra Digital Inc</span>
    </div>
  )
}
