import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
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
    </PageWrapper>
  );
}
