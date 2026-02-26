import type { HeadersFinding } from '@/types'

/**
 * Fetches the domain and inspects HTTP security response headers.
 * Uses HEAD request first, falls back to GET if headers are missing.
 * This is a passive, read-only, non-intrusive check.
 */
export async function checkSecurityHeaders(domain: string): Promise<HeadersFinding> {
  const url = `https://${domain}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        // Identify ourselves honestly
        'User-Agent': 'Floatt-SecurityScanner/1.0 (authorized-scan; +https://floatt.io)',
      },
    })

    clearTimeout(timeout)

    const h = response.headers

    return {
      contentSecurityPolicy:  h.get('content-security-policy'),
      strictTransportSecurity: h.get('strict-transport-security'),
      xFrameOptions:          h.get('x-frame-options'),
      xContentTypeOptions:    h.get('x-content-type-options'),
      referrerPolicy:         h.get('referrer-policy'),
      permissionsPolicy:      h.get('permissions-policy'),
      xPoweredBy:             h.get('x-powered-by'),
      server:                 h.get('server'),
    }
  } catch {
    clearTimeout(timeout)
    // Return nulls — the scoring engine will treat missing as "failed"
    return {
      contentSecurityPolicy:  null,
      strictTransportSecurity: null,
      xFrameOptions:          null,
      xContentTypeOptions:    null,
      referrerPolicy:         null,
      permissionsPolicy:      null,
      xPoweredBy:             null,
      server:                 null,
    }
  }
}
