import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { PROJECT_SORTS, type ProjectSort } from "../../domain/sort";
import { SORT_LABELS } from "../shared/labels";
import { styles } from "../shared/styles";

export function SortSelect() {
  const { filters, setSort } = useProjectCatalog();

  return (
    <div className="relative shrink-0 md:min-w-44">
      <label htmlFor="project-sort" className="sr-only">
        Sort projects
      </label>
      <select
        id="project-sort"
        value={filters.sort}
        onChange={(event) => setSort(event.target.value as ProjectSort)}
        className={cn(
          styles.field,
          styles.fieldFocus,
          "h-12 w-full cursor-pointer appearance-none pr-9 pl-3.5 font-albert text-sm"
        )}
      >
        {PROJECT_SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {SORT_LABELS[sort]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        aria-hidden
      />
    </div>
  );
}
