import { SearchX } from 'lucide-react'

export default function FilterEmptyState({ message = 'No records match the selected filters.' }) {
  return (
    <div className="panel filter-empty-state">
      <SearchX size={28} />
      <p>{message}</p>
    </div>
  )
}
