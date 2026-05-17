import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { config } from "@/data";

const EFFECTIVE_DATE = "May 17, 2026";
const { name, email, website } = config.person;

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function PolicySection({ title, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-primary mb-3 text-xl font-semibold">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <PageWrapper>
      <PageHeader iconName="FileText" title="Privacy Policy" />

      <PageSection>
        <div className="content-section">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8 text-sm">
              <strong>Effective date:</strong> {EFFECTIVE_DATE}
              <br />
              <strong>Last updated:</strong> {EFFECTIVE_DATE}
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              This Privacy Policy describes how <strong>{name}</strong> ("we", "us", or "our") collects, uses, and
              shares information about you when you use the <strong>MR Portfolio</strong> website and Progressive Web
              App (PWA) available at{" "}
              <a href={website} className="text-primary hover:underline">
                {website}
              </a>{" "}
              (collectively, the "Service"). By using the Service, you agree to the practices described in this policy.
            </p>

            <PolicySection title="1. Information We Collect">
              <p>
                We collect only the minimum information necessary to operate the Service. Depending on how you interact
                with the Service, we may collect:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Contact form submissions:</strong> When you use the contact form, we collect your name, email
                  address, and any message content you provide voluntarily.
                </li>
                <li>
                  <strong>Usage data:</strong> Anonymous analytics about how pages are visited (page views, referrers,
                  device type, browser type, and general geographic region). This data cannot identify you personally.
                </li>
                <li>
                  <strong>Technical data:</strong> IP address, browser type, and operating system collected
                  automatically by our hosting infrastructure (Vercel) as part of standard server logs.
                </li>
                <li>
                  <strong>PWA installation data:</strong> If you install the app as a PWA on your device, the browser
                  stores the app shell and cached assets locally on your device. We do not receive additional personal
                  data from this process.
                </li>
              </ul>
              <p>
                We do not collect sensitive personal information such as financial data, health data, or government IDs.
              </p>
            </PolicySection>

            <PolicySection title="2. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>To respond to messages you send via the contact form.</li>
                <li>To monitor and improve the performance, reliability, and security of the Service.</li>
                <li>To understand aggregate usage patterns and improve user experience.</li>
                <li>To diagnose and fix technical issues using error reporting tools.</li>
                <li>To comply with applicable legal obligations.</li>
              </ul>
              <p>We do not use your information for automated decision-making or profiling.</p>
            </PolicySection>

            <PolicySection title="3. Information Sharing and Disclosure">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share information with
                the following categories of service providers solely to operate the Service:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Vercel Inc.</strong> — hosting and infrastructure. Your request data (including IP address)
                  passes through Vercel servers.{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Vercel Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Vercel Analytics / Speed Insights</strong> — privacy-friendly, cookieless web analytics
                  provided by Vercel. No personally identifiable data is shared.{" "}
                  <a
                    href="https://vercel.com/docs/analytics/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Analytics Privacy
                  </a>
                </li>
                <li>
                  <strong>Sentry</strong> — error monitoring and crash reporting. Error reports may contain information
                  about your browser environment, but are anonymized as much as possible.{" "}
                  <a
                    href="https://sentry.io/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Sentry Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Amazon Web Services (SES)</strong> — used to process and deliver contact form emails. Message
                  content is transmitted securely.{" "}
                  <a
                    href="https://aws.amazon.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    AWS Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>GitHub API</strong> — publicly available contribution data is fetched from the GitHub API to
                  display on the site. No private GitHub data is accessed.{" "}
                  <a
                    href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Privacy Statement
                  </a>
                </li>
              </ul>
              <p>
                We may also disclose information if required to do so by law, court order, or in response to a valid
                request by a public authority.
              </p>
            </PolicySection>

            <PolicySection title="4. Cookies and Local Storage">
              <p>
                The Service does not use tracking cookies or advertising cookies. We may use browser local storage and
                session storage for the following functional purposes only:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Theme preference:</strong> Storing your light/dark mode selection so it persists across
                  sessions.
                </li>
                <li>
                  <strong>PWA caching:</strong> The service worker caches static assets (HTML, CSS, JS, images) on your
                  device to enable offline functionality. This data is stored locally on your device and is not
                  transmitted to us.
                </li>
              </ul>
              <p>You can clear this data at any time through your browser's developer tools or settings.</p>
            </PolicySection>

            <PolicySection title="5. Data Retention">
              <p>
                Contact form messages are retained only as long as necessary to respond to your inquiry and are not
                stored in a database. Server logs are retained for a limited period (typically 30–90 days) as determined
                by our infrastructure providers. Anonymous analytics data may be retained for up to 12 months in
                aggregated form.
              </p>
            </PolicySection>

            <PolicySection title="6. Your Rights (GDPR / EEA Users)">
              <p>
                If you are located in the European Economic Area (EEA), you have the following rights regarding your
                personal data:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Right of access:</strong> You may request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Right to rectification:</strong> You may ask us to correct inaccurate data.
                </li>
                <li>
                  <strong>Right to erasure:</strong> You may ask us to delete your personal data.
                </li>
                <li>
                  <strong>Right to restriction:</strong> You may ask us to restrict how we process your data.
                </li>
                <li>
                  <strong>Right to data portability:</strong> You may request your data in a structured,
                  machine-readable format.
                </li>
                <li>
                  <strong>Right to object:</strong> You may object to our processing of your personal data.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
                . We will respond within 30 days.
              </p>
            </PolicySection>

            <PolicySection title="7. Children's Privacy">
              <p>
                The Service is not directed to children under the age of 13, and we do not knowingly collect personal
                information from children under 13. If you believe a child has provided us with personal information,
                please contact us so we can delete it promptly.
              </p>
            </PolicySection>

            <PolicySection title="8. Data Security">
              <p>
                We use industry-standard security measures, including HTTPS encryption, to protect your information
                during transmission. Our hosting provider (Vercel) maintains physical and technical safeguards for the
                infrastructure. However, no method of electronic transmission or storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </PolicySection>

            <PolicySection title="9. Third-Party Links">
              <p>
                The Service may contain links to third-party websites (e.g., GitHub, LinkedIn, Medium). This Privacy
                Policy does not apply to those websites. We encourage you to review the privacy policies of any
                third-party sites you visit.
              </p>
            </PolicySection>

            <PolicySection title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date
                at the top of this page. We encourage you to review this page periodically. Continued use of the Service
                after changes constitutes your acceptance of the updated policy.
              </p>
            </PolicySection>

            <PolicySection title="11. Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your
                personal data, please contact:
              </p>
              <address className="not-italic">
                <strong>{name}</strong>
                <br />
                {config.person.location}
                <br />
                Email:{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
                <br />
                Website:{" "}
                <a href={website} className="text-primary hover:underline">
                  {website}
                </a>
              </address>
            </PolicySection>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
