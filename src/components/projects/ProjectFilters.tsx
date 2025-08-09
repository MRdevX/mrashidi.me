import { motion } from "framer-motion";
import { getTechIcon } from "@/lib/techIconMap";
import { TechnologyCategory, CATEGORY_DISPLAY_NAMES } from "@/lib/constants";

interface ProjectFiltersProps {
  categorizedStacks: Record<TechnologyCategory, string[]>;
  stackUsageCount: Record<string, number>;
  selectedStacks: Set<string>;
  showOpenSourceOnly: boolean;
  onToggleStack: (stack: string) => void;
  onToggleOpenSource: (show: boolean) => void;
  onClearAll: () => void;
}

export default function ProjectFilters({
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
        <h4 className="text-md font-semibold text-gray-300 mb-3">{displayName}</h4>
        <div className="flex flex-wrap gap-3">
          {stacks.map((stack) => {
            const isSelected = selectedStacks.has(stack);
            const techIcon = getTechIcon(stack.toLowerCase().replace(/\s+/g, ""));
            const usageCount = stackUsageCount[stack];

            return (
              <button
                key={stack}
                onClick={() => onToggleStack(stack)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-lg"
                    : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50 hover:text-orange-400"
                }`}
              >
                {techIcon && <techIcon.Icon className={`w-5 h-5 ${techIcon.colorClass}`} />}
                <span className="text-sm font-medium">{stack}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-orange-500 text-white" : "bg-gray-600 text-gray-400"
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
          <h3 className="text-lg font-semibold text-orange-400 mb-3">Filter by Technology Stack</h3>
          <p className="text-gray-400 text-sm mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open Source Toggle */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOpenSourceOnly}
                onChange={(e) => onToggleOpenSource(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  showOpenSourceOnly ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    showOpenSourceOnly ? "translate-x-6" : "translate-x-1"
                  } top-1`}
                />
              </div>
              <span className="ml-3 text-sm font-semibold text-orange-400">Show Open Source Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-end">
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600/50 hover:text-white transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
