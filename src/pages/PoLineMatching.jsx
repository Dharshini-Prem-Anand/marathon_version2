import { useEffect, useMemo, useState } from 'react'
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
import { poMatchingFilters, poMatchingStats } from '../data'
import {
  fetchGoodsReceipts,
  fetchInvoices,
  fetchMatchExplanation,
  fetchPurchaseOrders,
} from '../api/invoiceAutomation'
import { buildMatchingRecords, matchingStatCounts } from '../utils/matchingMappers'

// The service has no tolerance data and no VIM-readiness flag, so these two
// tiles stay on their mock values.
const STATIC_STAT_LABELS = ['Tolerance Exceptions', 'Ready for VIM']

// Shown whenever /matchExplanation is unavailable, errors, or returns nothing.
// The route is still being built on the Python service, so this is the normal
// state for now rather than an exceptional one.
const EXPLANATION_NOT_READY = {
  recommendedAction: 'Match explanation is not yet available for this invoice.',
  confidence: '—',
  evidence: 'The explanation service has not returned a result for this invoice.',
}

export default function PoLineMatching({ onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(poMatchingFilters)
  const [selectedId, setSelectedId] = useState(null)

  const [data, setData] = useState({ ids: [], records: {} })
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setError(null)

    Promise.all([fetchInvoices(), fetchPurchaseOrders(), fetchGoodsReceipts()])
      .then(([invoices, purchaseOrders, goodsReceipts]) => {
        if (cancelled) return
        setData(buildMatchingRecords(invoices, purchaseOrders, goodsReceipts))
      })
      .catch((err) => {
        if (cancelled) return
        setData({ ids: [], records: {} })
        setError(`Could not load matching data — ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const [explanation, setExplanation] = useState(null)

  const { ids, records } = data

  // Vendor options come from the loaded data — the mock list holds different
  // names, so a static dropdown would filter everything out.
  const filterFields = useMemo(() => {
    const vendors = [...new Set(ids.map((id) => records[id].context.vendor))].sort()
    return poMatchingFilters.map((f) =>
      f.label === 'Vendor' ? { ...f, options: ['All', ...vendors] } : f
    )
  }, [ids, records])

  const filteredQueue = ids.filter((id) => {
    const { context } = records[id]
    return (
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Invoice Channel'], context.channel) &&
      matchesOption(applied['Vendor'], context.vendor) &&
      matchesOption(applied['Status'], context.status)
    )
  })

  const selectedRecordId = filteredQueue.includes(selectedId) ? selectedId : filteredQueue[0] ?? null
  const selectedRecord = selectedRecordId ? records[selectedRecordId] : null

  const selectedInvoiceNumber = selectedRecord?.invoiceNumber ?? null

  // One call per invoice selection. Any failure (route missing, network, empty
  // body) degrades to the "not ready" copy — it must never surface as an error.
  useEffect(() => {
    if (!selectedInvoiceNumber) {
      setExplanation(null)
      return
    }

    let cancelled = false

    fetchMatchExplanation(selectedInvoiceNumber)
      .then((res) => {
        if (cancelled) return
        setExplanation(
          res?.recommendedAction || res?.confidence || res?.evidence
            ? {
                recommendedAction: res.recommendedAction || EXPLANATION_NOT_READY.recommendedAction,
                confidence: res.confidence || '—',
                evidence: res.evidence || '—',
              }
            : EXPLANATION_NOT_READY
        )
      })
      .catch(() => {
        if (!cancelled) setExplanation(EXPLANATION_NOT_READY)
      })

    return () => {
      cancelled = true
    }
  }, [selectedInvoiceNumber])

  const queueRows = filteredQueue.map((id) => {
    const record = records[id]
    return {
      id,
      invoiceNumber: record.invoiceNumber,
      vendor: record.context.vendor,
      amount: record.amount,
      status: record.context.status,
    }
  })

  const stats = useMemo(() => {
    const counts = matchingStatCounts(ids, records)
    return poMatchingStats.map((stat) => {
      if (STATIC_STAT_LABELS.includes(stat.label)) return stat
      const value = {
        'PO Invoices': counts.total,
        'Fully Matched': counts.matched,
        'Partial Match': counts.partial,
        'PO Not Found': counts.notFound,
      }[stat.label]
      if (value === undefined) return stat
      return { ...stat, value: value.toLocaleString() }
    })
  }, [ids, records])

  return (
    <>
      <FilterBar fields={filterFields} values={draft} onFieldChange={setField} onGo={apply} />
      <StatsRow stats={stats} />

      {selectedRecord ? (
        <>
          <div className="pv-page-grid">
            <PoMatchingQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="po-main-grid">
                <ThreeWayMatchReview summaryCards={selectedRecord.summaryCards} matchLines={selectedRecord.matchLines} />
                <MatchExplanation explanation={explanation} />
              </div>

              <PoMatchingPipelinePanel
                context={selectedRecord.context}
                matchLines={selectedRecord.matchLines}
                invoiceId={selectedRecord.invoiceNumber}
                onNavigateToException={onNavigateToException}
              />
            </div>
          </div>

          <MatchingPerformance />
          <VimProcessingTimeline />
        </>
      ) : (
        <FilterEmptyState message={error ?? 'No PO match record matches the selected filters.'} />
      )}
    </>
  )
}
