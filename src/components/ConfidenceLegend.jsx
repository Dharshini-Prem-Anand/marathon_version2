import { useState } from 'react'
import { ArrowDown, TrendingDown, TrendingUp } from 'lucide-react'
import { CONFIDENCE_BANDS } from '../utils/confidenceBands'

// Key for the confidence badges on the extracted header fields and line items:
// which range each colour stands for. It reads the bands from the same
// definition the badges are coloured by, so the two can't drift apart.
const TREND_ICON = { down: ArrowDown, flat: TrendingDown, up: TrendingUp }

export default function ConfidenceLegend() {
  const [hovered, setHovered] = useState(null)
  const active = CONFIDENCE_BANDS.find((b) => b.key === hovered)

  return (
    <div className="confidence-legend">
      <span className="confidence-legend-label">Extraction Confidence Range:</span>
      {CONFIDENCE_BANDS.map((band) => {
        const Icon = TREND_ICON[band.trend]
        return (
          <span
            key={band.key}
            className={`confidence-legend-chip confidence-legend-${band.tone}`}
            tabIndex={0}
            onMouseEnter={() => setHovered(band.key)}
            onMouseLeave={() => setHovered((k) => (k === band.key ? null : k))}
            onFocus={() => setHovered(band.key)}
            onBlur={() => setHovered((k) => (k === band.key ? null : k))}
          >
            <Icon size={12} />
            {band.label}
          </span>
        )
      })}

      {/* One tooltip anchored to the legend rather than to each chip: the
          fields pane scrolls, and a box hanging off the right-hand chip would
          push a horizontal scrollbar into it. */}
      {active && (
        <span className="confidence-legend-tip" role="tooltip">
          <strong>
            {active.name} ({active.label})
          </strong>
          {active.tip}
        </span>
      )}
    </div>
  )
}
