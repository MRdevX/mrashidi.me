import { PageHeader, PageSection, PageWrapper, SocialButtonsRow } from "@/components/ui";
import { ContactHeader, contactData } from "@/features/contact";

export default function Contact() {
  const { header } = contactData;

  return (
    <PageWrapper>
      <PageHeader iconName="MessageCircle" title={header.title} />

      <PageSection>
        <div className="content-section">
          <ContactHeader description={header.description} />
        </div>
      </PageSection>

      <PageHeader iconName="Share2" title="Other ways to reach me" titleHeading="h2" />

      <PageSection delay={0.06} className="mt-2 md:mt-4">
        <div className="content-section">
          <div className="glass-card rounded-xl border border-orange-500/15 p-6 shadow-lg shadow-orange-950/10 sm:p-8 dark:border-orange-500/20 dark:shadow-orange-950/30">
            <div className="mx-auto mb-8 max-w-prose space-y-5 px-1 text-center font-albert">
              <p className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                I genuinely enjoy hearing from people.
              </p>
              <div className="flex justify-center" aria-hidden="true">
                <span className="h-1 w-14 shrink-0 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/55 to-orange-500/20 dark:from-orange-400/15 dark:via-orange-400/45 dark:to-orange-400/15" />
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
                <p>
                  <span className="mr-1 inline-block font-semibold text-foreground">Email</span>
                  is where I&apos;m most likely to see your note and reply with real attention.
                </p>
                <p>The form above and my inbox are the same place for me.</p>
                <p>If another channel suits you better, the links below are there too.</p>
              </div>
            </div>
            <SocialButtonsRow />
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
