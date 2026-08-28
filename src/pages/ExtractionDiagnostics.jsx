import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import FieldAccuracyHeatmap from '../components/FieldAccuracyHeatmap'
import HorizontalBarChart from '../components/HorizontalBarChart'
import LowConfidenceTrendChart from '../components/LowConfidenceTrendChart'
import ExtractionDiagnosticDetailsTable from '../components/ExtractionDiagnosticDetailsTable'
import SelectedIssueExplanation from '../components/SelectedIssueExplanation'
import LearningGovernanceRow from '../components/LearningGovernanceRow'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { extractionDiagFilters, extractionDiagStats, accuracyByFormat, errorPareto, extractionDiagnosticDetails } from '../data'

function confidenceBand(pct) {
  const n = parseInt(pct, 10)
  if (n >= 90) return 'High'
  if (n >= 70) return 'Medium'
  return 'Low'
}

function validationStatus(pct) {
  return parseInt(pct, 10) >= 60 ? 'Review' : 'Failed'
}

export default function ExtractionDiagnostics() {
  const { draft, applied, setField, apply } = useFilters(extractionDiagFilters)

  const filteredRows = extractionDiagnosticDetails.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Invoice Type'], row.format) &&
      matchesOption(applied['Confidence Band'], confidenceBand(row.confidence)) &&
      matchesOption(applied['Validation Status'], validationStatus(row.confidence))
  )

  return (
    <>
      <FilterBar
        fields={extractionDiagFilters}
        values={draft}
        onFieldChange={setField}
        onGo={apply}
        dateRangeLabel="05/11/2025 - 05/18/2025"
        hideAdaptLink
      />
      <StatsRow stats={extractionDiagStats} />

      <div className="extraction-diag-grid-1">
        <FieldAccuracyHeatmap />
        <HorizontalBarChart title="Accuracy by Format" rows={accuracyByFormat} axisMax={100} axisStep={20} />
        <LowConfidenceTrendChart />
        <HorizontalBarChart title="Error Pareto (by Failed Field)" rows={errorPareto} axisMax={40} axisStep={10} />
      </div>

      <div className="extraction-diag-grid-2">
        <ExtractionDiagnosticDetailsTable rows={filteredRows} />
        <SelectedIssueExplanation />
      </div>

      <LearningGovernanceRow />
    </>
  )
}
