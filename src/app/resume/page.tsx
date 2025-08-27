"use client";

import { PageWrapper } from "@/components/ui";
import { CertificatesSection, ResumeHeader, WorkExperienceSection } from "@/features/resume";

export default function Resume() {
  return (
    <PageWrapper>
      <ResumeHeader />

      <div className="glass-card p-8">
        <div className="prose dark:prose-invert max-w-none">
          <WorkExperienceSection />
          <CertificatesSection />
        </div>
      </div>
    </PageWrapper>
  );
}
