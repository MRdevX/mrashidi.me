"use client";

import { PageWrapper, PageSection } from "@/components/ui";
import { CertificatesSection, ResumeHeader, WorkExperienceSection } from "@/features/resume";

export default function Resume() {
  return (
    <PageWrapper>
      <ResumeHeader />

      <PageSection>
        <div className="content-section">
          <div className="prose dark:prose-invert max-w-none">
            <WorkExperienceSection />
            <CertificatesSection />
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
