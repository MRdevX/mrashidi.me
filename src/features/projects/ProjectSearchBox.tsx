"use client";

import { Search, X } from "lucide-react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ProjectAnimatedSection } from "./ProjectAnimatedSection";

interface ProjectSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function ProjectSearchBox({ searchQuery, onSearchChange, onClear }: ProjectSearchBoxProps) {
  const { getTextColor, getBackgroundColor } = useThemeConfig();

  return (
    <ProjectAnimatedSection className="mb-8" startOpaque={false}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="size-5 text-orange-400" aria-hidden />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by title, description, technology, or use regex patterns..."
          className={`w-full rounded-lg border-2 border-orange-500/30 py-4 pr-12 pl-12 font-albert transition-all duration-300 ${getBackgroundColor("glassLight")} ${getTextColor("primary")} placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none dark:placeholder-gray-500 focus:${getBackgroundColor("glass")}`}
        />
        {searchQuery ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <CyberpunkButton
              onClick={onClear}
              variant="ghost"
              icon={<X className="size-4" aria-hidden />}
              className={`h-8 w-8 p-0 ${getTextColor("secondary")} hover:text-orange-400`}
              aria-label="Clear search"
            />
          </div>
        ) : null}
      </div>
      {searchQuery ? (
        <div className={`mt-3 font-albert text-sm ${getTextColor("secondary")}`}>
          <p className="flex items-center gap-2">
            <span className="font-albert text-orange-400">Searching for:</span>
            <span
              className={`rounded border border-orange-500/30 px-2 py-1 font-mono text-orange-300 ${getBackgroundColor("glass")}`}
            >
              {searchQuery}
            </span>
          </p>
          <p className={`mt-2 text-xs ${getTextColor("muted")}`}>
            Supports regex patterns. Examples: &quot;microservice&quot;, &quot;docker|kubernetes&quot;,
            &quot;202[45]&quot;, &quot;auth.*service&quot;
          </p>
        </div>
      ) : null}
    </ProjectAnimatedSection>
  );
}
