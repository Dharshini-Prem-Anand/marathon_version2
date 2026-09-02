import { useState } from 'react'
import { Calendar } from 'lucide-react'

const defaultDateRangeOptions = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days',
  'This Month',
  'Last Month',
  'This Quarter',
  'Last Quarter',
  'Year to Date',
  'Custom Range',
]

export default function FilterBar({
  fields,
  values,
  onFieldChange,
  dateRangeLabel = 'Last 7 Days',
  dateRangeValue,
  onDateRangeChange,
  dateRangeOptions,
  dateFieldLabel = 'Date Range',
  personaField,
  personaValue,
  onPersonaChange,
  hideAdaptLink,
  hideGoButton,
  onGo,
}) {
  const options =
    dateRangeOptions ??
    (defaultDateRangeOptions.includes(dateRangeLabel)
      ? defaultDateRangeOptions
      : [dateRangeLabel, ...defaultDateRangeOptions])
  const [internalDateRange, setInternalDateRange] = useState(dateRangeLabel)
  // Controlled when the parent passes dateRangeValue, uncontrolled otherwise.
  const dateRange = dateRangeValue ?? internalDateRange
  const handleDateRangeChange = (value) => {
    setInternalDateRange(value)
    onDateRangeChange?.(value)
  }

  return (
    <div className="filter-bar">
      {fields.map((f) => (
        <div className="filter-field" key={f.label}>
          <label>{f.label}</label>
          <select value={values[f.label]} onChange={(e) => onFieldChange(f.label, e.target.value)}>
            {f.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}

      <div className="filter-field">
        <label>{dateFieldLabel}</label>
        <div className="filter-date-select">
          <select value={dateRange} onChange={(e) => handleDateRangeChange(e.target.value)}>
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <Calendar size={15} className="filter-date-icon" />
        </div>
      </div>

      {personaField && (
        <div className="filter-field">
          <label>{personaField.label}</label>
          <select value={personaValue} onChange={(e) => onPersonaChange(e.target.value)}>
            {personaField.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hideGoButton && (
        <button className="btn-go" onClick={onGo}>
          Go
        </button>
      )}
      {!hideAdaptLink && <button className="btn-link">Adapt Filters</button>}
    </div>
  )
}
