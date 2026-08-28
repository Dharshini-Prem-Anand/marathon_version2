import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import KpiFilterBar from '../components/KpiFilterBar'
import KpiStatsRow from '../components/KpiStatsRow'
import MeasureDefinitionRegister from '../components/MeasureDefinitionRegister'
import MeasureConfiguration from '../components/MeasureConfiguration'
import ValueCalculationInputs from '../components/ValueCalculationInputs'
import ValueOutputsPanel from '../components/ValueOutputsPanel'
import MeasurementGovernancePanel from '../components/MeasurementGovernancePanel'
import { useFilters, matchesOption } from '../hooks/useFilters'
import { kpiPageHeader, kpiHeaderActions, kpiFilters, measureDefinitionRegister } from '../data'

export default function KpiMetricsValue() {
  const { draft, applied, setField, apply } = useFilters(kpiFilters.fields)
  const [searchDraft, setSearchDraft] = useState('')
  const [searchApplied, setSearchApplied] = useState('')

  function handleApply() {
    apply()
    setSearchApplied(searchDraft)
  }

  const filteredRows = measureDefinitionRegister.rows.filter(
    (row) =>
      matchesOption(applied['Category'], row.category) &&
      matchesOption(applied['Status'], row.status) &&
      matchesOption(applied['Reporting Period'], row.reportingPeriod) &&
      (searchApplied.trim() === '' || row.measure.toLowerCase().includes(searchApplied.trim().toLowerCase()))
  )

  return (
    <>
      <PageHeader title={kpiPageHeader.title} subtitle={kpiPageHeader.subtitle} actions={kpiHeaderActions} />
      <KpiFilterBar
        values={draft}
        onFieldChange={setField}
        searchValue={searchDraft}
        onSearchChange={setSearchDraft}
        onApply={handleApply}
      />
      <KpiStatsRow />

      <div className="kpi-main-grid">
        <MeasureDefinitionRegister rows={filteredRows} />
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
