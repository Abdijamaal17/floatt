import { resend, FROM_EMAIL } from '@/lib/resend'
import type { AIReport, AIReportFinding, DomainRow } from '@/types'

// ─── Domain verified ──────────────────────────────────────────────────────────

export async function sendVerificationEmail(to: string, domain: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✓ Domain verified: ${domain}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; color: #18181b;">
        <h2 style="font-size: 20px; font-weight: 600;">Domain Verified</h2>
        <p>Your domain <strong>${domain}</strong> has been successfully verified on Floatt.</p>
        <p>You can now run security scans and receive AI-powered reports for this domain.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; padding: 10px 20px; background: #4f46e5;
                  color: white; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          Go to Dashboard
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #71717a;">
          You're receiving this because you added ${domain} to your Floatt account.
        </p>
      </div>
    `,
  })
}

// ─── Critical / High finding alert ────────────────────────────────────────────

export async function sendFindingAlert(
  to: string,
  domain: string,
  scanId: string,
  criticalFindings: AIReportFinding[],
) {
  const findingList = criticalFindings
    .map(
      (f) =>
        `<li><strong>${f.title}</strong> (${f.severity.toUpperCase()})<br>
         ${f.explanation}<br>
         <em>Fix: ${f.recommendation}</em></li>`,
    )
    .join('')

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `⚠ Security alert: ${criticalFindings.length} issue(s) found on ${domain}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; color: #18181b;">
        <h2 style="font-size: 20px; font-weight: 600; color: #dc2626;">Security Alert</h2>
        <p>A recent scan of <strong>${domain}</strong> detected ${criticalFindings.length} critical or high severity issue(s):</p>
        <ul style="line-height: 1.8;">${findingList}</ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/domains/${scanId}"
           style="display: inline-block; padding: 10px 20px; background: #4f46e5;
                  color: white; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          View Full Report
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #71717a;">
          Floatt — Authorized Security Monitoring. Scanning only permitted for verified domain owners.
        </p>
      </div>
    `,
  })
}

// ─── Weekly digest ─────────────────────────────────────────────────────────────

export async function sendWeeklyDigest(
  to: string,
  domains: Array<{ domain: string; score: number | null; lastScan: string | null }>,
) {
  const rows = domains
    .map(
      (d) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${d.domain}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; text-align: center;">
            <span style="color: ${scoreColor(d.score)}; font-weight: 600;">${d.score ?? 'N/A'}</span>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 12px;">
            ${d.lastScan ? new Date(d.lastScan).toLocaleDateString() : 'Never'}
          </td>
        </tr>`,
    )
    .join('')

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Floatt Weekly Security Digest',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; color: #18181b;">
        <h2 style="font-size: 20px; font-weight: 600;">Weekly Security Digest</h2>
        <p>Here's your security score summary for the past week:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f4f4f5; text-align: left; font-size: 12px; color: #71717a;">
              <th style="padding: 8px;">Domain</th>
              <th style="padding: 8px; text-align: center;">Score</th>
              <th style="padding: 8px;">Last Scan</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; padding: 10px 20px; background: #4f46e5;
                  color: white; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          View Dashboard
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #71717a;">
          Floatt — Authorized Security Monitoring for Modern Businesses.
        </p>
      </div>
    `,
  })
}

function scoreColor(score: number | null): string {
  if (!score) return '#71717a'
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#d97706'
  return '#dc2626'
}
