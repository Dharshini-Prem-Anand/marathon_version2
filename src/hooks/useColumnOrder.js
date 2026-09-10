import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Lets the user drag table headers into whatever order they want.
//
// The order is held as a list of column KEYS rather than of columns, so it
// survives the column set changing underneath it: keys already placed keep
// their position, a new key lands at the end, a key that disappears drops
// out. That matters for the extraction tables, where the columns are whatever
// fields the schema returned for the selected document — pick a different
// document and the list can differ.
export function useColumnOrder(columns) {
  const [order, setOrder] = useState(() => columns.map((c) => c.key))
  const [draggingKey, setDraggingKey] = useState(null)
  const [overKey, setOverKey] = useState(null)

  // Depend on the key list itself, not the array identity — a re-fetch that
  // returns the same fields must not throw away the user's arrangement.
  const keySignature = columns.map((c) => c.key).join('\u0000')

  useEffect(() => {
    const incoming = keySignature ? keySignature.split('\u0000') : []
    setOrder((prev) => {
      const kept = prev.filter((k) => incoming.includes(k))
      const added = incoming.filter((k) => !kept.includes(k))
      const next = [...kept, ...added]
      const unchanged = next.length === prev.length && next.every((k, i) => k === prev[i])
      return unchanged ? prev : next
    })
  }, [keySignature])

  const ordered = useMemo(() => {
    const byKey = new Map(columns.map((c) => [c.key, c]))
    const arranged = order.map((k) => byKey.get(k)).filter(Boolean)
    // Guard the first render after the columns change, before the effect runs.
    return arranged.length === columns.length ? arranged : columns
  }, [columns, order])

  // Dropping onto a column puts the dragged one at that column's index, which
  // is what the drop indicator on the header shows.
  const moveColumn = useCallback((fromKey, toKey) => {
    if (!fromKey || !toKey || fromKey === toKey) return
    setOrder((prev) => {
      const from = prev.indexOf(fromKey)
      const to = prev.indexOf(toKey)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      next.splice(from, 1)
      next.splice(to, 0, fromKey)
      return next
    })
  }, [])

  const reset = useCallback(() => setOrder(columns.map((c) => c.key)), [columns])

  const dragPropsFor = useCallback(
    (key) => ({
      draggable: true,
      onDragStart: (e) => {
        setDraggingKey(key)
        e.dataTransfer.effectAllowed = 'move'
        // Firefox refuses to start a drag unless the transfer carries data.
        e.dataTransfer.setData('text/plain', key)
      },
      onDragOver: (e) => {
        if (!draggingKey || draggingKey === key) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverKey(key)
      },
      onDragLeave: () => setOverKey((k) => (k === key ? null : k)),
      onDrop: (e) => {
        e.preventDefault()
        moveColumn(e.dataTransfer.getData('text/plain') || draggingKey, key)
        setDraggingKey(null)
        setOverKey(null)
      },
      onDragEnd: () => {
        setDraggingKey(null)
        setOverKey(null)
      },
    }),
    [draggingKey, moveColumn]
  )

  // These tables scroll sideways inside a narrow pane, so a column can easily
  // be off-screen while another is being dragged. Hold the pointer near either
  // edge of the scroller and it pans, the same way a file manager does.
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !draggingKey) return

    const EDGE = 56
    const STEP = 14
    let speed = 0
    let frame = 0

    const tick = () => {
      if (!speed) {
        frame = 0
        return
      }
      el.scrollLeft += speed
      frame = requestAnimationFrame(tick)
    }

    const onDragOver = (e) => {
      const box = el.getBoundingClientRect()
      if (e.clientX < box.left + EDGE) speed = -STEP
      else if (e.clientX > box.right - EDGE) speed = STEP
      else speed = 0
      if (speed && !frame) frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      speed = 0
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    el.addEventListener('dragover', onDragOver)
    el.addEventListener('drop', stop)
    window.addEventListener('dragend', stop)
    return () => {
      stop()
      el.removeEventListener('dragover', onDragOver)
      el.removeEventListener('drop', stop)
      window.removeEventListener('dragend', stop)
    }
  }, [draggingKey])

  const dragStateFor = useCallback(
    (key) => (draggingKey === key ? 'dragging' : overKey === key ? 'over' : null),
    [draggingKey, overKey]
  )

  return { columns: ordered, dragPropsFor, dragStateFor, moveColumn, reset, scrollRef, isDragging: Boolean(draggingKey) }
}
