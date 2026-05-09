"use client";

import type { Variants } from "framer-motion";
import { Suspense } from "react";
import { MotionSection } from "@/components/ui";
import { ContributionGraphSkeleton } from "@/components/ui/skeletons/ContributionGraphSkeleton";
import { HomeMarkedSection } from "./HomeMarkedSection";
import { LazyContributionGraph, LazyLoaderComponent } from "./homeLazyComponents";

export function HomeContributionSection({ variants }: { variants: Variants }) {
  return (
    <HomeMarkedSection variants={variants} iconName="Activity" title="GitHub Activity">
      <MotionSection variants={variants} className="w-full overflow-x-auto pb-4">
        <Suspense fallback={<ContributionGraphSkeleton />}>
          <LazyLoaderComponent loadingText="Loading GitHub activity...">
            <LazyContributionGraph />
          </LazyLoaderComponent>
        </Suspense>
      </MotionSection>
    </HomeMarkedSection>
  );
}
