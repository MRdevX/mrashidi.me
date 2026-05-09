import { SocialButtonsRow } from "@/components/ui";
import { ResumeFilamentDivider } from "@/features/resume";

const OUTREACH_TITLE = "I genuinely enjoy hearing from people.";

export function ContactSocialReachCard() {
  return (
    <div className="relative isolate z-0 p-6 sm:p-8 feature-card group">
      <div className="relative z-10">
        <div className="mx-auto mb-8 max-w-prose space-y-5 px-1 text-center font-albert">
          <p className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
            {OUTREACH_TITLE}
          </p>
          <ResumeFilamentDivider align="center" symmetric />
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
  );
}
