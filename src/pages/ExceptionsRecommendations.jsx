import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import PriorityExceptionQueue from '../components/PriorityExceptionQueue'
import AiReviewRecommendation from '../components/AiReviewRecommendation'
import WhatIfResolutionScenarios from '../components/WhatIfResolutionScenarios'
import InfoBanner from '../components/InfoBanner'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { exceptionsFilters, exceptionsStats, scenarioInfoText, priorityExceptionQueue, totalExceptionsCount } from '../data'
import { fetchExceptions } from '../api/invoiceAutomation'
import { buildExceptionRows } from '../utils/exceptionsMappers'
import { isTodayRange } from '../utils/dateRange'

const DEFAULT_DATE_RANGE = 'Today'

export default function ExceptionsRecommendations({ pendingSelectId, onPendingSelectConsumed }) {
  const { draft, applied, setField, apply } = useFilters(exceptionsFilters)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [postedInvoices, setPostedInvoices] = useState(() => new Set())
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  // The Priority Exception Queue binds to the live CAP /Exceptions data for
  // Today, same as the other pages — any other range falls back to the seed
  // queue, since there's no historical window to page through yet.
  const [liveRows, setLiveRows] = useState([])
  const [liveError, setLiveError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLiveError(null)

    fetchExceptions()
      .then((exceptions) => {
        if (cancelled) return
        setLiveRows(buildExceptionRows(exceptions))
      })
      .catch((err) => {
        if (cancelled) return
        setLiveRows([])
        setLiveError(`Could not load exceptions — ${err.message}`)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const showLive = isTodayRange(appliedDateRange)
  const sourceRows = showLive ? liveRows : priorityExceptionQueue

  // Vendor options come from the loaded data — a static dropdown would offer
  // names that can never match a live exception.
  const filterFields = useMemo(() => {
    const vendors = [...new Set(sourceRows.map((row) => row.vendor))].sort()
    return exceptionsFilters.map((f) => (f.label === 'Vendor' ? { ...f, options: ['All', ...vendors] } : f))
  }, [sourceRows])

  const filteredRows = sourceRows.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Priority'], row.priority)
  )

  // A deep link from Pre-Validation / PO & Line Matching's "Exception —
  // routed for..." link arrives as an invoice id — select that row.
  useEffect(() => {
    if (!pendingSelectId) return
    if (!sourceRows.some((row) => row.invoice === pendingSelectId)) return
    setSelectedInvoice(pendingSelectId)
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId, sourceRows])

  const selectedRecordId = filteredRows.some((row) => row.invoice === selectedInvoice)
    ? selectedInvoice
    : filteredRows[0]?.invoice ?? null
  const selectedException = filteredRows.find((row) => row.invoice === selectedRecordId) ?? null

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
      <StatsRow stats={exceptionsStats} />

      {filteredRows.length === 0 ? (
        <FilterEmptyState message={(showLive && liveError) || 'No exceptions match the selected filters.'} />
      ) : (
        <div className="exceptions-main-grid">
          <PriorityExceptionQueue
            rows={filteredRows}
            totalCount={showLive ? filteredRows.length : totalExceptionsCount}
            selectedId={selectedRecordId}
            onSelect={setSelectedInvoice}
          />
          <AiReviewRecommendation
            exception={selectedException}
            posted={selectedRecordId ? postedInvoices.has(selectedRecordId) : false}
            onPostToSap={() => {
              if (selectedRecordId) setPostedInvoices((prev) => new Set(prev).add(selectedRecordId))
            }}
          />
        </div>
      )}

      <WhatIfResolutionScenarios />
      <InfoBanner text={scenarioInfoText} />
    </>
  )
}
