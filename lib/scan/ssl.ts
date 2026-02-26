import * as tls from 'tls'
import type { SSLFinding } from '@/types'

/**
 * Checks SSL/TLS configuration for a domain by opening a TLS connection
 * and inspecting the certificate. This is a passive, read-only operation.
 */
export async function checkSSL(hostname: string): Promise<SSLFinding> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        available: false,
        valid: false,
        validFrom: '',
        validTo: '',
        daysUntilExpiry: -1,
        protocol: 'unknown',
        cipher: 'unknown',
        issuer: 'unknown',
        subject: hostname,
        selfSigned: false,
        error: 'Connection timed out',
      })
    }, 10_000)

    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        // rejectUnauthorized: false allows us to inspect even invalid/expired certs
        rejectUnauthorized: false,
      },
      () => {
        clearTimeout(timeout)

        try {
          const cert = socket.getPeerCertificate(false)
          const protocol = socket.getProtocol() ?? 'unknown'
          const cipher = socket.getCipher()

          socket.destroy()

          const validFrom = new Date(cert.valid_from)
          const validTo = new Date(cert.valid_to)
          const now = new Date()
          const daysUntilExpiry = Math.floor(
            (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          )

          const issuerCN = (cert.issuer as unknown as Record<string, string>)?.CN ?? 'unknown'
          const subjectCN = (cert.subject as unknown as Record<string, string>)?.CN ?? hostname

          resolve({
            available: true,
            valid: now >= validFrom && now <= validTo,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysUntilExpiry,
            protocol,
            cipher: cipher?.name ?? 'unknown',
            issuer: issuerCN,
            subject: subjectCN,
            selfSigned: issuerCN === subjectCN,
          })
        } catch (err) {
          socket.destroy()
          resolve({
            available: true,
            valid: false,
            validFrom: '',
            validTo: '',
            daysUntilExpiry: -1,
            protocol: 'unknown',
            cipher: 'unknown',
            issuer: 'unknown',
            subject: hostname,
            selfSigned: false,
            error: 'Failed to parse certificate',
          })
        }
      },
    )

    socket.on('error', (err) => {
      clearTimeout(timeout)
      socket.destroy()
      resolve({
        available: false,
        valid: false,
        validFrom: '',
        validTo: '',
        daysUntilExpiry: -1,
        protocol: 'unknown',
        cipher: 'unknown',
        issuer: 'unknown',
        subject: hostname,
        selfSigned: false,
        error: err.message,
      })
    })
  })
}
