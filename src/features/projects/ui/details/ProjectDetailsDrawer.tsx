"use client";

import { ChevronLeft, ChevronRight, ExternalLink, GitCommit, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";
import { createCommitUrl, formatDate, formatRelativeTime } from "@/lib/utils/index";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import type { Project } from "../../domain/project";
import { ProjectMonogram } from "../shared/ProjectMonogram";
import { Sheet, SheetCloseIcon, SheetTitle } from "../shared/Sheet";
import { styles } from "../shared/styles";

type ProjectDetailsDrawerProps = {
  project: Project | null;
  onSelect: (project: Project | null) => void;
};

export function ProjectDetailsDrawer({ project, onSelect }: ProjectDetailsDrawerProps) {
  return (
    <Sheet side="right" open={project !== null} onOpenChange={(open) => !open && onSelect(null)}>
      {project ? <ProjectDetails project={project} onSelect={onSelect} /> : null}
    </Sheet>
  );
}

function ProjectDetails({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const { results, commitInfo } = useProjectCatalog();
  const index = results.indexOf(project);
  const commit = project.githubUrl ? commitInfo.get(project.githubUrl) : undefined;
  const facts = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.year },
    { label: "Type", value: project.type === "client" ? project.clientName : "Personal" },
  ];
  const links = [
    { href: project.githubUrl, label: "View code", Icon: FaGithub, className: styles.primaryButton },
    { href: project.liveUrl, label: "Visit live", Icon: ExternalLink, className: styles.secondaryButton },
  ].filter((link) => link.href);

  return (
    <>
      <header className={cn("flex flex-col gap-5 border-b px-6 pt-5 pb-6 sm:px-9", styles.divider)}>
        <div className="flex items-center justify-between gap-3">
          <span className={cn("truncate font-terminal text-[13px]", styles.textSecondary)}>
            ~/projects{index >= 0 ? ` · ${index + 1} of ${results.length}` : ""}
          </span>
          <SheetCloseIcon label="Close project details" />
        </div>

        <div className="flex items-center gap-4">
          <ProjectMonogram title={project.title} size="lg" />
          <SheetTitle className="font-cyberpunk text-2xl leading-tight font-bold sm:text-3xl">
            {project.title}
          </SheetTitle>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {facts.map(({ label, value }) =>
            value ? (
              <div key={label} className="flex min-w-0 flex-col gap-1">
                <dt className={cn(styles.label, "text-[11px]")}>{label}</dt>
                <dd className="font-albert text-sm">{value}</dd>
              </div>
            ) : null
          )}
        </dl>

        <div className="flex flex-wrap gap-2.5">
          {links.map(({ href, label, Icon, className }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
              <Icon className="size-4" aria-hidden />
              {label}
              <NewTabSrOnly />
            </a>
          ))}
          {links.length === 0 ? (
            <span className={cn(styles.secondaryButton, styles.textSecondary, "pointer-events-none")}>
              <Lock className="size-4" aria-hidden />
              Private codebase
            </span>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-7 px-6 py-7 sm:px-9">
        <p className="font-albert text-base leading-relaxed text-gray-700 dark:text-gray-300">{project.description}</p>

        {project.highlights?.length ? (
          <section className="flex flex-col gap-3">
            <h3 className={styles.label}>Highlights</h3>
            <ul className="flex flex-col gap-2.5">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 font-albert text-[15px] text-gray-700 dark:text-gray-300">
                  <span aria-hidden className={cn("font-terminal", styles.accentText)}>
                    →
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <h3 className={styles.label}>Stack · {project.stack.length}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => {
              const { Icon, colorClass } = getTechIcon(tech);
              return (
                <li
                  key={tech}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 font-terminal text-xs text-gray-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200"
                >
                  <Icon className={cn("size-3.5", colorClass)} aria-hidden />
                  {tech}
                </li>
              );
            })}
          </ul>
        </section>

        {commit && project.githubUrl ? (
          <p className={cn("flex flex-wrap items-center gap-2 font-terminal text-xs", styles.textSecondary)}>
            <span title={formatDate(commit.date)}>Last commit {formatRelativeTime(commit.date)}</span>
            <a
              href={createCommitUrl(project.githubUrl, commit.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-1 hover:underline", styles.focusRing)}
            >
              <GitCommit className="size-3.5" aria-hidden />
              {commit.hash.slice(0, 7)}
              <NewTabSrOnly />
            </a>
          </p>
        ) : null}

        <nav
          aria-label="Browse projects"
          className={cn("mt-auto flex justify-between gap-3 border-t pt-5", styles.divider)}
        >
          <SiblingButton project={results[index - 1]} direction="previous" onSelect={onSelect} />
          <SiblingButton project={results[index + 1]} direction="next" onSelect={onSelect} />
        </nav>
      </div>
    </>
  );
}

type SiblingButtonProps = {
  project: Project | undefined;
  direction: "previous" | "next";
  onSelect: (project: Project) => void;
};

function SiblingButton({ project, direction, onSelect }: SiblingButtonProps) {
  if (!project) {
    return <span />;
  }
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      aria-label={`${direction === "previous" ? "Previous" : "Next"} project: ${project.title}`}
      className={cn(styles.secondaryButton, "max-w-[48%] px-3", direction === "next" && "flex-row-reverse")}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{project.title}</span>
    </button>
  );
}
