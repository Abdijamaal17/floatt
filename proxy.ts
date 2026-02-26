import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware enforces three checks in order:
 * 1. Authentication — /dashboard/* requires a valid session
 * 2. Terms acceptance — authenticated users who haven't accepted ToS
 *    are redirected to /onboarding/legal before any dashboard access
 * 3. Auth-page redirect — authenticated users with ToS accepted are
 *    sent to /dashboard when they visit /auth/* pages
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: always call getUser() to refresh the session token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── 1. Unauthenticated user trying to access dashboard ────────────────────
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // ── 2. Terms acceptance gate (auth check → terms check) ──────────────────
  // If a logged-in user hasn't accepted terms, gate them to /onboarding/legal
  // Exception: allow /onboarding/legal itself, /auth/*, /api/*, /legal/* through
  if (
    user &&
    !pathname.startsWith('/onboarding') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/legal') &&
    pathname.startsWith('/dashboard')
  ) {
    // Check terms_accepted — use a lightweight query
    const { data: profile } = await supabase
      .from('users')
      .select('terms_accepted')
      .eq('id', user.id)
      .single()

    if (!profile?.terms_accepted) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/legal'
      return NextResponse.redirect(url)
    }
  }

  // ── 3. Redirect authenticated+accepted users away from auth pages ─────────
  if ((pathname === '/auth/login' || pathname === '/auth/signup') && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('terms_accepted')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = profile?.terms_accepted ? '/dashboard' : '/onboarding/legal'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
