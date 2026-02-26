const YEAR = 2026;

// ── small local components ────────────────────────────────────────────────────

function StatusDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" />
      All Systems Operational
    </span>
  );
}

function GlassCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-fade-up rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[10px] tracking-[0.15em] uppercase text-zinc-500 font-mono">
      {children}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

// ── data ──────────────────────────────────────────────────────────────────────

const metrics = [
  { value: "Verified", label: "Domains only" },
  { value: "Passive", label: "Scan method" },
  { value: "< 5 min", label: "Avg scan time" },
  { value: "99.9%", label: "Uptime SLA" },
];

const howItWorks = [
  {
    step: "01",
    title: "Verify Domain Ownership",
    desc: "Prove you control the domain before any scan begins. We support DNS TXT record verification and file-upload verification — the same standards used by Google Search Console.",
    detail: "DNS TXT record · File upload verification",
    color: "indigo",
  },
  {
    step: "02",
    title: "Run a Safe Security Scan",
    desc: "Our scanner performs non-intrusive, read-only checks only. No payloads, no brute force, no stress testing. Just passive observation of your public-facing security posture.",
    detail: "Read-only · Non-intrusive · Rate-limited",
    color: "violet",
  },
  {
    step: "03",
    title: "Get an AI-Explained Report",
    desc: "Receive a plain-language security report powered by AI. Understand every finding, its risk level, and exactly what to fix — without needing a security engineering team.",
    detail: "Plain-language findings · Risk ranking · Fix guidance",
    color: "emerald",
  },
];

const scanScope = [
  { label: "SSL/TLS configuration check", desc: "Certificate validity, expiry, protocol versions, cipher strength" },
  { label: "Security headers analysis", desc: "CSP, HSTS, X-Frame-Options, Referrer-Policy, and more" },
  { label: "Basic CMS detection", desc: "Identifies platform versions for known vulnerability matching" },
  { label: "Public exposure analysis", desc: "robots.txt, sitemap.xml, directory listings, exposed files" },
  { label: "Known CVE version matching", desc: "Passive matching of detected versions against public CVE databases" },
];

const notIncluded = [
  "No intrusive attacks or exploit attempts",
  "No brute force or credential stuffing",
  "No denial-of-service or load testing",
  "No injection payloads (SQLi, XSS, etc.)",
  "No scanning of third-party domains",
];

const compliancePillars = [
  {
    title: "Explicit Authorization Required",
    desc: "Every scan requires verified domain ownership. We enforce this technically — not just contractually. No exceptions.",
  },
  {
    title: "Logged & Rate-Limited Scans",
    desc: "All scan activity is logged with timestamps, IP, and user identity. Rate limits prevent misuse and ensure responsible usage.",
  },
  {
    title: "GDPR-Aligned Data Handling",
    desc: "Scan results are stored encrypted, retained only as needed, and can be deleted on request. We never sell or share your data.",
  },
  {
    title: "Responsible Disclosure Policy",
    desc: "We maintain a public responsible disclosure policy and a security contact for researchers who discover issues in our own platform.",
  },
];

const useCases = [
  {
    tag: "SMB Owners",
    value: "Know your website's security posture without hiring a penetration tester. Get actionable fixes in plain language.",
  },
  {
    tag: "Agencies",
    value: "Monitor client sites you manage under written authorization. Deliver security reports as part of your service offering.",
  },
  {
    tag: "SaaS Founders",
    value: "Continuously monitor your product's public attack surface as your codebase evolves and dependencies change.",
  },
  {
    tag: "Compliance Teams",
    value: "Generate audit-ready security snapshots with full scan logs, timestamps, and evidence of authorized testing.",
  },
];

// ── page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080810] font-sans text-zinc-100 overflow-x-hidden">

      {/* ── background grid + glow ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #a0a0ff 1px, transparent 1px), linear-gradient(to bottom, #a0a0ff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════ */}
      <nav
        className="animate-fade-up fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4
                   bg-[#080810]/80 backdrop-blur-md border-b border-white/[0.05]"
        style={{ animationDelay: "0ms" }}
      >
        <span className="text-sm font-semibold tracking-tight text-white">
          Floatt
        </span>

        <div className="hidden sm:flex items-center gap-7">
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Scan Scope", href: "#scan-scope" },
            { label: "Compliance", href: "#compliance" },
            { label: "Use Cases", href: "#use-cases" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <StatusDot />
          <a
            href="/auth/login"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors duration-200"
          >
            Sign in
          </a>
          <a
            href="/auth/signup"
            className="text-xs font-medium px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200"
          >
            Start Monitoring
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pt-20">
        <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">

          <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
            <SectionLabel>AI-Powered Security Monitoring</SectionLabel>
          </div>

          <h1
            className="animate-fade-up text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.18] tracking-[-0.03em] text-white"
            style={{ animationDelay: "140ms" }}
          >
            AI-Powered Security
            <br />
            <span className="text-zinc-600">Monitoring for</span>
            <br />
            Modern Businesses
          </h1>

          <p
            className="animate-fade-up max-w-md text-base leading-relaxed text-zinc-400"
            style={{ animationDelay: "220ms" }}
          >
            Monitor, understand, and strengthen your website security — safely and legally.
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center gap-3"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="/auth/signup"
              className="inline-flex items-center h-11 px-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200"
            >
              Start Secure Monitoring
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center h-11 px-7 rounded-full border border-white/10 text-sm font-medium text-zinc-300 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              How It Works
            </a>
          </div>

          <p
            className="animate-fade-up text-[11px] font-mono text-zinc-600 tracking-widest"
            style={{ animationDelay: "360ms" }}
          >
            Scanning available only for verified domain owners.
          </p>
        </div>

        {/* metric strip */}
        <div
          className="animate-fade-up absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6"
          style={{ animationDelay: "440ms" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.05]">
            {metrics.map((m) => (
              <div key={m.label} className="bg-[#080810] px-6 py-5 text-center">
                <div className="text-xl font-semibold text-white tracking-tight">{m.value}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5 font-mono">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Legal, safe, and transparent by design
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500">
              Every scan starts with verified ownership. We built the authorization step into the
              product — not as a checkbox, but as a hard technical gate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {howItWorks.map((step, i) => (
              <GlassCard key={step.step} delay={(i + 1) * 100}>
                <div className="flex items-start justify-between mb-5">
                  <span className={`text-xs font-mono tracking-widest ${
                    step.color === "indigo" ? "text-indigo-500" :
                    step.color === "violet" ? "text-violet-500" :
                    "text-emerald-500"
                  }`}>
                    {step.step}
                  </span>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    step.color === "indigo" ? "bg-indigo-500" :
                    step.color === "violet" ? "bg-violet-500" :
                    "bg-emerald-500"
                  }`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 mb-4">{step.desc}</p>
                <p className="text-[10px] font-mono text-zinc-700 tracking-widest border-t border-white/[0.05] pt-4">
                  {step.detail}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SCAN SCOPE
      ════════════════════════════════════════════════════ */}
      <section id="scan-scope" className="relative z-10 py-32 px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[400px] rounded-full bg-violet-700/10 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Scan Scope</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              What we check — and what we never do
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500">
              Our scans are entirely passive and non-intrusive. We observe only what is publicly
              visible. We never attempt to exploit, attack, or overload your systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Included */}
            <div
              className="animate-fade-up flex flex-col gap-4"
              style={{ animationDelay: "80ms" }}
            >
              <p className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase">Included</p>
              <div className="flex flex-col gap-3">
                {scanScope.map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]"
                  >
                    <CheckIcon />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Included */}
            <div
              className="animate-fade-up flex flex-col gap-4"
              style={{ animationDelay: "160ms" }}
            >
              <p className="text-[10px] font-mono tracking-widest text-rose-700 uppercase">Never Included</p>
              <div className="flex flex-col gap-3">
                {notIncluded.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]"
                  >
                    <svg className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-sm text-zinc-500">{item}</p>
                  </div>
                ))}
                {/* Statement block */}
                <div className="p-4 rounded-xl border border-rose-900/30 bg-rose-950/20 mt-2">
                  <p className="text-xs leading-relaxed text-zinc-500 italic">
                    &ldquo;No intrusive attacks. No brute force. No denial-of-service testing.
                    Floatt is a defensive monitoring tool — not an offensive one.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          COMPLIANCE
      ════════════════════════════════════════════════════ */}
      <section id="compliance" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Compliance</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Built with Security &amp; Compliance in Mind
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500">
              We applied the same security-first thinking to our own platform that we help you apply to yours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compliancePillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="animate-fade-up flex gap-4 p-5 rounded-xl border border-white/[0.05] bg-white/[0.02]"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <ShieldIcon />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{pillar.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-500">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          USE CASES
      ════════════════════════════════════════════════════ */}
      <section id="use-cases" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Use Cases</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Built for business owners, not hackers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <GlassCard key={uc.tag} delay={(i + 1) * 80}>
                <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono tracking-widest border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 mb-4">
                  {uc.tag}
                </span>
                <p className="text-sm leading-relaxed text-zinc-400">{uc.value}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TERMS NOTICE
      ════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 px-6">
        <div
          className="animate-fade-up max-w-2xl mx-auto px-6 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center"
          style={{ animationDelay: "0ms" }}
        >
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="text-zinc-400 font-medium">Authorization Required: </span>
            By starting a scan, you confirm that you own or have written authorization to test this domain.
            Unauthorized scanning is a violation of our Terms of Service and may violate applicable law.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA BAND
      ════════════════════════════════════════════════════ */}
      <section id="start" className="relative z-10 py-24 px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] rounded-full bg-indigo-700/10 blur-[80px]" />
        </div>
        <div
          className="animate-fade-up relative max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
          style={{ animationDelay: "0ms" }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Ready to monitor your security?
          </h2>
          <p className="text-sm text-zinc-500 max-w-sm">
            Verify your domain and get your first security report in under 5 minutes.
            No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/auth/signup"
              className="inline-flex items-center h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200"
            >
              Start Secure Monitoring — Free
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center h-12 px-8 rounded-full border border-white/10 text-sm font-medium text-zinc-300 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              Sign In
            </a>
          </div>
          <p className="text-[11px] font-mono text-zinc-700 tracking-widest">
            Scanning available only for verified domain owners.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-sm font-semibold text-white">Floatt</span>
            <span className="text-[10px] text-zinc-700 font-mono">AI-Powered Security Monitoring</span>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: "How It Works", href: "#how-it-works" },
              { label: "Scan Scope", href: "#scan-scope" },
              { label: "Compliance", href: "#compliance" },
              { label: "Use Cases", href: "#use-cases" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 text-right">
            <p className="text-xs text-zinc-700">© {YEAR} Floatt. All rights reserved.</p>
            <p className="text-[10px] text-zinc-800 max-w-[280px] leading-relaxed">
              Scanning only permitted for verified domain owners. Unauthorized use is prohibited.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
