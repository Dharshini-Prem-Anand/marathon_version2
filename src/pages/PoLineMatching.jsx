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
import { useFilters, matchesCompanyCode, matchesOption, withLiveOptions } from '../hooks/useFilters'
import { poMatchingFilters, poMatchingStats } from '../data'
import {
  fetchGoodsReceipts,
  fetchInvoices,
  fetchMatchExplanation,
  fetchMatchingKpis,
  fetchPurchaseOrders,
  fetchVendorNameFields,
} from '../api/invoiceAutomation'
import { buildMatchingRecords, matchingStatCounts } from '../utils/matchingMappers'
import { buildVendorNamesByInvoice } from '../utils/vendorNames'
import { dateRangeFilter } from '../utils/dateRange'
import {
  KPI_UNAVAILABLE,
  kpiDateParams,
  kpiPlaceholder,
  MATCHING_KPI_FIELDS,
  overlayKpiStats,
} from '../utils/kpiTiles'
import { mapMatchingPerformance } from '../utils/kpiPanels'

const DEFAULT_DATE_RANGE = 'Today'

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
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  const [liveData, setLiveData] = useState({ ids: [], records: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)

    // Invoices carries only a vendor code; the readable name comes from the
    // extraction, fetched alongside the three matching sets.
    Promise.all([
      fetchInvoices(),
      fetchPurchaseOrders(),
      fetchGoodsReceipts(),
      fetchVendorNameFields().catch(() => []),
    ])
      .then(([invoices, purchaseOrders, goodsReceipts, vendorFields]) => {
        if (cancelled) return
        setLiveData(
          buildMatchingRecords(invoices, purchaseOrders, goodsReceipts, buildVendorNamesByInvoice(vendorFields))
        )
      })
      .catch((err) => {
        if (cancelled) return
        setLiveData({ ids: [], records: {} })
        setError(`Could not load matching data — ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchMatchingKpis(kpiDateParams(appliedDateRange))
      .then((res) => {
        if (!cancelled) setKpis(res)
      })
      .catch(() => {
        if (!cancelled) setKpis(KPI_UNAVAILABLE)
      })

    return () => {
      cancelled = true
    }
  }, [appliedDateRange])

  const [explanation, setExplanation] = useState(null)

  const { ids, records } = liveData

  // Every row is live; the Date Range filter narrows them by when the pipeline
  // wrote the invoice (managed createdAt), falling back to the invoice's own
  // date where that's missing.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  // Every dropdown is filled from the loaded rows — a static list would offer
  // choices (e.g. EDI) that never match a live invoice, since Invoices carries
  // no channel and always reports 'Email'. Company Code is left alone.
  const filterFields = useMemo(
    () =>
      withLiveOptions(poMatchingFilters, {
        'Invoice Channel': ids.map((id) => records[id].context.channel),
        Vendor: ids.map((id) => records[id].context.vendor),
        Status: ids.map((id) => records[id].context.status),
      }),
    [ids, records]
  )

  const filteredQueue = ids.filter((id) => {
    const { context } = records[id]
    return (
      inDateRange(records[id].createdAt ?? records[id].creationDate) &&
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
  // The previous invoice's explanation is cleared up front so a slow request
  // shows a busy indicator instead of briefly leaving stale content on screen.
  useEffect(() => {
    setExplanation(null)
    setExplanationLoading(false)

    if (!selectedInvoiceNumber) {
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

  // Tiles and the Matching Performance panel come from /matchingkpis. The
  // four count tiles keep the counts this page derives from the filtered
  // queue until that call answers, then the service's numbers win; Tolerance
  // Exceptions and Ready for VIM have no local equivalent and show a
  // placeholder until it does.
  const stats = useMemo(() => {
    const counts = matchingStatCounts(filteredQueue, records)
    const local = poMatchingStats.map((stat) => {
      // 'Non PO invoices' and the rest are left to /matchingkpis: the queue can
      // only count what Invoices.VerificationStatus says.
      const value = {
        'Total Invoices': counts.total,
        'PO Invoices': counts.total,
        'Fully Matched': counts.matched,
        'Partial Match': counts.partial,
      }[stat.label]
      return { ...stat, value: value === undefined ? kpiPlaceholder(kpis) : value.toLocaleString() }
    })
    return overlayKpiStats(local, MATCHING_KPI_FIELDS, kpis)
  }, [filteredQueue, records, kpis])

  const performanceMetrics = useMemo(() => {
    // The service's rates win once /matchingkpis is deployed.
    const fromService = mapMatchingPerformance(kpis)
    if (fromService) return fromService

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
  }, [filteredQueue, records, kpis])

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
        <FilterEmptyState
          message={
            error ||
            (loading
              ? 'Loading invoices, purchase orders and goods receipts…'
              : 'No PO match record matches the selected filters.')
          }
        />
      )}
    </>
  )
}
