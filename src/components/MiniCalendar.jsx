import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a, b) {
  return Boolean(a) && Boolean(b) && a.getTime() === startOfDay(b).getTime()
}

// Weeks (arrays of 7 Dates, or null for days outside the month) for the
// calendar grid, including the leading/trailing days from adjacent months.
function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// A small calendar popover, anchored under `anchorRef`, for picking a custom
// [start, end] date range. First click sets the start and clears the end;
// the next click sets the end (swapped into order if it lands before start).
export default function MiniCalendar({ anchorRef, initialStart, initialEnd, onApply, onCancel }) {
  const popoverRef = useRef(null)
  const [pos, setPos] = useState(null)
  const [viewMonth, setViewMonth] = useState(() => {
    const base = initialStart ?? new Date()
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  const [start, setStart] = useState(initialStart ? startOfDay(initialStart) : null)
  const [end, setEnd] = useState(initialEnd ? startOfDay(initialEnd) : null)

  useEffect(() => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 4, left: rect.left })
  }, [anchorRef])

  useEffect(() => {
    function onDocPointerDown(e) {
      if (popoverRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return
      onCancel()
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('mousedown', onDocPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [anchorRef, onCancel])

  if (!pos) return null

  function pickDay(day) {
    if (!start || (start && end)) {
      setStart(day)
      setEnd(null)
      return
    }
    if (day < start) {
      setEnd(start)
      setStart(day)
    } else {
      setEnd(day)
    }
  }

  function changeMonth(delta) {
    setViewMonth(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const weeks = monthGrid(viewMonth.year, viewMonth.month)
  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return createPortal(
    <div className="mini-calendar" style={{ top: pos.top, left: pos.left }} ref={popoverRef}>
      <div className="mini-calendar-header">
        <button type="button" className="icon-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="mini-calendar-month">{monthLabel}</span>
        <button type="button" className="icon-btn" onClick={() => changeMonth(1)} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mini-calendar-weekdays">
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div className="mini-calendar-week" key={wi}>
          {week.map((day, di) => {
            if (!day) return <span key={di} className="mini-calendar-day empty" />
            const inRange = start && end && day > start && day < end
            const isEdge = sameDay(start, day) || sameDay(end, day)
            const isToday = sameDay(new Date(), day)
            return (
              <button
                type="button"
                key={di}
                className={`mini-calendar-day${isEdge ? ' selected' : ''}${inRange ? ' in-range' : ''}${
                  isToday ? ' today' : ''
                }`}
                onClick={() => pickDay(day)}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      ))}

      <div className="mini-calendar-footer">
        <span className="mini-calendar-range-label">
          {start ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Start'}
          {' – '}
          {end ? end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'End'}
        </span>
        <div className="mini-calendar-actions">
          <button type="button" className="btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!start || !end}
            onClick={() => onApply(start, end)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
