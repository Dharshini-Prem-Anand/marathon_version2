import PipelineStepper from './PipelineStepper'

function getTriageProgress(row) {
  const isDocument = row.category !== 'Inquiry' && row.category !== 'Non-Invoice'

  return {
    fetch: { done: true, caption: `Received ${row.time}` },
    classify: { done: true, caption: `${row.category} · ${row.confidence} confidence` },
    ready: {
      done: isDocument,
      caption: isDocument ? 'Queued for extraction' : 'Not applicable',
    },
  }
}

export default function TriageStepper({ row, documentId, onNavigateToDocument }) {
  const progress = getTriageProgress(row)
  const canNavigate = Boolean(progress.ready.done && documentId && onNavigateToDocument)

  const steps = [
    { key: 'fetch', label: 'Fetch Email', done: progress.fetch.done, caption: progress.fetch.caption },
    {
      key: 'classify',
      label: 'Attachment Classification',
      done: progress.classify.done,
      caption: progress.classify.caption,
    },
    {
      key: 'ready',
      label: 'Ready for Document AI Extraction Process',
      done: progress.ready.done,
      caption: progress.ready.caption,
      isLink: canNavigate,
      onClick: canNavigate ? () => onNavigateToDocument(documentId) : undefined,
      linkTitle: 'Open this document in Document AI & Extraction',
    },
  ]

  return <PipelineStepper steps={steps} />
}
