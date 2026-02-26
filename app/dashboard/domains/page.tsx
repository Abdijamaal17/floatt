'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { DomainRow, UserRow } from '@/types'
import { PLAN_LIMITS } from '@/types'

function StatusPill({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border
        ${verified
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-zinc-800 border-white/[0.06] text-zinc-500'
        }`}
    >
      <span className={`w-1 h-1 rounded-full ${verified ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
      {verified ? 'Verified' : 'Unverified'}
    </span>
  )
}

export default function DomainsPage() {
  const supabase = createClient()

  const [domains, setDomains] = useState<DomainRow[]>([])
  const [profile, setProfile] = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  // Add domain form state
  const [newDomain, setNewDomain] = useState('')
  const [authType, setAuthType] = useState<'owned' | 'authorized'>('owned')
  const [authorizedBy, setAuthorizedBy] = useState('')
  const [authDeclarationChecked, setAuthDeclarationChecked] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: userProfile }, { data: domainList }] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('domains').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])

    setProfile(userProfile as UserRow)
    setDomains((domainList ?? []) as DomainRow[])
    setLoading(false)
  }

  function resetAddForm() {
    setNewDomain('')
    setAuthType('owned')
    setAuthorizedBy('')
    setAuthDeclarationChecked(false)
    setAddError(null)
    setAddOpen(false)
  }

  async function handleAddDomain(e: FormEvent) {
    e.preventDefault()
    setAddError(null)

    const cleaned = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:.*$/, '')
    if (!cleaned) { setAddError('Enter a valid domain name.'); return }
    if (!authDeclarationChecked) { setAddError('You must confirm your authorization declaration.'); return }
    if (authType === 'authorized' && !authorizedBy.trim()) {
      setAddError('Please enter the name of the domain owner or organization.')
      return
    }

    const plan = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS
    const limit = PLAN_LIMITS[plan].maxDomains
    if (domains.length >= limit) {
      setAddError(`Your ${plan} plan allows ${limit === Infinity ? 'unlimited' : limit} domain(s). Upgrade to add more.`)
      return
    }

    setAddLoading(true)
    const res = await fetch('/api/domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: cleaned,
        authorizationType: authType,
        authorizedBy: authType === 'authorized' ? authorizedBy.trim() : undefined,
      }),
    })
    const json = await res.json()

    if (!res.ok) {
      setAddError(json.error ?? 'Failed to add domain.')
      setAddLoading(false)
      return
    }

    setAddLoading(false)
    resetAddForm()
    loadData()
  }

  async function handleDelete(domainId: string) {
    if (!confirm('Delete this domain and all its scan history? This cannot be undone.')) return
    await fetch(`/api/domains/${domainId}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-sm text-zinc-600">Loading…</div>
  }

  const plan = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS
  const limit = PLAN_LIMITS[plan].maxDomains
  const atLimit = domains.length >= limit

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Domains</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {domains.length} / {limit === Infinity ? '∞' : limit} domains · {plan} plan
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          disabled={atLimit}
          className="inline-flex items-center h-9 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500
                     disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-colors"
        >
          + Add Domain
        </button>
      </div>

      {/* ── Add Domain Form with Authorization Declaration ──────────────────── */}
      {addOpen && (
        <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-200 mb-0.5">Add new domain</p>
            <p className="text-xs text-zinc-500">
              You must confirm your authorization to monitor this domain before it can be added.
            </p>
          </div>

          <form onSubmit={handleAddDomain} className="flex flex-col gap-4">
            {/* Domain input */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.05] border border-white/10
                           text-sm text-white placeholder-zinc-600 outline-none
                           focus:border-indigo-500/50 transition"
              />
            </div>

            {/* Authorization type */}
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Authorization basis</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="authType"
                    value="owned"
                    checked={authType === 'owned'}
                    onChange={() => setAuthType('owned')}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-zinc-300">I own this domain</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="authType"
                    value="authorized"
                    checked={authType === 'authorized'}
                    onChange={() => setAuthType('authorized')}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-zinc-300">
                    I have written authorization to test this domain
                  </span>
                </label>
              </div>
            </div>

            {/* Authorized by (only shown when 'authorized' selected) */}
            {authType === 'authorized' && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Name of domain owner or organization
                </label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  placeholder="Acme Corp / John Smith"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.05] border border-white/10
                             text-sm text-white placeholder-zinc-600 outline-none
                             focus:border-indigo-500/50 transition"
                />
              </div>
            )}

            {/* Legal declaration checkbox */}
            <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <input
                type="checkbox"
                checked={authDeclarationChecked}
                onChange={(e) => setAuthDeclarationChecked(e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-indigo-500"
              />
              <span className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-zinc-100">I confirm this declaration is truthful and legally binding.</strong>{' '}
                I {authType === 'owned' ? 'own' : 'have written authorization to test'} the domain above.
                I understand that false declarations violate Floatt&apos;s Terms of Service and may
                constitute a criminal offense.
              </span>
            </label>

            {addError && (
              <p className="text-xs text-red-400">{addError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={addLoading}
                className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                           text-xs font-medium text-white transition-colors"
              >
                {addLoading ? 'Adding…' : 'Add Domain'}
              </button>
              <button
                type="button"
                onClick={resetAddForm}
                className="h-9 px-4 rounded-lg border border-white/10 text-xs text-zinc-400
                           hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Domain list ────────────────────────────────────────────────────── */}
      {domains.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-zinc-500">No domains yet. Add a domain to start monitoring.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="flex items-center justify-between px-5 py-4 rounded-xl
                         border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-4">
                <StatusPill verified={domain.verified} />
                <span className="text-sm font-mono text-zinc-200">{domain.domain}</span>
                <span className="text-[10px] font-mono text-zinc-700 px-1.5 py-0.5 rounded border border-white/[0.04]">
                  {domain.authorization_type ?? 'owned'}
                </span>
                <span className="text-xs text-zinc-600">
                  Added {new Date(domain.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {!domain.verified && (
                  <Link
                    href={`/dashboard/domains/${domain.id}`}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Verify →
                  </Link>
                )}
                <Link
                  href={`/dashboard/domains/${domain.id}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(domain.id)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
