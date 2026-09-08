export default function PaneSplitter({ onMouseDown }) {
  return (
    <div
      className="invoice-preview-splitter"
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize invoice preview"
    />
  )
}
