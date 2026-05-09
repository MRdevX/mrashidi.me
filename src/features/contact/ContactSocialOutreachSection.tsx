"use client";

import { PageHeader } from "@/components/ui";
import { ContactSectionShell } from "./ContactSectionShell";
import { ContactSocialReachCard } from "./ContactSocialReachCard";

export function ContactSocialOutreachSection() {
  return (
    <>
      <PageHeader iconName="Share2" title="Other ways to reach me" titleHeading="h2" />
      <ContactSectionShell delay={0.06} className="mt-2 md:mt-4">
        <ContactSocialReachCard />
      </ContactSectionShell>
    </>
  );
}
