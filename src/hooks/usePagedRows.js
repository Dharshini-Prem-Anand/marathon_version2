import { useEffect, useState } from 'react'

export const PAGE_SIZE = 5

// Collapsed: first `pageSize` rows. Once expanded, page through the rest.
export function usePagedRows(rows, pageSize = PAGE_SIZE) {
  const [expanded, setExpanded] = useState(false)
  const [page, setPage] = useState(0)

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  // A new result set (filters changed) collapses back to page one.
  useEffect(() => {
    setExpanded(false)
    setPage(0)
  }, [total])

  const currentPage = Math.min(page, pageCount - 1)
  const visibleRows = expanded
    ? rows.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    : rows.slice(0, pageSize)

  return {
    visibleRows,
    total,
    pageCount,
    currentPage,
    expanded,
    showViewAll: !expanded && total > pageSize,
    firstShown: expanded ? currentPage * pageSize + 1 : 1,
    lastShown: expanded ? Math.min(currentPage * pageSize + pageSize, total) : visibleRows.length,
    expand: () => setExpanded(true),
    collapse: () => {
      setExpanded(false)
      setPage(0)
    },
    goToPage: setPage,
  }
}
