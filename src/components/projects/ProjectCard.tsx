import React from "react";
import { Project } from "@/data/projects";
import { getTechIcon } from "@/lib/techIconMap";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
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
              <svg className="w-3.5 h-3.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12.93V17a1 1 0 11-2 0v-2.07A6.002 6.002 0 014 10a1 1 0 112 0 4 4 0 108 0 1 1 0 112 0 6.002 6.002 0 01-5 4.93z" />
              </svg>
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
      <div className="flex flex-wrap gap-2 mt-2">
        {project.stack.map((tech, i) => {
          const iconKey = project.stackIcons && project.stackIcons[i];
          const techIcon = iconKey ? getTechIcon(iconKey) : null;
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-.325.217l-4 1.5a1 1 0 01-1.263-1.263l1.5-4a1 1 0 01.217-.325l8.5-8.5zM15 7l-2-2-8.293 8.293-.707.707-.707 2.121 2.121-.707.707-.707z" />
            </svg>
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 4v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-5h-1v5a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h6V4a1 1 0 112 0v2a1 1 0 01-1 1h-2a1 1 0 110-2h1V4a1 1 0 10-2 0z" />
            </svg>
            Case Study
          </a>
        )}
      </div>
    </div>
  );
}
