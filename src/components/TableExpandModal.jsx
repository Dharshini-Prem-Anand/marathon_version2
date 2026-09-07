import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

// Positions the modal centered over wherever the source table actually sits
// on screen (clamped to stay fully in the viewport) instead of dead-center
// of the page, so it reads as that table zooming up in place. `ready` stays
// false for the measuring pass so the box's un-transformed size is read
// before the zoom-in animation's `scale()` would otherwise skew it.
function useAnchoredPosition(anchorRef) {
  const boxRef = useRef(null)
  const [style, setStyle] = useState({ opacity: 0 })
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const anchorEl = anchorRef?.current
    const boxEl = boxRef.current
    if (!anchorEl || !boxEl) return

    const anchorRect = anchorEl.getBoundingClientRect()
    const boxRect = boxEl.getBoundingClientRect()
    const margin = 16
    const cx = anchorRect.left + anchorRect.width / 2
    const cy = anchorRect.top + anchorRect.height / 2

    const maxLeft = Math.max(margin, window.innerWidth - boxRect.width - margin)
    const maxTop = Math.max(margin, window.innerHeight - boxRect.height - margin)
    const left = Math.min(Math.max(cx - boxRect.width / 2, margin), maxLeft)
    const top = Math.min(Math.max(cy - boxRect.height / 2, margin), maxTop)

    setStyle({ left, top, opacity: 1 })
    setReady(true)
  }, [anchorRef])

  return { boxRef, style, ready }
}

export default function TableExpandModal({ title, onClose, anchorRef, children }) {
  const { boxRef, style, ready } = useAnchoredPosition(anchorRef)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="table-modal-overlay" onClick={onClose}>
      <div
        className={`table-modal table-modal-anchored${ready ? ' table-modal-pop' : ''}`}
        style={style}
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="table-modal-header">
          <span className="table-modal-title">{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close expanded table">
            <X size={18} />
          </button>
        </div>
        <div className="table-modal-body">{children}</div>
      </div>
    </div>
  )
}
