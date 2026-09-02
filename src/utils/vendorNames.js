// The backend carries only vendor codes — VendorNO / InvoicingParty on Invoices,
// Supplier on PurchaseOrders, Vendor on Exceptions are all codes like
// "USSU-PBP02". There is no supplier name anywhere in the service, so these are
// display names mapped in the frontend.
//
// NOTE: only USSU-PBP02 is grounded in real data (the extracted invoice PDF for
// 660002 reads "PERMIAN BASIN PETROLEUM SUPPLY CO."). The rest are placeholders
// inferred from the code initials — replace them with the real supplier names,
// or better, expose a supplier name from the backend.
export const vendorNamesByCode = {
  'USSU-PBP02': 'Permian Basin Petroleum Supply',
  'USSU-LSF01': 'Lone Star Fuel & Supply',
  '490LSF01': 'Lone Star Fuel & Supply',
  'USSU-RGE03': 'Rio Grande Energy',
  'USSU-SRP04': 'Southern Refining Products',
  'USSU-BBF05': 'Big Bend Fuel Company',
  'USSU-CGP06': 'Coastal Gulf Petroleum',
  'USSU-DSE07': 'Delta States Energy',
  'USSU-TRF08': 'Tri-River Fuels',
  'USSU-APS09': 'Allied Petroleum Services',
  'USSU-FFC10': 'Frontier Fuel Corporation',
}

// Falls back to the raw code so an unmapped vendor is still identifiable.
export function vendorName(code) {
  if (!code) return '—'
  return vendorNamesByCode[code] ?? code
}
