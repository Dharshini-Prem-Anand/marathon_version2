import { useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import MiniCalendar from './MiniCalendar'

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
  'All Dates',
]

function formatCustomRangeLabel(customRange) {
  if (!customRange?.start || !customRange?.end) return null
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(customRange.start)} – ${fmt(customRange.end)}`
}

export default function FilterBar({
  fields,
  values,
  onFieldChange,
  dateRangeLabel = 'Last 7 Days',
  dateRangeValue,
  onDateRangeChange,
  dateRangeOptions,
  dateFieldLabel = 'Date Range',
  customRange,
  onCustomRangeChange,
  personaField,
  personaValue,
  onPersonaChange,
  hideResetButton,
  hideGoButton,
  onGo,
  onReset,
}) {
  const options =
    dateRangeOptions ??
    (defaultDateRangeOptions.includes(dateRangeLabel)
      ? defaultDateRangeOptions
      : [dateRangeLabel, ...defaultDateRangeOptions])
  const [internalDateRange, setInternalDateRange] = useState(dateRangeLabel)
  // Controlled when the parent passes dateRangeValue, uncontrolled otherwise.
  const dateRange = dateRangeValue ?? internalDateRange
  const [calendarOpen, setCalendarOpen] = useState(false)
  const dateFieldRef = useRef(null)

  const handleDateRangeChange = (value) => {
    setInternalDateRange(value)
    onDateRangeChange?.(value)
    // Nothing to pick a window from yet, so open the calendar right away
    // instead of silently falling back to "every date".
    if (value === 'Custom Range') setCalendarOpen(true)
  }

  const customRangeLabel = dateRange === 'Custom Range' ? formatCustomRangeLabel(customRange) : null

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
        <div className="filter-date-select" ref={dateFieldRef}>
          <select value={dateRange} onChange={(e) => handleDateRangeChange(e.target.value)}>
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          {dateRange === 'Custom Range' ? (
            <button
              type="button"
              className="filter-date-icon-btn"
              onClick={() => setCalendarOpen((v) => !v)}
              aria-label="Choose custom date range"
            >
              <Calendar size={15} />
            </button>
          ) : (
            <Calendar size={15} className="filter-date-icon" />
          )}
        </div>
        {customRangeLabel && <span className="filter-date-custom-label">{customRangeLabel}</span>}
      </div>

      {calendarOpen && (
        <MiniCalendar
          anchorRef={dateFieldRef}
          initialStart={customRange?.start}
          initialEnd={customRange?.end}
          onCancel={() => setCalendarOpen(false)}
          onApply={(start, end) => {
            onCustomRangeChange?.({ start, end })
            setCalendarOpen(false)
          }}
        />
      )}

      {personaField && (
        <div className="filter-field">
          <label>{personaField.label}</label>
          <select value={personaValue} onChange={(e) => onPersonaChange(e.target.value)}>
            {personaField.options.map((opt) => (
              <option key={opt} disabled={opt !== personaValue}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {!hideGoButton && (
        <button className="btn-go" onClick={onGo}>
          Go
        </button>
      )}
      {!hideResetButton && (
        <button className="btn-link" onClick={onReset}>
          Reset
        </button>
      )}
    </div>
  )
}
