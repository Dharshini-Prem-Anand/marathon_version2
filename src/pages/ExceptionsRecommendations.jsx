import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import StatsRow from '../components/StatsRow'
import PriorityExceptionQueue from '../components/PriorityExceptionQueue'
import AiReviewRecommendation from '../components/AiReviewRecommendation'
import WhatIfResolutionScenarios from '../components/WhatIfResolutionScenarios'
import InfoBanner from '../components/InfoBanner'
import FilterEmptyState from '../components/FilterEmptyState'
import { useFilters, matchesCompanyCode, matchesOption, withLiveOptions } from '../hooks/useFilters'
import { exceptionsFilters, exceptionsStats } from '../data'
import { fetchExceptionKpis, fetchExceptions, fetchVendorNameFields } from '../api/invoiceAutomation'
import { buildExceptionRows } from '../utils/exceptionsMappers'
import { buildVendorNamesByInvoice } from '../utils/vendorNames'
import { ALL_DATES_RANGE, dateRangeFilter } from '../utils/dateRange'
import { EXCEPTION_KPI_FIELDS, KPI_UNAVAILABLE, kpiDateParams, mergeKpiStats } from '../utils/kpiTiles'
import { mapRecommendationSummary, mapWhatIfScenarios } from '../utils/kpiPanels'

const DEFAULT_DATE_RANGE = 'Today'

export default function ExceptionsRecommendations({ pendingSelectId, onPendingSelectConsumed }) {
  const { draft, applied, setField, apply } = useFilters(exceptionsFilters)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [postedInvoices, setPostedInvoices] = useState(() => new Set())
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  // The Priority Exception Queue binds to the live CAP /Exceptions data.
  const [liveRows, setLiveRows] = useState([])
  const [liveError, setLiveError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLiveError(null)

    // Exceptions.Vendor is a code; the readable name comes from the extraction,
    // fetched alongside so the queue renders once with names resolved.
    Promise.all([fetchExceptions(), fetchVendorNameFields().catch(() => [])])
      .then(([exceptions, vendorFields]) => {
        if (cancelled) return
        setLiveRows(buildExceptionRows(exceptions, buildVendorNamesByInvoice(vendorFields)))
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

  // The tile row comes from /exceptionKpis, over whatever window the Date
  // Range filter has applied. null until it answers, so the tiles show a
  // placeholder instead of the sample numbers they're defined with.
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchExceptionKpis(kpiDateParams(appliedDateRange))
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

  const stats = useMemo(() => mergeKpiStats(exceptionsStats, EXCEPTION_KPI_FIELDS, kpis), [kpis])

  // The same response also carries the What-If table and the summary under it.
  const scenarios = useMemo(() => mapWhatIfScenarios(kpis), [kpis])
  const scenarioSummary = useMemo(() => mapRecommendationSummary(kpis), [kpis])

  // Every row is live; the Date Range filter narrows them by when the pipeline
  // raised the exception (managed createdAt). Due is the deadline, often in the
  // future, so filtering on it hid today's exceptions from every past window.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])
  const sourceRows = useMemo(
    () => liveRows.filter((row) => inDateRange(row.createdAt ?? row.dueDate)),
    [liveRows, inDateRange]
  )

  // Dropdowns are filled from the loaded rows, not the current window, so
  // changing the Date Range doesn't make a selected value disappear. Company
  // Code is left alone: Exceptions carries no company code.
  const filterFields = useMemo(
    () =>
      withLiveOptions(exceptionsFilters, {
        Vendor: liveRows.map((row) => row.vendor),
        Priority: liveRows.map((row) => row.priority),
      }),
    [liveRows]
  )

  const filteredRows = sourceRows.filter(
    (row) =>
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Priority'], row.priority)
  )

  // A deep link from Pre-Validation / PO & Line Matching's "Exception —
  // routed for..." link arrives as an invoice id — select that row. Each page
  // keeps its own Date Range, so the linked exception can sit outside this
  // one's window — drop the constraint rather than land on another exception.
  useEffect(() => {
    if (!pendingSelectId) return
    const target = liveRows.find((row) => row.invoice === pendingSelectId)
    if (!target) return
    setSelectedInvoice(pendingSelectId)
    if (!inDateRange(target.dueDate)) {
      setDateRange(ALL_DATES_RANGE)
      setAppliedDateRange(ALL_DATES_RANGE)
    }
    onPendingSelectConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelectId, liveRows])

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
      <StatsRow stats={stats} />

      {filteredRows.length === 0 ? (
        <FilterEmptyState message={liveError || 'No exceptions match the selected filters.'} />
      ) : (
        <div className="exceptions-main-grid">
          <PriorityExceptionQueue
            rows={filteredRows}
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

      <WhatIfResolutionScenarios rows={scenarios} />
      {scenarioSummary && <InfoBanner text={scenarioSummary} />}
    </>
  )
}
