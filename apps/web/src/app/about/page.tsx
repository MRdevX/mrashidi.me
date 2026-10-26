import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { AboutPageContent, MouseTrackingWrapper } from "@/features/about";

export default function About() {
  return (
    <MouseTrackingWrapper>
      <PageWrapper>
        <PageHeader iconName="User" title="About Me" />

        <PageSection>
          <div className="content-section">
            <div className="prose dark:prose-invert max-w-none">
              <AboutPageContent />
            </div>
          </div>
        </PageSection>
      </PageWrapper>
    </MouseTrackingWrapper>
  );
}
