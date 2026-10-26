"use client";

import type { Variants } from "framer-motion";
import { Suspense } from "react";
import type { TechStackItem } from "@/lib/tech";
import { HomeMarkedSection } from "./HomeMarkedSection";
import { LazyTechStackGrid } from "./homeLazyComponents";
import { TechStackGridSkeleton } from "./TechStackGridSkeleton";

type HomeTechStackSectionProps = {
  variants: Variants;
  techStack: TechStackItem[];
};

export function HomeTechStackSection({ variants, techStack }: HomeTechStackSectionProps) {
  return (
    <HomeMarkedSection variants={variants} iconName="Code2" title="Tech Stack">
      <Suspense fallback={<TechStackGridSkeleton />}>
        <LazyTechStackGrid techStack={techStack} />
      </Suspense>
    </HomeMarkedSection>
  );
}
