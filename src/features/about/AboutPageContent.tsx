"use client";

import { BioSection } from "./BioSection";
import { EducationSection } from "./EducationSection";
import { LanguagesSection } from "./LanguagesSection";
import { SkillsSection } from "./SkillsSection";

export function AboutPageContent() {
  return (
    <>
      <BioSection />
      <SkillsSection />
      <LanguagesSection />
      <EducationSection />
    </>
  );
}
