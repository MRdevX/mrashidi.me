import { Calendar, ExternalLink, Eye, GitCommit, Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ProjectModal } from "@/components/ui/ProjectModal";
import type { Project } from "@/data/site/projects";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { getTechIcon } from "@/lib/tech";
import { createCommitUrl, formatDate } from "@/lib/utils/index";

interface ProjectCardProps {
  project: Project;
  commitInfo?: { date: Date; hash: string };
  isLoadingCommitDates?: boolean;
}

export function ProjectCard({ project, commitInfo, isLoadingCommitDates = false }: ProjectCardProps) {
  const { getTextColor, getBackgroundColor, getProjectBadge, getBorderColor } = useThemeConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`glass-card p-6 flex flex-col gap-4 shadow-lg rounded-xl border border-orange-500/10 transition-transform duration-200 hover:scale-[1.025] hover:shadow-orange-500/20 group`}
      >
        {/* Project Image */}
        {project.imageUrl && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors mb-2">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.status && (
                <span
                  className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("status", project.status)} capitalize flex items-center gap-1`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                  {project.status}
                </span>
              )}
              {project.openSource && (
                <span
                  className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("openSource")} flex items-center gap-1`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                  Open Source
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            {project.year && (
              <span className="px-2 py-0.5 rounded-full font-semibold text-xs bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30">
                {project.year}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full font-semibold text-xs ${getProjectBadge("type", project.type)}`}>
              {project.type}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
            {project.clientName && <span className="font-semibold text-orange-400">{project.clientName}</span>}
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
                  <Calendar className="w-3 h-3" />
                  <span>Last commit: {formatDate(commitInfo.date)}</span>
                </div>
                <a
                  href={createCommitUrl(project.githubUrl, commitInfo.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-400 transition-colors"
                  title="View commit on GitHub"
                >
                  <GitCommit className="w-3 h-3" />
                  <span className="font-mono">{commitInfo.hash.substring(0, 7)}</span>
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${getBackgroundColor("muted")} border border-orange-500/20 hover:border-orange-500/40 transition-colors flex items-center gap-1.5`}
              >
                {techIcon && <techIcon.Icon className={`w-3.5 h-3.5 ${techIcon.colorClass}`} />}
                {tech}
              </span>
            );
          })}
          {project.stack.length > 6 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30">
              +{project.stack.length - 6} more
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-300 transition-colors text-xs font-semibold"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-green-300 transition-colors text-xs font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
          {project.caseStudyUrl && (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-xs font-semibold"
            >
              Case Study
            </a>
          )}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-300 transition-colors text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
