import SapLogo from './SapLogo'

export default function PageFooter({ platformLabel }) {
  return (
    <div className="page-footer">
      <span>Powered by</span>
      <SapLogo width={34} height={19} className="sap-logo-sm" />
      {platformLabel && <span>{platformLabel}</span>}
      <span className="page-footer-divider">|</span>
      <span>Built by Sierra Digital</span>
    </div>
  )
}
