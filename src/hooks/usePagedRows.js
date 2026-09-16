import { useEffect, useState } from 'react'

export const PAGE_SIZE = 5

// Collapsed: first `pageSize` rows. Once expanded, page through the rest.
// `alwaysExpanded` skips the collapsed state entirely, so the table is
// paginated from the start with no "View All" step.
export function usePagedRows(rows, pageSize = PAGE_SIZE, { alwaysExpanded = false } = {}) {
  const [expanded, setExpanded] = useState(alwaysExpanded)
  const [page, setPage] = useState(0)

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  // A new result set (filters changed) collapses back to page one.
  useEffect(() => {
    setExpanded(alwaysExpanded)
    setPage(0)
  }, [total, alwaysExpanded])

  const currentPage = Math.min(page, pageCount - 1)
  const visibleRows = expanded
    ? rows.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    : rows.slice(0, pageSize)

  return {
    visibleRows,
    pageSize,
    total,
    pageCount,
    currentPage,
    expanded,
    showViewAll: !expanded && total > pageSize,
    firstShown: expanded ? currentPage * pageSize + 1 : 1,
    lastShown: expanded ? Math.min(currentPage * pageSize + pageSize, total) : visibleRows.length,
    expand: () => setExpanded(true),
    collapse: () => {
      setExpanded(alwaysExpanded)
      setPage(0)
    },
    goToPage: setPage,
  }
}
