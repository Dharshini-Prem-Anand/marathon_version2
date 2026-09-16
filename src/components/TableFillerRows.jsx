// Pads a table body out to a fixed row count with blank rows, so the panel
// doesn't shrink on a partial last page or a filtered-down result set.
export default function TableFillerRows({ count, colSpan }) {
  if (count <= 0) return null

  return Array.from({ length: count }, (_, i) => (
    <tr key={`filler-${i}`} className="table-filler-row" aria-hidden="true">
      <td colSpan={colSpan}>&nbsp;</td>
    </tr>
  ))
}
