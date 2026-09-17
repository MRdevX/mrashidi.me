import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { hasActiveFilters } from "../../domain/filters";
import { pluralizeProjects, TYPE_LABELS } from "../shared/labels";
import { styles } from "../shared/styles";

interface FilterTag {
  label: string;
  removeLabel: string;
  remove: () => void;
}

export function ActiveFilters() {
  const { filters, results, overview, setQuery, setType, setOpenSourceOnly, toggleStack, clearFilters } =
    useProjectCatalog();
  const query = filters.query.trim();
  const filtered = hasActiveFilters(filters);

  const tags: FilterTag[] = [
    ...(query ? [{ label: `“${query}”`, removeLabel: `Remove search “${query}”`, remove: () => setQuery("") }] : []),
    ...(filters.type !== "all"
      ? [{ label: TYPE_LABELS[filters.type], removeLabel: "Remove project type filter", remove: () => setType("all") }]
      : []),
    ...(filters.openSourceOnly
      ? [{ label: "Open source", removeLabel: "Remove open source filter", remove: () => setOpenSourceOnly(false) }]
      : []),
    ...filters.stacks.map((tech) => ({
      label: tech,
      removeLabel: `Remove ${tech} filter`,
      remove: () => toggleStack(tech),
    })),
  ];

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-2">
      <p role="status" className={cn("mr-2 font-albert text-[15px]", styles.textSecondary)}>
        <strong className={cn("font-semibold", styles.textPrimary)}>{results.length}</strong>
        {filtered ? ` of ${overview.projectCount}` : ""} {pluralizeProjects(results.length)}
      </p>
      {tags.map((tag) => (
        <button
          key={tag.removeLabel}
          type="button"
          onClick={tag.remove}
          aria-label={tag.removeLabel}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-full border border-orange-600/50 bg-orange-50 pr-2 pl-3 font-albert text-[13px] text-orange-950 hover:border-orange-600 dark:border-orange-500/45 dark:bg-orange-500/10 dark:text-orange-100 dark:hover:border-orange-500",
            styles.focusRing
          )}
        >
          {tag.label}
          <X className="size-3.5" aria-hidden />
        </button>
      ))}
      {filtered ? (
        <button
          type="button"
          onClick={clearFilters}
          className={cn(
            "h-8 rounded px-2 font-albert text-[13px] underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100",
            styles.textSecondary,
            styles.focusRing
          )}
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
