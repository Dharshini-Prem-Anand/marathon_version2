import { Search, RefreshCw, Download } from 'lucide-react'
import { vimFilters } from '../data'

export default function VimFilterBar() {
  return (
    <div className="filter-bar vim-filter-bar">
      {vimFilters.map((f) => (
        <div className="filter-field" key={f.label}>
          <label>{f.label}</label>
          <select defaultValue={f.value} onChange={() => {}}>
            <option>{f.value}</option>
          </select>
        </div>
      ))}

      <div className="filter-field vim-search-field">
        <label>Search Invoice</label>
        <div className="vim-search-input">
          <input type="text" placeholder="Search by Invoice ID" readOnly />
          <Search size={15} />
        </div>
      </div>

      <button className="btn-outline btn-icon-label">
        <RefreshCw size={14} /> Refresh
      </button>
      <button className="btn-primary btn-icon-label">
        <Download size={14} /> Export
      </button>
    </div>
  )
}
