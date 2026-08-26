import LineChart from './LineChart'
import { lowConfidenceTrend } from '../data'

export default function LowConfidenceTrendChart() {
  const { xLabels, values, yMax } = lowConfidenceTrend
  const yGridLabels = [0, 10, 20, 30, 40].map((v) => ({ value: v, label: `${v}` }))

  return (
    <section className="panel">
      <h2 className="panel-title">Low-Confidence Trend (by Week)</h2>
      <div className="chart-legend-row">
        <span className="chart-legend-item">
          <span className="chart-legend-swatch chart-legend-solid chart-legend-orange" />
          Low-Confidence Documents
        </span>
      </div>
      <div className="chart-with-y-title">
        <span className="axis-title-y">Documents</span>
        <LineChart
          xLabels={xLabels}
          values={values}
          pointLabels={values.map(String)}
          yMax={yMax}
          yGridLabels={yGridLabels}
          color="var(--orange)"
        />
      </div>
    </section>
  )
}
