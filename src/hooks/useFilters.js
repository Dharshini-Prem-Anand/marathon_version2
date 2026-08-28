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
