import { useId } from 'react'

export default function SapLogo({ width = 44, height = 24, className }) {
  const gradientId = useId()

  return (
    <svg width={width} height={height} viewBox="0 0 100 54" className={className} aria-label="SAP">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5DC3EF" />
          <stop offset="55%" stopColor="#0B7BC0" />
          <stop offset="100%" stopColor="#063D73" />
        </linearGradient>
      </defs>
      <polygon points="0,0 100,0 68,54 0,54" fill={`url(#${gradientId})`} />
      <text x="7" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="29" fill="#ffffff">
        SAP
      </text>
    </svg>
  )
}
