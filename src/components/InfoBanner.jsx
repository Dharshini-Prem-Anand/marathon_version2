import { Info } from 'lucide-react'

export default function InfoBanner({ text }) {
  return (
    <div className="info-banner">
      <Info size={18} />
      <span>{text}</span>
    </div>
  )
}
