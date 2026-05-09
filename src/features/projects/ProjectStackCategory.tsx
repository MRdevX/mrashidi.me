"use client";

import { Layers } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { CATEGORY_DISPLAY_NAMES, type TechnologyCategory } from "@/lib/core";
import { getTechIcon } from "@/lib/tech";

type ProjectStackCategoryProps = {
  category: TechnologyCategory;
  stacks: string[];
  stackUsageCount: Record<string, number>;
  selectedStacks: Set<string>;
  onToggleStack: (stack: string) => void;
};

export function ProjectStackCategory({
  category,
  stacks,
  stackUsageCount,
  selectedStacks,
  onToggleStack,
}: ProjectStackCategoryProps) {
  const { getTextColor } = useThemeConfig();

  if (stacks.length === 0) {
    return null;
  }

  const displayName = CATEGORY_DISPLAY_NAMES[category];

  return (
    <div className="mb-6">
      <h4 className={`text-md mb-3 flex items-center gap-2 font-albert font-semibold ${getTextColor("secondary")}`}>
        <Layers className="size-4 text-orange-400" aria-hidden />
        {displayName}
      </h4>
      <div className="flex flex-wrap gap-2">
        {stacks.map((stack) => {
          const isSelected = selectedStacks.has(stack);
          const techIcon = getTechIcon(stack);
          const usageCount = stackUsageCount[stack];

          return (
            <button
              type="button"
              key={stack}
              onClick={() => onToggleStack(stack)}
              aria-pressed={isSelected}
              className={`relative isolate z-10 flex items-center gap-2 rounded-lg border-2 px-3 py-2 font-medium transition-all duration-300 motion-safe:hover:scale-[1.03] ${
                isSelected
                  ? "border-orange-600 bg-orange-100 text-orange-950 shadow-md shadow-orange-900/10 dark:border-orange-500 dark:bg-orange-950 dark:text-orange-50 dark:shadow-orange-950/40"
                  : "border-border a11y-tech-chip hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10"
              }`}
            >
              {techIcon ? <techIcon.Icon className={`size-4 ${techIcon.colorClass}`} aria-hidden /> : null}
              <span className="text-sm font-medium">{stack}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  isSelected ? "bg-orange-500 text-black shadow-lg" : "border border-border a11y-tech-chip-count"
                }`}
              >
                {usageCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
