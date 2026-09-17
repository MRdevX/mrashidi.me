"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { styles } from "../shared/styles";
import { StackFacetList } from "./StackFacetList";
import { StackGroups } from "./StackGroups";

export function StackFilter() {
  const { overview, topFacets, groupFacets } = useProjectCatalog();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const topTechs = new Set(overview.topStacks);
  const selectedOutsideTop = groupFacets
    .flatMap((group) => group.items)
    .filter((facet) => facet.selected && !topTechs.has(facet.tech));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <span className={cn(styles.label, "flex h-10 w-14 shrink-0 items-center")}>Stack</span>
        <StackFacetList facets={[...selectedOutsideTop, ...topFacets]} size="lg" className="flex-1 gap-2">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-gray-400 px-3 font-albert text-sm text-gray-700 hover:text-gray-900 dark:border-white/20 dark:text-gray-300 dark:hover:text-gray-50",
              styles.focusRing
            )}
          >
            {expanded ? "Fewer technologies" : `All ${overview.stackCount} technologies`}
            <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} aria-hidden />
          </button>
        </StackFacetList>
      </div>

      {expanded ? (
        <div
          id={panelId}
          className={cn(
            "grid gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-3 lg:pl-[72px]",
            styles.divider
          )}
        >
          <StackGroups size="md" />
        </div>
      ) : null}
    </div>
  );
}
