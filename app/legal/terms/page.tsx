import Link from 'next/link'

const EFFECTIVE_DATE = 'February 26, 2026'
const VERSION = '1.0'

export const metadata = {
  title: 'Terms of Service & Acceptable Use Policy — Floatt',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-zinc-300">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4
                     bg-[#080810]/80 backdrop-blur-md border-b border-white/[0.05]">
        <Link href="/" className="text-sm font-semibold text-white">Floatt</Link>
        <Link href="/auth/signup"
          className="text-xs font-medium px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
          Get Started
        </Link>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                           text-[10px] tracking-[0.15em] uppercase text-zinc-500 font-mono mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-semibold text-white leading-tight mb-2">
            Terms of Service &amp;<br />Acceptable Use Policy
          </h1>
          <p className="text-sm text-zinc-500 font-mono">
            Version {VERSION} · Effective {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="prose-floatt flex flex-col gap-10">

          <Section title="1. Agreement to Terms">
            <p>
              By creating an account or using any Floatt service, you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;), our Privacy Policy, and our Acceptable Use Policy. If you do not agree, you may
              not use Floatt.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you (&ldquo;User&rdquo;) and Floatt
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;Company&rdquo;). Floatt provides an authorized security
              monitoring platform for websites and web applications.
            </p>
          </Section>

          <Section title="2. Authorized Use Only — The Core Requirement">
            <Callout color="amber">
              <strong>CRITICAL:</strong> Floatt is a security monitoring tool. You may ONLY scan domains
              that you own or for which you have obtained explicit, written authorization from the domain owner.
              Scanning any other domain is a violation of these Terms and may constitute a criminal offense.
            </Callout>
            <p>By using Floatt, you represent and warrant that:</p>
            <ul>
              <li>You are the registered owner of every domain you add to Floatt, OR</li>
              <li>You have obtained explicit written authorization from the domain owner to perform security testing on their domain</li>
              <li>You will maintain records of any written authorizations for a minimum of three (3) years</li>
              <li>You will immediately remove any domain for which your authorization is revoked</li>
            </ul>
            <p>
              Domain ownership is technically verified before any scan is permitted. Technical verification does
              not substitute for legal authorization — you remain legally responsible for ensuring you have the
              right to test any domain you add.
            </p>
          </Section>

          <Section title="3. Acceptable Use Policy">
            <p className="font-medium text-zinc-200">3.1 Permitted Uses</p>
            <ul>
              <li>Monitoring the security posture of domains you own</li>
              <li>Monitoring client domains under a written service agreement authorizing security testing</li>
              <li>Using scan results to improve the security of your own or your clients&rsquo; systems</li>
              <li>Generating security reports for compliance or audit purposes</li>
            </ul>

            <p className="font-medium text-zinc-200 mt-4">3.2 Prohibited Uses</p>
            <Callout color="red">
              The following are strictly prohibited and will result in immediate account termination:
            </Callout>
            <ul>
              <li>Scanning any domain without ownership or written authorization</li>
              <li>Using Floatt to identify vulnerabilities in third-party systems for exploitation</li>
              <li>Performing any offensive security testing (exploitation, injection, brute force)</li>
              <li>Circumventing or attempting to circumvent Floatt&rsquo;s rate limits or domain verification</li>
              <li>Sharing account credentials or API keys with unauthorized third parties</li>
              <li>Using Floatt to facilitate illegal computer access under any applicable law</li>
              <li>Reselling or white-labeling Floatt services without an Agency plan and written agreement</li>
              <li>Using scan data to harm, embarrass, or extort domain owners</li>
              <li>Automating scan triggers in ways that exceed your plan&rsquo;s rate limits</li>
            </ul>
          </Section>

          <Section title="4. User Liability">
            <Callout color="red">
              You are solely and fully legally responsible for any unauthorized scanning activity conducted
              through your Floatt account, whether intentional or accidental.
            </Callout>
            <p>
              Unauthorized computer scanning may constitute a criminal offense under multiple jurisdictions,
              including but not limited to:
            </p>
            <ul>
              <li>The Computer Fraud and Abuse Act (CFAA), 18 U.S.C. § 1030 — United States</li>
              <li>The Computer Misuse Act 1990 — United Kingdom</li>
              <li>EU Directive on Attacks Against Information Systems (2013/40/EU)</li>
              <li>EU NIS2 Directive (2022/2555) requirements for authorized testing</li>
              <li>Equivalent national computer fraud and cybercrime laws in your jurisdiction</li>
            </ul>
            <p>
              Floatt maintains a complete audit log of all scan activity including timestamps, IP addresses,
              user identity, and domain verification status. This data may be provided to law enforcement
              or civil litigants with a valid legal process.
            </p>
            <p>
              Floatt cooperates fully with law enforcement investigations. We will not protect users who
              engage in unauthorized scanning or other illegal activity using our platform.
            </p>
          </Section>

          <Section title="5. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FLOATT AND ITS OFFICERS, DIRECTORS,
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              Floatt&rsquo;s total liability to you for any direct damages shall not exceed the amount
              you paid to Floatt in the twelve (12) months immediately preceding the claim.
            </p>
            <p>
              Floatt provides security information on an &ldquo;as-is&rdquo; basis. Scan results are
              informational only and do not constitute a guarantee of security or compliance. Floatt is not
              responsible for any security breaches that occur regardless of scan findings.
            </p>
          </Section>

          <Section title="6. GDPR and Data Handling">
            <p>
              Floatt is designed with GDPR compliance in mind. As a data processor acting on your behalf:
            </p>
            <ul>
              <li>Scan results are stored encrypted at rest using AES-256</li>
              <li>Data is retained only as necessary for service operation and legal compliance</li>
              <li>You may request deletion of your account and all associated data at any time</li>
              <li>We do not sell, share, or transfer your data to third parties for marketing purposes</li>
              <li>We use Supabase (EU data residency available) for data storage</li>
              <li>Our full Privacy Policy and Data Processing Agreement are available at floatt.io/legal/privacy</li>
            </ul>
            <p>
              Scan audit logs (user ID, timestamp, domain, IP, verification status) are retained for a
              minimum of seven (7) years to satisfy legal and compliance obligations. These records exist
              to establish proof of authorized testing and cannot be deleted on request.
            </p>
          </Section>

          <Section title="7. Account Termination">
            <p>We may suspend or terminate your account immediately without notice if:</p>
            <ul>
              <li>You violate any provision of these Terms or the Acceptable Use Policy</li>
              <li>You provide false information during signup or domain addition</li>
              <li>We receive a credible complaint that you scanned a domain without authorization</li>
              <li>You engage in any fraudulent or illegal activity using our platform</li>
              <li>Your payment method fails and you do not resolve the failure within 14 days</li>
            </ul>
            <p>
              Upon termination, your access to the service will be revoked and your data may be deleted
              in accordance with our retention policy. We reserve the right to retain audit logs and
              records required for legal compliance.
            </p>
          </Section>

          <Section title="8. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless Floatt and its officers, directors,
              employees, and agents from and against any claims, liabilities, damages, losses, and
              expenses (including legal fees) arising out of or in any way connected with:
            </p>
            <ul>
              <li>Your use of the service in violation of these Terms</li>
              <li>Your scanning of any domain without proper authorization</li>
              <li>Any false declaration of domain ownership or authorization</li>
              <li>Any violation of applicable law arising from your use of Floatt</li>
            </ul>
          </Section>

          <Section title="9. Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the laws of Norway, without
              regard to its conflict of law principles. Any disputes arising from these Terms shall be
              subject to the exclusive jurisdiction of the courts of Oslo, Norway.
            </p>
            <p>
              For users in the European Union, nothing in these Terms limits your rights under applicable
              EU consumer protection law.
            </p>
          </Section>

          <Section title="10. Changes to These Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material
              changes by email at least 30 days in advance. Continued use of the service after the
              effective date of changes constitutes acceptance of the updated Terms.
            </p>
            <p>
              Your acceptance of these Terms is recorded with a version number and timestamp. If we
              make material changes, you will be required to re-accept the updated Terms.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For questions about these Terms, to report a violation, or to submit a legal notice:
            </p>
            <p className="font-mono text-sm text-indigo-400">legal@floatt.io</p>
            <p>
              For security vulnerability reports about Floatt itself:{' '}
              <span className="font-mono text-sm text-indigo-400">security@floatt.io</span>
            </p>
          </Section>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-zinc-700 font-mono">
              Terms of Service Version {VERSION} · Last updated {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
      <div className="flex flex-col gap-3 text-sm text-zinc-400 leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4 [&_li]:list-disc [&_li]:text-zinc-500 [&_strong]:text-zinc-200 [&_p]:text-zinc-400">
        {children}
      </div>
    </section>
  )
}

function Callout({ children, color }: { children: React.ReactNode; color: 'amber' | 'red' }) {
  const styles = color === 'amber'
    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
    : 'bg-red-500/10 border-red-500/20 text-red-300'
  return (
    <div className={`px-4 py-3 rounded-lg border text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  )
}
