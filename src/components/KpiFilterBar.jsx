import { Search } from 'lucide-react'
import { kpiFilters } from '../data'

export default function KpiFilterBar() {
  return (
    <div className="filter-bar">
      <div className="filter-field kpi-search-field">
        <label>Search Metrics</label>
        <div className="vim-search-input">
          <Search size={15} />
          <input type="text" placeholder={kpiFilters.searchPlaceholder} readOnly />
        </div>
      </div>

      <div className="filter-field">
        <label>Category</label>
        <select defaultValue={kpiFilters.category} onChange={() => {}}>
          <option>{kpiFilters.category}</option>
        </select>
      </div>

      <div className="filter-field">
        <label>Status</label>
        <select defaultValue={kpiFilters.status} onChange={() => {}}>
          <option>{kpiFilters.status}</option>
        </select>
      </div>

      <div className="filter-field">
        <label>Reporting Period</label>
        <select defaultValue={kpiFilters.reportingPeriod} onChange={() => {}}>
          <option>{kpiFilters.reportingPeriod}</option>
        </select>
      </div>

      <button className="btn-go">Apply</button>
    </div>
  )
}
