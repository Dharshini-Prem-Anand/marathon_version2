import { Search, X } from 'lucide-react'

// A single search box that matches against every column of a useColumnSortFilter()
// controller (`ctl`) — a quick, whole-row search alongside the per-column filters.
export default function TableSearchInput({ ctl, placeholder = 'Search...' }) {
  return (
    <label className="table-search-box">
      <Search size={14} />
      <input
        type="text"
        placeholder={placeholder}
        value={ctl.search}
        onChange={(e) => ctl.setSearch(e.target.value)}
      />
      {ctl.search && (
        <button
          type="button"
          className="table-search-clear"
          aria-label="Clear search"
          onClick={() => ctl.setSearch('')}
        >
          <X size={12} />
        </button>
      )}
    </label>
  )
}
