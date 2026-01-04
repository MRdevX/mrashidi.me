import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { BioSection, EducationSection, LanguagesSection, MouseTrackingWrapper, SkillsSection } from "@/features/about";

export default function About() {
  return (
    <MouseTrackingWrapper>
      <PageWrapper>
        <PageHeader iconName="User" title="About Me" />

        <PageSection>
          <div className="content-section">
            <div className="prose dark:prose-invert max-w-none">
              <BioSection />
              <SkillsSection />
              <LanguagesSection />
              <EducationSection />
            </div>
          </div>
        </PageSection>
      </PageWrapper>
    </MouseTrackingWrapper>
  );
}
