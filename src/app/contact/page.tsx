import { PageWrapper } from "@/components/ui";
import {
  ContactContributionSection,
  ContactLeadSection,
  ContactSocialOutreachSection,
  contactData,
} from "@/features/contact";

export default function Contact() {
  const { header } = contactData;

  return (
    <PageWrapper>
      <ContactLeadSection title={header.title} description={header.description} />
      <ContactContributionSection />
      <ContactSocialOutreachSection />
    </PageWrapper>
  );
}
