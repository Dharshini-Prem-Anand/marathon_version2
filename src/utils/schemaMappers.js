// Maps the Document Information Extraction schema payload (/getDieSchema) into
// the rows the Schema Configuration dialog renders.
//
// DIE returns a lot of extraction plumbing per field — defaultExtractor,
// setupTypeVersion, formatting, formattingTypeVersion, modelArtifactId. None of
// that is editable here, so only the columns the dialog shows are lifted out;
// the untouched original is kept on `raw` so a future save can round-trip the
// field without dropping what wasn't displayed.

// Exactly the list DIE offers, in its order.
export const DATA_TYPES = [
  'string',
  'number',
  'date',
  'discount',
  'currency',
  'country/region',
  'list of values',
]
// Every field is created with DIE's automatic extractor; not user-selectable.
export const SETUP_TYPE = 'auto'

function mapField(field, section) {
  return {
    section,
    name: field?.name ?? '',
    description: field?.description ?? '',
    dataType: field?.formattingType ?? 'string',
    raw: field,
  }
}

export function mapDieSchema(payload) {
  if (!payload || typeof payload !== 'object') {
    return { name: '—', description: '', version: '', state: '', headerFields: [], lineItemFields: [] }
  }

  return {
    name: payload.name ?? '—',
    description: payload.schemaDescription ?? '',
    documentType: payload.documentType ?? '',
    version: payload.version ?? '',
    state: payload.state ?? '',
    id: payload.id ?? '',
    headerFields: (payload.headerFields ?? []).map((f) => mapField(f, 'header')),
    lineItemFields: (payload.lineItemFields ?? []).map((f) => mapField(f, 'lineItem')),
  }
}

// A blank row for the Add pane.
export function emptyField(section) {
  return { section, name: '', description: '', dataType: 'string', raw: null }
}

// Builds the /updateDieSchemaFields body.
//
// Both arrays carry the COMPLETE field list, not just the one being saved:
// the backend forwards this to Document AI as a schema POST, which replaces
// the field set rather than patching it — so anything left out would be
// dropped from the schema.
//
// An add appends to its section; an edit replaces the matching entry, keyed on
// the field's ORIGINAL name (`raw.name`) so renaming a field still lands on
// the right row instead of adding a duplicate.
//
// Note: `label` is deliberately absent — the endpoint's contract has only
// name / description / data_type / setup_type.
function toEntry(field) {
  return {
    name: (field.name ?? '').trim(),
    description: (field.description ?? '').trim(),
    data_type: field.dataType,
    setup_type: SETUP_TYPE,
  }
}

export function buildSchemaFieldPayload(schema, field, isNew) {
  const edited = toEntry(field)

  const merge = (list, section) => {
    const entries = list.map(toEntry)
    if (field.section !== section) return entries
    if (isNew) return [...entries, edited]

    const originalName = field.raw?.name ?? field.name
    const replaced = entries.map((e) => (e.name === originalName ? edited : e))
    // Guard against an edit whose original row isn't in the list.
    return replaced.some((e) => e.name === edited.name) ? replaced : [...entries, edited]
  }

  return {
    schema_id: schema.id,
    version: schema.version,
    header_fields: merge(schema.headerFields, 'header'),
    line_item_fields: merge(schema.lineItemFields, 'lineItem'),
  }
}

// DIE field names are used verbatim as extraction keys and as the FieldName in
// ExtractedHeaderFields / ExtractedLineItemFields, so they can't contain
// spaces or punctuation. Returns null when valid, otherwise the reason.
export function validateFieldName(name, existingNames = []) {
  const value = (name ?? '').trim()
  if (!value) return null // nothing typed yet — not an error, just can't save

  if (/\s/.test(value)) {
    return 'No spaces allowed. Join the words and capitalise each one, e.g. VendorName.'
  }
  if (!/^[A-Za-z]/.test(value)) {
    return 'Must start with a letter.'
  }
  if (!/^[A-Za-z0-9]+$/.test(value)) {
    return 'Letters and numbers only — no spaces, hyphens, underscores or symbols.'
  }
  if (existingNames.some((n) => n.toLowerCase() === value.toLowerCase())) {
    return `A field called "${value}" already exists in this section.`
  }
  return null
}
