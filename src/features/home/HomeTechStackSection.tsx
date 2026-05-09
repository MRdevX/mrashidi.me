"use client";

import type { Variants } from "framer-motion";
import { Suspense } from "react";
import { TechStackGridSkeleton } from "@/components/ui/skeletons/TechStackGridSkeleton";
import type { TechStackItem } from "@/lib/tech";
import { HomeMarkedSection } from "./HomeMarkedSection";
import { LazyTechStackGrid } from "./homeLazyComponents";

type HomeTechStackSectionProps = {
  variants: Variants;
  techStack: TechStackItem[];
};

export function HomeTechStackSection({ variants, techStack }: HomeTechStackSectionProps) {
  return (
    <HomeMarkedSection variants={variants} iconName="Code2" title="My Tech Stack">
      <Suspense fallback={<TechStackGridSkeleton />}>
        <LazyTechStackGrid techStack={techStack} />
      </Suspense>
    </HomeMarkedSection>
  );
}
