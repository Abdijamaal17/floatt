'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TERMS_VERSION = '1.0'

export default function LegalAcceptancePage() {
  const router = useRouter()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [typedConfirm, setTypedConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const typedCorrect = typedConfirm.trim().toUpperCase() === 'I AGREE'
  const canSubmit = hasScrolled && check1 && check2 && typedCorrect

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40
    if (atBottom) setHasScrolled(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading(true)

    const res = await fetch('/api/legal/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termsVersion: TERMS_VERSION }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Failed to record acceptance.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#080810] text-zinc-100 flex flex-col">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <Link href="/" className="text-lg font-semibold text-white block mb-6">Floatt</Link>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Before you continue
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Floatt is a security monitoring tool. Before accessing your dashboard, you must read
            and agree to our Terms of Service. This protects you, domain owners, and the internet.
          </p>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-5">
          {/* Scrollable terms summary */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Terms of Service — Key Points
              </span>
              {!hasScrolled && (
                <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                  ↓ Scroll to read all
                </span>
              )}
              {hasScrolled && (
                <span className="text-[10px] font-mono text-emerald-400">✓ Read</span>
              )}
            </div>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-72 overflow-y-auto px-5 py-4 text-sm text-zinc-400 leading-relaxed flex flex-col gap-4
                         scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <KeyPoint
                number="01"
                color="amber"
                title="Authorization Required — No Exceptions"
                body="You may only scan domains you own or have explicit written authorization to test. Scanning any other domain is a violation of these Terms and may be a criminal offense under the CFAA, Computer Misuse Act, or equivalent laws in your jurisdiction."
              />
              <KeyPoint
                number="02"
                color="red"
                title="You Are Legally Responsible"
                body="If you scan a domain without authorization, you — not Floatt — are legally liable. We cooperate with law enforcement investigations and maintain audit logs of all scan activity including your identity, IP address, and timestamps. We will share this data if required by law."
              />
              <KeyPoint
                number="03"
                color="blue"
                title="What Floatt Does and Doesn't Do"
                body="Floatt performs passive, non-intrusive, read-only checks only. We never attempt to exploit, attack, inject, or brute-force your systems. Our scanner is a defensive monitoring tool — never an offensive one."
              />
              <KeyPoint
                number="04"
                color="purple"
                title="Audit Trail"
                body="Every scan is logged with your user ID, domain, timestamp, IP address, and domain verification status. This audit trail is retained for at least 7 years for legal compliance and cannot be deleted."
              />
              <KeyPoint
                number="05"
                color="green"
                title="Your Data Under GDPR"
                body="Scan results are stored encrypted. You may request deletion of your account and scan data at any time. We do not sell or share your data for marketing. Audit logs are exempt from deletion under legal retention requirements."
              />
              <KeyPoint
                number="06"
                color="red"
                title="Account Termination"
                body="We will immediately terminate accounts that scan domains without authorization, provide false authorization claims, or engage in illegal activity. We do not protect users who misuse our platform."
              />
              <KeyPoint
                number="07"
                color="zinc"
                title="Governing Law"
                body="These Terms are governed by Norwegian law. Disputes are subject to the exclusive jurisdiction of Oslo courts. Full Terms of Service available at floatt.io/legal/terms."
              />

              <div className="mt-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                <p className="text-xs text-zinc-600 font-mono">— End of Key Points —</p>
                <Link
                  href="/legal/terms"
                  target="_blank"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Read full Terms of Service →
                </Link>
              </div>
            </div>
          </div>

          {/* Checkboxes + confirmation */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className={`p-5 rounded-xl border transition-colors ${
              !hasScrolled ? 'opacity-40 pointer-events-none border-white/[0.06]' : 'border-white/[0.08]'
            } bg-white/[0.02]`}>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
                Required Confirmations
              </p>

              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.05] accent-indigo-500 flex-shrink-0"
                />
                <span className="text-sm text-zinc-300 leading-relaxed">
                  I confirm that I will <strong className="text-white">only scan domains I own</strong> or
                  have <strong className="text-white">explicit written authorization</strong> to test.
                  I understand that unauthorized scanning may violate criminal law and I accept full
                  legal responsibility for my actions.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.05] accent-indigo-500 flex-shrink-0"
                />
                <span className="text-sm text-zinc-300 leading-relaxed">
                  I have read and agree to the{' '}
                  <Link href="/legal/terms" target="_blank" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Terms of Service and Acceptable Use Policy
                  </Link>
                  . I understand that Floatt logs all scan activity and cooperates with law enforcement.
                </span>
              </label>
            </div>

            {/* Typed confirmation */}
            <div className={`p-5 rounded-xl border transition-colors ${
              (!hasScrolled || !check1 || !check2) ? 'opacity-40 pointer-events-none border-white/[0.06]' : 'border-white/[0.08]'
            } bg-white/[0.02]`}>
              <label className="block text-xs text-zinc-400 mb-2">
                Type <strong className="text-white font-mono">I AGREE</strong> to confirm your acceptance
              </label>
              <input
                type="text"
                value={typedConfirm}
                onChange={(e) => setTypedConfirm(e.target.value)}
                placeholder="I AGREE"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono outline-none transition
                  ${typedCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.05] border-white/10 text-white placeholder-zinc-700'
                  } focus:border-indigo-500/50`}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30
                         disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
            >
              {loading ? 'Recording acceptance…' : 'I Accept — Continue to Dashboard'}
            </button>

            <p className="text-center text-xs text-zinc-700 font-mono">
              Your acceptance is recorded with a timestamp and IP address · Version {TERMS_VERSION}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

function KeyPoint({
  number, color, title, body,
}: {
  number: string
  color: 'amber' | 'red' | 'blue' | 'purple' | 'green' | 'zinc'
  title: string
  body: string
}) {
  const colorMap = {
    amber:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red:    'text-red-400 bg-red-500/10 border-red-500/20',
    blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    green:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    zinc:   'text-zinc-400 bg-zinc-800 border-white/[0.06]',
  }
  return (
    <div className="flex gap-3">
      <span className={`flex-shrink-0 px-1.5 py-0.5 h-fit rounded text-[9px] font-mono border ${colorMap[color]}`}>
        {number}
      </span>
      <div>
        <p className="text-sm font-medium text-zinc-200 mb-0.5">{title}</p>
        <p className="text-xs text-zinc-500 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
