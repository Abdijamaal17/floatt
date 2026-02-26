import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import dns from 'dns'
import { sendVerificationEmail } from '@/lib/email/alerts'

// This route uses Node.js DNS APIs — must run on Node runtime, not Edge
export const runtime = 'nodejs'

async function checkDNSTxt(domain: string, token: string): Promise<boolean> {
  try {
    const records = await dns.promises.resolveTxt(domain)
    const flat = records.flat()
    return flat.some((r) => r.includes(`floatt-verify=${token}`))
  } catch {
    return false
  }
}

async function checkFileVerification(domain: string, token: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 8_000)

    const res = await fetch(`https://${domain}/.well-known/floatt-verify.txt`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Floatt-Verification/1.0' },
    })

    if (!res.ok) return false
    const text = (await res.text()).trim()
    return text === token || text.includes(token)
  } catch {
    return false
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Authorization: verify session before any verification check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch the domain — ownership enforced by user_id filter + RLS
  const { data: domain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !domain) {
    return NextResponse.json({ error: 'Domain not found.' }, { status: 404 })
  }

  if (domain.verified) {
    return NextResponse.json({ message: 'Domain is already verified.' })
  }

  // Try DNS TXT verification first, then file-based
  const [dnsVerified, fileVerified] = await Promise.all([
    checkDNSTxt(domain.domain, domain.verification_token),
    checkFileVerification(domain.domain, domain.verification_token),
  ])

  const verified = dnsVerified || fileVerified
  const method = dnsVerified ? 'dns' : fileVerified ? 'file' : null

  if (!verified) {
    return NextResponse.json({
      verified: false,
      message: 'Verification token not found. Ensure your DNS TXT record or verification file is in place, then try again. DNS changes can take up to 48 hours.',
    })
  }

  // Mark domain as verified in database
  await supabase
    .from('domains')
    .update({
      verified: true,
      verification_method: method,
      verified_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  // Fetch user email for confirmation email
  const { data: { user: fullUser } } = await supabase.auth.getUser()
  if (fullUser?.email) {
    await sendVerificationEmail(fullUser.email, domain.domain).catch(console.error)
  }

  return NextResponse.json({
    verified: true,
    method,
    message: `✓ Domain verified via ${method === 'dns' ? 'DNS TXT record' : 'file upload'}.`,
  })
}
