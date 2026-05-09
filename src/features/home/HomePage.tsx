"use client";

import { PageStaggerContainer } from "@/components/ui";
import { getMainTechStack } from "@/lib/tech";
import { HomeContactSection } from "./HomeContactSection";
import { HomeContributionSection } from "./HomeContributionSection";
import { HomeHero } from "./HomeHero";
import { HomeTechStackSection } from "./HomeTechStackSection";
import { HomeTerminalSection } from "./HomeTerminalSection";

export function HomePage() {
  const techStack = getMainTechStack();

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
