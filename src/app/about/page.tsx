"use client";

import { User } from "lucide-react";
import { PageWrapper, PageHeader, PageSection } from "@/components/ui";
import { BioSection, EducationSection, LanguagesSection, SkillsSection } from "@/features/about";
import { useMouseTracking } from "@/hooks/useMouseTracking";

export default function About() {
  useMouseTracking(".glitch-image");

  return (
    <PageWrapper>
      <PageHeader icon={User} title="About Me" />

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
  );
}
