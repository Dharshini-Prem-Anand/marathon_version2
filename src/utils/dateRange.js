// Resolves a FilterBar date-range label into an inclusive [start, end) window.
// `customBounds` ({ start, end } Dates) supplies the window for 'Custom
// Range' — the label alone doesn't carry it, since it comes from the mini
// calendar picker rather than being derived from `now`.
export function dateRangeBounds(label, now = new Date(), customBounds = null) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const quarterStart = (d) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)
  // Unbounded — used for 'All Dates' and any label this function doesn't
  // recognise (including 'Custom Range' before the user has picked both ends).
  const unbounded = { start: new Date(0), end: new Date(8.64e15) }

  switch (label) {
    case 'Today':
      return { start: today, end: tomorrow }
    case 'Last 7 Days':
      return { start: addDays(today, -6), end: tomorrow }
    case 'Last 30 Days':
      return { start: addDays(today, -29), end: tomorrow }
    case 'Last 90 Days':
      return { start: addDays(today, -89), end: tomorrow }
    case 'This Month':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: tomorrow }
    case 'Last Month':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 1),
      }
    case 'This Quarter':
      return { start: quarterStart(now), end: tomorrow }
    case 'Last Quarter': {
      const thisQ = quarterStart(now)
      return { start: new Date(thisQ.getFullYear(), thisQ.getMonth() - 3, 1), end: thisQ }
    }
    case 'Year to Date':
      return { start: new Date(now.getFullYear(), 0, 1), end: tomorrow }
    case 'Custom Range':
      if (!customBounds?.start || !customBounds?.end) return unbounded
      return { start: startOfDay(customBounds.start), end: addDays(startOfDay(customBounds.end), 1) }
    case 'All Dates':
    default:
      return unbounded
  }
}

// The FilterBar option whose window is unbounded. A cross-page link selects a
// row the current window may exclude, so the target page switches to this
// rather than landing on the wrong row.
export const ALL_DATES_RANGE = 'All Dates'

// Live rows carry dates in three shapes: an ISO timestamp
// (EmailMetadata.ReceivedDateTime), an ISO date (Invoices.CreationDate,
// "2025-01-06") and, on a few invoice rows, DD/MM/YYYY ("22/08/2026").
//
// A date-only string is deliberately NOT handed to `new Date()`, which reads
// it as UTC midnight — west of Greenwich that lands on the previous local day
// and would shift the row into the wrong window. Anything unrecognised
// returns null.
export function parseRowDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

  const text = String(value).trim()

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text)
  if (isoDate) return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]))

  const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text)
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]))

  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

// Builds the predicate a queue filters its rows by. A row whose date is
// missing or unparseable can't be placed in the window, so it's excluded
// rather than shown in every range.
export function dateRangeFilter(rangeLabel, now = new Date(), customBounds = null) {
  const { start, end } = dateRangeBounds(rangeLabel, now, customBounds)
  return (value) => {
    const date = parseRowDate(value)
    return Boolean(date) && date >= start && date < end
  }
}
