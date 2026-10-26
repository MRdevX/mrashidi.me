"use client";

import { PageStaggerContainer } from "@/components/ui";
import { useContent } from "@/lib/content";
import { HomeContactSection } from "./HomeContactSection";
import { HomeContributionSection } from "./HomeContributionSection";
import { HomeHero } from "./HomeHero";
import { HomeTechStackSection } from "./HomeTechStackSection";
import { HomeTerminalSection } from "./HomeTerminalSection";
import { getMainTechStack } from "./techStack";

export function HomePage() {
  const { skillsOverview } = useContent();
  const techStack = getMainTechStack(skillsOverview.featured);

  return (
    <PageStaggerContainer>
      {({ itemVariants, prefersReducedMotion }) => (
        <>
          <HomeHero variants={itemVariants} />
          <HomeTerminalSection variants={itemVariants} />
          <HomeTechStackSection variants={itemVariants} techStack={techStack} />
          <HomeContributionSection variants={itemVariants} />
          <HomeContactSection variants={itemVariants} reducedMotion={prefersReducedMotion ?? false} />
        </>
      )}
    </PageStaggerContainer>
  );
}
