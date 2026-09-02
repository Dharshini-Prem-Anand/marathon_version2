// Backend: Marathon Invoice Automation OData v4 service.
//
// In dev, requests go through the Vite proxy (see vite.config.js) so the
// browser never makes a cross-origin call. In a built/deployed app set
// VITE_API_BASE_URL to the absolute service URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/odata/v4/invoice-automation'

// Bearer token for the OData service. Paste the token here (or set
// VITE_API_TOKEN in a .env.local file) and it is sent as
// `Authorization: Bearer <token>`.
export const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJqaWQiOiJIajBuVHN3cm1OS1llby9yN20wL01oaEhySlExanpqcGdzS2FoSVplVE80PSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktLTEyNjUxNTkyODgifQ.eyJzdWIiOiJzYi1NYXJhdGhvbkludm9pY2VBdXRvbWF0aW9uLXBvYy1tYzEwLW9yZy1BSSF0MTU2NTI5IiwiaXNzIjoiaHR0cHM6Ly9wb2MtbWMxMC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sImNsaWVudF9pZCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJhdWQiOlsic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSIsInVhYSJdLCJleHRfYXR0ciI6eyJlbmhhbmNlciI6IlhTVUFBIiwic3ViYWNjb3VudGlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiemRuIjoicG9jLW1jMTAifSwiemlkIjoiNDk5YTFhYWEtOGY2ZC00OTA2LThmNGYtODRkZDViZGQyMjRmIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImF6cCI6InNiLU1hcmF0aG9uSW52b2ljZUF1dG9tYXRpb24tcG9jLW1jMTAtb3JnLUFJIXQxNTY1MjkiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiXSwiZXhwIjoxNzg4MzM0OTE5LCJpYXQiOjE3ODgyOTE3MTksImp0aSI6Ijg2NjkzN2Q0ZmI4ZDQ0MWNhOTQyZGMyMDhjMmUxMGI4IiwicmV2X3NpZyI6ImUzMjc1YzU2IiwiY2lkIjoic2ItTWFyYXRob25JbnZvaWNlQXV0b21hdGlvbi1wb2MtbWMxMC1vcmctQUkhdDE1NjUyOSJ9.lZP_He6ebSh1F_3jBDdEPi8U6lP8z1lc02YqTEvkmiEW4WE50HkPUhxUfOFBfwYonz5I_ZTXYFHT-ptGR71jmHLAEdj97ARrJ214zn3k5Dm0QyqFDlza_dCX2V3sQTCwes5KdK-5jECnKuw1d5JSEP1RJs7801Djq_nErm1pasKzbyErXWdQ1qfO9uauC1E3Axel5ADEt5KNo6ecyejRxfGW41WHLqBHDo9v2ze12MGILw2zvvNxrfOn-56kVKOrltsoh8lNQRJZ_a7LKFq2U7Ap9wqnR9O4L9-nziH3bK1BA4j_oMSX6S3ZC5ejEFmAXdItHqZ9b3CUYv6pFUxoqg'

// FastAPI service that proxies the original PDF out of SAP Document
// Information Extraction (GET /getExtractedDocument?document_id=...).
// This is NOT the CAP OData service, so it needs its own base URL — set
// VITE_PDF_SERVICE_BASE_URL (no trailing slash) in .env.local.
//
// In dev the call is routed through the Vite proxy at /pdf-api to avoid CORS;
// in a build it goes straight to the configured host.
const PDF_HOST = (import.meta.env.VITE_PDF_SERVICE_BASE_URL || '').replace(/\/+$/, '')
export const PDF_SERVICE_BASE_URL = PDF_HOST && import.meta.env.DEV ? '/pdf-api' : PDF_HOST

