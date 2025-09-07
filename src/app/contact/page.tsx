"use client";

import { MessageCircle } from "lucide-react";
import { PageHeader, PageSection } from "@/components/ui";
import { ContactContainer, ContactHeader, contactData } from "@/features/contact";

export default function Contact() {
  const { header, sections, adpListWidgets } = contactData;

  return (
    <ContactContainer>
      <PageHeader icon={MessageCircle} title={header.title} />

      <PageSection>
        <div className="content-section">
          <ContactHeader
            title={header.title}
            description={header.description}
            sections={sections}
            adpListWidgets={adpListWidgets}
          />
        </div>
      </PageSection>
    </ContactContainer>
  );
}
