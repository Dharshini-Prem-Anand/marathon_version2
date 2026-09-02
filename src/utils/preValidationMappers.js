// Maps an editable header field on the Selected Invoice Preview to the
// Validation Rule Results category it stands for. When that rule's result
// isn't "passed" (review/failed — i.e. low confidence), the field shows a
// Correct Field control.
export const FIELD_RULE_CATEGORY = {
  invoiceNumber: 'Mandatory Fields',
  poNumber: 'PO Existence',
  grossAmount: 'Total Reconciliation',
}

export function ruleForField(rules, fieldKey) {
  const category = FIELD_RULE_CATEGORY[fieldKey]
  if (!category) return null
  return rules.find((r) => r.category === category) ?? null
}

// Applies a user correction: updates the field value and marks its rule
// passed, as if pre-validation re-ran against the corrected value.
export function applyFieldCorrection(record, fieldKey, value) {
  const category = FIELD_RULE_CATEGORY[fieldKey]
  return {
    ...record,
    invoice: { ...record.invoice, [fieldKey]: value },
    validationRuleResults: record.validationRuleResults.map((r) =>
      r.category === category ? { ...r, result: 'passed', confidence: '99%', issue: '—' } : r
    ),
  }
}
