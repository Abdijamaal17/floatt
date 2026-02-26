'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DomainRow, ScanRow, AIReportFinding, UserRow } from '@/types'
import { PLAN_LIMITS } from '@/types'

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  medium:   { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  low:      { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  info:     { color: 'text-zinc-400', bg: 'bg-zinc-800 border-white/[0.06]', dot: 'bg-zinc-500' },
}

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {severity.toUpperCase()}
    </span>
  )
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center border-4"
        style={{ borderColor: color }}
      >
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
      <span className="text-[10px] font-mono text-zinc-600">Security Score</span>
    </div>
  )
}

// ── Scan Authorization Modal ──────────────────────────────────────────────────

function ScanAuthModal({
  domain,
  onConfirm,
  onCancel,
}: {
  domain: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0d18] p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Confirm Scan Authorization</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              By clicking <strong className="text-zinc-200">Confirm Scan</strong>, you confirm that you
              own or have <strong className="text-zinc-200">explicit written authorization</strong> to
              perform security testing on:
            </p>
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-sm text-indigo-300">
              {domain}
            </div>
          </div>
        </div>

        <div className="px-3 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 mb-5">
          <p className="text-xs text-amber-300 leading-relaxed">
            This action is logged with your identity, IP address, and timestamp. Unauthorized scanning
            violates our Terms of Service and may violate computer fraud laws.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500
                       text-sm font-medium text-white transition-colors"
          >
            Confirm Scan
          </button>
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-white/10 text-sm text-zinc-400
                       hover:border-white/20 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [domain, setDomain] = useState<DomainRow | null>(null)
  const [scans, setScans] = useState<ScanRow[]>([])
  const [activeScan, setActiveScan] = useState<ScanRow | null>(null)
  const [profile, setProfile] = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyResult, setVerifyResult] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [tab, setTab] = useState<'report' | 'history' | 'verify'>('report')

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [
      { data: domainData },
      { data: scanList },
      { data: userProfile },
    ] = await Promise.all([
      supabase.from('domains').select('*').eq('id', id).eq('user_id', user.id).single(),
      supabase.from('scans').select('*').eq('domain_id', id).eq('user_id', user.id)
        .order('started_at', { ascending: false }).limit(20),
      supabase.from('users').select('*').eq('id', user.id).single(),
    ])

    setDomain(domainData as DomainRow)
    const sortedScans = (scanList ?? []) as ScanRow[]
    setScans(sortedScans)
    setActiveScan(sortedScans.find((s) => s.status === 'completed') ?? null)
    setProfile(userProfile as UserRow)
    setLoading(false)

    if (domainData && !domainData.verified) setTab('verify')
  }

  // Show the authorization modal before running a scan
  function requestScan() {
    setScanError(null)
    setShowAuthModal(true)
  }

  async function executeScan() {
    setShowAuthModal(false)
    setScanning(true)

    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domainId: id, scanAuthorizationConfirmed: true }),
    })
    const json = await res.json()

    if (!res.ok) {
      setScanError(json.error ?? 'Scan failed.')
      setScanning(false)
      return
    }

    const scanId = json.scanId
    // Poll for completion every 3 seconds, up to 2 minutes
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 3000))
      const { data } = await supabase.from('scans').select('*').eq('id', scanId).single()
      if (data?.status === 'completed' || data?.status === 'failed') {
        setScanning(false)
        loadData()
        return
      }
    }
    setScanning(false)
    loadData()
  }

  async function triggerVerify() {
    setVerifyLoading(true)
    setVerifyResult(null)
    const res = await fetch(`/api/domains/${id}/verify`, { method: 'POST' })
    const json = await res.json()
    setVerifyResult(json.message ?? (res.ok ? 'Verified!' : 'Not verified yet.'))
    setVerifyLoading(false)
    if (res.ok) loadData()
  }

  async function downloadPDF() {
    if (!activeScan) return
    setPdfLoading(true)
    const res = await fetch(`/api/reports/${activeScan.id}/pdf`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `floatt-report-${domain?.domain}-${activeScan.id.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    setPdfLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-sm text-zinc-600">Loading…</div>
  }

  if (!domain) {
    return <div className="text-sm text-red-400">Domain not found or access denied.</div>
  }

  const plan = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS
  const canPdf = PLAN_LIMITS[plan].pdfExport
  const report = activeScan?.ai_report

  return (
    <>
      {/* Scan authorization modal */}
      {showAuthModal && (
        <ScanAuthModal
          domain={domain.domain}
          onConfirm={executeScan}
          onCancel={() => setShowAuthModal(false)}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-white font-mono">{domain.domain}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-mono
                ${domain.verified
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                {domain.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              Added {new Date(domain.created_at).toLocaleDateString()} ·{' '}
              {domain.authorization_type === 'authorized'
                ? `Authorized by ${domain.authorized_by ?? 'unknown'}`
                : 'Domain owner'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canPdf && activeScan && (
              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="h-9 px-4 rounded-lg border border-white/10 text-xs text-zinc-300
                           hover:border-white/20 hover:text-white disabled:opacity-50 transition-colors"
              >
                {pdfLoading ? 'Generating…' : '↓ PDF Report'}
              </button>
            )}
            {domain.verified && (
              <button
                onClick={requestScan}
                disabled={scanning}
                className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                           text-xs font-medium text-white transition-colors"
              >
                {scanning ? 'Scanning…' : 'Run Scan'}
              </button>
            )}
          </div>
        </div>

        {scanError && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {scanError}
          </div>
        )}

        {scanning && (
          <div className="px-4 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
            Scan running… This typically takes 30–60 seconds. The page will update automatically.
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/[0.06]">
          {(['report', 'history', 'verify'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium capitalize transition-colors
                ${tab === t
                  ? 'text-white border-b-2 border-indigo-500 -mb-px'
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Report Tab ──────────────────────────────────────────────────── */}
        {tab === 'report' && (
          <div className="flex flex-col gap-6">
            {!activeScan ? (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
                <p className="text-sm text-zinc-500">
                  {domain.verified
                    ? 'No scans yet. Click "Run Scan" to get your first security report.'
                    : 'Verify your domain first, then run a scan to get a report.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-8 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  {activeScan.security_score !== null && (
                    <ScoreRing score={activeScan.security_score} />
                  )}
                  <div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {report?.summary ?? 'AI report processing…'}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2">
                      Scanned {activeScan.completed_at && new Date(activeScan.completed_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {report?.findings && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-zinc-300">
                      Findings ({report.findings.length})
                    </h3>
                    {report.findings.map((finding: AIReportFinding) => (
                      <div
                        key={finding.id}
                        className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <SeverityBadge severity={finding.severity} />
                          <h4 className="text-sm font-medium text-zinc-200 flex-1">{finding.title}</h4>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                          {finding.explanation}
                        </p>
                        <div className="px-3.5 py-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
                          <p className="text-xs text-indigo-300">
                            <span className="font-semibold text-indigo-400">Fix: </span>
                            {finding.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── History Tab ─────────────────────────────────────────────────── */}
        {tab === 'history' && (
          <div className="flex flex-col gap-2">
            {scans.length === 0 ? (
              <p className="text-sm text-zinc-500">No scan history yet.</p>
            ) : (
              scans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => { setActiveScan(scan); setTab('report') }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl
                             border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]
                             cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full
                      ${scan.status === 'completed' ? 'bg-emerald-400' :
                        scan.status === 'running' ? 'bg-indigo-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-xs text-zinc-400">
                      {new Date(scan.started_at).toLocaleString()}
                    </span>
                    <span className={`text-xs capitalize
                      ${scan.status === 'completed' ? 'text-emerald-400' :
                        scan.status === 'running' ? 'text-indigo-400' : 'text-red-400'}`}>
                      {scan.status}
                    </span>
                  </div>
                  {scan.security_score !== null && (
                    <span className={`text-sm font-semibold
                      ${scan.security_score >= 80 ? 'text-emerald-400' :
                        scan.security_score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {scan.security_score}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Verify Tab ──────────────────────────────────────────────────── */}
        {tab === 'verify' && (
          <div className="flex flex-col gap-5">
            {domain.verified ? (
              <div className="px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
                ✓ This domain is verified. You can run scans anytime.
              </div>
            ) : (
              <>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Verify ownership of{' '}
                  <strong className="text-zinc-200 font-mono">{domain.domain}</strong>{' '}
                  using one of the methods below.
                </p>

                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-1">Method 1: DNS TXT Record</h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Add this TXT record to your DNS zone, then click Verify:
                  </p>
                  <div className="px-4 py-3 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-sm text-indigo-300 break-all">
                    floatt-verify={domain.verification_token}
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-2">DNS changes can take up to 48 hours.</p>
                </div>

                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-1">Method 2: File Upload</h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Create a file at this URL containing exactly the token below:
                  </p>
                  <div className="px-4 py-2 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs text-zinc-400 mb-2">
                    https://{domain.domain}/.well-known/floatt-verify.txt
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-sm text-indigo-300">
                    {domain.verification_token}
                  </div>
                </div>

                <button
                  onClick={triggerVerify}
                  disabled={verifyLoading}
                  className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                             text-sm font-medium text-white transition-colors self-start"
                >
                  {verifyLoading ? 'Checking…' : 'Verify Domain'}
                </button>

                {verifyResult && (
                  <p className={`text-sm ${verifyResult.includes('✓') || verifyResult.includes('verified')
                    ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {verifyResult}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Legal footer ────────────────────────────────────────────────── */}
        <div className="mt-4 px-4 py-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
          <p className="text-[10px] font-mono text-zinc-700 leading-relaxed">
            All scans are logged. Scanning unauthorized domains violates our Terms of Service and may
            violate computer fraud laws including the CFAA and EU NIS2 Directive.
          </p>
        </div>
      </div>
    </>
  )
}
