import LineChart from './LineChart'
import { touchlessByMonth } from '../data'

export default function TouchlessByMonthChart() {
  const { xLabels, values, target } = touchlessByMonth
  const yGridLabels = [0, 20, 40, 60, 80, 100].map((v) => ({ value: v, label: `${v}%` }))

  return (
    <section className="panel">
      <h2 className="panel-title">Touchless Processing by Month</h2>
      <div className="chart-legend-row">
        <span className="chart-legend-item">
          <span className="chart-legend-swatch chart-legend-solid" />
          Touchless %
        </span>
        <span className="chart-legend-item">
          <span className="chart-legend-swatch chart-legend-dashed" />
          Target (80%)
        </span>
      </div>
      <LineChart
        xLabels={xLabels}
        values={values}
        pointLabels={values.map((v) => `${v}%`)}
        yMax={100}
        yGridLabels={yGridLabels}
        targetValue={target}
        targetLabel={`${target}%`}
      />
    </section>
  )
}
