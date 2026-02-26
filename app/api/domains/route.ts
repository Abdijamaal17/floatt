import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'
import type { Plan } from '@/types'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const AddDomainSchema = z.object({
  domain: z.string().min(3).max(253),
  authorizationType: z.enum(['owned', 'authorized']).default('owned'),
  authorizedBy: z.string().optional(),
})

export async function GET() {
  // Authorization: verify session before returning any data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ domains: data })
}

export async function POST(request: NextRequest) {
  // Authorization: verify session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Parse and validate input
  const body = await request.json().catch(() => null)
  const parsed = AddDomainSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.', details: parsed.error.flatten() }, { status: 400 })
  }

  const { domain, authorizationType, authorizedBy } = parsed.data

  // Sanitize domain — strip protocol, path, port
  const cleanDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:.*$/, '')

  // Plan enforcement: check domain count limit server-side
  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  const plan = (profile?.plan ?? 'free') as Plan
  const limit = PLAN_LIMITS[plan].maxDomains

  const { count } = await supabase
    .from('domains')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count !== null && count >= limit) {
    return NextResponse.json(
      { error: `Domain limit reached for your ${plan} plan (${limit} domains). Upgrade to add more.` },
      { status: 403 },
    )
  }

  // Check terms acceptance
  const { data: userRow } = await supabase.from('users').select('terms_accepted').eq('id', user.id).single()
  if (!userRow?.terms_accepted) {
    return NextResponse.json({ error: 'You must accept the Terms of Service before adding domains.' }, { status: 403 })
  }

  // Generate unique verification token
  const verificationToken = randomBytes(16).toString('hex')

  const { data: newDomain, error } = await supabase
    .from('domains')
    .insert({
      user_id: user.id,
      domain: cleanDomain,
      verification_token: verificationToken,
      authorization_type: authorizationType,
      authorized_by: authorizedBy ?? null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You have already added this domain.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ domain: newDomain }, { status: 201 })
}
