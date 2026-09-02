// Resolves a FilterBar date-range label into an inclusive [start, end) window.
export function dateRangeBounds(label, now = new Date()) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const quarterStart = (d) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)

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
    default:
      // Custom Range / unknown: don't constrain.
      return { start: new Date(0), end: new Date(8.64e15) }
  }
}

export function isTodayRange(label) {
  return label === 'Today'
}

// Mock rows carry a clock time but no date. Spread them deterministically over
// the recent past so the date-range filter has something meaningful to act on.
const MOCK_DAY_OFFSETS = [0, 0, 1, 2, 3, 5, 6, 8, 11, 14, 18, 22, 27, 33, 40, 48, 57, 66, 74, 88, 100, 130, 200, 300]

export function mockRowDate(row, index, now = new Date()) {
  const offset = MOCK_DAY_OFFSETS[index % MOCK_DAY_OFFSETS.length]
  const [clock, meridiem] = String(row.time).split(' ')
  const [rawHour, minute] = clock.split(':').map(Number)
  let hour = rawHour % 12
  if (meridiem === 'PM') hour += 12
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, hour, minute || 0, 0)
}
