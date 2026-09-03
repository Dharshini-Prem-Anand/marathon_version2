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
export const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJqaWQiOiJmZjBqS0F4d0RpN1FkUlZZQXk4M2xjQzJ2a3JzT0orK0pYaytIWHJGdXc4PSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktLTEyNjUxNTkyODgifQ.eyJzdWIiOiJzYi1NYXJhdGhvbkludm9pY2VBdXRvbWF0aW9uLXBvYy1tYzEwLW9yZy1BSSF0MTU2NTI5IiwiaXNzIjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sImNsaWVudF9pZCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJhdWQiOlsic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSIsInVhYSJdLCJleHRfYXR0ciI6eyJlbmhhbmNlciI6IlhTVUFBIiwic3ViYWNjb3VudGlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiemRuIjoicG9jLW1jMTAifSwiemlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImF6cCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiXSwiZXhwIjoxNzg4NDgwNzQwLCJpYXQiOjE3ODg0Mzc1NDAsImp0aSI6IjY4NWZkNWZkMjA4NTRlMGI5YjAzN2ZlNzhhNGMyZTllIiwicmV2X3NpZyI6ImUzMjc1YzU2IiwiY2lkIjoic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSJ9.VBagQaKpcC_pIOAXGRmdbhP1YTUOkZ9f9o6kYV5LBeXmo85k2iyo5aOdPnrW5PulsXvNxx6DYBhFlPZD1SSsy6bz2grvvMOJG5S6hGymuV1w8JdJBwigCA2JWEJZafnwYH_-JcYXwEyPTCL31tctL_ItO33oOWRbrgHMS9EURotrT85HRcNLY4cAgE8FsV55MB6UM4lxu4bNPwJEOT02kLrfXbxQYMjMayd64QTZZuyywKZmeX7r_VZf2Bkfne_S2D4q6bcTqQ92K8uxhPgVgdYPsaeyz41TiOu9kGKp5jQc2WRtljFegiE0mK3CHKY7OMzoKXguxDSsBYJCsXGUhw'

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

