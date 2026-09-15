import { useEffect, useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import Scorecard from '../components/Scorecard'
import FlowSteps from '../components/FlowSteps'
import CapabilityCards from '../components/CapabilityCards'
import PriorityQueue from '../components/PriorityQueue'
import Bottlenecks from '../components/Bottlenecks'
import ValueRealization from '../components/ValueRealization'
import { useFilters, matchesOption, withLiveOptions } from '../hooks/useFilters'
import {
  scorecardMetrics,
  capabilityCards,
  dashboardFilters,
  dashboardPersonaField,
} from '../data'
import {
  fetchAllPipelineStatus,
  fetchEmailMetadata,
  fetchExceptionKpis,
  fetchExceptions,
  fetchExtractionKpis,
  fetchInvoices,
  fetchMatchingKpis,
  fetchPreValidationKpis,
  fetchPurchaseOrders,
  fetchTriageKpis,
  fetchVendorNameFields,
} from '../api/invoiceAutomation'
import { buildExceptionRows } from '../utils/exceptionsMappers'
import { buildVendorNamesByInvoice } from '../utils/vendorNames'
import { preValidationTilePayload } from '../utils/kpiPanels'
import { KPI_UNAVAILABLE, kpiDateParams } from '../utils/kpiTiles'
import { dateRangeFilter } from '../utils/dateRange'
import {
  buildBottlenecks,
  buildCapabilityCards,
  buildDiagnostics,
  buildFlowLegend,
  buildFlowSteps,
  buildIntervention,
  buildScorecard,
  buildValueFooter,
  buildValueRealization,
  cycleTimeLabel,
  invoiceStatusFromPipeline,
  pipelineFunnel,
} from '../utils/dashboardLive'

const DEFAULT_DATE_RANGE = 'Last 7 Days'

// Stable stand-in for "not loaded yet", so the memos below don't see a new
// array on every render.
const NO_ROWS = []

// The KPI endpoints take a window and nothing else, so the filter bar's
// dropdowns narrow the Priority Action Queue rather than the panels above it
// — the same split every other page has.
export default function Dashboard({ onNavigate }) {
  const { draft, applied, setField, apply } = useFilters(dashboardFilters)
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)

  // One state per source: a panel shows a placeholder until its own call
  // lands, instead of the whole page waiting on the slowest one.
  const [triage, setTriage] = useState(null)
  const [extraction, setExtraction] = useState(null)
  const [preValidation, setPreValidation] = useState(null)
  const [exceptionKpis, setExceptionKpis] = useState(null)
  const [matching, setMatching] = useState(null)

  const [pipeline, setPipeline] = useState(null)
  const [emails, setEmails] = useState([])
  const [exceptionRows, setExceptionRows] = useState([])
  const [exceptionsLoading, setExceptionsLoading] = useState(true)
  const [companyCodeByInvoice, setCompanyCodeByInvoice] = useState({})

  // KPI endpoints — refetched whenever the window changes.
  useEffect(() => {
    let cancelled = false
    const params = kpiDateParams(appliedDateRange)
    const load = (fetcher, setter) =>
      fetcher(params)
        .then((res) => {
          if (!cancelled) setter(res)
        })
        .catch(() => {
          if (!cancelled) setter(KPI_UNAVAILABLE)
        })

    setTriage(null)
    setExtraction(null)
    setPreValidation(null)
    setExceptionKpis(null)
    setMatching(null)

    load(fetchTriageKpis, setTriage)
    load(fetchExtractionKpis, setExtraction)
    load(fetchPreValidationKpis, setPreValidation)
    load(fetchExceptionKpis, setExceptionKpis)
    load(fetchMatchingKpis, setMatching)

    return () => {
      cancelled = true
    }
  }, [appliedDateRange])

  // CAP entities — the run record behind the flow strip, the exceptions
  // behind the queue, and the two joins that give a row its vendor name and
  // company code.
  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchAllPipelineStatus().catch(() => []),
      fetchEmailMetadata().catch(() => []),
      fetchExceptions().catch(() => []),
      fetchVendorNameFields().catch(() => []),
      fetchInvoices().catch(() => []),
      fetchPurchaseOrders().catch(() => []),
    ]).then(([pipelineRows, emailRows, exceptions, vendorFields, invoices, purchaseOrders]) => {
      if (cancelled) return
      setPipeline(pipelineRows)
      setEmails(emailRows)
      setExceptionRows(buildExceptionRows(exceptions, buildVendorNamesByInvoice(vendorFields)))

      // Company code lives only on the purchase order, so an invoice reaches
      // one in two hops: Invoices.PurchaseOrder -> PurchaseOrders.CompanyCode.
      const codeByPo = {}
      for (const po of purchaseOrders) {
        if (po.PurchaseOrder && po.CompanyCode) codeByPo[String(po.PurchaseOrder)] = String(po.CompanyCode)
      }
      const byInvoice = {}
      for (const invoice of invoices) {
        const code = codeByPo[String(invoice.PurchaseOrder)]
        if (invoice.InvoiceNumber && code) byInvoice[String(invoice.InvoiceNumber)] = code
      }
      setCompanyCodeByInvoice(byInvoice)
      setExceptionsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const pipelineRows = pipeline ?? NO_ROWS
  const pipelineLoaded = pipeline != null
  const funnel = useMemo(() => pipelineFunnel(pipelineRows), [pipelineRows])
  const statusByInvoice = useMemo(() => invoiceStatusFromPipeline(pipelineRows), [pipelineRows])
  const cycleTime = useMemo(() => cycleTimeLabel(pipelineRows, emails), [pipelineRows, emails])

  // Queue rows carry the attributes the filter bar acts on: the vendor from
  // the extraction, the channel from the email, the company code from the PO
  // and the status from where the pipeline left the invoice.
  const inDateRange = useMemo(() => dateRangeFilter(appliedDateRange), [appliedDateRange])

  const queueRows = useMemo(() => {
    const channelByInvoice = {}
    for (const row of pipelineRows) {
      const email = emails.find((e) => e.MessageID === row.MessageID)
      if (email?.Source && row.InvoiceNumber) channelByInvoice[String(row.InvoiceNumber)] = email.Source
    }

    return exceptionRows.map((row) => ({
      ...row,
      companyCode: companyCodeByInvoice[String(row.invoice)] ?? null,
      channel: channelByInvoice[String(row.invoice)] ?? null,
      status: statusByInvoice.get(String(row.invoice)) ?? null,
      // The queue's last column. The recommendation is a paragraph; its first
      // sentence is the action.
      action: row.recommendation ? `${row.recommendation.split(/(?<=\.)\s/)[0]}` : '—',
    }))
  }, [exceptionRows, companyCodeByInvoice, statusByInvoice, pipelineRows, emails])

  const filterFields = useMemo(
    () =>
      withLiveOptions(dashboardFilters, {
        'Company Code': queueRows.map((row) => row.companyCode),
        'Invoice Channel': emails.map((row) => row.Source),
        Vendor: queueRows.map((row) => row.vendor),
        Status: queueRows.map((row) => row.status),
      }),
    [queueRows, emails]
  )

  const filteredQueue = queueRows.filter(
    (row) =>
      inDateRange(row.createdAt) &&
      matchesOption(applied['Company Code'], row.companyCode) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['Invoice Channel'], row.channel) &&
      matchesOption(applied['Status'], row.status)
  )

  const preValidationTiles = useMemo(() => preValidationTilePayload(preValidation), [preValidation])

  // Averaged over the exceptions on screen, so it moves with the filters the
  // way the queue under it does.
  const avgConfidence = useMemo(() => {
    const values = filteredQueue
      .map((row) => Number(String(row.confidence ?? '').replace('%', '')))
      .filter((n) => Number.isFinite(n))
    return values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : null
  }, [filteredQueue])

  const amountAtRisk = useMemo(() => {
    const values = filteredQueue
      // '—' strips to an empty string, and Number('') is 0 — which would read
      // as "no money at risk" rather than "no amount on the row".
      .map((row) => String(row.amount ?? '').replace(/[^0-9.-]/g, ''))
      .filter((text) => text !== '')
      .map(Number)
      .filter((n) => Number.isFinite(n))
    return values.length ? values.reduce((sum, n) => sum + n, 0) : null
  }, [filteredQueue])

  const scorecard = buildScorecard(scorecardMetrics, {
    funnel,
    preValidation: preValidationTiles,
    extraction,
    cycleTime,
    pipelineLoaded,
  })
  const flow = buildFlowSteps({ funnel, matching, pipelineLoaded })
  const legend = buildFlowLegend({ funnel, exceptions: exceptionKpis, pipelineLoaded })
  const cards = buildCapabilityCards(capabilityCards, {
    triage,
    extraction,
    preValidation: preValidationTiles,
    exceptions: exceptionKpis,
    matching,
    avgConfidence,
  })
  const bottlenecks = buildBottlenecks(preValidation)
  const diagnostics = buildDiagnostics(extraction)
  const intervention = buildIntervention({
    exceptions: exceptionKpis,
    rows: filteredQueue,
    avgConfidence,
    amountAtRisk,
  })
  const valueItems = buildValueRealization({ triage, preValidation: preValidationTiles, exceptions: exceptionKpis })
  const valueFooterItems = buildValueFooter({ exceptions: exceptionKpis })

  const handleGo = () => {
    apply()
    setAppliedDateRange(dateRange)
  }

  return (
    <>
      <div className="dashboard-top-zoom">
        <FilterBar
          fields={filterFields}
          values={draft}
          onFieldChange={setField}
          dateRangeLabel={DEFAULT_DATE_RANGE}
          dateRangeValue={dateRange}
          onDateRangeChange={setDateRange}
          onGo={handleGo}
          personaField={dashboardPersonaField}
          personaValue={draft.Persona ?? dashboardPersonaField.value}
          onPersonaChange={(v) => setField('Persona', v)}
        />
        <Scorecard title="Business Outcome Scorecard" metrics={scorecard} />
        <FlowSteps steps={flow} legend={legend} />
      </div>

      <CapabilityCards cards={cards} />

      <div className="dashboard-queue-row">
        <PriorityQueue rows={filteredQueue} loading={exceptionsLoading} />
        <Bottlenecks
          bottlenecks={bottlenecks}
          diagnostics={diagnostics}
          intervention={intervention}
          onReviewRecommendations={() => onNavigate?.('Exceptions & Recommendations')}
        />
      </div>

      <ValueRealization items={valueItems} footer={valueFooterItems} />
    </>
  )
}
