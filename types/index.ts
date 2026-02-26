// ═══════════════════════════════════════════════════════════════════════════
// Floatt — Shared TypeScript Types
// ═══════════════════════════════════════════════════════════════════════════

export type Plan = 'free' | 'pro' | 'business' | 'agency'
export type ScanStatus = 'running' | 'completed' | 'failed'
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type AlertType = 'critical_finding' | 'high_finding' | 'weekly_digest' | 'verification_confirmed'
export type VerificationMethod = 'dns' | 'file'

// ─── Database row types ───────────────────────────────────────────────────────

export interface UserRow {
  id: string
  email: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface DomainRow {
  id: string
  user_id: string
  domain: string
  verified: boolean
  verification_token: string
  verification_method: VerificationMethod | null
  verified_at: string | null
  authorization_type: 'owned' | 'authorized' | null
  authorized_by: string | null
  created_at: string
}

export interface ScanRow {
  id: string
  domain_id: string
  user_id: string
  started_at: string
  completed_at: string | null
  status: ScanStatus
  findings: ScanFindings | null
  ai_report: AIReport | null
  security_score: number | null
}

export interface AlertRow {
  id: string
  user_id: string
  domain_id: string
  scan_id: string
  type: AlertType
  sent_at: string
}

// ─── Scan findings ────────────────────────────────────────────────────────────

export interface SSLFinding {
  available: boolean
  valid: boolean
  validFrom: string
  validTo: string
  daysUntilExpiry: number
  protocol: string
  cipher: string
  issuer: string
  subject: string
  selfSigned: boolean
  error?: string
}

export interface HeadersFinding {
  contentSecurityPolicy: string | null
  strictTransportSecurity: string | null
  xFrameOptions: string | null
  xContentTypeOptions: string | null
  referrerPolicy: string | null
  permissionsPolicy: string | null
  xPoweredBy: string | null
  server: string | null
}

export interface PublicFilesFinding {
  robotsTxt: { accessible: boolean; content?: string }
  sitemapXml: { accessible: boolean }
  securityTxt: { accessible: boolean }
  directoryListing: boolean
}

export interface CMSFinding {
  detected: boolean
  cms: string | null
  version: string | null
  indicators: string[]
}

export interface ScanFindings {
  ssl: SSLFinding
  headers: HeadersFinding
  publicFiles: PublicFilesFinding
  cms: CMSFinding
  scannedAt: string
  domain: string
}

// ─── AI report ───────────────────────────────────────────────────────────────

export interface AIReportFinding {
  id: string
  title: string
  explanation: string
  severity: Severity
  recommendation: string
  category: 'ssl' | 'headers' | 'exposure' | 'cms' | 'general'
}

export interface AIReport {
  overall_score: number
  summary: string
  findings: AIReportFinding[]
  generated_at: string
}

// ─── Plan limits ──────────────────────────────────────────────────────────────

export const PLAN_LIMITS: Record<Plan, {
  maxDomains: number
  scanIntervalHours: number
  emailAlerts: boolean
  pdfExport: boolean
  apiAccess: boolean
  whiteLabelPdf: boolean
}> = {
  free:     { maxDomains: 1,         scanIntervalHours: 168, emailAlerts: false, pdfExport: false, apiAccess: false, whiteLabelPdf: false },
  pro:      { maxDomains: 5,         scanIntervalHours: 24,  emailAlerts: true,  pdfExport: true,  apiAccess: false, whiteLabelPdf: false },
  business: { maxDomains: 20,        scanIntervalHours: 24,  emailAlerts: true,  pdfExport: true,  apiAccess: false, whiteLabelPdf: false },
  agency:   { maxDomains: Infinity,  scanIntervalHours: 1,   emailAlerts: true,  pdfExport: true,  apiAccess: true,  whiteLabelPdf: true  },
}

export const PLAN_PRICES: Record<Exclude<Plan, 'free'>, { monthly: number; label: string }> = {
  pro:      { monthly: 29,  label: 'Pro' },
  business: { monthly: 79,  label: 'Business' },
  agency:   { monthly: 199, label: 'Agency' },
}
