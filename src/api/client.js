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
