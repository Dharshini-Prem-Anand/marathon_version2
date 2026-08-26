import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import FieldAccuracyHeatmap from '../components/FieldAccuracyHeatmap'
import HorizontalBarChart from '../components/HorizontalBarChart'
import LowConfidenceTrendChart from '../components/LowConfidenceTrendChart'
import ExtractionDiagnosticDetailsTable from '../components/ExtractionDiagnosticDetailsTable'
import SelectedIssueExplanation from '../components/SelectedIssueExplanation'
import LearningGovernanceRow from '../components/LearningGovernanceRow'
import { extractionDiagFilters, extractionDiagStats, accuracyByFormat, errorPareto } from '../data'

export default function ExtractionDiagnostics() {
  return (
    <>
      <FilterBar fields={extractionDiagFilters} dateRangeLabel="05/11/2025 - 05/18/2025" hideAdaptLink />
      <StatsRow stats={extractionDiagStats} />

      <div className="extraction-diag-grid-1">
        <FieldAccuracyHeatmap />
        <HorizontalBarChart title="Accuracy by Format" rows={accuracyByFormat} axisMax={100} axisStep={20} />
        <LowConfidenceTrendChart />
        <HorizontalBarChart title="Error Pareto (by Failed Field)" rows={errorPareto} axisMax={40} axisStep={10} />
      </div>

      <div className="extraction-diag-grid-2">
        <ExtractionDiagnosticDetailsTable />
        <SelectedIssueExplanation />
      </div>

      <LearningGovernanceRow />
    </>
  )
}
