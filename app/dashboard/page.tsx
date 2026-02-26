import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'
import type { DomainRow, ScanRow } from '@/types'

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-zinc-600 text-sm">—</span>
  const color = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
  return <span className={`text-xl font-semibold ${color}`}>{score}</span>
}

function StatusDot({ verified }: { verified: boolean }) {
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${verified ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
  )
}

export default async function DashboardOverview() {
  // Authorization: already checked by layout, but we re-verify for data access
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS
  const limits = PLAN_LIMITS[plan]

  // Fetch domains with their most recent scan
  const { data: domains } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: DomainRow[] | null }

  const { data: recentScans } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('started_at', { ascending: false })
    .limit(5) as { data: ScanRow[] | null }

  const verifiedCount = domains?.filter((d) => d.verified).length ?? 0
  const avgScore = (() => {
    const scores = recentScans?.map((s) => s.security_score).filter((s): s is number => s !== null)
    if (!scores?.length) return null
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Your security monitoring dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Domains',
            value: `${domains?.length ?? 0} / ${limits.maxDomains === Infinity ? '∞' : limits.maxDomains}`,
          },
          { label: 'Verified', value: verifiedCount },
          { label: 'Avg Score', value: avgScore ?? '—' },
          { label: 'Plan', value: plan.charAt(0).toUpperCase() + plan.slice(1) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Domains list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-300">Your Domains</h2>
          <Link
            href="/dashboard/domains"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Manage domains →
          </Link>
        </div>

        {!domains?.length ? (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-zinc-500 mb-4">No domains yet. Add your first domain to start monitoring.</p>
            <Link
              href="/dashboard/domains"
              className="inline-flex items-center h-9 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500
                         text-xs font-medium text-white transition-colors"
            >
              Add Domain
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                  {['Domain', 'Status', 'Score', 'Last Scan', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {domains.map((domain) => {
                  const lastScan = recentScans?.find((s) => s.domain_id === domain.id)
                  return (
                    <tr
                      key={domain.id}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusDot verified={domain.verified} />
                          <span className="text-sm text-zinc-200 font-mono">{domain.domain}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${domain.verified ? 'text-emerald-400' : 'text-zinc-600'}`}>
                          {domain.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={lastScan?.security_score ?? null} />
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {lastScan?.completed_at
                          ? new Date(lastScan.completed_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/domains/${domain.id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent scan history */}
      {(recentScans?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Recent Scans</h2>
          <div className="flex flex-col gap-2">
            {recentScans!.map((scan) => {
              const domain = domains?.find((d) => d.id === scan.domain_id)
              return (
                <div
                  key={scan.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl
                             border border-white/[0.05] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-sm text-zinc-300 font-mono">
                      {domain?.domain ?? scan.domain_id}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {scan.completed_at && new Date(scan.completed_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={scan.security_score} />
                    <Link
                      href={`/dashboard/domains/${scan.domain_id}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Report →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
