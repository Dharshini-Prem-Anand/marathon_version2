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
export const SETUP_TYPES = ['auto', 'manual']

function mapField(field, section) {
  return {
    section,
    name: field?.name ?? '',
    label: field?.label ?? '',
    description: field?.description ?? '',
    dataType: field?.formattingType ?? 'string',
    setupType: field?.setup?.type ?? 'auto',
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
  return { section, name: '', label: '', description: '', dataType: 'string', setupType: 'auto', raw: null }
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
    setup_type: field.setupType,
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
