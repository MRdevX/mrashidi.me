"use client";

import { Building, Calendar, Code, ExternalLink, Github, Shield, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
import { getTechIcon } from "@/lib/tech";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500 flex items-center gap-3">
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
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Year: {project.year}</span>
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Role: {project.role}</span>
                </div>
              )}
              {project.clientName && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Client: {project.clientName}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Type: {project.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Visibility: {project.visibility}</span>
              </div>
              {project.status && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status: {project.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {project.status && (
              <Badge variant="secondary" className="capitalize">
                {project.status}
              </Badge>
            )}
            <Badge variant="outline">{project.visibility}</Badge>
            <Badge variant="outline">{project.type}</Badge>
            {project.openSource && (
              <Badge variant="default" className="bg-green-500">
                Open Source
              </Badge>
            )}
            {project.license && <Badge variant="outline">{project.license}</Badge>}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {project.highlights.map((highlight, index) => (
                  <li key={`highlight-${index}-${Math.random()}`}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => {
                const techIcon = getTechIcon(tech);
                return (
                  <div key={tech} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                    {techIcon && <techIcon.Icon className={`w-4 h-4 ${techIcon.colorClass}`} />}
                    {tech}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {project.githubUrl && (
              <Button asChild variant="outline" className="flex items-center gap-2">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="default" className="flex items-center gap-2">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.caseStudyUrl && (
              <Button asChild variant="secondary" className="flex items-center gap-2">
                <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Case Study
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
