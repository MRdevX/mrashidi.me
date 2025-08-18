"use client";

import {
  ContactContainer,
  ContactHeader,
  ContactFormSection,
  MentorshipSection,
  ReviewsSection,
  useContactData,
} from "@/components/features/contact";

export default function Contact() {
  const { header, sections, adpListWidgets } = useContactData();

  return (
    <ContactContainer>
      <ContactHeader title={header.title} description={header.description} />
      <ContactFormSection />

      <MentorshipSection section={sections[0]} widget={adpListWidgets.booking} />

      <ReviewsSection section={sections[1]} impactWidget={adpListWidgets.impact} reviewsWidget={adpListWidgets.reviews} />
    </ContactContainer>
  );
}
