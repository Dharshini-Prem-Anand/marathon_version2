import { useEffect, useRef, useState } from 'react'

// Drag-to-resize state for a two-pane split. `containerRef` goes on the flex
// row, `paneRef` on the resizing pane. While dragging, the pane's flex-basis
// is written straight to the DOM (bypassing React) so the drag doesn't force
// a re-render of everything on the page — including the line-items table —
// on every pixel of mouse movement, which is what made it feel laggy.
// `ratio` state only updates once, on mouseup, so React's picture stays in
// sync without paying the per-frame render cost during the drag itself.
export function useSplitRatio(initial, min = 0.28, max = 0.8) {
  const [ratio, setRatio] = useState(initial)
  const containerRef = useRef(null)
  const paneRef = useRef(null)
  const draggingRef = useRef(false)
  const ratioRef = useRef(initial)

  useEffect(() => {
    function onMouseMove(e) {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const next = Math.min(max, Math.max(min, (e.clientX - rect.left) / rect.width))
      ratioRef.current = next
      if (paneRef.current) paneRef.current.style.flexBasis = `${next * 100}%`
    }
    function onMouseUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      window.document.body.classList.remove('is-resizing-cols')
      setRatio(ratioRef.current)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [min, max])

  function startResize(e) {
    e.preventDefault()
    ratioRef.current = ratio
    draggingRef.current = true
    window.document.body.classList.add('is-resizing-cols')
  }

  return { ratio, paneRef, containerRef, startResize }
}
