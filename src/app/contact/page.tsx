"use client";

import { MessageCircle } from "lucide-react";
import { PageHeader, PageSection } from "@/components/ui";
import { ContactContainer, ContactHeader, useContactData } from "@/features/contact";

export default function Contact() {
  const { header, sections, adpListWidgets } = useContactData();

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
