import { PageWrapper } from "@/components/ui";
import { ContactContributionSection, ContactLeadSection, ContactSocialOutreachSection } from "@/features/contact";
import { getSiteContent } from "@/lib/content/server";

export default async function Contact() {
  const { profile } = await getSiteContent();

  return (
    <PageWrapper>
      <ContactLeadSection title={profile.contact.title} description={profile.contact.description} />
      <ContactContributionSection />
      <ContactSocialOutreachSection />
    </PageWrapper>
  );
}
