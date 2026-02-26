import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'
import type { Plan, DomainRow, ScanRow, AIReport } from '@/types'

// Use Node runtime for @react-pdf/renderer
export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> },
) {
  const { scanId } = await params

  // ── Authorization check ────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Plan check: PDF export is Pro+ only ───────────────────────────────────
  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  const plan = (profile?.plan ?? 'free') as Plan

  if (!PLAN_LIMITS[plan].pdfExport) {
    return NextResponse.json(
      { error: 'PDF export is available on Pro and higher plans.' },
      { status: 403 },
    )
  }

  // ── Fetch scan (ownership enforced by user_id + RLS) ──────────────────────
  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', user.id)
    .single()

  if (scanError || !scan) {
    return NextResponse.json({ error: 'Scan not found.' }, { status: 404 })
  }

  if (!scan.ai_report) {
    return NextResponse.json({ error: 'AI report not yet available for this scan.' }, { status: 404 })
  }

  // ── Fetch domain ───────────────────────────────────────────────────────────
  const { data: domain } = await supabase
    .from('domains')
    .select('*')
    .eq('id', scan.domain_id)
    .eq('user_id', user.id)
    .single()

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found.' }, { status: 404 })
  }

  // ── Generate PDF ───────────────────────────────────────────────────────────
  try {
    // Dynamic import to avoid issues in non-Node environments
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const React = await import('react')
    const { FloattPDFReport } = await import('@/lib/pdf/report')

    const element = React.createElement(FloattPDFReport, {
      domain: domain as DomainRow,
      scan: scan as ScanRow,
      report: scan.ai_report as AIReport,
    })

    const buffer = await renderToBuffer(element as any)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="floatt-report-${domain.domain}.pdf"`,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF.' }, { status: 500 })
  }
}
