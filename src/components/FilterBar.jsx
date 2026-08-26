import { Calendar } from 'lucide-react'

export default function FilterBar({
  fields,
  dateRangeLabel = 'Last 7 Days',
  dateFieldLabel = 'Date Range',
  personaField,
  hideAdaptLink,
  hideGoButton,
}) {
  return (
    <div className="filter-bar">
      {fields.map((f) => (
        <div className="filter-field" key={f.label}>
          <label>{f.label}</label>
          <select defaultValue={f.value} onChange={() => {}}>
            <option>{f.value}</option>
          </select>
        </div>
      ))}

      <div className="filter-field">
        <label>{dateFieldLabel}</label>
        <div className="filter-date">
          <span>{dateRangeLabel}</span>
          <Calendar size={15} />
        </div>
      </div>

      {personaField && (
        <div className="filter-field">
          <label>{personaField.label}</label>
          <select defaultValue={personaField.value} onChange={() => {}}>
            <option>{personaField.value}</option>
          </select>
        </div>
      )}

      {!hideGoButton && <button className="btn-go">Go</button>}
      {!hideAdaptLink && <button className="btn-link">Adapt Filters</button>}
    </div>
  )
}
