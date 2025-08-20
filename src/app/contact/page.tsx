"use client";

import { ContactContainer, ContactHeader, useContactData } from "@/components/features/contact";

export default function Contact() {
  const { header, sections, adpListWidgets } = useContactData();

  return (
    <ContactContainer>
      <ContactHeader
        title={header.title}
        description={header.description}
        sections={sections}
        adpListWidgets={adpListWidgets}
      />
    </ContactContainer>
  );
}
