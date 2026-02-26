import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const AcceptSchema = z.object({
  termsVersion: z.string(),
})

export async function POST(request: NextRequest) {
  // Authorization: must be logged in to accept terms
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = AcceptSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Extract IP address from request headers
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  // Record acceptance with timestamp, IP, and terms version
  const { error } = await supabase
    .from('users')
    .update({
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      terms_version: parsed.data.termsVersion,
      terms_ip: ip,
    })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
