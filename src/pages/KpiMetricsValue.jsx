import PageHeader from '../components/PageHeader'
import KpiFilterBar from '../components/KpiFilterBar'
import KpiStatsRow from '../components/KpiStatsRow'
import MeasureDefinitionRegister from '../components/MeasureDefinitionRegister'
import MeasureConfiguration from '../components/MeasureConfiguration'
import ValueCalculationInputs from '../components/ValueCalculationInputs'
import ValueOutputsPanel from '../components/ValueOutputsPanel'
import MeasurementGovernancePanel from '../components/MeasurementGovernancePanel'
import { kpiPageHeader, kpiHeaderActions } from '../data'

export default function KpiMetricsValue() {
  return (
    <>
      <PageHeader title={kpiPageHeader.title} subtitle={kpiPageHeader.subtitle} actions={kpiHeaderActions} />
      <KpiFilterBar />
      <KpiStatsRow />

      <div className="kpi-main-grid">
        <MeasureDefinitionRegister />
        <MeasureConfiguration />
      </div>

      <div className="kpi-bottom-grid">
        <ValueCalculationInputs />
        <ValueOutputsPanel />
        <MeasurementGovernancePanel />
      </div>
    </>
  )
}
