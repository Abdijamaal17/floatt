import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authorization check: ensure user is authenticated before rendering any dashboard content
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile for plan info
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[#080810] text-zinc-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-56 border-r border-white/[0.05] bg-[#080810] flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/[0.05]">
          <Link href="/dashboard" className="text-sm font-semibold text-white">
            Floatt
          </Link>
          <span className="ml-auto text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5
                           rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            {plan}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <NavLink href="/dashboard" exact>
            <DashboardIcon /> Overview
          </NavLink>
          <NavLink href="/dashboard/domains">
            <GlobeIcon /> Domains
          </NavLink>
          <NavLink href="/dashboard/billing">
            <CreditCardIcon /> Billing
          </NavLink>
        </nav>

        {/* User + sign out */}
        <div className="px-5 py-4 border-t border-white/[0.05]">
          <p className="text-[11px] text-zinc-600 truncate mb-2">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="pl-56 flex flex-col min-h-screen">
        <main className="flex-1 max-w-5xl mx-auto px-8 py-10 w-full">{children}</main>

        {/* Persistent legal footer — appears on every dashboard page */}
        <div className="border-t border-white/[0.04] px-8 py-3">
          <p className="text-[10px] font-mono text-zinc-800 leading-relaxed max-w-5xl mx-auto">
            All scans are logged. Scanning unauthorized domains violates our Terms of Service and may
            violate computer fraud laws including the CFAA and EU NIS2 Directive. ·{' '}
            <a href="/legal/terms" className="underline hover:text-zinc-600 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Simple nav link that highlights the active route ─────────────────────────

function NavLink({
  href,
  exact = false,
  children,
}: {
  href: string
  exact?: boolean
  children: React.ReactNode
}) {
  // Active state is handled client-side, but we render a static version here
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400
                 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors"
    >
      {children}
    </Link>
  )
}

function DashboardIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}
