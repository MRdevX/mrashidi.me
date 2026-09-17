"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { pluralizeProjects } from "../shared/labels";
import { Sheet, SheetClose, SheetCloseIcon, SheetTitle } from "../shared/Sheet";
import { styles } from "../shared/styles";
import { OpenSourceSwitch } from "./OpenSourceSwitch";
import { SortSelect } from "./SortSelect";
import { StackGroups } from "./StackGroups";

export function MobileFilterSheet() {
  const { results, activeFilterCount, clearFilters } = useProjectCatalog();

  const trigger = (
    <button
      type="button"
      className={cn(
        styles.chip,
        styles.chipOff,
        styles.focusRing,
        "h-11 shrink-0 rounded-full px-4 text-sm font-medium"
      )}
    >
      <SlidersHorizontal className="size-4" aria-hidden />
      Filters
      {activeFilterCount > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-700 px-1.5 font-terminal text-xs font-semibold text-white dark:bg-orange-500 dark:text-black">
          {activeFilterCount}
          <span className="sr-only"> active</span>
        </span>
      ) : null}
    </button>
  );

  return (
    <Sheet side="bottom" trigger={trigger}>
      <div className="flex shrink-0 items-center justify-between gap-2 px-5 pt-4 pb-2">
        <SheetTitle className="font-albert text-xl font-semibold">Filters</SheetTitle>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearFilters}
            className={cn("h-11 rounded-md px-3 font-albert text-[15px]", styles.accentText, styles.focusRing)}
          >
            Reset
          </button>
          <SheetCloseIcon label="Close filters" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 pt-2 pb-6">
        <section className="flex flex-col gap-2.5">
          <h3 className={styles.label}>Sort & visibility</h3>
          <SortSelect />
          <OpenSourceSwitch />
        </section>
        <StackGroups size="lg" />
      </div>

      <div className={cn("shrink-0 border-t px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]", styles.divider)}>
        <SheetClose className={cn(styles.primaryButton, "h-[52px] w-full rounded-xl text-base")}>
          {results.length === 0
            ? "No matching projects"
            : `Show ${results.length} ${pluralizeProjects(results.length)}`}
        </SheetClose>
      </div>
    </Sheet>
  );
}
