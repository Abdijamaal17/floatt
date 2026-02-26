import type { ScanFindings } from '@/types'
import { checkSSL } from './ssl'
import { checkSecurityHeaders } from './headers'
import { checkPublicFiles } from './robots'
import { detectCMS } from './cms'

/**
 * Main scan orchestrator. Runs all passive checks in parallel.
 *
 * AUTHORIZATION REQUIREMENT: The caller MUST verify that the domain is
 * verified=true in the database before calling this function.
 * This is enforced at the API layer (/api/scan) before this is invoked.
 */
export async function runScan(domain: string): Promise<ScanFindings> {
  // All checks run in parallel for speed, none are intrusive
  const [ssl, headers, publicFiles, cms] = await Promise.all([
    checkSSL(domain),
    checkSecurityHeaders(domain),
    checkPublicFiles(domain),
    detectCMS(domain),
  ])

  return {
    ssl,
    headers,
    publicFiles,
    cms,
    scannedAt: new Date().toISOString(),
    domain,
  }
}

/**
 * Calculates a security score (0-100) from raw findings.
 * Deductions are applied per severity level.
 */
export function calculateSecurityScore(findings: ScanFindings): number {
  let score = 100

  // SSL checks
  if (!findings.ssl.available) {
    score -= 40 // No HTTPS at all — critical
  } else {
    if (!findings.ssl.valid) score -= 30          // Expired/invalid cert
    if (findings.ssl.selfSigned) score -= 20      // Self-signed cert
    if (findings.ssl.daysUntilExpiry < 14) score -= 15 // Expires very soon
    else if (findings.ssl.daysUntilExpiry < 30) score -= 8 // Expires soon
    if (findings.ssl.protocol === 'TLSv1' || findings.ssl.protocol === 'TLSv1.1') score -= 15 // Weak protocol
  }

  // Security headers
  const h = findings.headers
  if (!h.contentSecurityPolicy) score -= 15    // High
  if (!h.strictTransportSecurity) score -= 15  // High
  if (!h.xFrameOptions) score -= 8             // Medium
  if (!h.xContentTypeOptions) score -= 5       // Medium
  if (!h.referrerPolicy) score -= 3            // Low
  if (!h.permissionsPolicy) score -= 2         // Info

  // Information disclosure
  if (h.xPoweredBy) score -= 3                 // Leaks tech stack
  if (h.server) score -= 2                     // Leaks server info

  // Public exposure
  if (findings.publicFiles.directoryListing) score -= 15 // High

  return Math.max(0, Math.min(100, score))
}
