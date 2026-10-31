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
import { getSiteContent } from "@/lib/content/server";
import { Bullet, DateBadge, PolicyCard, ProviderCard, RightCard, SummaryCard } from "./PrivacyCards";

const EFFECTIVE_DATE = "May 17, 2026";
const UPDATED_DATE = "October 13, 2026";
export async function PrivacyPage() {
  const { name, email, website, location } = (await getSiteContent()).profile.person;

  return (
    <PageWrapper>
      <PageHeader iconName="FileText" title="Privacy Policy" />

      <PageSection>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <DateBadge icon={<Clock className="h-3 w-3" aria-hidden />} label="Effective" value={EFFECTIVE_DATE} />
            <DateBadge icon={<RefreshCw className="h-3 w-3" aria-hidden />} label="Updated" value={UPDATED_DATE} />
            <DateBadge
              icon={<Shield className="h-3 w-3 text-green-500" aria-hidden />}
              label="Standard"
              value="GDPR / EEA"
            />
          </div>

          <div className="glass-card border-l-4 border-l-primary p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This Privacy Policy describes how <span className="font-semibold text-foreground">{name}</span> ("we",
              "us", or "our") collects, uses, and shares information about you when you use the{" "}
              <span className="font-semibold text-foreground">MR Portfolio</span> website and Progressive Web App (PWA)
              available at{" "}
              <Link href={website} className="text-brand-text hover:underline">
                {website}
              </Link>{" "}
              (the "Service"). By using the Service, you agree to the practices described in this policy.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">At a glance</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
              <Bullet>
                <strong className="text-foreground">Ask MR (AI chat)</strong> — the questions you type and the
                assistant's answers are stored anonymously so we can improve its answers. No IP address, account or
                device identifier is attached; a random ID only groups messages from the same browser tab. Please don't
                enter personal or sensitive information in the chat.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Voice input</strong> — if you dictate a question, your browser's
                built-in speech recognition turns it into text. Depending on your browser, the audio may be processed by
                its vendor (for example Google in Chrome). We only receive the resulting text.
              </Bullet>
            </ul>
            <p className="mt-3 rounded-lg bg-muted/30 p-3 text-xs">
              We do <strong className="text-foreground">not</strong> collect sensitive data such as financial
              information, health records, or government IDs.
            </p>
          </PolicyCard>

          <PolicyCard icon={<BookOpen className="h-5 w-5" />} title="2. How We Use Your Information">
            <ul className="space-y-2">
              <Bullet>To respond to messages you send via the contact form.</Bullet>
              <Bullet>To answer questions in the Ask MR chat, and to review anonymous chat logs to improve it.</Bullet>
              <Bullet>To monitor and improve performance, reliability, and security of the Service.</Bullet>
              <Bullet>To understand aggregate usage patterns and improve user experience.</Bullet>
              <Bullet>To diagnose and fix technical issues using error reporting tools.</Bullet>
              <Bullet>To comply with applicable legal obligations.</Bullet>
            </ul>
            <p className="mt-3">We do not use your information for automated decision-making or profiling.</p>
          </PolicyCard>

          <PolicyCard icon={<Server className="h-5 w-5" />} title="3. Information Sharing and Disclosure">
            <p>
              We do not sell, trade, or rent your personal information. The following service providers process data
              solely to operate the Service:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                name="Vercel AI Gateway"
                desc="Routes Ask MR chat messages to the AI model provider."
                href="https://vercel.com/legal/privacy-policy"
              />
              <ProviderCard
                name="Anthropic"
                desc="AI model that generates Ask MR answers from the chat messages it receives."
                href="https://www.anthropic.com/legal/privacy"
              />
              <ProviderCard
                name="Upstash"
                desc="Rate limiting and anonymous Ask MR chat logs (no IP addresses stored in logs)."
                href="https://upstash.com/trust/privacy.pdf"
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
              <Bullet>
                <strong className="text-foreground">Ask MR conversation</strong> — your current chat is kept in session
                storage so it survives page navigation. It is removed when you close the tab or start a new chat.
              </Bullet>
            </ul>
            <p className="mt-3">You can clear this data anytime via your browser's developer tools or settings.</p>
          </PolicyCard>

          <PolicyCard icon={<Clock className="h-5 w-5" />} title="5. Data Retention">
            <p>
              Contact form messages are not stored in a database and are retained only long enough to reply to your
              inquiry. Anonymous Ask MR chat logs are deleted automatically after 30 days. Server logs are held for
              30–90 days by our infrastructure providers. Aggregated, anonymous analytics data may be retained for up to
              12 months.
            </p>
          </PolicyCard>

          <PolicyCard icon={<Scale className="h-5 w-5" />} title="6. Your Rights (GDPR / EEA)">
            <p>If you are located in the European Economic Area (EEA), you have the following rights:</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
              <a href={`mailto:${email}`} className="font-medium text-brand-text hover:underline">
                {email}
              </a>
              . We will respond within <strong className="text-foreground">30 days</strong>.
            </p>
          </PolicyCard>

          <PolicyCard icon={<Users className="h-5 w-5" />} title="7. Children's Privacy">
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal information from
              children under 13. If you believe a child has provided us with personal data, please contact us and we
              will delete it promptly.
            </p>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck className="h-5 w-5" />} title="8. Data Security">
            <p>
              We use industry-standard security measures including HTTPS encryption to protect data in transit. Our
              hosting provider (Vercel) maintains physical and technical infrastructure safeguards. No method of
              electronic transmission or storage is 100% secure — we cannot guarantee absolute security.
            </p>
          </PolicyCard>

          <PolicyCard icon={<ExternalLink className="h-5 w-5" />} title="9. Third-Party Links">
            <p>
              The Service may link to third-party sites (e.g. GitHub, LinkedIn, Medium). This Privacy Policy does not
              apply to those sites. We encourage you to review their respective privacy policies.
            </p>
          </PolicyCard>

          <PolicyCard icon={<RefreshCw className="h-5 w-5" />} title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy at any time. The "Last updated" date at the top of this page will
              reflect the latest revision. Continued use of the Service after changes constitutes acceptance of the
              updated policy. We encourage you to review this page periodically.
            </p>
          </PolicyCard>

          <div className="glass-card border border-primary/30 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-text">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Questions, concerns, or data requests? Reach out directly:
            </p>
            <address className="not-italic space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4 text-brand-text shrink-0" aria-hidden />
                <span className="font-semibold">{name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-brand-text shrink-0" aria-hidden />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-text shrink-0" aria-hidden />
                <a href={`mailto:${email}`} className="text-brand-text hover:underline">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-text shrink-0" aria-hidden />
                <Link href={website} className="text-brand-text hover:underline">
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
