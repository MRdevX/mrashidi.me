import { Calendar, ExternalLink, Eye, GitCommit } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { ProjectModal } from "@/components/ui/ProjectModal";
import type { Project } from "@/data/projects";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";
import { createCommitUrl, formatDate, formatRelativeTime } from "@/lib/utils/index";
import { ProjectCardExternalLink } from "./ProjectCardExternalLink";

function ProjectCardKeyedBadge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {children}
    </span>
  );
}

interface ProjectCardProps {
  project: Project;
  commitInfo?: { date: Date; hash: string };
  isLoadingCommitDates?: boolean;
}

export function ProjectCard({ project, commitInfo, isLoadingCommitDates = false }: ProjectCardProps) {
  const { getTextColor, getProjectBadge, getBorderColor, getCardPattern } = useThemeConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={`${getCardPattern()} relative isolate z-0 flex flex-col`}>
        <div className="relative z-10 flex flex-col gap-4">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover motion-safe:group-hover:scale-105 transition-transform duration-300 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 text-xl font-bold text-orange-500 transition-colors group-hover:text-orange-400">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.status ? (
                  <ProjectCardKeyedBadge className={`capitalize ${getProjectBadge("status", project.status)}`}>
                    {project.status}
                  </ProjectCardKeyedBadge>
                ) : null}
                {project.openSource ? (
                  <ProjectCardKeyedBadge className={getProjectBadge("openSource")}>Open Source</ProjectCardKeyedBadge>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right items-end">
              {project.year && (
                <span className="px-2 py-0.5 rounded-full font-semibold text-xs bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30">
                  {project.year}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full font-semibold text-xs ${getProjectBadge("type", project.type)}`}
              >
                {project.type}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
              {project.clientName && (
                <span className="font-semibold text-orange-800 dark:text-orange-300">{project.clientName}</span>
              )}
              {project.role && <span className={getTextColor("secondary")}>{project.role}</span>}
            </div>
            <p
              className={`${getTextColor("secondary")} group-hover:${getTextColor("primary")} transition-colors text-sm mb-1`}
            >
              {project.description}
            </p>
            {project.highlights && project.highlights.length > 0 && (
              <ul className={`list-disc list-inside text-xs ${getTextColor("secondary")} space-y-1 mt-1`}>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Commit Information */}
          {project.githubUrl && (
            <div
              className={`flex flex-wrap gap-2 items-center text-xs ${getTextColor("muted")} border-t ${getBorderColor(
                "primary"
              )} pt-2`}
            >
              {commitInfo ? (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden />
                    <span title={formatDate(commitInfo.date)}>Last commit: {formatRelativeTime(commitInfo.date)}</span>
                  </div>
                  <a
                    href={createCommitUrl(project.githubUrl, commitInfo.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-800 underline-offset-2 hover:text-orange-700 hover:underline dark:text-neutral-200 dark:hover:text-orange-400 transition-colors"
                    title="View commit on GitHub"
                  >
                    <GitCommit className="w-3 h-3" aria-hidden />
                    <span className="font-mono">{commitInfo.hash.substring(0, 7)}</span>
                    <NewTabSrOnly />
                  </a>
                </>
              ) : isLoadingCommitDates ? (
                <div className={`flex items-center gap-1 ${getTextColor("muted")}`}>
                  <span>Loading commit info...</span>
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {project.stack.slice(0, 6).map((tech) => {
              const techIcon = getTechIcon(tech);
              return (
                <span
                  key={tech}
                  className="relative z-10 isolate px-3 py-1 rounded-full text-xs font-medium a11y-tech-chip border border-orange-500/20 hover:border-orange-500/40 transition-colors inline-flex items-center gap-1.5"
                >
                  {techIcon && <techIcon.Icon className={`w-3.5 h-3.5 ${techIcon.colorClass}`} aria-hidden />}
                  <span>{tech}</span>
                </span>
              );
            })}
            {project.stack.length > 6 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-800 dark:text-slate-200 border border-slate-500/30">
                +{project.stack.length - 6} more
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            {project.githubUrl ? (
              <ProjectCardExternalLink
                href={project.githubUrl}
                variant="github"
                icon={<FaGithub className="size-4" aria-hidden />}
              >
                GitHub
              </ProjectCardExternalLink>
            ) : null}
            {project.liveUrl ? (
              <ProjectCardExternalLink
                href={project.liveUrl}
                variant="live"
                icon={<ExternalLink className="size-4" aria-hidden />}
              >
                Live
              </ProjectCardExternalLink>
            ) : null}
            {project.caseStudyUrl ? (
              <ProjectCardExternalLink href={project.caseStudyUrl} variant="caseStudy">
                Case Study
              </ProjectCardExternalLink>
            ) : null}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded border border-orange-700/30 bg-orange-50 text-orange-950 hover:bg-orange-100 dark:border-orange-400/45 dark:bg-orange-950 dark:text-orange-50 dark:hover:bg-orange-900 transition-colors text-xs font-semibold"
            >
              <Eye className="w-4 h-4" aria-hidden />
              View Details
            </button>
          </div>
        </div>
      </div>

      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
