"use client";

import { PageHeader } from "@/components/ui";
import { ContactHeader } from "./ContactHeader";
import { ContactSectionShell } from "./ContactSectionShell";

type ContactLeadSectionProps = {
  title: string;
  description: string;
};

export function ContactLeadSection({ title, description }: ContactLeadSectionProps) {
  return (
    <>
      <PageHeader iconName="MessageCircle" title={title} />
      <ContactSectionShell>
        <ContactHeader description={description} />
      </ContactSectionShell>
    </>
  );
}
