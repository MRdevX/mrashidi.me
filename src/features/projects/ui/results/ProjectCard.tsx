import { ArrowRight, ExternalLink, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatDate, formatRelativeTime } from "@/lib/utils/index";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import type { Project } from "../../domain/project";
import { ProjectMonogram } from "../shared/ProjectMonogram";
import { styles } from "../shared/styles";
import { TechChip } from "../shared/TechChip";

const VISIBLE_STACK = 4;

type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { filters, commitInfo, toggleStack } = useProjectCatalog();
  const commit = project.githubUrl ? commitInfo.get(project.githubUrl) : undefined;
  const hiddenStackCount = project.stack.length - VISIBLE_STACK;
  const meta = [project.type === "client" ? project.clientName : "Personal", project.role].filter(Boolean).join(" · ");
  const links = [
    { href: project.githubUrl, label: "on GitHub", Icon: FaGithub },
    { href: project.liveUrl, label: "live site", Icon: ExternalLink },
  ];

  return (
    <article
      className={cn(
        styles.panel,
        "flex h-full flex-col gap-4 p-5 hover:border-gray-300 md:p-6 dark:hover:border-white/20"
      )}
    >
      <header className="flex items-start gap-3.5">
        <ProjectMonogram title={project.title} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className={cn("font-albert text-[17px] leading-snug font-semibold", styles.textPrimary)}>
            <button
              type="button"
              onClick={() => onOpen(project)}
              className={cn("text-left hover:text-orange-700 dark:hover:text-orange-400", styles.focusRing)}
            >
              {project.title}
            </button>
          </h3>
          <p className={cn("truncate font-albert text-[13px]", styles.textSecondary)} title={meta}>
            {meta}
          </p>
        </div>
        <span className={cn("shrink-0 pt-0.5 font-terminal text-xs", styles.textSecondary)}>{project.year}</span>
      </header>

      <p className={cn("line-clamp-3 font-albert text-sm leading-relaxed", styles.textSecondary)}>
        {project.description}
      </p>

      <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.stack.slice(0, VISIBLE_STACK).map((tech) => (
          <li key={tech}>
            <TechChip tech={tech} size="sm" selected={filters.stacks.includes(tech)} onToggle={toggleStack} />
          </li>
        ))}
        {hiddenStackCount > 0 ? (
          <li className={cn("flex h-7 items-center px-1 font-terminal text-xs", styles.textSecondary)}>
            +{hiddenStackCount}
            <span className="sr-only"> more</span>
          </li>
        ) : null}
      </ul>

      <footer className={cn("mt-auto flex items-center gap-2 border-t pt-4", styles.divider)}>
        <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5 font-albert text-[13px]", styles.textSecondary)}>
          <span className="flex items-center gap-1.5">
            {project.openSource ? (
              <span className="size-[7px] rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden />
            ) : (
              <Lock className="size-3.5" aria-hidden />
            )}
            {project.openSource ? "Open source" : "Private"}
          </span>
          {commit ? (
            <span className="truncate font-terminal text-xs" title={formatDate(commit.date)}>
              Updated {formatRelativeTime(commit.date)}
            </span>
          ) : null}
        </div>
        {links.map(({ href, label, Icon }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} ${label} (opens in new tab)`}
              className={cn(styles.iconButton, "size-9")}
            >
              <Icon className="size-[18px]" aria-hidden />
            </a>
          ) : null
        )}
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Details for ${project.title}`}
          className={cn(styles.secondaryButton, "h-9 px-3 text-[13px]")}
        >
          Details
          <ArrowRight className="size-3.5" aria-hidden />
        </button>
      </footer>
    </article>
  );
}
