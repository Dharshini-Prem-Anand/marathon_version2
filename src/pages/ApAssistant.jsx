import PageHeader from '../components/PageHeader'
import ApQueryPanel from '../components/ApQueryPanel'
import { apAssistantPageHeader } from '../data'

export default function ApAssistant() {
  return (
    <div className="ap-assistant-page">
      <PageHeader title={apAssistantPageHeader.title} subtitle={apAssistantPageHeader.subtitle} />

      <ApQueryPanel />
    </div>
  )
}
