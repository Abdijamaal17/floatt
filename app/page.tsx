const YEAR = 2026;

// ── small local components ────────────────────────────────────────────────────

function StatusDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" />
      System Status: Online
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

// ── data ──────────────────────────────────────────────────────────────────────

const platformCards = [
  {
    title: "Autonomous Agents",
    desc: "Self-directed AI workers that monitor, decide, and act — without waiting for human input.",
    bullets: ["Event-driven execution pipelines", "Multi-agent coordination layer"],
  },
  {
    title: "Secure Orchestration",
    desc: "Route workloads through encrypted, policy-enforced channels from ingress to storage.",
    bullets: ["End-to-end encrypted task queues", "Role-based access at every step"],
  },
  {
    title: "Observability Layer",
    desc: "Full-stack telemetry with AI-powered anomaly correlation and real-time dashboards.",
    bullets: ["Distributed trace aggregation", "Intelligent alert deduplication"],
  },
];

const securityCapabilities = [
  {
    title: "Real-time Detection",
    desc: "Sub-millisecond threat identification across all ingress points.",
  },
  {
    title: "AI Anomaly Scoring",
    desc: "Continuous behavioral baseline modelling with deviation ranking.",
  },
  {
    title: "API Behavior Monitoring",
    desc: "Schema-aware traffic inspection that flags abnormal call patterns.",
  },
  {
    title: "Automated Response Playbooks",
    desc: "Pre-built and custom runbooks that execute isolations in seconds.",
  },
];

const useCases = [
  {
    tag: "SaaS",
    value: "Protect multi-tenant data with zero-trust isolation and automated incident response.",
  },
  {
    tag: "FinTech",
    value: "Satisfy compliance requirements while deploying fraud-detection agents in real time.",
  },
  {
    tag: "Smart Home",
    value: "Secure device fleets and encrypted event streams from the edge to the cloud.",
  },
  {
    tag: "Enterprise Tools",
    value: "Harden internal tooling with policy-driven access control and full audit trails.",
  },
];

const metrics = [
  { value: "4.2B+", label: "Threat signals / day" },
  { value: "180K", label: "Endpoints monitored" },
  { value: "< 3ms", label: "Avg response latency" },
  { value: "99.98%", label: "Uptime SLA" },
];

const archFlow = [
  "Client",
  "AI Layer",
  "Security Core",
  "Cloud Runtime",
  "Data Store",
];

// ── page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080810] font-sans text-zinc-100 overflow-x-hidden">

      {/* ── background grid + glow ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* radial glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        {/* subtle grid */}
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
        {/* wordmark */}
        <span className="text-sm font-semibold tracking-tight text-white">
          Floatt
        </span>

        {/* nav links */}
        <div className="hidden sm:flex items-center gap-7">
          {["Platform", "Security", "Architecture", "Use Cases"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors duration-200 tracking-wide"
            >
              {link}
            </a>
          ))}
        </div>

        {/* right side */}
        <div className="flex items-center gap-4">
          <StatusDot />
          <a
            href="#access"
            className="text-xs font-medium px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200"
          >
            Get Early Access
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pt-20">
        <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">

          <div
            className="animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <SectionLabel>AI &amp; Security Infrastructure</SectionLabel>
          </div>

          <h1
            className="animate-fade-up text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.06] tracking-[-0.03em] text-white"
            style={{ animationDelay: "140ms" }}
          >
            Floatt — AI &amp; Security
            <br />
            <span className="text-zinc-600">Infrastructure for the</span>
            <br />
            Next Generation
          </h1>

          <p
            className="animate-fade-up max-w-md text-base leading-relaxed text-zinc-400"
            style={{ animationDelay: "220ms" }}
          >
            Autonomous systems that defend, automate, and scale modern digital businesses.
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center gap-3"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="#access"
              className="inline-flex items-center h-11 px-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200"
            >
              Get Early Access
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center h-11 px-7 rounded-full border border-white/10 text-sm font-medium text-zinc-300 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              View Architecture
            </a>
          </div>

          <p
            className="animate-fade-up text-[11px] font-mono text-zinc-600 tracking-widest"
            style={{ animationDelay: "360ms" }}
          >
            Zero-trust by default &nbsp;•&nbsp; Encrypted pipelines &nbsp;•&nbsp; API-native
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
          PLATFORM
      ════════════════════════════════════════════════════ */}
      <section id="platform" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Platform</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Built for autonomous operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {platformCards.map((card, i) => (
              <GlassCard key={card.title} delay={(i + 1) * 80}>
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 mb-5" />
                <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 mb-4">{card.desc}</p>
                <ul className="flex flex-col gap-1.5">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-zinc-600">
                      <span className="mt-0.5 w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECURITY
      ════════════════════════════════════════════════════ */}
      <section id="security" className="relative z-10 py-32 px-6">
        {/* secondary glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[400px] rounded-full bg-violet-700/10 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Security</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Autonomous Protection Engine
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500">
              Floatt&apos;s protection engine operates at the infrastructure layer — not as an afterthought.
              Every signal is scored, every anomaly is correlated, and every response is executed in
              milliseconds without human bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityCapabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="animate-fade-up flex gap-4 p-5 rounded-xl border border-white/[0.05] bg-white/[0.02]"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{cap.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-500">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ARCHITECTURE
      ════════════════════════════════════════════════════ */}
      <section id="architecture" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="animate-fade-up flex flex-col items-center text-center gap-4 mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <SectionLabel>Architecture</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Designed for integration
            </h2>
            <p className="max-w-sm text-sm text-zinc-500">
              Drop Floatt into any stack. Connect via API, SDK, or webhook — the rest is automatic.
            </p>
          </div>

          {/* diagram */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-0"
            style={{ animationDelay: "120ms" }}
          >
            {archFlow.map((node, i) => (
              <div key={node} className="flex flex-col sm:flex-row items-center">
                {/* node box */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-zinc-300 tracking-wide whitespace-nowrap">
                    {node}
                  </div>
                  {i === 0 && (
                    <span className="text-[9px] font-mono text-zinc-700 tracking-widest">INGRESS</span>
                  )}
                  {i === 2 && (
                    <span className="text-[9px] font-mono text-indigo-700 tracking-widest">CORE</span>
                  )}
                  {i === archFlow.length - 1 && (
                    <span className="text-[9px] font-mono text-zinc-700 tracking-widest">STORE</span>
                  )}
                </div>
                {/* arrow */}
                {i < archFlow.length - 1 && (
                  <div className="flex flex-col sm:flex-row items-center">
                    {/* vertical connector (mobile) */}
                    <div className="sm:hidden w-px h-6 bg-white/10 my-1" />
                    {/* horizontal connector (desktop) */}
                    <div className="hidden sm:flex items-center gap-0 mx-1">
                      <div className="w-8 h-px bg-white/10" />
                      <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-white/20" />
                    </div>
                  </div>
                )}
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
              Built for every vertical
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
          CTA BAND
      ════════════════════════════════════════════════════ */}
      <section id="access" className="relative z-10 py-24 px-6">
        <div
          className="animate-fade-up max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
          style={{ animationDelay: "0ms" }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Ready to deploy?
          </h2>
          <p className="text-sm text-zinc-500 max-w-sm">
            Join the early access program and get priority onboarding, direct Slack access, and launch pricing.
          </p>
          <a
            href="mailto:hello@floatt.io"
            className="inline-flex items-center h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200"
          >
            Get Early Access
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-white">Floatt</span>

          <div className="flex items-center gap-6">
            {["Platform", "Security", "Architecture", "Use Cases"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <p className="text-xs text-zinc-700">© {YEAR} Floatt</p>
            <p className="text-[10px] text-zinc-800 max-w-[260px] leading-relaxed">
              Security features depend on integration and configuration.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
