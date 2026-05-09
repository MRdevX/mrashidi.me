"use client";

import { Filter } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { TechnologyCategory } from "@/lib/core";
import { ProjectAnimatedSection } from "./ProjectAnimatedSection";
import { ProjectSecondaryFilters } from "./ProjectSecondaryFilters";
import { ProjectStackCategory } from "./ProjectStackCategory";

interface ProjectFiltersProps {
  categorizedStacks: Record<TechnologyCategory, string[]>;
  stackUsageCount: Record<string, number>;
  selectedStacks: Set<string>;
  showOpenSourceOnly: boolean;
  onToggleStack: (stack: string) => void;
  onToggleOpenSource: (show: boolean) => void;
  onClearAll: () => void;
}

export function ProjectFilters({
  categorizedStacks,
  stackUsageCount,
  selectedStacks,
  showOpenSourceOnly,
  onToggleStack,
  onToggleOpenSource,
  onClearAll,
}: ProjectFiltersProps) {
  const { getTextColor } = useThemeConfig();

  return (
    <>
      <ProjectAnimatedSection className="mb-8">
        <div className="mb-4">
          <h3 className="mb-3 flex items-center gap-2 font-albert text-lg font-semibold tracking-tight text-orange-400">
            <Filter className="size-5 shrink-0" aria-hidden />
            Filter by Technology Stack
          </h3>
          <p className={`mb-4 font-albert text-sm ${getTextColor("secondary")}`}>
            Click on technology icons to filter projects. Multiple selections are supported.
          </p>
        </div>
        <div className="space-y-4">
          {Object.entries(categorizedStacks).map(([category, stacks]) => (
            <ProjectStackCategory
              key={category}
              category={category as TechnologyCategory}
              stacks={stacks}
              stackUsageCount={stackUsageCount}
              selectedStacks={selectedStacks}
              onToggleStack={onToggleStack}
            />
          ))}
        </div>
      </ProjectAnimatedSection>

      <ProjectAnimatedSection className="mb-8" delay={0.06}>
        <ProjectSecondaryFilters
          showOpenSourceOnly={showOpenSourceOnly}
          onToggleOpenSource={onToggleOpenSource}
          onClearAll={onClearAll}
        />
      </ProjectAnimatedSection>
    </>
  );
}
