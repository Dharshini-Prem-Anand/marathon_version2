import PageHeader from '../components/PageHeader'
import VimFilterBar from '../components/VimFilterBar'
import StatsRow from '../components/StatsRow'
import VimWorklistTable from '../components/VimWorklistTable'
import SelectedInvoiceTimeline from '../components/SelectedInvoiceTimeline'
import IntegrationReconciliation from '../components/IntegrationReconciliation'
import OperationalHealth from '../components/OperationalHealth'
import { vimPageHeader, vimStats } from '../data'

export default function VimProcessing() {
  return (
    <>
      <PageHeader title={vimPageHeader.title} subtitle={vimPageHeader.subtitle} />
      <VimFilterBar />
      <StatsRow stats={vimStats} />

      <VimWorklistTable />

      <div className="vim-secondary-grid">
        <SelectedInvoiceTimeline />
        <IntegrationReconciliation />
      </div>

      <OperationalHealth />
    </>
  )
}
