// Backend: Marathon Invoice Automation OData v4 service.
//
// In dev, requests go through the Vite proxy (see vite.config.js) so the
// browser never makes a cross-origin call. In a built/deployed app set
// VITE_API_BASE_URL to the absolute service URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/odata/v4/invoice-automation'

// Bearer token for the OData service — DEV ONLY. Set VITE_API_TOKEN in
// .env.local (gitignored); never hardcode it here, because Vite inlines the
// literal into the built bundle and ships it to every browser.
//
// In a deployed app this stays empty: no Authorization header is sent, and the
// server module attaches credentials from the BTP destination instead.
export const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJqaWQiOiI2Q2lNYWFoS3MxNEtpY2tEWDBJMlBSTDhTVkVFbmJFK1J4RGlUc25tK09jPSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktLTEyNjUxNTkyODgifQ.eyJzdWIiOiJzYi1NYXJhdGhvbkludm9pY2VBdXRvbWF0aW9uLXBvYy1tYzEwLW9yZy1BSSF0MTU2NTI5IiwiaXNzIjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sImNsaWVudF9pZCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJhdWQiOlsic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSIsInVhYSJdLCJleHRfYXR0ciI6eyJlbmhhbmNlciI6IlhTVUFBIiwic3ViYWNjb3VudGlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiemRuIjoicG9jLW1jMTAifSwiemlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImF6cCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiXSwiZXhwIjoxNzg5MDcwMjEyLCJpYXQiOjE3ODkwMjcwMTIsImp0aSI6ImM4ZWM2Yzg1OWE3MjRmYzFiN2ZjMGRmZWVmZDc1OWJlIiwicmV2X3NpZyI6ImUzMjc1YzU2IiwiY2lkIjoic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSJ9.atfm6gYV8dhfyrRDbNcYlmHu23j5og-GMt-qboDRhEH9d1nB7Vd1F6Ew6_yrzt3SD1lkmyQEdIFP9qxMgPktmt6LXewQPZM1AsxoPjTHFY3liBme9kaRWWFe7GbYkkPkgYJup9C7j1Q-O17mYe-eiP6prTvd4kGwGpBGU51bWxPVsskwaCJO_PcaactTwrE4HkHHOpKx6Sx6anUtPcuwJRqWt-D_ZKGOrLlwlAUu6ZrCz153tEAbVHfiK7B8Y7eCNjODzFl8uQ0MzvujavtGYARtojrhEjOxyuM1wuV-UuvZ262l-JMj_Ogu28R00yCw-vgYdBREJ7AkSd6-g0CNnA'

// FastAPI service that proxies the original PDF out of SAP Document
// Information Extraction (GET /getExtractedDocument?document_id=...).
// This is NOT the CAP OData service, so it needs its own base URL — set
// VITE_PDF_SERVICE_BASE_URL (no trailing slash) in .env.local.
//
// In dev the call is routed through the Vite proxy at /pdf-api to avoid CORS;
// in a build it goes straight to the configured host.
const PDF_HOST = (import.meta.env.VITE_PDF_SERVICE_BASE_URL || 'https://poc-mc10-org-ai-marathoninvoiceautomation-pysrv.cfapps.us10-001.hana.ondemand.com').replace(/\/+$/, '')
export const PDF_SERVICE_BASE_URL = PDF_HOST && import.meta.env.DEV ? '/pdf-api' : PDF_HOST

// Same FastAPI host also serves /matchExplanation — alias for clarity at the
// call sites that aren't about PDFs.
export const PYTHON_SERVICE_BASE_URL = PDF_SERVICE_BASE_URL

