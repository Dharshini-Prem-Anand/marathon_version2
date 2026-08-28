import { Search } from 'lucide-react'
import { kpiFilters } from '../data'

export default function KpiFilterBar({ values, onFieldChange, searchValue, onSearchChange, onApply }) {
  return (
    <div className="filter-bar">
      <div className="filter-field kpi-search-field">
        <label>Search Metrics</label>
        <div className="vim-search-input">
          <Search size={15} />
          <input
            type="text"
            placeholder={kpiFilters.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {kpiFilters.fields.map((f) => (
        <div className="filter-field" key={f.label}>
          <label>{f.label}</label>
          <select value={values[f.label]} onChange={(e) => onFieldChange(f.label, e.target.value)}>
            {f.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}

      <button className="btn-go" onClick={onApply}>
        Apply
      </button>
    </div>
  )
}
