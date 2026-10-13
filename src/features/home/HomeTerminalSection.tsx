"use client";

import type { Variants } from "framer-motion";
import { Suspense } from "react";
import { TerminalSkeleton } from "@/components/ui/skeletons/TerminalSkeleton";
import { isAskMrEnabled } from "@/features/ask-mr";
import { HomeMarkedSection } from "./HomeMarkedSection";
import { LazyLoaderComponent, LazyTerminal } from "./homeLazyComponents";

type HomeTerminalSectionProps = {
  variants: Variants;
};

export function HomeTerminalSection({ variants }: HomeTerminalSectionProps) {
  const aiEnabled = isAskMrEnabled();
  return (
    <>
      <div id="ask" className="scroll-mt-20" aria-hidden />
      <HomeMarkedSection
        variants={variants}
        iconName="Terminal"
        title={aiEnabled ? "Ask Me Anything" : "Interact with Terminal"}
      >
        <Suspense fallback={<TerminalSkeleton />}>
          <LazyLoaderComponent
            loadingText="Loading terminal..."
            loadingColor="green"
            fallbackClassName="terminal-window flex h-96 w-full items-center justify-center overflow-hidden rounded-lg content-section"
            minHeight="384px"
          >
            <LazyTerminal />
          </LazyLoaderComponent>
        </Suspense>
      </HomeMarkedSection>
    </>
  );
}
