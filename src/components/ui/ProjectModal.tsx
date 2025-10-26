"use client";

import { Building, Calendar, Code, ExternalLink, Github, Shield, User } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
import { useThemeConfig } from "@/hooks";
import { getTechIcon } from "@/lib/tech";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { getProjectBadge } = useThemeConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-2 border-orange-500/30 shadow-[0_0_30px_rgba(255,95,31,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text flex items-center gap-3">
            {project.logoUrl && (
              <Image
                src={project.logoUrl}
                alt={`${project.title} logo`}
                width={32}
                height={32}
                className="rounded-lg"
              />
            )}
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Project Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {project.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500/70" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Year: {project.year}</span>
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500/70" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Role: {project.role}</span>
                </div>
              )}
              {project.clientName && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-500/70" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Client: {project.clientName}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-500/70" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Type: {project.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500/70" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Visibility: {project.visibility}</span>
              </div>
              {project.status && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status: {project.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {project.status && (
              <span
                className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("status", project.status)} capitalize`}
              >
                {project.status}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("visibility", project.visibility)}`}
            >
              {project.visibility}
            </span>
            <span className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("type", project.type)}`}>
              {project.type}
            </span>
            {project.openSource && (
              <span className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("openSource")}`}>
                Open Source
              </span>
            )}
            {project.license && (
              <span
                className={`px-2 py-1 rounded-md font-semibold text-xs ${getProjectBadge("license", project.license)}`}
              >
                {project.license}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-500 dark:text-orange-400">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-orange-500 dark:text-orange-400">Key Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-500 dark:text-orange-400">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => {
                const techIcon = getTechIcon(tech);
                return (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:border-orange-500/40 transition-colors"
                  >
                    {techIcon && <techIcon.Icon className={`w-4 h-4 ${techIcon.colorClass}`} />}
                    {tech}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-orange-500/20">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-300 transition-colors text-xs font-semibold"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-green-300 transition-colors text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Case Study
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
