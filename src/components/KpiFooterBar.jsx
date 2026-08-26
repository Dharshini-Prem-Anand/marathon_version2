import { Hexagon } from 'lucide-react'
import { kpiFooter } from '../data'

export default function KpiFooterBar() {
  return (
    <div className="kpi-footer-bar">
      <div className="kpi-footer-left">
        <span className="kpi-footer-brand">{kpiFooter.brand}</span>
        <span className="kpi-footer-divider">|</span>
        <span>{kpiFooter.subtitle}</span>
      </div>
      <div className="kpi-footer-right">
        <span>{kpiFooter.designedByLabel}</span>
        <Hexagon size={16} />
        <span className="kpi-footer-brand">{kpiFooter.designedBy.toUpperCase()}</span>
      </div>
    </div>
  )
}
