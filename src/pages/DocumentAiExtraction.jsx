import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import DocumentQueueTable from '../components/DocumentQueueTable'
import InvoicePreviewPanel from '../components/InvoicePreviewPanel'
import FormatPerformanceChart from '../components/FormatPerformanceChart'
import LineItemExtraction from '../components/LineItemExtraction'
import PainPointTable from '../components/PainPointTable'
import LearningModelPerformance from '../components/LearningModelPerformance'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { documentAiFilters, documentAiStats, documentQueue } from '../data'

export default function DocumentAiExtraction() {
  const { draft, applied, setField, apply } = useFilters(documentAiFilters)

  const filteredQueue = documentQueue.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.topVendor) &&
      matchesOption(applied['Invoice Channel'], row.channel) &&
      matchesOption(applied['Status'], row.status)
  )

  return (
    <>
      <FilterBar fields={documentAiFilters} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={documentAiStats} />

      <div className="docai-main-grid">
        <DocumentQueueTable rows={filteredQueue} />
        <InvoicePreviewPanel />
      </div>

      <div className="doc-ai-secondary-grid">
        <FormatPerformanceChart />
        <LineItemExtraction />
        <PainPointTable />
      </div>

      <LearningModelPerformance />
    </>
  )
}
