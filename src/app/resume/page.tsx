import { PageSection, PageWrapper } from "@/components/ui";
import { CertificatesSection, ResumeHeader, WorkExperienceSection } from "@/features/resume";

export default function Resume() {
  return (
    <PageWrapper>
      <ResumeHeader />

      <PageSection>
        <WorkExperienceSection />
      </PageSection>

      <PageSection delay={0.1}>
        <CertificatesSection />
      </PageSection>
    </PageWrapper>
  );
}
