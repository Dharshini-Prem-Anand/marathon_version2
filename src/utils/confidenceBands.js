// Extraction confidence bands — one definition for every confidence badge on
// the Document AI & Extraction page, so the colour a field is painted always
// matches the legend printed above it.
//
// The bands are the ones the business uses: below 51% the value needs
// re-keying, 51-80% needs a look, 80% and above is trusted. Boundary values
// belong to the higher band (51% is Medium, 80% is High), which is how the
// labels read.

export const CONFIDENCE_BANDS = [
  {
    key: 'low',
    label: '0% - 51%',
    tone: 'red',
    trend: 'down',
    name: 'Low confidence',
    tip: 'The model is unsure of the value it read. Check it against the document and re-key it before the invoice moves on.',
  },
  {
    key: 'medium',
    label: '51% - 80%',
    tone: 'orange',
    trend: 'flat',
    name: 'Medium confidence',
    tip: 'The value is probably right but worth a look — these are the fields that most often cause pre-validation failures.',
  },
  {
    key: 'high',
    label: '80% - 100%',
    tone: 'green',
    trend: 'up',
    name: 'High confidence',
    tip: 'The value can be trusted as extracted and needs no manual check.',
  },
]

// Accepts either a number or the formatted "94%" the mappers produce.
// Anything unparseable ('—' for a field the service returned no score for)
// stays grey rather than being counted as low confidence.
export function confidenceTone(confidence) {
  const n = parseInt(confidence, 10)
  if (Number.isNaN(n)) return 'gray'
  if (n >= 80) return 'green'
  if (n >= 51) return 'orange'
  return 'red'
}
