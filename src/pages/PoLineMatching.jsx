import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import PoMatchingQueueTable from '../components/PoMatchingQueueTable'
import ThreeWayMatchReview from '../components/ThreeWayMatchReview'
import MatchExplanation from '../components/MatchExplanation'
import PoMatchingPipelinePanel from '../components/PoMatchingPipelinePanel'
import MatchingPerformance from '../components/MatchingPerformance'
import VimProcessingTimeline from '../components/VimProcessingTimeline'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { poMatchingFilters, poMatchingStats, poMatchingQueue, poMatchingRecords } from '../data'

export default function PoLineMatching({ onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(poMatchingFilters)
  const [selectedId, setSelectedId] = useState(poMatchingQueue[0])

  const filteredQueue = poMatchingQueue.filter((id) => {
    const { context } = poMatchingRecords[id]
    return (
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Invoice Channel'], context.channel) &&
      matchesOption(applied['Vendor'], context.vendor) &&
      matchesOption(applied['Status'], context.status)
    )
  })

  const selectedRecordId = filteredQueue.includes(selectedId) ? selectedId : filteredQueue[0] ?? null
  const selectedRecord = selectedRecordId ? poMatchingRecords[selectedRecordId] : null

  const queueRows = filteredQueue.map((id) => {
    const record = poMatchingRecords[id]
    return {
      id,
      invoiceNumber: id,
      vendor: record.context.vendor,
      amount: record.summaryCards[0]?.value ?? '—',
      status: record.context.status,
    }
  })

  return (
    <>
      <FilterBar fields={poMatchingFilters} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={poMatchingStats} />

      {selectedRecord ? (
        <>
          <div className="pv-page-grid">
            <PoMatchingQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="po-main-grid">
                <ThreeWayMatchReview summaryCards={selectedRecord.summaryCards} matchLines={selectedRecord.matchLines} />
                <MatchExplanation explanation={selectedRecord.explanation} />
              </div>

              <PoMatchingPipelinePanel
                context={selectedRecord.context}
                matchLines={selectedRecord.matchLines}
                invoiceId={selectedRecordId}
                onNavigateToException={onNavigateToException}
              />
            </div>
          </div>

          <MatchingPerformance />
          <VimProcessingTimeline />
        </>
      ) : (
        <FilterEmptyState message="No PO match record matches the selected filters." />
      )}
    </>
  )
}
