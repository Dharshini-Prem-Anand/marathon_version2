import { useState, useCallback } from 'react'

export function useFilters(fields, { live = false } = {}) {
  const initial = Object.fromEntries(fields.map((f) => [f.label, f.value]))
  const [draft, setDraft] = useState(initial)
  const [applied, setApplied] = useState(initial)

  const setField = useCallback(
    (label, value) => {
      setDraft((prev) => {
        const next = { ...prev, [label]: value }
        if (live) setApplied(next)
        return next
      })
    },
    [live]
  )

  const apply = useCallback(() => setApplied(draft), [draft])

  return { draft, applied, setField, apply }
}

export function matchesCompanyCode(selected) {
  return selected === 'All' || selected === '1000 - Marathon US'
}

export function matchesOption(selected, actual) {
  return selected === 'All' || actual === selected
}

// Fills a filter's options from the values actually present in the loaded
// rows, so a dropdown can't offer a choice that matches nothing (or miss one
// that does — EmailMetadata.Status is "Pending Review", which wasn't in any
// hardcoded list).
//
// A label listed in `valuesByLabel` is backed by the service and shows nothing
// but what came back: just 'All' while the call is in flight, and just 'All'
// if that column is empty on every row. It must never fall back to a sample
// list — a vendor the user can pick but that exists nowhere in the data reads
// as real.
//
// A label with no entry in `valuesByLabel` keeps the options it was defined
// with; that's for fields the service has no column for at all, e.g. Company
// Code.
export function withLiveOptions(fields, valuesByLabel) {
  return fields.map((field) => {
    const values = valuesByLabel[field.label]
    if (!values) return field

    const options = [...new Set(values.flat().map((v) => (v == null ? '' : String(v).trim())))]
      .filter((v) => v && v !== '—')
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    return { ...field, options: ['All', ...options] }
  })
}
