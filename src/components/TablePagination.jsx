import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TablePagination({ paging }) {
  const { total, pageCount, currentPage, firstShown, lastShown, goToPage, collapse } = paging

  return (
    <div className="table-pagination">
      <span className="table-pagination-info">
        {firstShown}–{lastShown} of {total}
      </span>
      <div className="table-pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            className={`pagination-page${i === currentPage ? ' is-active' : ''}`}
            onClick={() => goToPage(i)}
            aria-current={i === currentPage ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <button className="btn-link" onClick={collapse}>
        Show Less
      </button>
    </div>
  )
}

