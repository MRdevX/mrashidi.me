import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { ContactHeader, contactData } from "@/features/contact";

export default function Contact() {
  const { header, sections } = contactData;

  return (
    <PageWrapper>
      <PageHeader iconName="MessageCircle" title={header.title} />

      <PageSection>
        <div className="content-section">
          <ContactHeader title={header.title} description={header.description} sections={sections} />
        </div>
      </PageSection>
    </PageWrapper>
  );
}
