import { ShieldAlert } from 'lucide-react'
import { approvalBannerText } from '../data'

export default function ApprovalBanner() {
  return (
    <div className="approval-banner">
      <ShieldAlert size={18} />
      <span>{approvalBannerText}</span>
    </div>
  )
}
