import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import VimFilterBar from '../components/VimFilterBar'
import StatsRow from '../components/StatsRow'
import VimWorklistTable from '../components/VimWorklistTable'
import SelectedInvoiceTimeline from '../components/SelectedInvoiceTimeline'
import IntegrationReconciliation from '../components/IntegrationReconciliation'
import OperationalHealth from '../components/OperationalHealth'
import { useFilters, matchesCompanyCode, matchesOption } from '../hooks/useFilters'
import { vimPageHeader, vimStats, vimFilters, vimWorklist } from '../data'

export default function VimProcessing() {
  const { draft, applied, setField, apply } = useFilters(vimFilters)
  const [searchDraft, setSearchDraft] = useState('')
  const [searchApplied, setSearchApplied] = useState('')

  function handleRefresh() {
    apply()
    setSearchApplied(searchDraft)
  }

  const filteredRows = vimWorklist.filter((row) => {
    const touchlessSelected = applied['Touchless/Human Review']
    const matchesTouchless =
      touchlessSelected === 'All' ||
      (touchlessSelected === 'Touchless' && row.touchless === 'Yes') ||
      (touchlessSelected === 'Human Review' && row.touchless === 'No')

    return (
      matchesCompanyCode(applied['Company Code']) &&
      matchesOption(applied['Vendor'], row.vendor) &&
      matchesOption(applied['VIM Status'], row.vimStatus) &&
      matchesOption(applied['Due Date'], row.dueDate) &&
      matchesTouchless &&
      (searchApplied.trim() === '' || row.invoiceId.toLowerCase().includes(searchApplied.trim().toLowerCase()))
    )
  })

  return (
    <>
      <PageHeader title={vimPageHeader.title} subtitle={vimPageHeader.subtitle} />
      <VimFilterBar
        values={draft}
        onFieldChange={setField}
        searchValue={searchDraft}
        onSearchChange={setSearchDraft}
        onRefresh={handleRefresh}
      />
      <StatsRow stats={vimStats} />

      <VimWorklistTable rows={filteredRows} />

      <div className="vim-secondary-grid">
        <SelectedInvoiceTimeline />
        <IntegrationReconciliation />
      </div>

      <OperationalHealth />
    </>
  )
}
