import { ChevronLeft, ChevronRight } from 'lucide-react'

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

// Bounds the page strip to a fixed number of slots — first, last, a window
// around the current page, and '…' for whatever's skipped — instead of one
// button per page, which overruns the bar once there are dozens of pages.
function pageWindow(current, count, siblingCount = 1) {
  const totalSlots = siblingCount * 2 + 5
  if (count <= totalSlots) return range(1, count)

  const leftSibling = Math.max(current - siblingCount, 1)
  const rightSibling = Math.min(current + siblingCount, count)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < count - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblingCount * 2), '…', count]
  }
  if (showLeftDots && !showRightDots) {
    return [1, '…', ...range(count - (3 + siblingCount * 2) + 1, count)]
  }
  return [1, '…', ...range(leftSibling, rightSibling), '…', count]
}

export default function TablePagination({ paging, showCollapse = true }) {
  const { total, pageCount, currentPage, firstShown, lastShown, goToPage, collapse } = paging
  const current = currentPage + 1

  return (
    <div className="table-pagination">
      <div className="table-pagination-controls">
        <button
          className="pagination-nav-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={15} />
          Previous
        </button>
        {pageWindow(current, pageCount).map((n, i) =>
          n === '…' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={n}
              className={`pagination-page${n === current ? ' is-active' : ''}`}
              onClick={() => goToPage(n - 1)}
              aria-current={n === current ? 'page' : undefined}
            >
              {n}
            </button>
          )
        )}
        <button
          className="pagination-nav-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="table-pagination-meta">
        <span className="table-pagination-info">
          Showing {firstShown}–{lastShown} of {total} results
        </span>
        {showCollapse && (
          <button className="btn-link" onClick={collapse}>
            Show Less
          </button>
        )}
      </div>
    </div>
  )
}

