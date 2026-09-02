import PageHeader from '../components/PageHeader'
import ApQueryPanel from '../components/ApQueryPanel'
import ExpectedValueImpactPanel from '../components/ExpectedValueImpactPanel'
import { apAssistantPageHeader } from '../data'

export default function ApAssistant() {
  return (
    <>
      <PageHeader title={apAssistantPageHeader.title} subtitle={apAssistantPageHeader.subtitle} />

      <ApQueryPanel />

      <ExpectedValueImpactPanel />
    </>
  )
}
