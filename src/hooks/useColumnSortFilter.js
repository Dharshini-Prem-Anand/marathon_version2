import { useMemo, useState } from 'react'

// Drives the per-column "Sort Ascending / Sort Descending / Filter" header menu.
// `columns` maps a column key to an accessor returning the raw value that column
// represents for a row — used for both the quick filter (stringified, case-insensitive
// contains) and the sort comparator (numeric/date-aware, falls back to string compare).
//
// `exactFilterKeys` marks columns whose filter is a pick-list (SortFilterTh's
// `filterOptions`) rather than free text — those match the whole value, not a
// substring, so an option like "Mismatch" doesn't also match "Partial Mismatch".
export function useColumnSortFilter(rows, columns, initialSort = { key: null, dir: null }, { exactFilterKeys = [] } = {}) {
  const [sort, setSort] = useState(initialSort)
  const [filters, setFilters] = useState({})
  const [openKey, setOpenKey] = useState(null)
  const [search, setSearch] = useState('')

  const processedRows = useMemo(() => {
    let out = rows

    const searchTerm = search.trim().toLowerCase()
    if (searchTerm) {
      const accessors = Object.values(columns)
      out = out.filter((row) =>
        accessors.some((accessor) => String(accessor(row) ?? '').toLowerCase().includes(searchTerm))
      )
    }

    for (const [key, term] of Object.entries(filters)) {
      if (!term) continue
      const accessor = columns[key]
      if (!accessor) continue
      const needle = term.toLowerCase()
      const exact = exactFilterKeys.includes(key)
      out = out.filter((row) => {
        const value = String(accessor(row) ?? '').toLowerCase()
        return exact ? value === needle : value.includes(needle)
      })
    }

    if (sort.key && sort.dir) {
      const accessor = columns[sort.key]
      if (accessor) {
        const dirMul = sort.dir === 'asc' ? 1 : -1
        out = [...out].sort((a, b) => {
          const av = accessor(a)
          const bv = accessor(b)
          if (av == null && bv == null) return 0
          if (av == null) return 1
          if (bv == null) return -1
          if (av instanceof Date && bv instanceof Date) return dirMul * (av.getTime() - bv.getTime())
          if (typeof av === 'number' && typeof bv === 'number') return dirMul * (av - bv)
          return dirMul * String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' })
        })
      }
    }

    return out
  }, [rows, filters, sort, columns, search, exactFilterKeys])

  return {
    rows: processedRows,
    sort,
    filters,
    openKey,
    search,
    setSearch,
    open: (key) => setOpenKey(key),
    close: () => setOpenKey(null),
    applySort: (key, dir) => {
      setSort((prev) => (prev.key === key && prev.dir === dir ? { key: null, dir: null } : { key, dir }))
      setOpenKey(null)
    },
    setFilter: (key, value) => setFilters((prev) => ({ ...prev, [key]: value })),
  }
}
