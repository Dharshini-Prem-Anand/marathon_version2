export const companyCodeOptions = ['All', '1000 - Marathon US', '2000 - Marathon Canada', '3000 - Marathon EU']
export const invoiceChannelOptions = ['All', 'Email', 'Vendor Portal', 'EDI', 'Upload']
export const vendorOptions = [
  'All',
  'Global Industrial Supply',
  'Office Depot',
  'Cintas Corporation',
  'Verizon Wireless',
  'Grainger',
  'Staples',
  'Delta Dental',
]

export const scorecardMetrics = [
  { label: 'Touchless Invoice Processing', value: '46%', target: 'Target 80%', trend: 'up', color: 'blue' },
  { label: 'First-Pass VIM Readiness', value: '84%', target: 'Target 95%', trend: 'up', color: 'green' },
  { label: 'Cost per Invoice', value: '$8.40', target: 'Target $5.50', trend: 'down', color: 'orange' },
  { label: 'Intake-to-VIM Cycle Time', value: '2.4 Days', target: 'Target 1.5', trend: 'down', color: 'blue' },
  { label: 'Human Touches per Invoice', value: '1.8', target: 'Target 0.8', trend: 'down', color: 'red' },
  { label: 'Extraction & Validation Accuracy', value: '94%', target: 'Target 98%', trend: 'up', color: 'green' },
]

export const dashboardFilters = [
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  { label: 'Invoice Channel', value: 'All', options: invoiceChannelOptions },
  { label: 'Vendor', value: 'All', options: vendorOptions },
  { label: 'Status', value: 'All', options: ['All', 'Active', 'Pending', 'Closed'] },
]

export const dashboardPersonaField = {
  label: 'Persona',
  value: 'Executive',
  options: ['Executive', 'CFO', 'Controller', 'AP Director', 'Transformation Leader'],
}

export const flowSteps = [
  { label: 'Emails / Documents Received', value: '2,600' },
  { label: 'Auto-Triaged', value: '2,314' },
  { label: 'Extracted', value: '2,244' },
  { label: 'PO / Validated', value: '2,180' },
  { label: 'Ready for VIM', value: '1,928' },
  { label: 'Posted', value: '1,874' },
]

export const flowLegend = [
  { label: 'Touchless', value: '1,196', color: 'blue' },
  { label: 'Human Review', value: '684', color: 'orange' },
  { label: 'Exceptions', value: '23', color: 'red' },
]

export const capabilityCards = [
  {
    icon: 'mail',
    title: 'Email & Attachment Triage',
    value: '89%',
    valueLabel: 'Auto-Triaged',
    target: 'Target 95%',
    stat: '42',
    statLabel: 'Manual Reviews',
    statColor: 'red',
  },
  {
    icon: 'fileText',
    title: 'Document AI & Extraction',
    value: '94%',
    valueLabel: 'Extraction Accuracy',
    target: 'Target 98%',
    stat: '18',
    statLabel: 'Low-Confidence',
    statColor: 'orange',
  },
  {
    icon: 'checkCircle',
    title: 'Pre-Validation',
    value: '84%',
    valueLabel: 'First-Pass Ready',
    target: 'Target 95%',
    stat: '126',
    statLabel: 'Prevented VIM Exceptions',
    statColor: 'green',
  },
  {
    icon: 'link',
    title: 'PO & Line Matching',
    value: '78%',
    valueLabel: 'Line Match',
    target: 'Target 90%',
    stat: '14',
    statLabel: 'Exceptions',
    statColor: 'red',
  },
  {
    icon: 'lightbulb',
    title: 'Exception Recommendations',
    value: '12',
    valueLabel: 'Recommendations',
    target: '92% Confidence',
    targetColor: 'green',
    stat: '7',
    statLabel: 'Beyond SLA',
    statColor: 'red',
  },
  {
    icon: 'barChart',
    title: 'Prioritization & Analytics',
    value: '23',
    valueLabel: 'Priority Items',
    target: '18 Late-Payment Risks',
    targetHighlight: '18',
    targetColor: 'orange',
    stat: '4',
    statLabel: 'Unassigned',
    statColor: 'orange',
  },
]

// Each row also carries the underlying signals (confidence, touchless, cost, etc.) that drive
// the Dashboard's scorecard, flow, capability and value-realization widgets when filters are applied.
export const priorityQueue = [
  { priority: 'High', invoice: 'INV-2025-10456', vendor: 'Global Industrial Supply', issue: 'Late-Payment Risk', due: 'May 21, 2025', owner: 'Sarah J.', action: 'Approve for posting', channel: 'Email', status: 'Active', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 88, vimReady: true, lineMatch: true, exception: true, lateRisk: true, costPerInvoice: 14.2, cycleTimeDays: 3.8, humanTouches: 3 },
  { priority: 'High', invoice: 'INV-2025-10412', vendor: 'Office Depot', issue: 'Low Extraction Confidence', due: 'May 21, 2025', owner: 'Michael T.', action: 'Review & confirm data', channel: 'Vendor Portal', status: 'Active', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 68, vimReady: false, lineMatch: true, exception: true, lateRisk: false, costPerInvoice: 16.5, cycleTimeDays: 4.2, humanTouches: 4 },
  { priority: 'Medium', invoice: 'INV-2025-10398', vendor: 'Cintas Corporation', issue: 'PO Line Mismatch', due: 'May 22, 2025', owner: 'Alicia R.', action: 'Correct PO / line', channel: 'EDI', status: 'Pending', companyCode: '2000 - Marathon Canada', touchless: false, triaged: true, extractionConfidence: 91, vimReady: false, lineMatch: false, exception: true, lateRisk: false, costPerInvoice: 11.8, cycleTimeDays: 3.1, humanTouches: 2 },
  { priority: 'Medium', invoice: 'INV-2025-10422', vendor: 'Verizon Wireless', issue: 'Vendor / Payee Ambiguity', due: 'May 23, 2025', owner: 'Daniel K.', action: 'Confirm vendor details', channel: 'Email', status: 'Pending', companyCode: '3000 - Marathon EU', touchless: false, triaged: true, extractionConfidence: 85, vimReady: false, lineMatch: true, exception: true, lateRisk: false, costPerInvoice: 10.4, cycleTimeDays: 2.6, humanTouches: 2 },
  { priority: 'Low', invoice: 'CM-2025-10077', vendor: 'Grainger', issue: 'Tax / Freight Variance', due: 'May 24, 2025', owner: 'Priya S.', action: 'Verify charges', channel: 'Upload', status: 'Active', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 93, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 7.9, cycleTimeDays: 1.4, humanTouches: 1 },
  { priority: 'Low', invoice: 'INV-2025-10441', vendor: 'Staples', issue: 'Duplicate Invoice Flag', due: 'May 20, 2025', owner: 'Priya S.', action: 'Confirm not a duplicate', channel: 'EDI', status: 'Closed', companyCode: '2000 - Marathon Canada', touchless: true, triaged: true, extractionConfidence: 97, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 4.1, cycleTimeDays: 0.6, humanTouches: 0 },
  { priority: 'Low', invoice: 'INV-2025-10443', vendor: 'Delta Dental', issue: 'Missing Remittance Info', due: 'May 20, 2025', owner: 'Daniel K.', action: 'Request remittance details', channel: 'Upload', status: 'Closed', companyCode: '3000 - Marathon EU', touchless: false, triaged: true, extractionConfidence: 82, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 6.8, cycleTimeDays: 1.1, humanTouches: 1 },
  { priority: 'Medium', invoice: 'INV-2025-10447', vendor: 'Global Industrial Supply', issue: 'PO Line Mismatch', due: 'May 23, 2025', owner: 'Alicia R.', action: 'Correct PO / line', channel: 'Vendor Portal', status: 'Pending', companyCode: '2000 - Marathon Canada', touchless: false, triaged: true, extractionConfidence: 89, vimReady: false, lineMatch: false, exception: true, lateRisk: false, costPerInvoice: 12.3, cycleTimeDays: 2.9, humanTouches: 2 },
  { priority: 'Low', invoice: 'INV-2025-10450', vendor: 'Office Depot', issue: 'Tax / Freight Variance', due: 'May 19, 2025', owner: 'Sarah J.', action: 'Verify charges', channel: 'Email', status: 'Closed', companyCode: '3000 - Marathon EU', touchless: true, triaged: true, extractionConfidence: 96, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 4.5, cycleTimeDays: 0.5, humanTouches: 0 },
  { priority: 'Medium', invoice: 'INV-2025-10453', vendor: 'Cintas Corporation', issue: 'Vendor / Payee Ambiguity', due: 'May 22, 2025', owner: 'Michael T.', action: 'Confirm vendor details', channel: 'EDI', status: 'Active', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 87, vimReady: false, lineMatch: true, exception: true, lateRisk: false, costPerInvoice: 9.9, cycleTimeDays: 2.2, humanTouches: 2 },
  { priority: 'High', invoice: 'INV-2025-10458', vendor: 'Verizon Wireless', issue: 'Low Extraction Confidence', due: 'May 21, 2025', owner: 'Daniel K.', action: 'Review & confirm data', channel: 'Email', status: 'Pending', companyCode: '2000 - Marathon Canada', touchless: false, triaged: false, extractionConfidence: 61, vimReady: false, lineMatch: true, exception: true, lateRisk: true, costPerInvoice: 17.8, cycleTimeDays: 4.6, humanTouches: 4 },
  { priority: 'High', invoice: 'INV-2025-10461', vendor: 'Grainger', issue: 'Late-Payment Risk', due: 'May 21, 2025', owner: 'Priya S.', action: 'Approve for posting', channel: 'Vendor Portal', status: 'Active', companyCode: '3000 - Marathon EU', touchless: false, triaged: true, extractionConfidence: 90, vimReady: true, lineMatch: true, exception: true, lateRisk: true, costPerInvoice: 13.6, cycleTimeDays: 3.5, humanTouches: 3 },
  { priority: 'Medium', invoice: 'INV-2025-10465', vendor: 'Staples', issue: 'PO Line Mismatch', due: 'May 23, 2025', owner: 'Alicia R.', action: 'Correct PO / line', channel: 'Upload', status: 'Pending', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 84, vimReady: false, lineMatch: false, exception: true, lateRisk: false, costPerInvoice: 11.1, cycleTimeDays: 2.8, humanTouches: 2 },
  { priority: 'Low', invoice: 'CM-2025-10082', vendor: 'Delta Dental', issue: 'Tax / Freight Variance', due: 'May 19, 2025', owner: 'Michael T.', action: 'Verify charges', channel: 'EDI', status: 'Closed', companyCode: '2000 - Marathon Canada', touchless: true, triaged: true, extractionConfidence: 95, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 4.3, cycleTimeDays: 0.7, humanTouches: 0 },
  { priority: 'Low', invoice: 'INV-2025-10470', vendor: 'Global Industrial Supply', issue: 'Duplicate Invoice Flag', due: 'May 19, 2025', owner: 'Sarah J.', action: 'Confirm not a duplicate', channel: 'Email', status: 'Closed', companyCode: '3000 - Marathon EU', touchless: true, triaged: true, extractionConfidence: 98, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 3.9, cycleTimeDays: 0.4, humanTouches: 0 },
  { priority: 'Medium', invoice: 'INV-2025-10474', vendor: 'Office Depot', issue: 'Vendor / Payee Ambiguity', due: 'May 22, 2025', owner: 'Daniel K.', action: 'Confirm vendor details', channel: 'Vendor Portal', status: 'Active', companyCode: '1000 - Marathon US', touchless: false, triaged: true, extractionConfidence: 86, vimReady: false, lineMatch: true, exception: true, lateRisk: false, costPerInvoice: 10.7, cycleTimeDays: 2.4, humanTouches: 2 },
  { priority: 'Low', invoice: 'INV-2025-10478', vendor: 'Cintas Corporation', issue: 'Missing Remittance Info', due: 'May 24, 2025', owner: 'Priya S.', action: 'Request remittance details', channel: 'Upload', status: 'Pending', companyCode: '2000 - Marathon Canada', touchless: false, triaged: true, extractionConfidence: 80, vimReady: true, lineMatch: true, exception: false, lateRisk: false, costPerInvoice: 7.2, cycleTimeDays: 1.3, humanTouches: 1 },
  { priority: 'High', invoice: 'INV-2025-10482', vendor: 'Verizon Wireless', issue: 'Late-Payment Risk', due: 'May 21, 2025', owner: 'Alicia R.', action: 'Approve for posting', channel: 'EDI', status: 'Active', companyCode: '3000 - Marathon EU', touchless: false, triaged: true, extractionConfidence: 89, vimReady: true, lineMatch: true, exception: true, lateRisk: true, costPerInvoice: 15.1, cycleTimeDays: 3.9, humanTouches: 3 },
]

export const bottlenecks = [
  { label: 'PO / Line Variance', value: 38 },
  { label: 'Vendor / Payee', value: 24 },
  { label: 'Low Confidence', value: 18 },
  { label: 'Tax / Freight', value: 12 },
  { label: 'Missing Remittance', value: 8 },
]

export const diagnostics = [
  { icon: 'clipboard', label: 'Header Accuracy', value: '94%' },
  { icon: 'list', label: 'Line Accuracy', value: '86%' },
  { icon: 'search', label: 'Vendor Accuracy', value: '91%' },
  { icon: 'check', label: 'Corrections Retained', value: '91%' },
]

export const dashboardIntervention = {
  description: 'Review 12 evidence-based recommendations',
  confidence: '92%',
  valueAtRisk: '$420K',
}

export const valueRealization = [
  { icon: 'users', value: '4.2', label: 'FTEs', title: 'FTE Capacity Released' },
  { icon: 'clock', value: '6,800', label: 'Hours', title: 'Manual Hours Avoided' },
  { icon: 'shield', value: '1,240', label: 'Exceptions', title: 'VIM Exceptions Prevented' },
  { icon: 'trend', value: '31%', label: 'Improvement', title: 'Cycle Time Reduced' },
  { icon: 'dollar', value: '$1.2M', label: 'Value', title: 'Annualized Value' },
]

export const valueFooter = [
  { label: 'Processing Cost Reduction', value: '$420K' },
  { label: 'Late-Payment Exposure Avoided', value: '$124K' },
  { label: 'Discount Opportunity Protected', value: '$86K' },
  { label: 'Reconciliation', value: '100%' },
]

export const dashboardGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Page Purpose',
      type: 'text',
      content:
        'Executive view of email triage, extraction, pre-validation, matching and exception resolution before invoices enter SAP VIM.',
    },
    {
      heading: 'Primary Personas',
      type: 'pills',
      items: ['CFO', 'Controller', 'AP Director', 'Enterprise Payables Leader', 'Transformation Leader', 'VIM Product Owner'],
    },
    {
      heading: 'Decisions Supported',
      type: 'bullets',
      items: [
        'Identify which MVP capability is below target',
        'Locate remaining manual effort and bottlenecks',
        'Prioritize vendor, document and exception improvements',
        'Confirm pre-validation is reducing VIM exceptions',
        'Validate financial value and control performance',
      ],
    },
    {
      heading: 'Recommended Actions',
      type: 'numbered',
      items: [
        'Review capabilities below target',
        'Open priority exceptions',
        'Investigate extraction diagnostics',
        'Validate value assumptions',
      ],
    },
    {
      heading: 'Key Measures',
      type: 'table',
      rows: [
        { label: 'Touchless Processing', current: '46%', target: '80%' },
        { label: 'First-Pass VIM Readiness', current: '84%', target: '95%' },
        { label: 'Extraction Accuracy', current: '94%', target: '98%' },
        { label: 'Line Match Rate', current: '78%', target: '90%' },
      ],
    },
    {
      heading: 'Data & Ownership',
      type: 'keyvalue',
      items: [
        { label: 'Sources', value: 'SAP S/4HANA, SAP VIM, BTP Integration Suite, Document AI, Email / Vendor Portals' },
        { label: 'Business Owner', value: 'AP Director' },
        { label: 'Technology Owner', value: 'SAP BTP Product Owner' },
      ],
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const emailTriageFilters = [
  { label: 'Source', value: 'All', options: ['All', 'Email', 'Vendor Portal', 'EDI 810', 'Upload'] },
  { label: 'Sender / Vendor', value: 'All', options: vendorOptions },
  {
    label: 'Proposed Category',
    value: 'All',
    options: ['All', 'Invoice', 'Credit Memo', 'Statement', 'Inquiry', 'Duplicate', 'Non-Invoice'],
  },
  { label: 'Priority', value: 'All', options: ['All', 'High', 'Medium', 'Low'] },
]

export const emailTriageStats = [
  { icon: 'mail', label: 'Emails Received Today', value: '2,600', valueColor: 'blue', target: null },
  { icon: 'checkCircle', label: 'Auto-Triaged', value: '89%', valueColor: 'green', target: 'Target: 95%' },
  { icon: 'fileText', label: 'Attachments Downloaded', value: '2,314', valueColor: 'blue', target: null },
  { icon: 'user', label: 'Manual Reviews', value: '42', valueColor: 'red', target: 'Target: < 20' },
  { icon: 'copy', label: 'Duplicate Attachments', value: '12', valueColor: 'red', target: null },
  { icon: 'clock', label: 'Average Triage Time', value: '2.1 min', valueColor: 'blue', target: 'Target: 1.0 min' },
]

export const categoryColor = {
  Invoice: 'blue',
  'Credit Memo': 'purple',
  Statement: 'cyan',
  Inquiry: 'gray',
  Duplicate: 'red',
  'Non-Invoice': 'gray',
  // Categories returned by the Document AI classifier.
  'Standard Invoice': 'green',
  'Debit Memo': 'orange',
  'Proforma Invoice': 'yellow',
}

export const priorityColor = {
  High: 'red',
  Medium: 'orange',
  Low: 'blue',
}

export const triageQueue = [
  {
    id: 1,
    time: '10:24 AM',
    source: 'Email',
    vendor: 'Global Industrial Supply',
    subject: 'Invoice INV-10456',
    attachments: 2,
    category: 'Invoice',
    confidence: '99%',
    priority: 'Medium',
    preview: {
      from: 'Global Industrial Supply <invoices@gis.com>',
      to: 'apinvoices@marathon.com',
      receivedFull: 'May 18, 2025 10:24 AM',
      source: 'Email (Microsoft 365)',
      attachments: [
        { fileName: 'INV-10456.pdf', type: 'PDF', size: '241 KB', category: 'Invoice', confidence: '99%' },
        { fileName: 'INV-10456_Backup.pdf', type: 'PDF', size: '238 KB', category: 'Duplicate', confidence: '99%' },
      ],
      proposedCategory: 'Invoice',
      proposedConfidence: '99%',
    },
  },
  {
    id: 2,
    time: '10:18 AM',
    source: 'Email',
    vendor: 'Office Depot',
    subject: 'Invoice 7SS8321',
    attachments: 3,
    category: 'Invoice',
    confidence: '96%',
    priority: 'Low',
  },
  {
    id: 3,
    time: '10:16 AM',
    source: 'Vendor Portal',
    vendor: 'Cintas Corporation',
    subject: 'Invoice #1239876',
    attachments: 1,
    category: 'Invoice',
    confidence: '92%',
    priority: 'Medium',
  },
  {
    id: 4,
    time: '10:12 AM',
    source: 'Email',
    vendor: 'Verizon Wireless',
    subject: 'Credit Memo 99876',
    attachments: 1,
    category: 'Credit Memo',
    confidence: '88%',
    priority: 'Medium',
  },
  {
    id: 5,
    time: '10:10 AM',
    source: 'EDI 810',
    vendor: 'Grainger',
    subject: 'Invoice 91023456',
    attachments: 1,
    category: 'Invoice',
    confidence: '95%',
    priority: 'Low',
  },
  {
    id: 6,
    time: '10:08 AM',
    source: 'Email',
    vendor: 'Staples',
    subject: 'Statement 05252025',
    attachments: 1,
    category: 'Statement',
    confidence: '91%',
    priority: 'Low',
  },
  {
    id: 7,
    time: '10:05 AM',
    source: 'Email',
    vendor: 'Delta Dental',
    subject: 'Service Inquiry',
    attachments: 1,
    category: 'Inquiry',
    confidence: '70%',
    priority: 'Low',
  },
  {
    id: 8,
    time: '10:02 AM',
    source: 'Email',
    vendor: 'Global Industrial Supply',
    subject: 'Invoice INV-10456 (Duplicate)',
    attachments: 2,
    category: 'Duplicate',
    confidence: '99%',
    priority: 'High',
  },
  {
    id: 9,
    time: '09:58 AM',
    source: 'Upload',
    vendor: '—',
    subject: 'Marketing Flyer May 2025',
    attachments: 1,
    category: 'Non-Invoice',
    confidence: '99%',
    priority: 'Low',
  },
  {
    id: 10,
    time: '09:55 AM',
    source: 'Vendor Portal',
    vendor: 'Office Depot',
    subject: 'Invoice 7SS9004',
    attachments: 2,
    category: 'Invoice',
    confidence: '94%',
    priority: 'High',
  },
  {
    id: 11,
    time: '09:51 AM',
    source: 'EDI 810',
    vendor: 'Grainger',
    subject: 'Invoice 91024410',
    attachments: 1,
    category: 'Invoice',
    confidence: '97%',
    priority: 'Medium',
  },
  {
    id: 12,
    time: '09:47 AM',
    source: 'Email',
    vendor: 'Verizon Wireless',
    subject: 'Credit Memo 99901',
    attachments: 1,
    category: 'Credit Memo',
    confidence: '90%',
    priority: 'Low',
  },
  {
    id: 13,
    time: '09:44 AM',
    source: 'Vendor Portal',
    vendor: 'Cintas Corporation',
    subject: 'Statement 05262025',
    attachments: 1,
    category: 'Statement',
    confidence: '93%',
    priority: 'Low',
  },
  {
    id: 14,
    time: '09:40 AM',
    source: 'Email',
    vendor: 'Staples',
    subject: 'Duplicate Invoice INV-7734',
    attachments: 2,
    category: 'Duplicate',
    confidence: '98%',
    priority: 'High',
  },
  {
    id: 15,
    time: '09:36 AM',
    source: 'Upload',
    vendor: '—',
    subject: 'Scanned Invoice Batch 14',
    attachments: 4,
    category: 'Invoice',
    confidence: '81%',
    priority: 'Medium',
  },
  {
    id: 16,
    time: '09:31 AM',
    source: 'Email',
    vendor: 'Delta Dental',
    subject: 'Billing Inquiry - Claim 4471',
    attachments: 1,
    category: 'Inquiry',
    confidence: '65%',
    priority: 'Low',
  },
  {
    id: 17,
    time: '09:27 AM',
    source: 'EDI 810',
    vendor: 'Office Depot',
    subject: 'Credit Memo 7SS8399',
    attachments: 1,
    category: 'Credit Memo',
    confidence: '92%',
    priority: 'Medium',
  },
  {
    id: 18,
    time: '09:22 AM',
    source: 'Email',
    vendor: 'Global Industrial Supply',
    subject: 'Newsletter - Product Updates',
    attachments: 1,
    category: 'Non-Invoice',
    confidence: '99%',
    priority: 'Low',
  },
  {
    id: 19,
    time: '09:15 AM',
    source: 'Vendor Portal',
    vendor: 'Grainger',
    subject: 'Invoice 91025678 - Urgent',
    attachments: 1,
    category: 'Invoice',
    confidence: '96%',
    priority: 'High',
  },
  {
    id: 20,
    time: '09:11 AM',
    source: 'Email',
    vendor: 'Verizon Wireless',
    subject: 'Invoice 44521 Past Due',
    attachments: 1,
    category: 'Invoice',
    confidence: '89%',
    priority: 'High',
  },
  {
    id: 21,
    time: '09:07 AM',
    source: 'EDI 810',
    vendor: 'Cintas Corporation',
    subject: 'Duplicate Shipment Invoice',
    attachments: 1,
    category: 'Duplicate',
    confidence: '97%',
    priority: 'Medium',
  },
  {
    id: 22,
    time: '09:03 AM',
    source: 'Upload',
    vendor: '—',
    subject: 'Vendor W-9 Form',
    attachments: 1,
    category: 'Non-Invoice',
    confidence: '99%',
    priority: 'Low',
  },
  {
    id: 23,
    time: '08:58 AM',
    source: 'Email',
    vendor: 'Staples',
    subject: 'Statement of Account - April',
    attachments: 1,
    category: 'Statement',
    confidence: '90%',
    priority: 'Medium',
  },
  {
    id: 24,
    time: '08:52 AM',
    source: 'Vendor Portal',
    vendor: 'Delta Dental',
    subject: 'Invoice DD-33210',
    attachments: 2,
    category: 'Invoice',
    confidence: '95%',
    priority: 'Low',
  },
]

export const totalTriageCount = '2,314'

export const channelIntake = [
  { label: 'Email', value: 1654, percent: 71, color: 'blue' },
  { label: 'Vendor Portal', value: 412, percent: 18, color: 'purple' },
  { label: 'EDI', value: 168, percent: 7, color: 'green' },
  { label: 'Upload', value: 80, percent: 4, color: 'orange' },
]

export const preprocessingMetrics = [
  { icon: 'fileCog', value: '318', label: 'Format Converted' },
  { icon: 'columns', value: '74', label: 'Documents Split' },
  { icon: 'layers', value: '28', label: 'Documents Consolidated' },
  { icon: 'layout', value: '16', label: 'Layout Corrected' },
  { icon: 'shieldLock', value: '9', label: 'PII Redacted' },
]

export const valueDeliveredTriage = [
  { icon: 'users', value: '2.5', label: 'FTE Opportunity' },
  { icon: 'clock', value: '38', label: 'Hours / Day Avoided' },
  { icon: 'checkCircle', value: '96%', label: 'Attachments Captured' },
]

export const emailTriageGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'arrowLeft',
  sections: [
    {
      heading: 'Purpose',
      icon: 'fileText',
      type: 'text',
      content: 'Automate high-volume AP inbox and portal acquisition before document extraction.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Intake Lead', 'AP Processor', 'Vendor Support', 'Integration Support'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'gitBranch',
      type: 'bullets',
      items: [
        'Which messages enter invoice processing',
        'Which items need priority or review',
        'Where acquisition failures occur',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Accept high-confidence classifications',
        'Correct misclassified categories',
        'Prioritize urgent or high-value documents',
        'Route to review for low-confidence items',
      ],
    },
    {
      heading: 'Key Measures',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Emails Received Today', current: '2,600', target: '—' },
        { label: 'Auto-Triaged', current: '89%', target: '95%' },
        { label: 'Attachments Downloaded', current: '2,314', target: '—' },
        { label: 'Manual Reviews', current: '42', target: '< 20' },
        { label: 'Average Triage Time', current: '2.1 min', target: '1.0 min' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves straight-through processing, reduces manual effort, and accelerates time to invoice.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Microsoft 365 inbox, vendor portals, EDI, BTP Integration Suite',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Intake Lead',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const documentAiFilters = [
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  { label: 'Invoice Channel', value: 'All', options: invoiceChannelOptions },
  { label: 'Vendor', value: 'All', options: vendorOptions },
  { label: 'Status', value: 'All', options: ['All', 'Processed', 'Pending', 'Failed'] },
]

export const documentAiStats = [
  { icon: 'copy', label: 'Documents Processed', value: '2,244', valueColor: 'blue', target: '+12% vs prior 7 days' },
  { icon: 'target', label: 'Overall Extraction Accuracy', value: '94%', valueColor: 'green', target: 'Target: 98%' },
  { icon: 'fileText', label: 'Header Accuracy', value: '96%', valueColor: 'blue', target: 'Target: 98%' },
  { icon: 'list', label: 'Line Accuracy', value: '86%', valueColor: 'orange', target: 'Target: 95%' },
  { icon: 'alertTriangle', label: 'Low Confidence', value: '18', valueColor: 'orange', target: '< 80% confidence' },
  { icon: 'clock', label: 'Average Extraction Time', value: '3.8 Min', valueColor: 'blue', target: '-0.4 min vs prior 7 days' },
]

export const documentQueue = [
  { format: 'PDF', icon: 'pdf', color: 'red', documents: 1128, percent: '50%', topVendor: 'Global Industrial Supply', topVendorCount: 312, lowConfidence: 8, channel: 'Email', status: 'Processed' },
  { format: 'Word', icon: 'word', color: 'blue', documents: 396, percent: '18%', topVendor: 'Office Depot', topVendorCount: 178, lowConfidence: 4, channel: 'Vendor Portal', status: 'Processed' },
  { format: 'Excel', icon: 'excel', color: 'green', documents: 332, percent: '15%', topVendor: 'Cintas Corporation', topVendorCount: 142, lowConfidence: 3, channel: 'EDI', status: 'Pending' },
  { format: 'Image', icon: 'image', color: 'purple', documents: 256, percent: '11%', topVendor: 'Verizon Wireless', topVendorCount: 98, lowConfidence: 2, channel: 'Upload', status: 'Processed' },
  { format: 'Handwritten', icon: 'handwritten', color: 'orange', documents: 132, percent: '6%', topVendor: 'Delta Dental', topVendorCount: 61, lowConfidence: 1, channel: 'Upload', status: 'Failed' },
]

export const invoicePreview = {
  vendorName: 'GLOBAL INDUSTRIAL SUPPLY',
  invoiceNumber: '10456',
  invoiceDate: 'May 18, 2025',
  billTo: {
    name: 'Marathon Oil Corporation',
    lines: ['5555 San Felipe Street', 'Houston, TX 77056', 'United States'],
  },
  vendor: {
    name: 'Global Industrial Supply',
    lines: ['5000 Amherst Street', 'Houston, TX 77092', 'United States'],
  },
  lineItems: [
    { description: 'Industrial Safety Gloves', qty: 100, unitPrice: '$12.50', amount: '$1,250.00' },
    { description: 'Safety Glasses', qty: 50, unitPrice: '$8.75', amount: '$437.50' },
    { description: 'Hard Hat', qty: 25, unitPrice: '$15.00', amount: '$375.00' },
  ],
  subtotal: '$2,062.50',
  taxRate: '7.40%',
  tax: '$152.50',
  total: '$2,215.00',
}

export const extractedFields = [
  { field: 'Vendor', value: 'Global Industrial Supply', confidence: '96%' },
  { field: 'Invoice Number', value: '10456', confidence: '99%' },
  { field: 'Invoice Date', value: 'May 18, 2025', confidence: '98%' },
  { field: 'PO Number', value: '4500089210', confidence: '93%' },
  { field: 'Gross Amount', value: '$2,215.00', confidence: '96%' },
  { field: 'Tax Amount', value: '$152.50', confidence: '94%' },
  { field: 'Freight Amount', value: '$0.00', confidence: '92%' },
  { field: 'Payee', value: 'Global Industrial Supply', confidence: '93%' },
]

export const formatPerformance = [
  { label: 'PDF', value: 97 },
  { label: 'Word', value: 93 },
  { label: 'Excel', value: 96 },
  { label: 'Image', value: 89 },
  { label: 'Handwritten', value: 74 },
]

export const lineItemExtraction = [
  { idx: 1, description: 'Industrial Safety Gloves', quantity: 100, uom: 'EA', unitPrice: '$12.50', amount: '$1,250.00', confidence: '96%' },
  { idx: 2, description: 'Safety Glasses', quantity: 50, uom: 'EA', unitPrice: '$8.75', amount: '$437.50', confidence: '94%' },
  { idx: 3, description: 'Hard Hat', quantity: 25, uom: 'EA', unitPrice: '$15.00', amount: '$375.00', confidence: '93%' },
]

export const painPoints = [
  { label: 'Invoice-Total Errors', current: '3.2%', prior: '4.7%', improvement: '-1.5 pp' },
  { label: 'PO Invoice Failure', current: '5.8%', prior: '7.6%', improvement: '-1.8 pp' },
  { label: 'Vendor Mismatches', current: '2.1%', prior: '2.8%', improvement: '-0.7 pp' },
]

export const learningModelPerformance = [
  { icon: 'brain', value: '91%', label: 'Corrections Retained' },
  { icon: 'refresh', value: '9%', label: 'Repeat Error Rate' },
  { icon: 'shield', value: '0', label: 'Cross-Document Contamination' },
  { icon: 'package', value: 'IIA-MVP-03', label: 'Model Version' },
]

export const documentAiGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content:
        'Extract and validate header and line-item information across PDF, Word, Excel, images and handwritten invoices.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Processor', 'Document Quality Analyst', 'AP Data Steward', 'Product Owner'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Which fields require correction or review',
        'Which vendors or formats need model tuning',
        'Whether extraction is ready for pre-validation',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'fileCheck',
      type: 'bullets',
      items: [
        'Review low-confidence fields and route accordingly',
        'Correct and confirm extractions to improve accuracy',
        'Investigate formats or vendors with lower accuracy',
        'Monitor pain points and act on improvement trends',
      ],
    },
    {
      heading: 'Key Measures',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Documents Processed', current: '2,244', target: '—' },
        { label: 'Overall Extraction Accuracy', current: '94%', target: '98%' },
        { label: 'Header Accuracy', current: '96%', target: '98%' },
        { label: 'Line Accuracy', current: '86%', target: '95%' },
        { label: 'Low Confidence', current: '18', target: '< 20' },
        { label: 'Average Extraction Time', current: '3.8 min', target: '≤ 3.5 min' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content:
        'Higher extraction accuracy reduces manual effort, speeds cycle time, minimizes errors and improves straight-through processing.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'bullets',
      items: [
        'Document AI (SAP Document Information Extraction)',
        'SAP Business Technology Platform (BTP)',
        'Email Attachments & Vendor Uploads',
        'SAP ERP Master Data (Vendors, Materials, POs)',
      ],
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Data Steward\nap.datasteward@marathonoil.com',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const preValidationFilters = [
  { label: 'Company Code', value: '1000 - Marathon US', options: companyCodeOptions },
  { label: 'Vendor', value: 'All', options: vendorOptions },
  { label: 'Document Type', value: 'All', options: ['All', 'Invoice', 'Credit Memo', 'Debit Memo'] },
  {
    label: 'Confidence Band',
    value: 'All',
    options: ['All', 'High (90-100%)', 'Medium (70-89%)', 'Low (< 70%)'],
  },
  { label: 'Validation Status', value: 'All', options: ['All', 'Passed', 'Review', 'Failed'] },
]

export const preValidationStats = [
  { icon: 'fileText', label: 'Pending Pre-Validation', value: '42', valueColor: 'blue', target: null },
  { icon: 'checkCircle', label: 'Auto-Validated', value: '2,180', valueColor: 'green', target: null },
  { icon: 'target', label: 'First-Pass VIM Readiness', value: '84%', valueColor: 'green', target: 'Target 95%' },
  { icon: 'alertTriangle', label: 'Low Confidence', value: '18', valueColor: 'orange', target: null },
  { icon: 'shield', label: 'Prevented VIM Exceptions', value: '126', valueColor: 'green', target: null },
  { icon: 'clock', label: 'Average Validation Time', value: '3.8 Min', valueColor: 'blue', target: null },
]

export const preValidationInvoice = {
  vendorName: 'GLOBAL INDUSTRIAL SUPPLY',
  confidenceBadge: 'HIGH CONFIDENCE',
  invoiceNumber: '10456',
  invoiceDate: 'May 18, 2025',
  poNumber: '4500089210',
  grossAmount: '$84,250.00 USD',
  lineItems: [
    { line: 1, description: 'Industrial Valve 2"', quantity: 10, uom: 'EA', unitPrice: '$2,750.00', amount: '$27,500.00' },
    { line: 2, description: 'Stainless Steel Pipe 4"', quantity: 50, uom: 'FT', unitPrice: '$850.00', amount: '$42,500.00' },
    { line: 3, description: 'Gasket Set', quantity: 20, uom: 'EA', unitPrice: '$150.00', amount: '$3,000.00' },
    { line: 4, description: 'Shipping & Handling', quantity: 1, uom: 'EA', unitPrice: '$1,350.00', amount: '$1,350.00' },
  ],
  totalAmountDue: '$84,250.00 USD',
}

export const validationRuleResults = [
  { category: 'Mandatory Fields', rule: 'Required fields present', result: 'passed', confidence: '99%', issue: '—' },
  { category: 'Duplicate Check', rule: 'Duplicate invoice check', result: 'passed', confidence: '98%', issue: '—' },
  { category: 'Vendor Validation', rule: 'Vendor exists & active', result: 'passed', confidence: '100%', issue: '—' },
  { category: 'Payee Validation', rule: 'Payee matches vendor', result: 'review', confidence: '74%', issue: 'Payee differs' },
  { category: 'PO Existence', rule: 'PO exists & open', result: 'passed', confidence: '99%', issue: '—' },
  { category: 'Company Code', rule: 'Company code valid', result: 'passed', confidence: '100%', issue: '—' },
  { category: 'Tax Validation', rule: 'Tax calculated correctly', result: 'review', confidence: '72%', issue: 'Tax rate variance' },
  { category: 'Freight Validation', rule: 'Freight within tolerance', result: 'review', confidence: '76%', issue: 'High freight %' },
  { category: 'Currency Validation', rule: 'Currency matches PO', result: 'passed', confidence: '100%', issue: '—' },
  { category: 'Total Reconciliation', rule: 'Totals match', result: 'failed', confidence: '45%', issue: 'Header vs Line total' },
]

export const vendorPayeeValidation = [
  { type: 'Proposed Vendor', name: 'Global Industrial Supply', confidence: '81%', badgeColor: 'orange' },
  { type: 'SAP Vendor', name: '10002348', confidence: '100%', badgeColor: 'green' },
  { type: 'Payee', name: 'Review Required', confidence: '0%', badgeColor: 'red', nameColor: 'red' },
  { type: 'Remit-To Address', name: '6000 Amherst Street, Houston, TX 77005', confidence: '74%', badgeColor: 'orange' },
]

export const documentClassification = [
  { label: 'Invoice', confidence: '96%', badgeColor: 'green', selected: true },
  { label: 'Credit Memo', confidence: '4%', badgeColor: 'gray', selected: false },
]

export const preValidationActions = [
  { label: 'Accept High Confidence', variant: 'primary' },
  { label: 'Correct Field', variant: 'outline' },
  { label: 'Route to Exception', variant: 'outline' },
  { label: 'Release to Matching', variant: 'outline' },
]

export const topRuleFailureDrivers = [
  { driver: 'Total Reconciliation', invoices: 34, percent: 32, color: 'red' },
  { driver: 'Payee Mismatch', invoices: 22, percent: 21, color: 'orange' },
  { driver: 'Tax Rate Variance', invoices: 18, percent: 17, color: 'orange' },
  { driver: 'High Freight %', invoices: 14, percent: 13, color: 'yellow' },
  { driver: 'Missing Mandatory Field', invoices: 10, percent: 9, color: 'gray' },
]

export const preventedExceptionsByType = [
  { type: 'Duplicate Invoice', prevented: 45, percent: 36 },
  { type: 'PO Price Variance', prevented: 30, percent: 24 },
  { type: 'Vendor / Payee Mismatch', prevented: 22, percent: 17 },
  { type: 'Tax Calculation', prevented: 18, percent: 14 },
  { type: 'Invalid Company Code', prevented: 11, percent: 9 },
]

export const correctionHistory = [
  { field: 'Payee', example: 'Review Required → Global Industrial Supply LLC', recurrence: 7, retained: true },
  { field: 'Tax Rate', example: '7.50% → 6.25%', recurrence: 6, retained: true },
  { field: 'Freight Amount', example: '$2,150 → $1,350', recurrence: 5, retained: true },
  { field: 'Total Amount', example: '$86,400 → $84,250', recurrence: 4, retained: true },
]

export const approvalBannerText =
  'Human approval required for vendor, payee and low-confidence financial fields before invoice proceeds to SAP VIM.'

export const preValidationGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'fileText',
      type: 'text',
      content: 'Validate invoice completeness, vendor/payee, duplicate, PO, tax and financial fields before SAP VIM.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Validator', 'AP Controls Lead', 'Tax Reviewer', 'VIM Product Owner'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Whether invoice may proceed to matching',
        'Which validation failed and why',
        'Which fields require human approval',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Accept high-confidence invoices',
        'Correct or review flagged fields',
        'Route exceptions for resolution',
        'Release to PO & Line Matching',
      ],
    },
    {
      heading: 'Key Measures',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'First-Pass VIM Readiness', current: '84%', target: '≥ 95%' },
        { label: 'Average Validation Time', current: '3.8 min', target: '≤ 3.0 min' },
        { label: 'Prevented VIM Exceptions', current: '126', target: '≥ 125' },
        { label: 'Low Confidence Invoices', current: '18', target: '≤ 20' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves invoice quality at source, reduces VIM exceptions, shortens cycle time and increases straight-through processing.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Extracted invoice, SAP Vendor Master, Purchase Orders, Tax Rules, Duplicate History, SAP Business Technology Platform (BTP) validation services.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Operations Manager',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const poMatchingFilters = [
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  { label: 'Invoice Channel', value: 'All', options: invoiceChannelOptions },
  { label: 'Vendor', value: 'All', options: vendorOptions },
  { label: 'Status', value: 'All', options: ['All', 'Matched', 'Partial Match', 'Mismatch', 'Not Found'] },
]

export const poMatchingContext = {
  vendor: 'Cintas Corporation',
  channel: 'EDI',
  status: 'Mismatch',
}

export const poMatchingStats = [
  { icon: 'fileText', label: 'PO Invoices', value: '1,986', valueColor: 'blue', target: null },
  { icon: 'checkCircle', label: 'Fully Matched', value: '1,548', valueColor: 'green', target: null },
  { icon: 'pieChart', label: 'Partial Match', value: '274', valueColor: 'orange', target: null },
  { icon: 'search', label: 'PO Not Found', value: '38', valueColor: 'red', target: null },
  { icon: 'alertTriangle', label: 'Tolerance Exceptions', value: '126', valueColor: 'orange', target: null },
  { icon: 'send', label: 'Ready for VIM', value: '1,928', valueColor: 'green', target: null },
]

export const matchSummaryCards = [
  { icon: 'fileText', label: 'Invoice', value: '$84,250', valueColor: null },
  { icon: 'clipboard', label: 'SAP PO', value: '$82,900', valueColor: null },
  { icon: 'truck', label: 'Received', value: '$82,900', valueColor: null },
  { icon: 'scale', label: 'Variance', value: '$1,350', valueColor: 'red' },
]

export const threeWayMatchLines = [
  {
    invLine: 1,
    description: 'Carbon Steel Pipe 2" SCH 40',
    qty: 100,
    unitPrice: '$250.00',
    invAmount: '$25,000.00',
    proposedPoLine: '00010',
    poAmount: '$25,000.00',
    variance: '$0.00',
    tolerance: '$500.00',
    matchStatus: 'matched',
  },
  {
    invLine: 2,
    description: 'Stainless Steel Valve 1"',
    qty: 10,
    unitPrice: '$1,200.00',
    invAmount: '$12,000.00',
    proposedPoLine: '00020',
    poAmount: '$12,000.00',
    variance: '$0.00',
    tolerance: '$240.00',
    matchStatus: 'matched',
  },
  {
    invLine: 3,
    description: 'Freight Charge',
    qty: 1,
    unitPrice: '$1,500.00',
    invAmount: '$1,500.00',
    proposedPoLine: 'FREIGHT',
    poAmount: '$1,400.00',
    variance: '$100.00',
    tolerance: '$150.00',
    matchStatus: 'tolerance',
  },
  {
    invLine: 4,
    description: 'Sales Tax',
    qty: 1,
    unitPrice: '$4,250.00',
    invAmount: '$4,250.00',
    proposedPoLine: 'TAX',
    poAmount: '$4,100.00',
    variance: '$150.00',
    tolerance: '$200.00',
    matchStatus: 'tolerance',
  },
  {
    invLine: 5,
    description: 'Gasket 2" Spiral Wound',
    qty: 20,
    unitPrice: '$950.00',
    invAmount: '$19,000.00',
    proposedPoLine: '00030',
    poAmount: '$18,400.00',
    variance: '$600.00',
    tolerance: '$200.00',
    matchStatus: 'mismatch',
  },
]

export const matchExplanation = {
  recommendedAction: 'Split freight to PO condition and route tax variance for review.',
  confidence: '92%',
  evidence: 'PO 4500089210, receipt 50006714, Marathon tolerance rule AP-PO-07',
}

export const matchExplanationActions = [
  { label: 'Accept Recommendation', variant: 'primary' },
  { label: 'Adjust Match', variant: 'outline' },
  { label: 'Send to Exception', variant: 'outline-red' },
]

export const matchingPerformance = [
  { label: 'Header Match Rate', percent: '98.2%', fraction: '(1,950 / 1,986)' },
  { label: 'Line Match Rate', percent: '95.1%', fraction: '(8,745 / 9,192)' },
  { label: 'Quantity Match Rate', percent: '97.6%', fraction: '(8,972 / 9,192)' },
  { label: 'Price Match Rate', percent: '94.3%', fraction: '(8,666 / 9,192)' },
  { label: 'Tax Match Rate', percent: '90.4%', fraction: '(1,612 / 1,784)' },
  { label: 'Freight Match Rate', percent: '91.0%', fraction: '(1,301 / 1,430)' },
]

export const vimProcessingTimeline = [
  { label: 'Received', status: 'complete' },
  { label: 'Extracted', status: 'complete' },
  { label: 'Pre-Validated', status: 'complete' },
  { label: 'PO Matched', status: 'complete' },
  { label: 'Ready for VIM', status: 'complete' },
  { label: 'VIM Workflow', status: 'inprogress' },
  { label: 'Posted', status: 'pending' },
]

export const vimTimelineMetrics = [
  { icon: 'trend', value: '99.4%', label: 'VIM Injection Success' },
  { icon: 'undo', value: '22', label: 'Returned for Correction' },
  { icon: 'scale', value: '100%', label: 'Reconciliation' },
]

export const poMatchingGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'fileText',
      type: 'text',
      content: 'Execute explainable two-way and three-way invoice, PO and receipt matching before VIM.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Processor', 'Buyer', 'Receiving Analyst', 'AP Supervisor'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Accept or adjust match',
        'Route material variance within tolerance',
        'Request PO or receipt correction',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Accept recommended match to proceed to VIM',
        'Adjust quantities, pricing, or coding',
        'Route to exception with comments',
      ],
    },
    {
      heading: 'Key Measures',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Match Confidence', current: '92%', target: '≥ 90%' },
        { label: 'Invoice Match Rate', current: '77.9%', target: '≥ 80%' },
        { label: 'Ready for VIM', current: '1,928', target: '≥ 1,900' },
        { label: 'Tolerance Exception Rate', current: '6.3%', target: '≤ 7.0%' },
        { label: 'Avg. Match Cycle Time', current: '1.6 hrs', target: '≤ 2.0 hrs' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves match accuracy, reduces exceptions and cycle time, and accelerates straight-through processing to VIM.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Invoice extraction, SAP PO, Goods receipt, Tolerance policy, Vendor master.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Operations Manager',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const exceptionsStats = [
  { icon: 'alertTriangle', label: 'Open Exceptions', value: '23', valueColor: 'blue', target: null },
  { icon: 'clock', label: 'At Risk of Late Payment', value: '18', valueColor: 'orange', target: null },
  { icon: 'user', label: 'Unassigned', value: '4', valueColor: 'blue', target: null },
  { icon: 'clock', label: 'Beyond SLA', value: '7', valueColor: 'red', target: null },
  { icon: 'sparkles', label: 'Recommendations', value: '12', valueColor: 'purple', target: null },
  { icon: 'refresh', label: 'Average Resolution', value: '6.4 Hours', valueColor: 'green', target: null },
]

export const priorityExceptionQueue = [
  {
    priority: 'High',
    invoice: 'INV-2025-10456',
    vendor: 'Global Industrial Supply',
    amount: '$84,250.00',
    issue: 'Late Payment Risk',
    issueColor: 'red',
    due: 'May 21, 2025',
    dueColor: 'red',
    owner: 'Sarah J.',
    sla: '0h',
    slaColor: 'red',
  },
  {
    priority: 'High',
    invoice: 'INV-2025-10412',
    vendor: 'Office Depot',
    amount: '$12,430.75',
    issue: 'Low OCR Confidence',
    issueColor: null,
    due: 'May 21, 2025',
    dueColor: 'red',
    owner: 'Michael T.',
    sla: '2h',
    slaColor: 'red',
  },
  {
    priority: 'Medium',
    invoice: 'INV-2025-10398',
    vendor: 'Cintas Corporation',
    amount: '$6,875.40',
    issue: 'PO Mismatch',
    issueColor: null,
    due: 'May 22, 2025',
    dueColor: 'orange',
    owner: 'Alicia R.',
    sla: '6h',
    slaColor: 'orange',
  },
  {
    priority: 'Medium',
    invoice: 'INV-2025-10422',
    vendor: 'Verizon Wireless',
    amount: '$3,210.00',
    issue: 'Vendor/Payee Ambiguity',
    issueColor: null,
    due: 'May 23, 2025',
    dueColor: 'orange',
    owner: 'Daniel K.',
    sla: '10h',
    slaColor: 'orange',
  },
  {
    priority: 'Low',
    invoice: 'CM-2025-10077',
    vendor: 'Grainger',
    amount: '-$2,150.00',
    issue: 'Credit Memo Review',
    issueColor: null,
    due: 'May 24, 2025',
    dueColor: null,
    owner: 'Priya S.',
    sla: '18h',
    slaColor: 'green',
  },
]

export const totalExceptionsCount = '23'

export const aiReviewRecommendation = {
  invoiceId: 'INV-2025-10456',
  vendor: 'Global Industrial Supply',
  amount: '$84,250',
  recommendation:
    'Accept the proposed vendor, split $1,350 freight to the approved PO freight condition, and route the $6,240 tax variance to AP Tax Review.',
  confidence: '92%',
  evidenceUsed: 'Invoice image, PO 4500089210, receipt 50006714, vendor master 100248, VIM history, policy AP-PO-07',
  requiredApproval: 'AP Processor and AP Tax Reviewer',
  prohibitedActions: 'No autonomous posting, vendor-master update, tolerance override, or payment-term change',
}

export const aiReviewActions = [
  { label: 'Accept and Route', variant: 'primary' },
  { label: 'Modify Recommendation', variant: 'outline' },
  { label: 'Reject Recommendation', variant: 'outline' },
  { label: 'View Evidence', variant: 'outline' },
]

export const whatIfScenarios = [
  {
    tag: null,
    scenario: 'Current Process',
    action: 'Full manual review',
    cycleTime: '2.4 days',
    manualMinutes: '38 min',
    latePaymentRisk: 'High',
    latePaymentRiskColor: 'red',
    estimatedCost: '$28.50',
    controlStatus: 'Compliant',
    rowStyle: null,
  },
  {
    tag: 'recommended',
    scenario: 'AI Assist',
    action: 'Accept vendor + split freight + tax review',
    cycleTime: '0.8 days',
    manualMinutes: '12 min',
    latePaymentRisk: 'Low',
    latePaymentRiskColor: 'green',
    estimatedCost: '$11.20',
    controlStatus: 'Compliant',
    rowStyle: 'green',
    valueColor: 'green',
  },
  {
    tag: 'not-allowed',
    scenario: 'Auto-Release',
    action: 'Post without review',
    cycleTime: '0.2 days',
    manualMinutes: '2 min',
    latePaymentRisk: 'Low',
    latePaymentRiskColor: 'green',
    estimatedCost: '$5.10',
    controlStatus: 'Not Allowed',
    rowStyle: 'red',
    valueColor: 'red',
  },
]

export const scenarioInfoText =
  'Recommended scenario saves 26 minutes, reduces cycle time by 67%, and avoids estimated late-payment exposure of $4,200.'

export const exceptionsPersonaSelector = {
  label: 'Persona',
  value: 'AP Supervisor',
  options: ['AP Supervisor', 'AP Processor', 'Tax Reviewer', 'Buyer', 'Controller'],
}

export const exceptionsGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'settings',
      type: 'text',
      content: 'Prioritize and resolve invoice exceptions with evidence-based recommendations, required approvals, and prohibited-action controls.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'pills',
      items: ['AP Supervisor', 'AP Processor', 'Tax Reviewer', 'Buyer', 'Controller'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Which exception should we resolve first?',
        'What is the safest and most efficient action?',
        'What approvals are required and from whom?',
        'What is the value and control tradeoff?',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: ['Accept and Route (recommended)', 'Modify Recommendation', 'Reject Recommendation', 'View Evidence'],
    },
    {
      heading: 'Key Measures',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Cycle Time', current: '2.4 days', target: '0.8 days' },
        { label: 'Manual Minutes', current: '38 min', target: '12 min' },
        { label: 'Late-Payment Risk', current: 'High', target: 'Low' },
        { label: 'Estimated Cost / Invoice', current: '$28.50', target: '$11.20' },
      ],
    },
    {
      heading: 'Business Value (per invoice)',
      icon: 'dollar',
      type: 'text',
      content: '26 minutes saved • 67% cycle-time reduction\n$17.30 avoided cost • $4,200 exposure reduced',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Invoice images, PO data, receipt data, SAP VIM history, Financial policies (AP-PO-07), Audit history',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'Accounts Payable Operations Manager',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const vimPageHeader = {
  title: 'VIM Processing',
  subtitle: 'Monitor handoff, workflow, approval, posting and reconciliation across SAP VIM.',
}

export const vimFilters = [
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  {
    label: 'Vendor',
    value: 'All',
    options: [
      'All',
      'Apex Field Services',
      'Global Industrial Supply',
      'ElectroMax Solutions',
      'Precision Components Inc.',
      'Office Depot Business',
    ],
  },
  {
    label: 'VIM Status',
    value: 'All',
    options: ['All', 'Awaiting Approval', 'Injected', 'Posting Failed', 'Blocked', 'Posted'],
  },
  { label: 'Due Date', value: 'All', options: ['All', 'May 18, 2026', 'May 21, 2026', 'May 22, 2026', 'May 23, 2026'] },
  { label: 'Touchless/Human Review', value: 'All', options: ['All', 'Touchless', 'Human Review'] },
]

export const vimStats = [
  { icon: 'fileText', label: 'Ready for VIM', value: '128', valueColor: 'blue', target: null },
  { icon: 'checkCircle', label: 'Successfully Injected', value: '2,314', valueColor: 'green', target: null },
  { icon: 'user', label: 'In Workflow', value: '186', valueColor: 'blue', target: null },
  { icon: 'clock', label: 'Awaiting Approval', value: '74', valueColor: 'orange', target: null },
  { icon: 'alertTriangle', label: 'Blocked', value: '29', valueColor: 'red', target: null },
  { icon: 'xCircle', label: 'Posting Failed', value: '7', valueColor: 'red', target: null },
]

export const vimWorklist = [
  {
    priority: 'Low',
    priorityDir: 'down',
    invoiceId: 'INV-2026-008472',
    vimDocument: 'VIM-60012345',
    vendor: 'Apex Field Services',
    amount: '$184,630.00',
    vimStatus: 'Awaiting Approval',
    vimStatusColor: 'orange',
    workflowStep: 'Awaiting Approval',
    currentOwner: 'Michael Brown',
    dueDate: 'May 22, 2026',
    aging: '2d',
    touchless: 'No',
    lastEvent: 'May 20, 2026 08:21 AM',
    action: 'OpenVIM',
  },
  {
    priority: 'Medium',
    priorityDir: 'up',
    invoiceId: 'INV-2026-008471',
    vimDocument: 'VIM-60012344',
    vendor: 'Global Industrial Supply',
    amount: '$52,410.00',
    vimStatus: 'Injected',
    vimStatusColor: 'green',
    workflowStep: 'Sent to VIM',
    currentOwner: 'System',
    dueDate: 'May 23, 2026',
    aging: '1d',
    touchless: 'Yes',
    lastEvent: 'May 20, 2026 08:10 AM',
    action: 'OpenVIM',
  },
  {
    priority: 'High',
    priorityDir: 'up',
    invoiceId: 'INV-2026-008469',
    vimDocument: 'VIM-60012342',
    vendor: 'ElectroMax Solutions',
    amount: '$97,850.00',
    vimStatus: 'Posting Failed',
    vimStatusColor: 'red',
    workflowStep: 'Posting',
    currentOwner: 'System',
    dueDate: 'May 21, 2026',
    aging: '3d',
    touchless: 'No',
    lastEvent: 'May 19, 2026 04:35 PM',
    action: 'Retry',
  },
  {
    priority: 'Medium',
    priorityDir: 'up',
    invoiceId: 'INV-2026-008468',
    vimDocument: 'VIM-60012341',
    vendor: 'Precision Components Inc.',
    amount: '$36,275.50',
    vimStatus: 'Blocked',
    vimStatusColor: 'red',
    workflowStep: 'Validation',
    currentOwner: 'Sarah Johnson',
    dueDate: 'May 22, 2026',
    aging: '2d',
    touchless: 'No',
    lastEvent: 'May 20, 2026 07:42 AM',
    action: 'OpenVIM',
  },
  {
    priority: 'Low',
    priorityDir: 'down',
    invoiceId: 'INV-2026-008465',
    vimDocument: 'VIM-60012338',
    vendor: 'Office Depot Business',
    amount: '$12,345.00',
    vimStatus: 'Posted',
    vimStatusColor: 'green',
    workflowStep: 'Posted',
    currentOwner: 'System',
    dueDate: 'May 18, 2026',
    aging: '0d',
    touchless: 'Yes',
    lastEvent: 'May 19, 2026 11:58 AM',
    action: 'Reconcile',
  },
]

export const selectedInvoice = {
  invoiceId: 'INV-2026-008472',
  vendor: 'Apex Field Services',
  amount: '$184,630.00',
  timeline: [
    { label: 'Received', time: 'May 19, 2026 07:58 AM', note: 'Automated', status: 'done' },
    { label: 'Extracted', time: 'May 19, 2026 08:00 AM', note: 'Automated', status: 'done' },
    { label: 'Pre-Validated', time: 'May 19, 2026 08:03 AM', note: 'Automated', status: 'done' },
    { label: 'PO Matched', time: 'May 19, 2026 08:08 AM', note: 'Automated', status: 'done' },
    { label: 'Sent to VIM', time: 'May 19, 2026 08:12 AM', note: 'Automated', status: 'done' },
    { label: 'Awaiting Approval', time: 'May 20, 2026 08:21 AM', note: '1d 2h 15m', status: 'inprogress', badge: 'Human Step' },
    { label: 'Posted', time: '—', note: 'Future', status: 'pending' },
    { label: 'Cleared', time: '—', note: 'Future', status: 'pending' },
  ],
}

export const integrationReconciliation = {
  connections: [
    { label: 'BTP Integration Suite', status: 'Connected' },
    { label: 'SAP VIM', status: 'Available' },
  ],
  details: [
    { label: 'Last successful sync', value: '08:42 AM' },
    { label: 'BTP Event ID', value: 'b3f2e9a1-7d4c-4b9a-9cf1-2e7a8dfc6f21' },
    { label: 'Retry count', value: '1' },
    { label: 'SAP document reference', value: '510560012345' },
  ],
  reconciliationStatus: 'Matched',
}

export const integrationActions = [
  { label: 'Retry Integration', variant: 'outline' },
  { label: 'Reconcile Status', variant: 'outline' },
  { label: 'Return to Pre-Validation', variant: 'outline' },
  { label: 'Escalate Approval', variant: 'outline-red' },
]

export const operationalHealth = [
  {
    label: 'Injection Success',
    value: '99.4%',
    valueColor: 'green',
    sparkline: [70, 74, 68, 80, 85, 78, 90, 88, 95, 92, 97, 99],
    sparklineColor: 'green',
    deltaText: '+0.6% ↑',
    deltaColor: 'green',
  },
  {
    label: 'Avg Handoff',
    value: '1.8 min',
    valueColor: 'blue',
    sparkline: [40, 55, 45, 60, 50, 65, 55, 70, 60, 50, 45, 40],
    sparklineColor: 'blue',
    deltaText: '-0.4 min ↓',
    deltaColor: 'green',
  },
  {
    label: 'Status Mismatches',
    value: '3',
    valueColor: null,
    sparkline: [30, 45, 35, 55, 40, 60, 45, 65, 50, 40, 35, 30],
    sparklineColor: 'orange',
    deltaText: '-2 ↓',
    deltaColor: 'green',
  },
  {
    label: 'Retry Queue',
    value: '7',
    valueColor: null,
    sparkline: [20, 35, 50, 30, 60, 40, 70, 45, 65, 55, 75, 60],
    sparklineColor: 'red',
    deltaText: '+1 ↑',
    deltaColor: 'red',
  },
]

export const vimProcessingGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Monitor handoff, workflow, approval, posting and reconciliation across SAP VIM.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Processor', 'VIM Approver', 'AP Supervisor', 'Integration Support', 'Controller'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Where an invoice is blocked or delayed',
        'Whether to retry, return, or escalate an invoice',
        'Whether system records reconcile successfully',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'fileCheck',
      type: 'bullets',
      items: [
        'Open invoice in VIM for review',
        'Retry failed posting or integration',
        'Return invoice to Pre-Validation',
        'Escalate for approval',
        'Reconcile integration status',
      ],
    },
    {
      heading: 'Key Measures (Current vs Target)',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Injection Success', current: '99.4%', target: '≥ 98%' },
        { label: 'Avg Handoff Time', current: '1.8 min', target: '≤ 2.0 min' },
        { label: 'Status Mismatches', current: '3', target: '≤ 5' },
        { label: 'Retry Queue', current: '7', target: '≤ 10' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves AP throughput, reduces delays, ensures accurate postings and faster close through visibility and timely action.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'bullets',
      items: ['SAP VIM', 'SAP S/4HANA', 'BTP Integration Suite Events', 'Workflow & Posting Logs'],
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Operations Manager',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const workAssignmentPageHeader = {
  title: 'Work Assignment & Capacity Management',
  subtitle: 'Risk-based prioritization, team capacity, and SLA control',
}

export const workAssignmentFilters = [
  {
    label: 'Team',
    value: 'All',
    options: ['All', 'Validators', 'AP Processors', 'Tax Review', 'Vendor Master Review'],
  },
  {
    label: 'Role',
    value: 'All',
    options: ['All', 'Validator', 'AP Processor', 'Tax Reviewer', 'Buyer'],
  },
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  { label: 'Priority', value: 'All', options: ['All', 'Critical', 'High', 'Medium', 'Low'] },
  { label: 'SLA Status', value: 'All', options: ['All', 'On Track', 'At Risk'] },
]

export const workAssignmentStats = [
  { icon: 'users', label: 'Available Capacity', value: '142 Hrs', valueColor: 'blue', target: null },
  { icon: 'pieChart', label: 'Team Utilization', value: '84%', valueColor: 'blue', target: null },
  { icon: 'briefcase', label: 'Open Backlog', value: '386', valueColor: 'blue', target: null },
  { icon: 'alertTriangle', label: 'At Risk of SLA', value: '42', valueColor: 'red', target: null },
  { icon: 'user', label: 'Unassigned', value: '31', valueColor: 'blue', target: null },
  { icon: 'calendar', label: 'Due Today', value: '67', valueColor: 'red', target: null },
]

export const teamCapacity = [
  { initials: 'MS', name: 'Maria S.', role: 'Validator', team: 'Validators', utilization: 92, assigned: 48, atRisk: 7, atRiskColor: 'red', available: '4.2 hrs available' },
  { initials: 'DR', name: 'David R.', role: 'Validator', team: 'Validators', utilization: 76, assigned: 35, atRisk: 2, atRiskColor: 'orange', available: '7.8 hrs available' },
  { initials: 'AP', name: 'Anita P.', role: 'AP Processor', team: 'AP Processors', utilization: 88, assigned: 41, atRisk: 6, atRiskColor: 'red', available: '5.1 hrs available' },
  { initials: 'JK', name: 'James K.', role: 'AP Processor', team: 'AP Processors', utilization: 69, assigned: 28, atRisk: 1, atRiskColor: 'yellow', available: '9.4 hrs available' },
  { initials: 'TR', name: 'Tom R.', role: 'Tax Reviewer', team: 'Tax Review', utilization: 81, assigned: 22, atRisk: 3, atRiskColor: 'orange', available: '3.8 hrs available' },
  { initials: 'LB', name: 'Lena B.', role: 'Buyer', team: 'Vendor Master Review', utilization: 58, assigned: 15, atRisk: 1, atRiskColor: 'yellow', available: '10.2 hrs available' },
]

export const priorityModel = {
  score: '87',
  label: 'High Priority',
  factors: [
    { label: 'Payment Due', weight: 30, color: 'blue' },
    { label: 'Invoice Value', weight: 20, color: 'teal' },
    { label: 'Supplier Criticality', weight: 20, color: 'purple' },
    { label: 'Exception Severity', weight: 15, color: 'orange' },
    { label: 'SLA Aging', weight: 15, color: 'yellow' },
  ],
  note: 'Weights are configurable and auditable.',
}

export const priorityWorkQueue = [
  {
    score: 94,
    scoreLabel: 'Critical',
    scoreColor: 'red',
    invoice: 'INV-890214',
    vendor: 'Halliburton',
    amount: '$128,450',
    due: 'Today',
    dueColor: 'red',
    exception: 'PO line mismatch',
    owner: 'Maria S.',
    sla: '3 hrs',
    recommendation: 'Reassign to Anita P.',
  },
  {
    score: 87,
    scoreLabel: 'High',
    scoreColor: 'red',
    invoice: 'INV-890187',
    vendor: 'Baker Hughes',
    amount: '$64,200',
    due: 'Tomorrow',
    dueColor: 'orange',
    exception: 'Vendor/payee ambiguity',
    owner: 'Unassigned',
    sla: '7 hrs',
    recommendation: 'Assign to David R.',
  },
  {
    score: 82,
    scoreLabel: 'High',
    scoreColor: 'orange',
    invoice: 'CM-12804',
    vendor: 'Schlumberger',
    amount: '($18,750)',
    due: 'Today',
    dueColor: 'red',
    exception: 'Credit memo review',
    owner: 'David R.',
    sla: '2 hrs',
    recommendation: 'Escalate specialist review',
  },
  {
    score: 76,
    scoreLabel: 'Medium',
    scoreColor: 'yellow',
    invoice: 'INV-890099',
    vendor: 'Weatherford',
    amount: '$32,800',
    due: '2 days',
    dueColor: null,
    exception: 'Low OCR confidence',
    owner: 'James K.',
    sla: '14 hrs',
    recommendation: 'Retain assignment',
  },
]

export const aiReassignment = {
  title: 'AI Reassignment Recommendation',
  description: 'Move 12 PO-match invoices from Maria S. to Anita P.',
  expectedResult:
    'Expected result: 9 SLA breaches avoided, 18 processing hours recovered, utilization balanced to 84%, $4.6K late-payment exposure reduced.',
  actions: [
    { label: 'Review 12 Items', variant: 'outline' },
    { label: 'Apply Reassignment', variant: 'primary' },
  ],
}

export const reassignmentMetrics = [
  { icon: 'shield', value: '9', label: 'SLA breaches avoided' },
  { icon: 'clock', value: '18', label: 'hours recovered' },
  { icon: 'dollar', value: '$4.6K', label: 'late-payment exposure reduced' },
]

export const workAssignmentGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Balance AP workload by skill, priority, capacity and SLA risk.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Operations Manager', 'Team Lead', 'AP Processor', 'Validator', 'Tax Reviewer'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Who should work on what, and why',
        'How to balance workload and skills',
        'When to escalate or reassign',
        'Where capacity risk exists',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Reassign work to reduce SLA risk',
        'Balance workloads across team',
        'Escalate exceptions per policy',
        'Monitor capacity and utilization',
      ],
    },
    {
      heading: 'Key Measures (Current → Target)',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Team Utilization', current: '84%', target: '80–85%' },
        { label: 'At Risk of SLA', current: '42', target: '< 20' },
        { label: 'SLA Breaches', current: '9', target: '< 5' },
        { label: 'Available Capacity', current: '142 hrs', target: '≥ 120 hrs' },
        { label: 'Late-Payment Exposure', current: '$4.6K', target: '< $2K' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves SLA performance, increases productivity, reduces late fees, and optimizes team capacity.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Work queues, team skills, calendars, SLA agreements, priority model, invoice value.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Operations Manager',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const operationalAnalyticsFilters = [
  { label: 'Company Code', value: 'All', options: companyCodeOptions },
  { label: 'Invoice Channel', value: 'All', options: invoiceChannelOptions },
  { label: 'Vendor', value: 'All', options: vendorOptions },
  { label: 'Status', value: 'All', options: ['All', 'Active', 'Pending', 'Closed'] },
]

export const operationalAnalyticsScorecard = [
  { label: 'Touchless Processing', value: '46%', target: 'Target 80%', trend: 'up', color: 'blue' },
  { label: 'Cost per Invoice', value: '$8.40', target: 'Target $5.50', trend: 'down', color: 'orange' },
  { label: 'Intake-to-VIM Cycle Time', value: '2.4 Days', target: 'Target 1.5', trend: 'down', color: 'blue' },
  { label: 'First-Pass VIM Readiness', value: '84%', target: 'Target 95%', trend: 'up', color: 'green' },
  { label: 'Manual Touches', value: '1.8', target: 'Target 0.8', trend: 'down', color: 'red' },
  { label: 'Annualized Value', value: '$1.2M', target: null, trend: null, color: 'blue' },
]

export const touchlessByMonth = {
  xLabels: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
  values: [46, 52, 61, 70, 80],
  target: 80,
}

export const exceptionDrivers = [
  { label: 'PO / Line', percent: 38 },
  { label: 'Vendor / Payee', percent: 24 },
  { label: 'OCR Confidence', percent: 18 },
  { label: 'Tax / Freight', percent: 12 },
  { label: 'Other', percent: 8 },
]

export const valueDeliveredBreakdown = {
  items: [
    { label: 'Capacity Value', value: '$692K', color: 'blue' },
    { label: 'Rework Avoidance', value: '$337K', color: 'blue' },
    { label: 'Late-Payment Avoidance', value: '$124K', color: 'blue' },
    { label: 'Discount Capture', value: '$86K', color: 'blue' },
    { label: 'Run Cost', value: '($240K)', color: 'red' },
  ],
  netLabel: 'Net Annualized Value',
  netValue: '$999K',
}

export const whatIfInputs = [
  { label: 'Invoice Volume', value: '100,000' },
  { label: 'Touchless Target', value: '80%' },
  { label: 'Manual Minutes', value: '12' },
  { label: 'AP Labor Rate', value: '$60 / hr' },
  { label: 'Annual Run Cost', value: '$240,000' },
]

export const whatIfScenariosAnalytics = [
  { scenario: 'Conservative', touchlessRate: '65% touchless', netValue: '$620K net value', payback: '14-month payback', onTime: '86% on-time', selected: false },
  { scenario: 'MVP Target', touchlessRate: '80% touchless', netValue: '$999K net value', payback: '6.5-month payback', onTime: '95% on-time', selected: true },
  { scenario: 'Stretch', touchlessRate: '90% touchless', netValue: '$1.34M net value', payback: '4.8-month payback', onTime: '98% on-time', selected: false },
]

export const netValueByTouchlessRate = {
  xLabels: ['50%', '60%', '70%', '80%', '90%', '100%'],
  values: [120000, 310000, 620000, 999000, 1340000, 1580000],
  labels: ['$120K', '$310K', '$620K', '$999K', '$1.34M', '$1.58M'],
  yMax: 1600000,
  xAxisTitle: 'Touchless Rate',
  yAxisTitle: 'Net Annualized Value',
}

export const analyticsDisclaimer = 'Scenario values are planning estimates until Marathon baselines and commercial costs are approved.'
export const analyticsCopyright = '© 2024 Sierra Digital, Inc. All rights reserved.'

export const operationalAnalyticsGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Explain AP operational performance, identify drivers and quantify MVP value.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['CFO', 'Controller', 'AP Director', 'Transformation Leader', 'Value Lead'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Performance driver identification',
        'Value realization tracking',
        'Target setting and scenario planning',
        'Investment case and prioritization',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Increase touchless throughput',
        'Address top exception drivers',
        'Improve first-pass VIM readiness',
        'Optimize manual effort and cost',
        'Track value realization vs targets',
      ],
    },
    {
      heading: 'Key Measures (Current vs Target)',
      icon: 'barChart',
      type: 'bullets',
      items: [
        'Touchless Processing: 46% vs 80%',
        'Cost per Invoice: $8.40 vs $5.50',
        'Intake-to-VIM Cycle Time: 2.4 vs 1.5 days',
        'First-Pass VIM Readiness: 84% vs 95%',
        'Manual Touches: 1.8 vs 0.8',
        'Annualized Value: $1.2M (target $1.0M+)',
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Quantifies efficiency gains, cost savings, and risk reduction to deliver $999K net annualized value at MVP target.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'bullets',
      items: ['AP operational events and metrics', 'SAP VIM processing data', 'Labor and cost assumptions', 'Finance-approved value model'],
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'Accounts Payable Operations',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const extractionDiagFilters = [
  { label: 'Company Code', value: '1000 - Marathon US', options: companyCodeOptions },
  {
    label: 'Vendor',
    value: 'All',
    options: ['All', 'Global Industrial Supply', 'Houston Components', 'Precision Parts Co.', 'Summit Solutions'],
  },
  { label: 'Invoice Type', value: 'All', options: ['All', 'PDF', 'Word', 'Excel', 'Image', 'Handwritten'] },
  { label: 'Confidence Band', value: 'All', options: ['All', 'High', 'Medium', 'Low'] },
  { label: 'Validation Status', value: 'All', options: ['All', 'Passed', 'Review', 'Failed'] },
]

export const extractionDiagStats = [
  { icon: 'target', label: 'Overall Accuracy', value: '94%', valueColor: 'blue', target: 'Target 98%' },
  { icon: 'fileText', label: 'Header Accuracy', value: '96%', valueColor: 'blue', target: 'Target 98%' },
  { icon: 'list', label: 'Line Accuracy', value: '86%', valueColor: 'orange', target: 'Target 95%' },
  { icon: 'alertTriangle', label: 'Low-Confidence Documents', value: '18', valueColor: 'orange', target: 'Target < 5' },
  { icon: 'refresh', label: 'Repeat Error Rate', value: '9%', valueColor: 'red', target: 'Target < 5%' },
  { icon: 'checkCircle', label: 'Corrections Retained', value: '91%', valueColor: 'green', target: 'Target 95%' },
]

export const fieldAccuracyByVendor = {
  vendors: ['Global Industrial Supply', 'Houston Components', 'Precision Parts Co.', 'Summit Solutions', 'All Vendors'],
  rows: [
    { field: 'Vendor', values: [98, 92, 90, 95, 94] },
    { field: 'Invoice Number', values: [99, 97, 94, 98, 97] },
    { field: 'PO Number', values: [98, 93, 89, 96, 94] },
    { field: 'Amount', values: [97, 90, 86, 94, 92] },
    { field: 'Tax', values: [92, 82, 78, 85, 85] },
    { field: 'Freight', values: [89, 78, 72, 81, 78] },
    { field: 'Line Items', values: [85, 72, 68, 78, 76] },
  ],
}

export const accuracyByFormat = [
  { label: 'PDF', percent: 97 },
  { label: 'Word', percent: 93 },
  { label: 'Excel', percent: 96 },
  { label: 'Image', percent: 89 },
  { label: 'Handwritten', percent: 74 },
]

export const lowConfidenceTrend = {
  xLabels: ['Apr 20', 'Apr 27', 'May 4', 'May 11', 'May 18'],
  values: [28, 31, 24, 20, 18],
  yMax: 40,
}

export const errorPareto = [
  { label: 'Line Description', percent: 28 },
  { label: 'Tax', percent: 22 },
  { label: 'Freight', percent: 18 },
  { label: 'Vendor', percent: 14 },
  { label: 'PO Number', percent: 10 },
  { label: 'Other', percent: 8 },
]

export const extractionDiagnosticDetails = [
  {
    vendor: 'Houston Components',
    format: 'PDF',
    failedField: 'Tax',
    confidence: '62%',
    errorType: 'Pattern Mismatch',
    recurrence: 23,
    lastCorrection: 'May 17, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Update rule / add pattern',
  },
  {
    vendor: 'Precision Parts Co.',
    format: 'PDF',
    failedField: 'Freight',
    confidence: '58%',
    errorType: 'Label Misread',
    recurrence: 17,
    lastCorrection: 'May 17, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Update rule / add pattern',
  },
  {
    vendor: 'Global Industrial Supply',
    format: 'Image',
    failedField: 'Line Description',
    confidence: '48%',
    errorType: 'OCR Error',
    recurrence: 31,
    lastCorrection: 'May 18, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Add training example',
  },
  {
    vendor: 'Summit Solutions',
    format: 'Word',
    failedField: 'PO Number',
    confidence: '65%',
    errorType: 'Pattern Mismatch',
    recurrence: 12,
    lastCorrection: 'May 16, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Update rule / add pattern',
  },
  {
    vendor: 'Houston Components',
    format: 'PDF',
    failedField: 'Vendor',
    confidence: '55%',
    errorType: 'Vendor Name Variant',
    recurrence: 9,
    lastCorrection: 'May 15, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Update vendor alias',
  },
  {
    vendor: 'Precision Parts Co.',
    format: 'Excel',
    failedField: 'Amount',
    confidence: '60%',
    errorType: 'Value Misread',
    recurrence: 15,
    lastCorrection: 'May 14, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Add training example',
  },
  {
    vendor: 'Global Industrial Supply',
    format: 'PDF',
    failedField: 'Tax',
    confidence: '61%',
    errorType: 'Pattern Mismatch',
    recurrence: 19,
    lastCorrection: 'May 13, 2025',
    modelVersion: 'IIA-MVP-03',
    action: 'Update rule / add pattern',
  },
]

export const selectedIssueExplanation = {
  vendor: 'Global Industrial Supply',
  document: 'INV-10456 (PDF)',
  failedField: 'Line Description',
  confidence: '48%',
  errorType: 'OCR Error',
  evidenceLine: { line: 1, description: 'Industrial Valve 2', qty: 10, unitPrice: '$2,750.00', amount: '$27,500.00' },
  modelRead: 'Industrial Valve 27',
  correctedTo: 'Industrial Valve 2"',
  actions: [
    { label: 'Correct Rule', variant: 'primary' },
    { label: 'Add Training Example', variant: 'outline' },
    { label: 'Route Vendor Outreach', variant: 'outline' },
  ],
}

export const learningGovernance = [
  { label: 'Corrections Retained', value: '91%', target: 'Target 95%', valueColor: 'green' },
  { label: 'Cross-Document Contamination', value: '0', target: 'Target 0', valueColor: null },
  { label: 'Template Drift Alerts', value: '7', target: 'Open Alerts', valueColor: 'orange' },
  { label: 'Model Version', value: 'IIA-MVP-03', target: 'Last Updated: May 16, 2025', valueColor: 'blue' },
]

export const extractionDiagGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Identify extraction failure patterns by field, vendor, document format and model version, then direct corrective action.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['AP Data Steward', 'Document Quality Analyst', 'AP Product Owner', 'Vendor Enablement Lead'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'What extraction rules or patterns need tuning?',
        'Which vendors require remediation or outreach?',
        'Whether a model change is safe and effective?',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Update extraction rules and patterns',
        'Add training examples for recurring OCR or layout issues',
        'Normalize vendor names and aliases',
        'Engage vendors with delivery or formatting guidance',
      ],
    },
    {
      heading: 'Key Measures (Current vs. Target)',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Overall Accuracy', current: '94%', target: '98%' },
        { label: 'Header Accuracy', current: '96%', target: '98%' },
        { label: 'Line Accuracy', current: '86%', target: '95%' },
        { label: 'Low-Confidence Documents', current: '18', target: '< 10' },
        { label: 'Repeat Error Rate', current: '9%', target: '< 5%' },
        { label: 'Corrections Retained', current: '91%', target: '95%' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Higher first-pass accuracy, lower touch cost, faster cycle time, and improved vendor experience.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Extraction events, corrected fields, document metadata, vendor master, model registry.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Data Steward',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const auditPersonaSelector = {
  label: 'Persona',
  value: 'AP Controller',
  options: ['AP Controller', 'Controller', 'Internal Audit', 'AP Controls', 'Compliance', 'VIM Product Owner'],
}

export const auditStats = [
  { label: 'Invoices Received', value: '2,600', color: 'blue' },
  { label: 'Fully Reconciled', value: '2,577', color: 'green' },
  { label: 'Open Reconciliation', value: '23', color: 'orange' },
  { label: 'Duplicate Events', value: '0', color: 'red' },
  { label: 'Missing Transactions', value: '0', color: 'red' },
  { label: 'Control Exceptions', value: '3', color: 'purple' },
]

export const endToEndReconciliation = {
  received: '2,600',
  posted: '1,874',
  inProcess: '684',
  rejected: '30',
  confirmedDuplicate: '12',
  balancedLabel: 'Balanced',
  balancedPercent: '100%',
}

export const auditTrail = [
  { time: 'May 21, 2025 09:12:03', invoice: 'INV-2025-10456', stage: 'Extraction', actor: 'automated', decision: 'Extracted', userModel: 'AI Extractor v3.2', result: 'Success', resultColor: 'green' },
  { time: 'May 21, 2025 09:12:21', invoice: 'INV-2025-10456', stage: 'Data Correction', actor: 'human', decision: 'Corrected', userModel: 'Sarah J.', result: 'Success', resultColor: 'green' },
  { time: 'May 21, 2025 09:12:45', invoice: 'INV-2025-10456', stage: 'PO Match', actor: 'automated', decision: 'Matched', userModel: 'PO Match Model v2.1', result: 'Success', resultColor: 'green' },
  { time: 'May 21, 2025 09:13:02', invoice: 'INV-2025-10456', stage: 'AI Recommendation', actor: 'automated', decision: 'PO Mismatch', userModel: 'GenAI Model v1.4', result: 'Needs Review', resultColor: 'orange' },
  { time: 'May 21, 2025 09:13:18', invoice: 'INV-2025-10456', stage: 'Approval', actor: 'human', decision: 'Approved', userModel: 'Michael T.', result: 'Success', resultColor: 'green' },
  { time: 'May 21, 2025 09:13:41', invoice: 'INV-2025-10456', stage: 'VIM Injection', actor: 'human', decision: 'Injected', userModel: 'Daniel K.', result: 'Success', resultColor: 'green' },
  { time: 'May 21, 2025 09:14:05', invoice: 'INV-2025-10456', stage: 'Posting', actor: 'automated', decision: 'Posted', userModel: 'Posting Bot v1.0', result: 'Success', resultColor: 'green' },
]

export const totalAuditEventsLabel = 'View All Audit Events'

export const auditFooterActions = [
  { label: 'View Audit Evidence', variant: 'outline' },
  { label: 'Export Control Package', variant: 'outline' },
]

export const controlGovernance = [
  { label: 'Financial Controls Passed', value: '100%', color: 'green' },
  { label: 'Segregation of Duties Passed', value: '100%', color: 'green' },
  { label: 'AI Recommendations Accepted', value: '72%', color: 'blue' },
  { label: 'AI Recommendations Modified', value: '21%', color: 'orange' },
  { label: 'AI Recommendations Rejected', value: '7%', color: 'purple' },
  { label: 'Unapproved Autonomous Actions', value: '0', color: 'red' },
]

export const workAssignmentCapacity = [
  { team: 'Validators', assigned: 42, capacity: 60, atRisk: 3, sla: '93%' },
  { team: 'VIM Processors', assigned: 24, capacity: 40, atRisk: 2, sla: '95%' },
  { team: 'Tax Review', assigned: 16, capacity: 20, atRisk: 1, sla: '90%' },
  { team: 'Vendor Master Review', assigned: 12, capacity: 16, atRisk: 0, sla: '98%' },
]

export const reassignmentBannerText = 'Reassign 6 PO mismatch invoices to Validator Team B to prevent 4 SLA breaches.'

export const auditGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Prove invoice population completeness, preserve evidence, and monitor financial and automation controls.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'bullets',
      items: ['Controller', 'Internal Audit', 'AP Controls', 'Compliance', 'VIM Product Owner'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Assess reconciliation completeness',
        'Validate evidence sufficiency',
        'Monitor policy compliance',
        'Drive control remediation',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Investigate open reconciliation items',
        'Review and act on control exceptions',
        'Reassign work to prevent SLA breaches',
        'Export control evidence for audit',
      ],
    },
    {
      heading: 'Key Measures (Current vs Target)',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Reconciliation Balance', current: '100%', target: '100%' },
        { label: 'Financial Controls Passed', current: '100%', target: '100%' },
        { label: 'AI Recommendations Accepted', current: '72%', target: '≥ 70%' },
        { label: 'AI Recommendations Modified', current: '21%', target: '≤ 25%' },
        { label: 'AI Recommendations Rejected', current: '7%', target: '≤ 10%' },
        { label: 'Unapproved Autonomous Actions', current: '0', target: '0' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improves audit readiness, reduces control risk, and increases straight-through processing while ensuring compliance and governance.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'SAP S/4HANA, VIM, SAP BTP event logs, approval history, and model decision history.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Controller',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const kpiRoleSelector = {
  value: 'Process Owner',
  options: ['Process Owner', 'CFO', 'Controller', 'AP Director', 'Data Steward', 'Value Lead'],
}

export const kpiPageHeader = {
  title: 'KPI, Metrics & Value',
  subtitle: 'Configure measurement definitions, targets, ownership, data lineage and value realization.',
}

export const kpiHeaderActions = [
  { label: 'View KPI Definitions', variant: 'outline' },
  { label: 'Business Use & Guidance', variant: 'outline' },
  { label: '+ Add Measure', variant: 'primary' },
]

export const kpiFilters = {
  searchPlaceholder: 'Search name or measure...',
  fields: [
    {
      label: 'Category',
      value: 'All',
      options: ['All', 'Automation', 'VIM Quality', 'Extraction Quality', 'Matching', 'Operational', 'Financial'],
    },
    { label: 'Status', value: 'Active', options: ['All', 'Active', 'Draft', 'Retired'] },
    {
      label: 'Reporting Period',
      value: 'All',
      options: ['All', 'Current Month', 'Last Month', 'Current Quarter', 'Year to Date'],
    },
  ],
}

export const measureCategoryOptions = ['Automation', 'VIM Quality', 'Extraction Quality', 'Matching', 'Operational', 'Financial']
export const measureOwnerOptions = ['AP Operations', 'AP Process Owner', 'Data Steward', 'AP Manager', 'Finance Transformation']

export const kpiStats = [
  { label: 'Touchless Processing', value: '46%', valueColor: 'blue', target: 'Target 80%', percent: 58, barColor: 'blue' },
  { label: 'First-Pass VIM Readiness', value: '84%', valueColor: 'green', target: 'Target 95%', percent: 88, barColor: 'green' },
  { label: 'Extraction Accuracy', value: '94%', valueColor: 'green', target: 'Target 98%', percent: 96, barColor: 'green' },
  { label: 'Line Match Rate', value: '78%', valueColor: 'blue', target: 'Target 90%', percent: 87, barColor: 'blue' },
  { label: 'Human Touches', value: '1.8', valueColor: 'red', target: 'Target 0.8', percent: 44, barColor: 'red' },
  { label: 'Annualized Value', value: '$1.2M', valueColor: 'green', target: 'Target $1.0M', percent: 100, barColor: 'green' },
]

export const measureDefinitionRegister = {
  count: '6 measures',
  rows: [
    { measure: 'Touchless Processing', subtitle: 'BTP IIA + SAP VIM', category: 'Automation', baseline: '28%', current: '46%', target: '80%', owner: 'AP Operations', status: 'Active', reportingPeriod: 'Current Month', selected: false },
    { measure: 'First-Pass VIM Readiness', subtitle: 'Pre-Validation + VIM', category: 'VIM Quality', baseline: '72%', current: '84%', target: '95%', owner: 'AP Process Owner', status: 'Active', reportingPeriod: 'Current Month', selected: true },
    { measure: 'Extraction Accuracy', subtitle: 'Document AI', category: 'Extraction Quality', baseline: '88%', current: '94%', target: '98%', owner: 'Data Steward', status: 'Active', reportingPeriod: 'Current Month', selected: false },
    { measure: 'Line Match Rate', subtitle: 'PO & Line Matching', category: 'Matching', baseline: '62%', current: '78%', target: '90%', owner: 'AP Operations', status: 'Active', reportingPeriod: 'Last Month', selected: false },
    { measure: 'Human Touches', subtitle: 'Audit Event Log', category: 'Operational', baseline: '2.6', current: '1.8', target: '0.8', owner: 'AP Manager', status: 'Active', reportingPeriod: 'Current Quarter', selected: false },
    { measure: 'Annualized Value', subtitle: 'Value Realization', category: 'Financial', baseline: '$0.6M', current: '$1.2M', target: '$1.0M', owner: 'Finance Transformation', status: 'Active', reportingPeriod: 'Year to Date', selected: false },
  ],
}

export const measureConfiguration = {
  measureName: 'First-Pass VIM Readiness',
  category: 'VIM Quality',
  businessOwner: 'AP Process Owner',
  baseline: '72%',
  current: '84%',
  target: '95%',
  calculationFormula: 'invoices passing pre-validation and accepted by VIM on first submission divided by invoices submitted to VIM multiplied by 100',
  calculationExample: '1,928 first-pass accepted ÷ 2,296 eligible × 100 = 84.0%',
  systemOfRecord: 'SAP VIM',
  includeInScorecard: true,
}

export const valueCalculationInputs = [
  { label: 'Annual Invoice Volume', value: '100,000' },
  { label: 'AP Labor Rate ($/hr)', value: '60' },
  { label: 'Annual Run Cost', value: '240,000' },
  { label: 'Manual Minutes Avoided per Invoice', value: '12' },
]

export const kpiValueOutputs = {
  items: [
    { label: 'Capacity Value', value: '$692,000' },
    { label: 'Rework Avoidance', value: '$337,000' },
    { label: 'Late-Payment Avoidance', value: '$124,000' },
    { label: 'Discount Capture', value: '$86,000' },
  ],
  netLabel: 'Net Annualized Value',
  netValue: '$999,000',
}

export const measurementGovernance = [
  { label: 'Definition Completeness', value: '100%' },
  { label: 'Approved Owner', value: 'Yes' },
  { label: 'Automated Source', value: 'Yes' },
  { label: 'Version', value: 'v2.1' },
  { label: 'Version History', value: 'View History', link: true },
  { label: 'Next Review', value: 'Jul 31, 2025' },
]

export const kpiFooter = {
  brand: 'Marathon',
  subtitle: 'Accounts Payable | Intelligent Invoice Automation',
  designedByLabel: 'Designed and delivered by',
  designedBy: 'Sierra Digital',
}

export const kpiGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'target',
      type: 'text',
      content: 'Govern AP metric definitions, formulas, baselines, targets, sources, owners and financial value calculations across the Accounts Payable process.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'pills',
      items: ['CFO', 'Controller', 'AP Director', 'Process Owner', 'Data Steward', 'Value Lead'],
    },
    {
      heading: 'Decisions Supported',
      icon: 'scale',
      type: 'bullets',
      items: [
        'Define and standardize KPI and metric definitions',
        'Validate calculation logic and ensure accuracy',
        'Set baselines, targets and performance thresholds',
        'Assign ownership and accountable parties',
        'Ensure data trust, source integrity and governance',
        'Quantify financial value and track realization',
      ],
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'bullets',
      items: [
        'Review and approve metric definitions and formulas',
        'Validate data sources and calculation logic',
        'Confirm targets and refresh baselines quarterly',
        'Monitor performance and act on exceptions',
        'Review value inputs and update assumptions',
      ],
    },
    {
      heading: 'Key Measures (Current vs Target)',
      icon: 'barChart',
      type: 'table',
      rows: [
        { label: 'Touchless Processing', current: '46%', target: '80%' },
        { label: 'First-Pass VIM Readiness', current: '84%', target: '95%' },
        { label: 'Extraction Accuracy', current: '94%', target: '98%' },
        { label: 'Line Match Rate', current: '78%', target: '90%' },
        { label: 'Human Touches', current: '1.8', target: '0.8' },
        { label: 'Annualized Value', current: '$1.2M', target: '$1.0M' },
      ],
    },
    {
      heading: 'Business Value',
      icon: 'dollar',
      type: 'text',
      content: 'Improved automation, accuracy and straight-through processing reduce cost, rework and exceptions while unlocking measurable financial value.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'SAP, VIM, BTP, Document AI, finance assumptions and metric registry.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'AP Process Owner',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const apAssistantPageHeader = {
  title: 'AI Assistant',
  subtitle: 'Evidence-based recommendations with human approval and financial controls',
}

export const apQuery = {
  question: 'Why is invoice INV-984521 blocked, and what is the safest next action?',
  answer:
    'Invoice INV-984521 is blocked due to freight and tax variance beyond policy tolerance. The safest next action is to accept the proposed vendor, allocate $1,350 freight to the approved PO freight condition, and route the $6,240 tax variance to AP Tax Review.',
  disclaimer: 'AI-generated response. Validate before action.',
}

export const invoiceContext = {
  vendor: 'Gulf Industrial Services',
  invoice: 'INV-984521',
  po: '4500981234',
  amount: '$184,760',
  due: 'Aug 24, 2026',
  exception: 'Freight and tax variance',
  paymentRisk: 'High',
}

export const assistantRecommendation = {
  title: 'AI Review Recommendation',
  recommendation:
    'Accept the proposed vendor, allocate $1,350 freight to the approved PO freight condition, and route the $6,240 tax variance to AP Tax Review.',
  confidence: '92%',
  evidenceUsed: [
    { icon: 'fileText', text: 'Invoice image and extracted fields' },
    { icon: 'users', text: 'SAP vendor master' },
    { icon: 'cart', text: 'PO and goods receipt' },
    { icon: 'history', text: 'VIM history' },
    { icon: 'shield', text: 'Marathon AP policy' },
  ],
  requiredApprovals: ['AP Processor', 'AP Tax Reviewer'],
  prohibitedActions: ['No autonomous posting', 'No tolerance override', 'No vendor master change'],
  actions: [
    { label: 'Accept Recommendation', icon: 'check', variant: 'primary' },
    { label: 'Modify', icon: 'pencil', variant: 'outline' },
    { label: 'Reject', icon: 'x', variant: 'outline-red' },
    { label: 'View Evidence', icon: 'fileText', variant: 'outline' },
  ],
}

export const assistantWhatIfScenarios = {
  columns: [
    { num: 1, label: 'Current Process', highlight: false },
    { num: 2, label: 'AI Assist, Recommended', highlight: true },
    { num: 3, label: 'Auto-Release, Not Allowed', highlight: false },
  ],
  rows: [
    { label: 'Cycle time', values: ['2.4 days', '0.8 days', '0.2 days'] },
    { label: 'Manual effort', values: ['38 min', '12 min', '2 min'] },
    { label: 'Processing cost', values: ['$28.50', '$11.20', '$5.10'] },
    { label: 'Payment risk', values: ['High', 'Low', 'Low'], badge: true },
    { label: 'Compliance', values: ['Compliant', 'Compliant', 'Not allowed'], status: true },
  ],
}

export const expectedValueImpact = [
  { icon: 'clock', value: '26 minutes', label: 'saved' },
  { icon: 'trendDown', value: '67%', label: 'cycle-time reduction' },
  { icon: 'dollar', value: '$17.30', label: 'cost avoided per invoice' },
  { icon: 'shield', value: '$4,200', label: 'exposure reduced' },
  { icon: 'checkCircle', value: 'controls preserved', label: '' },
]

export const expectedValueFootnote = 'Illustrative scenario values, subject to Marathon baseline validation.'

export const apAssistantGuidance = {
  title: 'Business Use & Guidance',
  closeIcon: 'x',
  sections: [
    {
      heading: 'Purpose',
      icon: 'checkCircle',
      type: 'text',
      content: 'Provide evidence-based answers and controlled recommendations across invoice intake, extraction, pre-validation, matching and VIM.',
    },
    {
      heading: 'Primary Personas',
      icon: 'users',
      type: 'text',
      content: 'AP Processor, AP Supervisor, Tax Reviewer, Buyer, Controller',
    },
    {
      heading: 'Decisions Supported',
      icon: 'clock',
      type: 'text',
      content: 'Cause of exception, safest next action, supporting evidence, required approvals, and expected value impact.',
    },
    {
      heading: 'Recommended Actions',
      icon: 'checkCircle',
      type: 'text',
      content: 'Accept recommendation, modify details, reject recommendation, or view evidence.',
    },
    {
      heading: 'Key Measures (Current → Target)',
      icon: 'alertTriangle',
      type: 'bullets',
      items: [
        'Cycle time: 2.4 days → 0.8 days',
        'Manual effort: 38 min → 12 min',
        'Processing cost: $28.50 → $11.20',
        'Payment risk: High → Low',
        'Compliance: Compliant → Compliant',
      ],
    },
    {
      heading: 'Business Value',
      icon: 'barChart',
      type: 'text',
      content: 'Faster, safer AP outcomes with lower cost, reduced risk, and preserved controls.',
    },
    {
      heading: 'Data Sources',
      icon: 'database',
      type: 'text',
      content: 'Invoice & extracted data, SAP vendor master, PO & goods receipt, VIM history, Marathon AP policy and historical performance.',
    },
    {
      heading: 'Accountable Owner',
      icon: 'userCheck',
      type: 'text',
      content: 'Accounts Payable Operations',
    },
  ],
  footerButton: 'View KPI Definitions',
}

export const sidebarItems = [
  { icon: 'layoutDashboard', label: 'Dashboard' },
  { icon: 'sparkles', label: 'AP Assistant' },
  { icon: 'mail', label: 'Email & Attachment Triage' },
  { icon: 'fileText', label: 'Document AI & Extraction' },
  { icon: 'checkCircle', label: 'Pre-Validation' },
  { icon: 'grid', label: 'PO & Line Matching' },
  { icon: 'alertTriangle', label: 'Exceptions & Recommendations' },
  { icon: 'layers', label: 'VIM Processing' },
  { icon: 'users', label: 'Work Assignment' },
  { icon: 'barChart', label: 'Operational Analytics' },
  { icon: 'search', label: 'Extraction Diagnostics' },
  { icon: 'fileCheck', label: 'Audit & Reconciliation' },
  { icon: 'barChart2', label: 'KPI, Metrics & Value' },
  { icon: 'layers', label: 'VIM Processing', wip: true },
  { icon: 'users', label: 'Work Assignment', wip: true },
  { icon: 'barChart', label: 'Operational Analytics', wip: true },
  { icon: 'search', label: 'Extraction Diagnostics', wip: true },
  { icon: 'fileCheck', label: 'Audit & Reconciliation', wip: true },
  { icon: 'barChart2', label: 'KPI, Metrics & Value', wip: true },
  { icon: 'sparkles', label: 'AP Assistant' },
]
