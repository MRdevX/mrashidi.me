import { ExternalLink, Github, Calendar, GitCommit } from "lucide-react";
import { Project } from "@/data/site/projects";
import { formatDate, createCommitUrl } from "@/lib/utils/index";
import { getTechIcon } from "@/lib/techIconMap";

interface ProjectCardProps {
  project: Project;
  commitInfo?: { date: Date; hash: string };
  isLoadingCommitDates?: boolean;
  isRefreshingInBackground?: boolean;
}

export default function ProjectCard({
  project,
  commitInfo,
  isLoadingCommitDates = false,
  isRefreshingInBackground = false,
}: ProjectCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 shadow-lg rounded-xl border border-orange-500/10 transition-transform duration-200 hover:scale-[1.025] hover:shadow-orange-500/20 group">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">{project.title}</h3>
        <div className="flex gap-2 flex-wrap items-center justify-end">
          {project.year && (
            <span className="px-2 py-0.5 rounded font-semibold text-xs bg-gray-800 text-gray-300 border border-gray-600">
              {project.year}
            </span>
          )}
          {project.status && (
            <span className="px-2 py-0.5 rounded font-semibold text-xs bg-gray-700 text-gray-400 border border-gray-600 capitalize">
              {project.status}
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded font-semibold text-xs ${project.visibility === "public" ? "bg-green-700 text-green-200" : "bg-gray-700 text-gray-300"}`}
          >
            {project.visibility}
          </span>
          <span
            className={`px-2 py-0.5 rounded font-semibold text-xs ${project.type === "personal" ? "bg-blue-700 text-blue-200" : "bg-orange-700 text-orange-200"}`}
          >
            {project.type}
          </span>
          {project.openSource && (
            <span className="px-2 py-0.5 rounded font-semibold text-xs bg-yellow-700 text-yellow-200 flex items-center gap-1">
              {/* <Globe className="w-3.5 h-3.5" /> */}
              Open Source
            </span>
          )}
          {project.openSource && project.license && (
            <span className="px-2 py-0.5 rounded font-semibold text-xs bg-yellow-900 text-yellow-200 border border-yellow-700 ml-1">
              {project.license}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
          {project.clientName && <span className="font-semibold text-orange-400">{project.clientName}</span>}
          {project.role && <span className="text-gray-400">{project.role}</span>}
        </div>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm mb-1">{project.description}</p>
        {project.highlights && project.highlights.length > 0 && (
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 mt-1">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Commit Information */}
      {project.githubUrl && (
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 border-t border-gray-700 pt-2">
          {commitInfo ? (
            <>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Last commit: {formatDate(commitInfo.date)}</span>
                {isRefreshingInBackground && <span className="text-orange-400 text-xs ml-1">(refreshing...)</span>}
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
            <div className="flex items-center gap-1 text-gray-600">
              {/* <Loader2 className="w-3 h-3 animate-spin" /> */}
              <span>Loading commit info...</span>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {project.stack.map((tech) => {
          const techIcon = getTechIcon(tech);
          return (
            <span key={tech} className="tech-badge bg-gray-800/60 border border-orange-500/20 text-xs flex items-center">
              {techIcon && <techIcon.Icon className={`w-4 h-4 mr-1 inline-block ${techIcon.colorClass}`} />}
              {tech}
            </span>
          );
        })}
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
            {/* <FileText className="w-4 h-4" /> */}
            Case Study
          </a>
        )}
      </div>
    </div>
  );
}
