export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles Supabase email confirmation and OAuth redirect callbacks.
 * Exchanges the one-time code for a session, then redirects the user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to dashboard (or wherever they were headed)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect to error page on failure
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
