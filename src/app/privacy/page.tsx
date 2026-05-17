import {
  BookOpen,
  Clock,
  Database,
  ExternalLink,
  Globe,
  Lock,
  Mail,
  MapPin,
  RefreshCw,
  Scale,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { config } from "@/data";

const EFFECTIVE_DATE = "May 17, 2026";
const { name, email, website, location } = config.person;

// ─── Sub-components ──────────────────────────────────────────────────────────

function DateBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
      {icon}
      <span className="font-medium text-foreground">{label}:</span> {value}
    </span>
  );
}

function SummaryCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-orange-500">{icon}</div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function PolicyCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function ProviderCard({ name: providerName, desc, href }: { name: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-orange-500/40 hover:bg-orange-500/5"
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-orange-500">
        {providerName}
        <ExternalLink className="h-3 w-3 opacity-50" aria-hidden />
      </span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </a>
  );
}

function RightCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-muted/20 p-3">
      <span className="mt-0.5 shrink-0 text-orange-500">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PrivacyPolicy() {
  return (
    <PageWrapper>
      <PageHeader iconName="FileText" title="Privacy Policy" />

      <PageSection>
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <DateBadge icon={<Clock className="h-3 w-3" aria-hidden />} label="Effective" value={EFFECTIVE_DATE} />
            <DateBadge icon={<RefreshCw className="h-3 w-3" aria-hidden />} label="Updated" value={EFFECTIVE_DATE} />
            <DateBadge
              icon={<Shield className="h-3 w-3 text-green-500" aria-hidden />}
              label="Standard"
              value="GDPR / EEA"
            />
          </div>

          {/* Intro */}
          <div className="glass-card border-l-4 border-l-orange-500 p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This Privacy Policy describes how <span className="font-semibold text-foreground">{name}</span> ("we",
              "us", or "our") collects, uses, and shares information about you when you use the{" "}
              <span className="font-semibold text-foreground">MR Portfolio</span> website and Progressive Web App (PWA)
              available at{" "}
              <Link href={website} className="text-orange-500 hover:underline">
                {website}
              </Link>{" "}
              (the "Service"). By using the Service, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Quick summary */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">At a glance</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard
                icon={<Database className="h-5 w-5" />}
                title="Minimal data"
                desc="Only what's needed to run the service"
              />
              <SummaryCard
                icon={<Users className="h-5 w-5" />}
                title="No selling"
                desc="Your data is never sold or rented"
              />
              <SummaryCard
                icon={<Globe className="h-5 w-5" />}
                title="No ad cookies"
                desc="Zero tracking or advertising cookies"
              />
              <SummaryCard
                icon={<UserCheck className="h-5 w-5" />}
                title="Your rights"
                desc="Full GDPR rights, respond within 30 days"
              />
            </div>
          </div>

          {/* Section 1 */}
          <PolicyCard icon={<Database className="h-5 w-5" />} title="1. Information We Collect">
            <p>We collect only the minimum information necessary to operate the Service:</p>
            <ul className="mt-2 space-y-2">
              <Bullet>
                <strong className="text-foreground">Contact form submissions</strong> — your name, email address, and
                message content, provided voluntarily.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Usage data</strong> — anonymous, cookieless analytics (page views,
                referrers, device type, browser, general region). Cannot identify you personally.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Technical data</strong> — IP address and browser/OS metadata
                collected automatically by hosting infrastructure as standard server logs.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">PWA cache</strong> — if you install the app, the browser stores
                static assets locally on your device. We receive no additional personal data from this.
              </Bullet>
            </ul>
            <p className="mt-3 rounded-lg bg-muted/30 p-3 text-xs">
              We do <strong className="text-foreground">not</strong> collect sensitive data such as financial
              information, health records, or government IDs.
            </p>
          </PolicyCard>

          {/* Section 2 */}
          <PolicyCard icon={<BookOpen className="h-5 w-5" />} title="2. How We Use Your Information">
            <ul className="space-y-2">
              <Bullet>To respond to messages you send via the contact form.</Bullet>
              <Bullet>To monitor and improve performance, reliability, and security of the Service.</Bullet>
              <Bullet>To understand aggregate usage patterns and improve user experience.</Bullet>
              <Bullet>To diagnose and fix technical issues using error reporting tools.</Bullet>
              <Bullet>To comply with applicable legal obligations.</Bullet>
            </ul>
            <p className="mt-3">We do not use your information for automated decision-making or profiling.</p>
          </PolicyCard>

          {/* Section 3 */}
          <PolicyCard icon={<Server className="h-5 w-5" />} title="3. Information Sharing and Disclosure">
            <p>
              We do not sell, trade, or rent your personal information. The following service providers process data
              solely to operate the Service:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ProviderCard
                name="Vercel Inc."
                desc="Hosting & infrastructure. Request data passes through Vercel servers."
                href="https://vercel.com/legal/privacy-policy"
              />
              <ProviderCard
                name="Vercel Analytics"
                desc="Privacy-friendly, cookieless analytics. No PII shared."
                href="https://vercel.com/docs/analytics/privacy-policy"
              />
              <ProviderCard
                name="Sentry"
                desc="Error monitoring. Reports are anonymized where possible."
                href="https://sentry.io/privacy/"
              />
              <ProviderCard
                name="AWS SES"
                desc="Email delivery for contact form. Content transmitted securely."
                href="https://aws.amazon.com/privacy/"
              />
              <ProviderCard
                name="GitHub API"
                desc="Public contribution data only. No private GitHub data accessed."
                href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              />
            </div>
            <p className="mt-4">
              We may also disclose information when required by law, court order, or a valid government request.
            </p>
          </PolicyCard>

          {/* Section 4 */}
          <PolicyCard icon={<Lock className="h-5 w-5" />} title="4. Cookies and Local Storage">
            <p>
              The Service uses <strong className="text-foreground">no</strong> tracking or advertising cookies. Browser
              storage is used only for:
            </p>
            <ul className="mt-2 space-y-2">
              <Bullet>
                <strong className="text-foreground">Theme preference</strong> — light/dark mode selection persisted
                locally across sessions.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">PWA service worker cache</strong> — static assets (HTML, CSS, JS,
                images) cached on your device for offline use. Not transmitted to us.
              </Bullet>
            </ul>
            <p className="mt-3">You can clear this data anytime via your browser's developer tools or settings.</p>
          </PolicyCard>

          {/* Section 5 */}
          <PolicyCard icon={<Clock className="h-5 w-5" />} title="5. Data Retention">
            <p>
              Contact form messages are not stored in a database and are retained only long enough to reply to your
              inquiry. Server logs are held for 30–90 days by our infrastructure providers. Aggregated, anonymous
              analytics data may be retained for up to 12 months.
            </p>
          </PolicyCard>

          {/* Section 6 – GDPR rights */}
          <PolicyCard icon={<Scale className="h-5 w-5" />} title="6. Your Rights (GDPR / EEA)">
            <p>If you are located in the European Economic Area (EEA), you have the following rights:</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RightCard
                icon={<UserCheck className="h-4 w-4" />}
                title="Right of access"
                desc="Request a copy of the personal data we hold about you."
              />
              <RightCard
                icon={<RefreshCw className="h-4 w-4" />}
                title="Right to rectification"
                desc="Ask us to correct inaccurate data."
              />
              <RightCard
                icon={<ShieldAlert className="h-4 w-4" />}
                title="Right to erasure"
                desc="Ask us to delete your personal data."
              />
              <RightCard
                icon={<Lock className="h-4 w-4" />}
                title="Right to restriction"
                desc="Ask us to limit how we process your data."
              />
              <RightCard
                icon={<Database className="h-4 w-4" />}
                title="Right to portability"
                desc="Receive your data in a structured, machine-readable format."
              />
              <RightCard
                icon={<Shield className="h-4 w-4" />}
                title="Right to object"
                desc="Object to our processing of your personal data."
              />
            </div>
            <p className="mt-4">
              To exercise any right, email us at{" "}
              <a href={`mailto:${email}`} className="font-medium text-orange-500 hover:underline">
                {email}
              </a>
              . We will respond within <strong className="text-foreground">30 days</strong>.
            </p>
          </PolicyCard>

          {/* Section 7 */}
          <PolicyCard icon={<Users className="h-5 w-5" />} title="7. Children's Privacy">
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal information from
              children under 13. If you believe a child has provided us with personal data, please contact us and we
              will delete it promptly.
            </p>
          </PolicyCard>

          {/* Section 8 */}
          <PolicyCard icon={<ShieldCheck className="h-5 w-5" />} title="8. Data Security">
            <p>
              We use industry-standard security measures including HTTPS encryption to protect data in transit. Our
              hosting provider (Vercel) maintains physical and technical infrastructure safeguards. No method of
              electronic transmission or storage is 100% secure — we cannot guarantee absolute security.
            </p>
          </PolicyCard>

          {/* Section 9 */}
          <PolicyCard icon={<ExternalLink className="h-5 w-5" />} title="9. Third-Party Links">
            <p>
              The Service may link to third-party sites (e.g. GitHub, LinkedIn, Medium). This Privacy Policy does not
              apply to those sites. We encourage you to review their respective privacy policies.
            </p>
          </PolicyCard>

          {/* Section 10 */}
          <PolicyCard icon={<RefreshCw className="h-5 w-5" />} title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy at any time. The "Last updated" date at the top of this page will
              reflect the latest revision. Continued use of the Service after changes constitutes acceptance of the
              updated policy. We encourage you to review this page periodically.
            </p>
          </PolicyCard>

          {/* Section 11 – Contact (highlighted) */}
          <div className="glass-card border border-orange-500/30 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Questions, concerns, or data requests? Reach out directly:
            </p>
            <address className="not-italic space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4 text-orange-500 shrink-0" aria-hidden />
                <span className="font-semibold">{name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0" aria-hidden />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" aria-hidden />
                <a href={`mailto:${email}`} className="text-orange-500 hover:underline">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-500 shrink-0" aria-hidden />
                <Link href={website} className="text-orange-500 hover:underline">
                  {website}
                </Link>
              </div>
            </address>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
