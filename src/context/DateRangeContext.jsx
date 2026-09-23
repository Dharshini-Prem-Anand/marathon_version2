import { createContext, useContext, useState } from 'react'

export const DEFAULT_DATE_RANGE = 'Today'

const DateRangeContext = createContext(null)

// One Date Range, shared by every page for the life of the tab: picking
// "Last 7 Days" on the Dashboard and switching to Pre-Validation shows that
// same selection there too. Deliberately plain React state rather than
// localStorage/sessionStorage — a hard refresh remounts the whole app, so the
// range resets to the default with no extra code, matching how the rest of
// the app's per-session state already behaves.
export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE)
  const [appliedDateRange, setAppliedDateRange] = useState(DEFAULT_DATE_RANGE)
  // { start, end } Dates for the 'Custom Range' option, picked from the mini
  // calendar — null until the user has chosen both ends.
  const [customRange, setCustomRange] = useState(null)

  const value = {
    dateRange,
    appliedDateRange,
    customRange,
    setDateRange,
    setCustomRange,
    // Commits the current draft selection — what a page's own "Go" click calls.
    applyDateRange: () => setAppliedDateRange(dateRange),
    // Bypasses the draft/apply split entirely, for a cross-page deep link that
    // must widen the window immediately with no "Go" click in between.
    setDateRangeImmediate: (value) => {
      setDateRange(value)
      setAppliedDateRange(value)
    },
    resetDateRange: () => {
      setDateRange(DEFAULT_DATE_RANGE)
      setAppliedDateRange(DEFAULT_DATE_RANGE)
      setCustomRange(null)
    },
  }

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>
}

export function useSharedDateRange() {
  const ctx = useContext(DateRangeContext)
  if (!ctx) throw new Error('useSharedDateRange must be used within a DateRangeProvider')
  return ctx
}
