import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS, PLAN_PRICES } from '@/types'
import type { Plan } from '@/types'

const PLAN_FEATURES: Record<Plan, string[]> = {
  free:     ['1 domain', 'Weekly scans', 'AI-explained reports'],
  pro:      ['5 domains', 'Daily scans', 'Email alerts', 'PDF export'],
  business: ['20 domains', 'Daily scans', 'Email alerts', 'PDF export', 'Fix guides', 'Compliance reports'],
  agency:   ['Unlimited domains', 'Real-time monitoring', 'White-label PDF', 'API access', 'All Pro + Business features'],
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const currentPlan = (profile?.plan ?? 'free') as Plan

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Billing</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Current plan: <span className="text-white font-medium capitalize">{currentPlan}</span>
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(PLAN_FEATURES) as [Plan, string[]][]).map(([plan, features]) => {
          const price = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
          const isCurrent = plan === currentPlan

          return (
            <div
              key={plan}
              className={`flex flex-col p-5 rounded-xl border transition-colors
                ${isCurrent
                  ? 'border-indigo-500/40 bg-indigo-500/5'
                  : 'border-white/[0.06] bg-white/[0.02]'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white capitalize">{plan}</h3>
                  <p className="text-2xl font-bold text-white mt-1">
                    {price ? `$${price.monthly}` : '$0'}
                    {price && <span className="text-xs font-normal text-zinc-500">/mo</span>}
                  </p>
                </div>
                {isCurrent && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5
                                   rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                    Current
                  </span>
                )}
              </div>

              <ul className="flex flex-col gap-1.5 flex-1 mb-5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {!isCurrent && plan !== 'free' && (
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value={plan} />
                  <button
                    type="submit"
                    className="w-full h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500
                               text-xs font-medium text-white transition-colors"
                  >
                    Upgrade to {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </button>
                </form>
              )}

              {isCurrent && currentPlan !== 'free' && (
                <form action="/api/stripe/portal" method="POST">
                  <button
                    type="submit"
                    className="w-full h-9 rounded-lg border border-white/10 text-xs text-zinc-400
                               hover:border-white/20 hover:text-white transition-colors"
                  >
                    Manage Subscription
                  </button>
                </form>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
