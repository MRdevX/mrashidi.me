"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Filter, Globe, Layers, X } from "lucide-react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { pageEnterTransition } from "@/lib/animations";
import { CATEGORY_DISPLAY_NAMES, type TechnologyCategory } from "@/lib/core";
import { getTechIcon } from "@/lib/tech";

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
  const { getTextColor, getBackgroundColor, getBorderColor } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const renderCategorySection = (category: TechnologyCategory, stacks: string[]) => {
    if (stacks.length === 0) {
      return null;
    }

    const displayName = CATEGORY_DISPLAY_NAMES[category];

    return (
      <div key={category} className="mb-6">
        <h4 className={`text-md font-semibold ${getTextColor("secondary")} mb-3 font-albert flex items-center gap-2`}>
          <Layers className="w-4 h-4 text-orange-400" aria-hidden />
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
                className={`relative isolate z-10 flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300 motion-safe:hover:scale-[1.03] font-medium ${
                  isSelected
                    ? "border-orange-600 bg-orange-100 text-orange-950 shadow-md shadow-orange-900/10 dark:border-orange-500 dark:bg-orange-950 dark:text-orange-50 dark:shadow-orange-950/40"
                    : "border-border a11y-tech-chip hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10"
                }`}
              >
                {techIcon && <techIcon.Icon className={`w-4 h-4 ${techIcon.colorClass}`} aria-hidden />}
                <span className="text-sm font-medium">{stack}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
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
  };

  return (
    <>
      {/* Technology Stack Icons - Categorized */}
      <motion.div
        className="mb-8"
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pageEnterTransition(prefersReducedMotion)}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-3 font-albert tracking-tight flex items-center gap-2">
            <Filter className="w-5 h-5" aria-hidden />
            Filter by Technology Stack
          </h3>
          <p className={`${getTextColor("secondary")} text-sm mb-4 font-albert`}>
            Click on technology icons to filter projects. Multiple selections are supported.
          </p>
        </div>
        <div className="space-y-4">
          {Object.entries(categorizedStacks).map(([category, stacks]) =>
            renderCategorySection(category as TechnologyCategory, stacks)
          )}
        </div>
      </motion.div>

      {/* Additional Filters */}
      <motion.div
        className="mb-8"
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pageEnterTransition(prefersReducedMotion, { delay: 0.06 })}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open Source Toggle */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={showOpenSourceOnly}
                onChange={(e) => onToggleOpenSource(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                  showOpenSourceOnly
                    ? "bg-orange-500 shadow-lg shadow-orange-500/50"
                    : `${getBackgroundColor("muted")} border ${getBorderColor("secondary")}`
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                    showOpenSourceOnly ? "translate-x-6" : "translate-x-1"
                  } top-1`}
                />
              </div>
              <span className="ml-4 text-sm font-semibold text-orange-400 font-albert group-hover:text-orange-300 transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" aria-hidden />
                Show Open Source Only
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-end">
            <CyberpunkButton
              onClick={onClearAll}
              variant="neon"
              icon={<X className="w-4 h-4" aria-hidden />}
              className="text-sm"
            >
              Clear All Filters
            </CyberpunkButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
