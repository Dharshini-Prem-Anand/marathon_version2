import { useState } from 'react'
import { PanelRightOpen } from 'lucide-react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import GuidancePanel from './components/GuidancePanel'
import PageFooter from './components/PageFooter'
import Dashboard from './pages/Dashboard'
import EmailTriage from './pages/EmailTriage'
import DocumentAiExtraction from './pages/DocumentAiExtraction'
import PreValidation from './pages/PreValidation'
import PoLineMatching from './pages/PoLineMatching'
import ExceptionsRecommendations from './pages/ExceptionsRecommendations'
import VimProcessing from './pages/VimProcessing'
import WorkAssignment from './pages/WorkAssignment'
import OperationalAnalytics from './pages/OperationalAnalytics'
import ExtractionDiagnostics from './pages/ExtractionDiagnostics'
import AuditReconciliation from './pages/AuditReconciliation'
import KpiMetricsValue from './pages/KpiMetricsValue'
import KpiFooterBar from './components/KpiFooterBar'
import ApAssistant from './pages/ApAssistant'
import ComingSoon from './pages/ComingSoon'
import {
  dashboardGuidance,
  emailTriageGuidance,
  documentAiGuidance,
  preValidationGuidance,
  poMatchingGuidance,
  exceptionsGuidance,
  vimProcessingGuidance,
  workAssignmentGuidance,
  operationalAnalyticsGuidance,
  extractionDiagGuidance,
  auditGuidance,
  kpiGuidance,
  kpiRoleSelector,
  apAssistantGuidance,
  exceptionsPersonaSelector,
} from './data'
import './App.css'

const guidanceByPage = {
  Dashboard: dashboardGuidance,
  'Email & Attachment Triage': emailTriageGuidance,
  'Document AI & Extraction': documentAiGuidance,
  'Pre-Validation': preValidationGuidance,
  'PO & Line Matching': poMatchingGuidance,
  'Exceptions & Recommendations': exceptionsGuidance,
  'VIM Processing': vimProcessingGuidance,
  'Work Assignment': workAssignmentGuidance,
  'Operational Analytics': operationalAnalyticsGuidance,
  'Extraction Diagnostics': extractionDiagGuidance,
  'Audit & Reconciliation': auditGuidance,
  'KPI, Metrics & Value': kpiGuidance,
  'Intelligent AP Agent': apAssistantGuidance,
}

const topbarTitleByPage = {
  'PO & Line Matching': 'PO & Line Matching | VIM Processing',
  'Exceptions & Recommendations': 'Exceptions & Recommendations',
  'Operational Analytics': 'Analytics | Value Realization & Scenario Planning',
  'Audit & Reconciliation': 'Audit & Reconciliation | Work Assignment',
}
const defaultTopbarTitle = 'Accounts Payable | Intelligent Invoice Automation'

const personaSelectorByPage = {
  'Exceptions & Recommendations': exceptionsPersonaSelector,
}

const searchPlaceholderByPage = {
  'KPI, Metrics & Value': 'Search in: "AP Documents"',
}

const roleSelectorByPage = {
  'KPI, Metrics & Value': kpiRoleSelector,
}

const pageFooterPlatformByPage = {
  'Work Assignment': 'Business Technology Platform',
}

const hidePageFooterFor = new Set(['Operational Analytics', 'KPI, Metrics & Value', 'Intelligent AP Agent'])
const showKpiFooterFor = new Set(['KPI, Metrics & Value'])

function App() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [showGuidance, setShowGuidance] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [pendingDocumentId, setPendingDocumentId] = useState(null)
  const [pendingExceptionId, setPendingExceptionId] = useState(null)

  const guidance = guidanceByPage[activeItem]

  function handleNavigateToDocument(documentId) {
    setPendingDocumentId(documentId)
    setActiveItem('Document AI & Extraction')
  }

  function handleNavigateToException(invoiceId) {
    setPendingExceptionId(invoiceId)
    setActiveItem('Exceptions & Recommendations')
  }

  function renderPage() {
    if (activeItem === 'Dashboard') return <Dashboard onNavigate={setActiveItem} />
    if (activeItem === 'Email & Attachment Triage') return <EmailTriage onNavigateToDocument={handleNavigateToDocument} />
    if (activeItem === 'Document AI & Extraction')
      return (
        <DocumentAiExtraction
          pendingSelectId={pendingDocumentId}
          onPendingSelectConsumed={() => setPendingDocumentId(null)}
          onNavigate={setActiveItem}
        />
      )
    if (activeItem === 'Pre-Validation')
      return <PreValidation onNavigate={setActiveItem} onNavigateToException={handleNavigateToException} />
    if (activeItem === 'PO & Line Matching')
      return <PoLineMatching onNavigateToException={handleNavigateToException} />
    if (activeItem === 'Exceptions & Recommendations')
      return (
        <ExceptionsRecommendations
          pendingSelectId={pendingExceptionId}
          onPendingSelectConsumed={() => setPendingExceptionId(null)}
        />
      )
    if (activeItem === 'VIM Processing') return <VimProcessing />
    if (activeItem === 'Work Assignment') return <WorkAssignment />
    if (activeItem === 'Operational Analytics') return <OperationalAnalytics />
    if (activeItem === 'Extraction Diagnostics') return <ExtractionDiagnostics />
    if (activeItem === 'Audit & Reconciliation') return <AuditReconciliation />
    if (activeItem === 'KPI, Metrics & Value') return <KpiMetricsValue />
    if (activeItem === 'Intelligent AP Agent') return <ApAssistant />
    return <ComingSoon pageName={activeItem} />
  }

  return (
    <div className="app">
      <TopBar
        onToggleSidebar={() => setCollapsed((c) => !c)}
        title={topbarTitleByPage[activeItem] ?? defaultTopbarTitle}
        personaSelector={personaSelectorByPage[activeItem]}
        searchPlaceholder={searchPlaceholderByPage[activeItem]}
        roleSelector={roleSelectorByPage[activeItem]}
      />
      <div className="app-body">
        <Sidebar
          active={activeItem}
          onSelect={setActiveItem}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        <main className="main-content">
          {renderPage()}
          {!hidePageFooterFor.has(activeItem) && (
            <PageFooter platformLabel={pageFooterPlatformByPage[activeItem]} />
          )}
        </main>

        {showGuidance && guidance ? (
          <GuidancePanel guidance={guidance} onClose={() => setShowGuidance(false)} />
        ) : (
          <button
            className="guidance-reopen"
            onClick={() => setShowGuidance(true)}
            aria-label="Open guidance panel"
          >
            <PanelRightOpen size={18} />
          </button>
        )}
      </div>
      {showKpiFooterFor.has(activeItem) && <KpiFooterBar />}
    </div>
  )
}

export default App
