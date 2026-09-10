import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpNarrowWide, ArrowDownNarrowWide, Filter, ChevronDown } from 'lucide-react'

// A <th> whose label opens a menu with Sort Ascending / Sort Descending / Filter,
// backed by a useColumnSortFilter() controller (`ctl`). Menu renders in a portal
// so it never gets clipped by a scrollable .table-wrap.
//
// `dragProps` / `dragState` are optional and come from useColumnOrder() when a
// table lets the user rearrange its columns; without them the header behaves
// exactly as before.
export default function SortFilterTh({ columnKey, label, ctl, className, dragProps, dragState }) {
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)
  const open = ctl.openKey === columnKey
  const filterValue = ctl.filters[columnKey] || ''
  const active = ctl.sort.key === columnKey || Boolean(filterValue)

  function handleTriggerClick() {
    if (open) {
      ctl.close()
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left })
    ctl.open(columnKey)
  }

  useEffect(() => {
    if (!open) return
    function onDocPointerDown(e) {
      if (menuRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return
      ctl.close()
    }
    function onScrollOrResize() {
      ctl.close()
    }
    document.addEventListener('mousedown', onDocPointerDown)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open, ctl])

  const classes = [
    'th-sortfilter',
    className,
    dragProps ? 'th-draggable' : null,
    dragState ? `th-drag-${dragState}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <th className={classes} {...dragProps}>
      <button
        type="button"
        ref={triggerRef}
        className={`th-sortfilter-trigger${active ? ' active' : ''}`}
        onClick={handleTriggerClick}
        title={dragProps ? 'Drag to move this column' : undefined}
      >
        <span>{label}</span>
        <ChevronDown size={12} />
      </button>

      {open &&
        pos &&
        createPortal(
          <div className="th-sortfilter-menu" style={{ top: pos.top, left: pos.left }} ref={menuRef}>
            <button
              type="button"
              className={`th-sortfilter-item${ctl.sort.key === columnKey && ctl.sort.dir === 'asc' ? ' selected' : ''}`}
              onClick={() => ctl.applySort(columnKey, 'asc')}
            >
              <ArrowUpNarrowWide size={14} />
              Sort Ascending
            </button>
            <button
              type="button"
              className={`th-sortfilter-item${ctl.sort.key === columnKey && ctl.sort.dir === 'desc' ? ' selected' : ''}`}
              onClick={() => ctl.applySort(columnKey, 'desc')}
            >
              <ArrowDownNarrowWide size={14} />
              Sort Descending
            </button>
            <div className="th-sortfilter-divider" />
            <label className="th-sortfilter-filter">
              <Filter size={13} />
              <input
                type="text"
                placeholder="Filter"
                value={filterValue}
                onChange={(e) => ctl.setFilter(columnKey, e.target.value)}
                autoFocus
              />
            </label>
          </div>,
          document.body
        )}
    </th>
  )
}
