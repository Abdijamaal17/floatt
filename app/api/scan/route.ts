import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runScan, calculateSecurityScore } from '@/lib/scan/runner'
import { generateAIReport } from '@/lib/ai-report'
import { sendFindingAlert } from '@/lib/email/alerts'
import { PLAN_LIMITS } from '@/types'
import type { Plan } from '@/types'
import { z } from 'zod'

// Must run on Node runtime for tls / dns modules used by the scan engine
export const runtime = 'nodejs'

const ScanRequestSchema = z.object({
  domainId: z.string().uuid(),
  scanAuthorizationConfirmed: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  // ── 1. Authentication ──────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Terms acceptance check ──────────────────────────────────────────────
  const { data: userRow } = await supabase
    .from('users')
    .select('plan, terms_accepted')
    .eq('id', user.id)
    .single()

  if (!userRow?.terms_accepted) {
    return NextResponse.json(
      { error: 'You must accept the Terms of Service before running scans.' },
      { status: 403 },
    )
  }

  // ── 3. Parse and validate request ─────────────────────────────────────────
  const body = await request.json().catch(() => null)
  const parsed = ScanRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const { domainId } = parsed.data

  // ── 4. Domain ownership + verification check ───────────────────────────────
  // CRITICAL: We NEVER scan a domain unless verified=true in the database.
  // This is enforced server-side — client-side state is NOT trusted.
  const { data: domain, error: domainError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .eq('user_id', user.id) // ownership check
    .single()

  if (domainError || !domain) {
    return NextResponse.json({ error: 'Domain not found.' }, { status: 404 })
  }

  if (!domain.verified) {
    return NextResponse.json(
      { error: 'Domain must be verified before scanning. Please complete domain verification first.' },
      { status: 403 },
    )
  }

  // ── 5. Rate limit check (server-side) ─────────────────────────────────────
  const plan = (userRow?.plan ?? 'free') as Plan
  const scanIntervalHours = PLAN_LIMITS[plan].scanIntervalHours
  const scanIntervalMs = scanIntervalHours * 60 * 60 * 1000
  const cutoff = new Date(Date.now() - scanIntervalMs).toISOString()

  const { data: recentScan } = await supabase
    .from('scans')
    .select('id, started_at')
    .eq('domain_id', domainId)
    .eq('user_id', user.id)
    .gte('started_at', cutoff)
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  if (recentScan) {
    const nextAllowed = new Date(new Date(recentScan.started_at).getTime() + scanIntervalMs)
    return NextResponse.json(
      {
        error: `Rate limit reached. Your ${plan} plan allows one scan per ${scanIntervalHours}h per domain. Next scan available: ${nextAllowed.toLocaleString()}`,
        nextAllowedAt: nextAllowed.toISOString(),
      },
      { status: 429 },
    )
  }

  // ── 6. Create scan record ──────────────────────────────────────────────────
  const { data: scanRecord, error: scanInsertError } = await supabase
    .from('scans')
    .insert({
      domain_id: domainId,
      user_id: user.id,
      status: 'running',
    })
    .select()
    .single()

  if (scanInsertError || !scanRecord) {
    return NextResponse.json({ error: 'Failed to create scan record.' }, { status: 500 })
  }

  // ── 7. Log scan authorization ──────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const userAgent = request.headers.get('user-agent') ?? 'unknown'

  await supabase.from('scan_authorizations').insert({
    user_id: user.id,
    domain_id: domainId,
    scan_id: scanRecord.id,
    ip_address: ip,
    user_agent: userAgent,
    authorization_statement: `User confirmed ownership/authorization at time of scan trigger`,
  })

  // Return the scan ID immediately so the client can poll
  // The actual scan runs asynchronously after this response is sent
  // (Next.js waitUntil pattern — we use a fire-and-forget approach here)
  runScanAsync(scanRecord.id, domain.domain, user.id, domainId, user.email ?? '', plan)

  return NextResponse.json({ scanId: scanRecord.id, status: 'running' }, { status: 202 })
}

/**
 * Runs the scan pipeline asynchronously.
 * Because Next.js serverless functions don't support true background work,
 * this will run within the request lifecycle. For production, consider
 * moving this to a queue (e.g. Inngest, Trigger.dev, or Supabase Edge Functions).
 */
async function runScanAsync(
  scanId: string,
  domain: string,
  userId: string,
  domainId: string,
  userEmail: string,
  plan: Plan,
) {
  const { createAdminClient } = await import('@/lib/supabase/server')
  const adminClient = createAdminClient()

  try {
    // Run all passive scan checks
    const findings = await runScan(domain)
    const securityScore = calculateSecurityScore(findings)

    // Generate AI report
    const aiReport = await generateAIReport(findings)

    // Store results
    await adminClient
      .from('scans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        findings,
        ai_report: aiReport,
        security_score: securityScore,
      })
      .eq('id', scanId)

    // ── Send email alert for critical/high findings (Pro+ only) ──────────────
    if (PLAN_LIMITS[plan].emailAlerts && userEmail) {
      const criticalFindings = aiReport.findings.filter(
        (f) => f.severity === 'critical' || f.severity === 'high',
      )
      if (criticalFindings.length > 0) {
        await sendFindingAlert(userEmail, domain, scanId, criticalFindings)

        // Log the alert
        await adminClient.from('alerts').insert({
          user_id: userId,
          domain_id: domainId,
          scan_id: scanId,
          type: criticalFindings.some((f) => f.severity === 'critical')
            ? 'critical_finding'
            : 'high_finding',
        })
      }
    }
  } catch (err) {
    console.error('Scan failed:', err)
    await adminClient
      .from('scans')
      .update({ status: 'failed', completed_at: new Date().toISOString() })
      .eq('id', scanId)
  }
}
