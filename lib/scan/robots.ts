import type { PublicFilesFinding } from '@/types'

async function isAccessible(url: string): Promise<{ accessible: boolean; content?: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Floatt-SecurityScanner/1.0 (authorized-scan; +https://floatt.io)' },
    })
    clearTimeout(timeout)

    if (res.status === 200) {
      const content = await res.text()
      return { accessible: true, content: content.slice(0, 2000) } // cap stored content
    }
    return { accessible: false }
  } catch {
    return { accessible: false }
  }
}

/**
 * Checks publicly accessible files that may reveal information about the site.
 * All requests are passive GET requests — no attack payloads, no auth attempts.
 */
export async function checkPublicFiles(domain: string): Promise<PublicFilesFinding> {
  const base = `https://${domain}`

  const [robotsTxt, sitemapXml, securityTxt, dirListing] = await Promise.all([
    isAccessible(`${base}/robots.txt`),
    isAccessible(`${base}/sitemap.xml`),
    isAccessible(`${base}/.well-known/security.txt`),
    // Check for directory listing by requesting a path that typically doesn't exist
    // and seeing if we get a directory index response
    (async () => {
      try {
        const res = await fetch(`${base}/`, {
          headers: { 'User-Agent': 'Floatt-SecurityScanner/1.0 (authorized-scan; +https://floatt.io)' },
        })
        const text = await res.text()
        return text.toLowerCase().includes('index of /')
      } catch {
        return false
      }
    })(),
  ])

  return {
    robotsTxt: { accessible: robotsTxt.accessible, content: robotsTxt.content },
    sitemapXml: { accessible: sitemapXml.accessible },
    securityTxt: { accessible: securityTxt.accessible },
    directoryListing: dirListing,
  }
}
