import $ from 'jquery'
import { API_BASE_URL, AUTH_TOKEN } from './config'

// Thin jQuery.ajax wrapper that attaches auth headers and returns a Promise.
export function apiGet(path, params) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_BASE_URL}${path}`,
      type: 'GET',
      dataType: 'json',
      data: params,
      headers: {
        Accept: 'application/json',
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      },
    })
      .done(resolve)
      .fail((xhr, textStatus, errorThrown) => {
        const message =
          xhr?.responseJSON?.error?.message || errorThrown || textStatus || 'Request failed'
        reject(new Error(`${path}: ${message}`))
      })
  })
}

// JSON POST to an absolute URL (caller builds the full URL — used for services
// that live on a different host than API_BASE_URL, e.g. the chat/PDF service).
export function apiPostJson(url, body) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(body),
      dataType: 'json',
      headers: {
        Accept: 'application/json',
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      },
    })
      .done(resolve)
      .fail((xhr, textStatus, errorThrown) => {
        const message =
          xhr?.responseJSON?.error?.message || xhr?.responseJSON?.detail || errorThrown || textStatus || 'Request failed'
        reject(new Error(message))
      })
  })
}

// Binary GET (PDF bytes). Returns a Blob so the caller can build an object URL;
// an <iframe src> can't carry an Authorization header, so we fetch it here.
export function apiGetBlob(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type: 'GET',
      xhrFields: { responseType: 'blob' },
      headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
    })
      .done(resolve)
      .fail((xhr, textStatus, errorThrown) => {
        reject(new Error(errorThrown || textStatus || 'Request failed'))
      })
  })
}
