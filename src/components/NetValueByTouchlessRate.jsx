import LineChart from './LineChart'
import { netValueByTouchlessRate } from '../data'

export default function NetValueByTouchlessRate() {
  const { xLabels, values, labels, yMax, xAxisTitle, yAxisTitle } = netValueByTouchlessRate
  const yGridLabels = [0, 200000, 400000, 600000, 800000, 1000000, 1200000, 1400000, 1600000].map((v) => ({
    value: v,
    label: v === 0 ? '$0' : `$${v / 1000000 >= 1 ? `${v / 1000000}M` : `${v / 1000}K`}`,
  }))

  return (
    <section className="panel">
      <h2 className="panel-title">Net Value by Touchless Rate</h2>
      <div className="chart-with-y-title">
        <span className="axis-title-y">{yAxisTitle}</span>
        <LineChart xLabels={xLabels} values={values} pointLabels={labels} yMax={yMax} yGridLabels={yGridLabels} />
      </div>
      <div className="axis-title-x">{xAxisTitle}</div>
    </section>
  )
}
