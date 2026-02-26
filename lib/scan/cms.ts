import type { CMSFinding } from '@/types'

interface CMSSignature {
  name: string
  headerPatterns: RegExp[]
  bodyPatterns: RegExp[]
  versionPattern?: RegExp
}

const CMS_SIGNATURES: CMSSignature[] = [
  {
    name: 'WordPress',
    headerPatterns: [/wordpress/i],
    bodyPatterns: [/wp-content\//i, /wp-json\//i, /wordpress/i],
    versionPattern: /wordpress\s+([\d.]+)/i,
  },
  {
    name: 'Drupal',
    headerPatterns: [/drupal/i, /x-generator.*drupal/i],
    bodyPatterns: [/\/sites\/default\//i, /drupal\.org/i],
    versionPattern: /drupal\s+([\d.]+)/i,
  },
  {
    name: 'Joomla',
    headerPatterns: [],
    bodyPatterns: [/joomla/i, /\/components\/com_/i],
  },
  {
    name: 'Shopify',
    headerPatterns: [/shopify/i],
    bodyPatterns: [/myshopify\.com/i, /cdn\.shopify\.com/i],
  },
  {
    name: 'Wix',
    headerPatterns: [],
    bodyPatterns: [/wix\.com/i, /static\.parastorage\.com/i],
  },
  {
    name: 'Squarespace',
    headerPatterns: [/squarespace/i],
    bodyPatterns: [/squarespace\.com/i, /sqspcdn\.com/i],
  },
  {
    name: 'Ghost',
    headerPatterns: [/ghost/i],
    bodyPatterns: [/ghost\//i],
  },
  {
    name: 'Next.js',
    headerPatterns: [/next\.js/i, /x-powered-by.*next/i],
    bodyPatterns: [/__next/i, /_next\/static/i],
  },
  {
    name: 'Laravel',
    headerPatterns: [/laravel_session/i],
    bodyPatterns: [],
  },
  {
    name: 'Magento',
    headerPatterns: [],
    bodyPatterns: [/mage\/cookies/i, /magento/i],
  },
]

/**
 * Passively detects the CMS/framework from HTTP headers and HTML body content.
 * No payloads, exploits, or authenticated requests are used.
 */
export async function detectCMS(domain: string): Promise<CMSFinding> {
  const indicators: string[] = []
  let detected = false
  let cms: string | null = null
  let version: string | null = null

  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(`https://${domain}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Floatt-SecurityScanner/1.0 (authorized-scan; +https://floatt.io)' },
    })

    const body = await res.text()
    const allHeaderValues = Array.from(res.headers.values()).join(' ')

    for (const sig of CMS_SIGNATURES) {
      const headerMatch = sig.headerPatterns.some((p) => p.test(allHeaderValues))
      const bodyMatch = sig.bodyPatterns.some((p) => p.test(body))

      if (headerMatch || bodyMatch) {
        detected = true
        cms = sig.name

        if (headerMatch) indicators.push(`Header signature detected: ${sig.name}`)
        if (bodyMatch) indicators.push(`Body signature detected: ${sig.name}`)

        // Try to extract version
        if (sig.versionPattern) {
          const headerVersion = allHeaderValues.match(sig.versionPattern)
          const bodyVersion = body.match(sig.versionPattern)
          version = (headerVersion ?? bodyVersion)?.[1] ?? null
          if (version) indicators.push(`Version detected: ${version}`)
        }

        break
      }
    }

    // Check x-powered-by separately
    const poweredBy = res.headers.get('x-powered-by')
    if (poweredBy) indicators.push(`X-Powered-By: ${poweredBy}`)

    const generatorMatch = body.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i)
    if (generatorMatch) {
      indicators.push(`Meta generator: ${generatorMatch[1]}`)
      if (!detected) {
        detected = true
        cms = generatorMatch[1].split(' ')[0]
      }
    }
  } catch {
    // Non-fatal — we just won't detect a CMS
  }

  return { detected, cms, version, indicators }
}
