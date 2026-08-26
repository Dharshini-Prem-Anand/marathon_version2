const colorVar = {
  green: 'var(--green)',
  blue: 'var(--blue)',
  orange: 'var(--orange)',
  red: 'var(--red)',
}

export default function Sparkline({ data, color = 'blue', width = 140, height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  const areaPoints = `0,${height} ${points} ${width},${height}`
  const stroke = colorVar[color]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" preserveAspectRatio="none">
      <polygon points={areaPoints} fill={stroke} opacity="0.12" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
