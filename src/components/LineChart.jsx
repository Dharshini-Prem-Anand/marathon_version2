const WIDTH = 620
const HEIGHT = 280
const MARGIN = { top: 40, right: 20, bottom: 40, left: 64 }
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom

export default function LineChart({
  xLabels,
  values,
  pointLabels,
  yMax,
  yGridLabels,
  targetValue,
  targetLabel,
  color = 'var(--blue)',
}) {
  const n = xLabels.length
  const xAt = (i) => MARGIN.left + (i / (n - 1)) * PLOT_WIDTH
  const yAt = (v) => MARGIN.top + (1 - v / yMax) * PLOT_HEIGHT

  const linePoints = values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="line-chart" preserveAspectRatio="xMidYMid meet">
      {yGridLabels.map((g) => (
        <g key={g.value}>
          <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={yAt(g.value)} y2={yAt(g.value)} className="line-chart-gridline" />
          <text x={MARGIN.left - 8} y={yAt(g.value) + 4} textAnchor="end" className="line-chart-axis-label">
            {g.label}
          </text>
        </g>
      ))}

      {typeof targetValue === 'number' && (
        <>
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={yAt(targetValue)}
            y2={yAt(targetValue)}
            className="line-chart-target-line"
          />
          <text x={WIDTH - MARGIN.right} y={yAt(targetValue) - 6} textAnchor="end" className="line-chart-target-label">
            {targetLabel}
          </text>
        </>
      )}

      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {values.map((v, i) => {
        const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'
        return (
          <g key={i}>
            <circle cx={xAt(i)} cy={yAt(v)} r="4" fill={color} />
            <text x={xAt(i)} y={yAt(v) - 12} textAnchor={anchor} className="line-chart-point-label">
              {pointLabels[i]}
            </text>
            <text x={xAt(i)} y={HEIGHT - MARGIN.bottom + 20} textAnchor={anchor} className="line-chart-axis-label">
              {xLabels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
