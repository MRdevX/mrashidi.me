import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import type { Project } from "../../domain/project";
import { styles } from "../shared/styles";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const { results, visibleProjects, remainingCount, pageSize, showMore, clearFilters } = useProjectCatalog();

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-white/15">
        <SearchX className={cn("size-7", styles.accentText)} aria-hidden />
        <h2 className={cn("font-albert text-xl font-semibold", styles.textPrimary)}>
          No project matches all of these filters
        </h2>
        <p className={cn("max-w-md font-albert text-[15px]", styles.textSecondary)}>
          Stack filters combine, so each project must use every selected technology. Remove a filter above, or start
          over.
        </p>
        <button type="button" onClick={clearFilters} className={cn(styles.primaryButton, "mt-2 px-5")}>
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <li key={project.title}>
            <ProjectCard project={project} onOpen={onOpenProject} />
          </li>
        ))}
      </ul>

      {remainingCount > 0 ? (
        <div className="flex flex-col items-center gap-2.5">
          <button type="button" onClick={showMore} className={cn(styles.secondaryButton, "h-12 px-6 text-[15px]")}>
            Show {Math.min(pageSize, remainingCount)} more
          </button>
          <span className={cn("font-terminal text-xs", styles.textSecondary)}>
            {visibleProjects.length} of {results.length} shown
          </span>
        </div>
      ) : null}
    </div>
  );
}
