// Resolves a BTP destination through the Destination service REST API.
//
// Two hops, both server-side because they need the destination service's
// client secret:
//   1. client_credentials token from the service's XSUAA  (credentials.url)
//   2. GET /destination-configuration/v1/destinations/<name>  (credentials.uri)
//
// For an OAuth2ClientCredentials destination the response also carries a ready
// -to-use access token in `authTokens`, so the browser never sees a credential.

const TOKEN_SKEW_MS = 60_000

function serviceCredentials() {
  const vcap = JSON.parse(process.env.VCAP_SERVICES || '{}')
  const binding = vcap.destination?.[0]
  if (!binding?.credentials) {
    throw new Error('No "destination" service bound to this app (check VCAP_SERVICES)')
  }
  return binding.credentials
}

let tokenCache = null

async function serviceToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_SKEW_MS) {
    return tokenCache.value
  }

  const { clientid, clientsecret, url } = serviceCredentials()
  const basic = Buffer.from(`${clientid}:${clientsecret}`).toString('base64')

  const res = await fetch(`${url.replace(/\/+$/, '')}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error(`Destination service token request failed: ${res.status} ${await res.text()}`)
  }

  const body = await res.json()
  tokenCache = {
    value: body.access_token,
    expiresAt: Date.now() + Number(body.expires_in ?? 3600) * 1000,
  }
  return tokenCache.value
}

const destinationCache = new Map()

// Returns { url, headers } — headers carry the destination's own auth, if any.
export async function resolveDestination(name) {
  const cached = destinationCache.get(name)
  if (cached && cached.expiresAt > Date.now() + TOKEN_SKEW_MS) {
    return cached.value
  }

  const token = await serviceToken()
  const { uri } = serviceCredentials()
  const res = await fetch(
    `${uri.replace(/\/+$/, '')}/destination-configuration/v1/destinations/${encodeURIComponent(name)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) {
    throw new Error(`Destination "${name}" lookup failed: ${res.status} ${await res.text()}`)
  }

  const body = await res.json()
  const config = body.destinationConfiguration ?? {}
  if (!config.URL) {
    throw new Error(`Destination "${name}" has no URL configured`)
  }

  // authTokens is present for OAuth flows; a NoAuthentication destination has none.
  const authToken = body.authTokens?.[0]
  const headers = {}
  if (authToken?.http_header?.key) {
    headers[authToken.http_header.key] = authToken.http_header.value
  } else if (authToken?.value) {
    headers.Authorization = `${authToken.type || 'Bearer'} ${authToken.value}`
  }

  const value = { url: config.URL.replace(/\/+$/, ''), headers, authentication: config.Authentication }
  // Expire with the token so a rotated credential is picked up.
  const ttlSeconds = Number(authToken?.expires_in ?? 3600)
  destinationCache.set(name, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
  return value
}
