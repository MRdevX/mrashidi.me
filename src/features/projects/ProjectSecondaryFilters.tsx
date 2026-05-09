"use client";

import { Globe, X } from "lucide-react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";

type ProjectSecondaryFiltersProps = {
  showOpenSourceOnly: boolean;
  onToggleOpenSource: (show: boolean) => void;
  onClearAll: () => void;
};

export function ProjectSecondaryFilters({
  showOpenSourceOnly,
  onToggleOpenSource,
  onClearAll,
}: ProjectSecondaryFiltersProps) {
  const { getBackgroundColor, getBorderColor } = useThemeConfig();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex items-center">
        <label className="group flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={showOpenSourceOnly}
            onChange={(e) => onToggleOpenSource(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
              showOpenSourceOnly
                ? "bg-orange-500 shadow-lg shadow-orange-500/50"
                : `${getBackgroundColor("muted")} border ${getBorderColor("secondary")}`
            }`}
          >
            <div
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                showOpenSourceOnly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
          <span className="ml-4 flex items-center gap-2 font-albert text-sm font-semibold text-orange-400 transition-colors group-hover:text-orange-300">
            <Globe className="size-4 shrink-0" aria-hidden />
            Show Open Source Only
          </span>
        </label>
      </div>

      <div className="flex items-center md:justify-end">
        <CyberpunkButton
          onClick={onClearAll}
          variant="neon"
          icon={<X className="size-4" aria-hidden />}
          className="text-sm"
        >
          Clear All Filters
        </CyberpunkButton>
      </div>
    </div>
  );
}
