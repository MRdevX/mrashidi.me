"use client";

import { ResumeHeader, WorkExperienceSection, CertificatesSection } from "@/components/features/resume";
import { PageWrapper } from "@/components/ui";

export default function Resume() {
  return (
    <PageWrapper>
      <ResumeHeader />

      <div className="prose dark:prose-invert max-w-none">
        <WorkExperienceSection />
        <CertificatesSection />
      </div>
    </PageWrapper>
  );
}
