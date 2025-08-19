import { motion } from "framer-motion";
import { Filter, Globe, X, Layers } from "lucide-react";
import { getTechIcon } from "@/lib/techIconMap";
import { TechnologyCategory, CATEGORY_DISPLAY_NAMES } from "@/lib/constants";
import { CyberpunkButton } from "@/components/ui";

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
  const renderCategorySection = (category: TechnologyCategory, stacks: string[]) => {
    if (stacks.length === 0) return null;

    const displayName = CATEGORY_DISPLAY_NAMES[category];

    return (
      <div key={category} className="mb-6">
        <h4 className="text-md font-semibold text-gray-300 mb-3 font-albert flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" />
          {displayName}
        </h4>
        <div className="flex flex-wrap gap-2">
          {stacks.map((stack) => {
            const isSelected = selectedStacks.has(stack);
            const techIcon = getTechIcon(stack);
            const usageCount = stackUsageCount[stack];

            return (
              <button
                key={stack}
                onClick={() => onToggleStack(stack)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 font-medium ${
                  isSelected
                    ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-lg shadow-orange-500/25"
                    : "bg-gray-800/30 border-gray-600 text-gray-300 hover:border-orange-500/60 hover:text-orange-400 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-orange-500/10"
                }`}
              >
                {techIcon && <techIcon.Icon className={`w-4 h-4 ${techIcon.colorClass}`} />}
                <span className="text-sm font-medium">{stack}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-orange-500 text-black shadow-lg"
                      : "bg-gray-600/80 text-gray-300 border border-gray-500/50"
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
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-3 font-cyberpunk glow-text flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter by Technology Stack
          </h3>
          <p className="text-gray-400 text-sm mb-4 font-albert">
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
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                  showOpenSourceOnly ? "bg-orange-500 shadow-lg shadow-orange-500/50" : "bg-gray-600 border border-gray-500"
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                    showOpenSourceOnly ? "translate-x-6" : "translate-x-1"
                  } top-1`}
                />
              </div>
              <span className="ml-4 text-sm font-semibold text-orange-400 font-albert group-hover:text-orange-300 transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Show Open Source Only
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-end">
            <CyberpunkButton onClick={onClearAll} variant="neon" icon={<X className="w-4 h-4" />} className="text-sm">
              Clear All Filters
            </CyberpunkButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
