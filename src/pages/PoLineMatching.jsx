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
import { poMatchingFilters, poMatchingStats, poMatchingQueue, poMatchingRecords } from '../data'
import {
  fetchGoodsReceipts,
  fetchInvoices,
  fetchMatchExplanation,
  fetchPurchaseOrders,
} from '../api/invoiceAutomation'
import { buildMatchingRecords, matchingStatCounts } from '../utils/matchingMappers'
import { isTodayRange } from '../utils/dateRange'

const DEFAULT_DATE_RANGE = 'Today'

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

// Seed data shown for any date range other than Today — the CAP
// Invoices/PurchaseOrders/GoodsReceipts data has no historical window to
// page through yet, same reasoning as Document AI & Extraction's mock queue.
const MOCK_DATA = (() => {
  const ids = [...poMatchingQueue]
  const records = {}
  for (const id of ids) {
    const r = poMatchingRecords[id]
    records[id] = {
      invoiceNumber: id,
      context: r.context,
      summaryCards: r.summaryCards,
      matchLines: r.matchLines,
      amount: r.summaryCards[0]?.value ?? '—',
      explanation: r.explanation,
    }
  }
  return { ids, records }
})()

export default function PoLineMatching({ onNavigateToException }) {
  const { draft, applied, setField, apply } = useFilters(poMatchingFilters)
  const [selectedId, setSelectedId] = useState(null)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  const [liveData, setLiveData] = useState({ ids: [], records: {} })
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setError(null)

    Promise.all([fetchInvoices(), fetchPurchaseOrders(), fetchGoodsReceipts()])
      .then(([invoices, purchaseOrders, goodsReceipts]) => {
        if (cancelled) return
        setLiveData(buildMatchingRecords(invoices, purchaseOrders, goodsReceipts))
      })
      .catch((err) => {
        if (cancelled) return
        setLiveData({ ids: [], records: {} })
        setError(`Could not load matching data — ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const [explanation, setExplanation] = useState(null)

  const showLive = isTodayRange(appliedDateRange)
  const { ids, records } = showLive ? liveData : MOCK_DATA

  // Vendor and Invoice Channel options come from the loaded data — a static
  // dropdown would offer choices (e.g. EDI) that never match a live invoice,
  // since Invoices carries no channel and always reports 'Email'.
  const filterFields = useMemo(() => {
    const vendors = [...new Set(ids.map((id) => records[id].context.vendor))].sort()
    const channels = [...new Set(ids.map((id) => records[id].context.channel))].sort()
    return poMatchingFilters.map((f) => {
      if (f.label === 'Vendor') return { ...f, options: ['All', ...vendors] }
      if (f.label === 'Invoice Channel') return { ...f, options: ['All', ...channels] }
      return f
    })
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

  const [explanationLoading, setExplanationLoading] = useState(false)

  // One call per invoice selection. Any failure (route missing, network, empty
  // body) degrades to the "not ready" copy — it must never surface as an error.
  // Seed invoices (any range other than Today) aren't known to the Python
  // service, so they use their own canned explanation instead of calling it.
  // The previous invoice's explanation is cleared up front so a slow request
  // shows a busy indicator instead of briefly leaving stale content on screen.
  useEffect(() => {
    setExplanation(null)
    setExplanationLoading(false)

    if (!selectedInvoiceNumber) {
      return
    }

    if (!showLive) {
      setExplanation(selectedRecord?.explanation ?? EXPLANATION_NOT_READY)
      return
    }

    let cancelled = false
    setExplanationLoading(true)

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
      .finally(() => {
        if (!cancelled) setExplanationLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedInvoiceNumber, showLive, selectedRecord])

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

  // Both the stat tiles and the Matching Performance panel reflect the
  // filtered queue, not the full dataset, so every filter visibly changes
  // what's on screen.
  const stats = useMemo(() => {
    const counts = matchingStatCounts(filteredQueue, records)
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
  }, [filteredQueue, records])

  const performanceMetrics = useMemo(() => {
    const lines = filteredQueue.flatMap((id) => records[id].matchLines)
    const totalLines = lines.length
    const matchedLines = lines.filter((l) => l.matchStatus === 'matched').length
    const totalHeaders = filteredQueue.length
    const matchedHeaders = filteredQueue.filter((id) => records[id].context.status === 'Matched').length

    const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(1)}%` : '—')

    return [
      {
        label: 'Header Match Rate',
        percent: pct(matchedHeaders, totalHeaders),
        fraction: `(${matchedHeaders.toLocaleString()} / ${totalHeaders.toLocaleString()})`,
      },
      {
        label: 'Line Match Rate',
        percent: pct(matchedLines, totalLines),
        fraction: `(${matchedLines.toLocaleString()} / ${totalLines.toLocaleString()})`,
      },
    ]
  }, [filteredQueue, records])

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  return (
    <>
      <FilterBar
        fields={filterFields}
        values={draft}
        onFieldChange={setField}
        dateRangeLabel={DEFAULT_DATE_RANGE}
        dateRangeValue={dateRange}
        onDateRangeChange={setDateRange}
        onGo={handleGo}
      />
      <StatsRow stats={stats} />

      {selectedRecord ? (
        <>
          <div className="pv-page-grid">
            <PoMatchingQueueTable rows={queueRows} selectedId={selectedRecordId} onSelect={setSelectedId} />

            <div className="pv-detail-col">
              <div className="po-main-grid">
                <ThreeWayMatchReview summaryCards={selectedRecord.summaryCards} matchLines={selectedRecord.matchLines} />
                <MatchExplanation explanation={explanation} loading={explanationLoading} />
              </div>

              <PoMatchingPipelinePanel
                context={selectedRecord.context}
                matchLines={selectedRecord.matchLines}
                invoiceId={selectedRecord.invoiceNumber}
                onNavigateToException={onNavigateToException}
              />
            </div>
          </div>

          <MatchingPerformance metrics={performanceMetrics} />
          <VimProcessingTimeline />
        </>
      ) : (
        <FilterEmptyState message={(showLive && error) || 'No PO match record matches the selected filters.'} />
      )}
    </>
  )
}
