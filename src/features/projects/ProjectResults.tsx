"use client";

import { Package } from "lucide-react";
import { projects } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ProjectAnimatedSection } from "./ProjectAnimatedSection";
import { ProjectCard } from "./ProjectCard";
import { ProjectResultsEmpty } from "./ProjectResultsEmpty";
import { ProjectSummaryFilterChip } from "./ProjectSummaryFilterChip";

interface ProjectResultsProps {
  filteredProjects: typeof projects;
  searchQuery: string;
  selectedStacks: Set<string>;
  showOpenSourceOnly: boolean;
  commitInfo?: Map<string, { date: Date; hash: string }>;
  isLoadingCommitDates?: boolean;
}

export function ProjectResults({
  filteredProjects,
  searchQuery,
  selectedStacks,
  showOpenSourceOnly,
  commitInfo = new Map(),
  isLoadingCommitDates = false,
}: ProjectResultsProps) {
  const { getTextColor } = useThemeConfig();

  return (
    <>
      <ProjectAnimatedSection className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className={`flex items-center gap-2 text-sm ${getTextColor("secondary")}`}>
            <Package className="size-4 shrink-0" />
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {filteredProjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {searchQuery ? <ProjectSummaryFilterChip kind="search" label={searchQuery} /> : null}
              {Array.from(selectedStacks).map((stack) => (
                <ProjectSummaryFilterChip key={stack} kind="stack" label={stack} />
              ))}
              {showOpenSourceOnly ? <ProjectSummaryFilterChip kind="openSource" /> : null}
            </div>
          ) : null}
        </div>
      </ProjectAnimatedSection>

      <ProjectAnimatedSection delay={0.08}>
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                commitInfo={project.githubUrl ? commitInfo.get(project.githubUrl) : undefined}
                isLoadingCommitDates={isLoadingCommitDates}
              />
            ))}
          </div>
        ) : (
          <ProjectResultsEmpty />
        )}
      </ProjectAnimatedSection>
    </>
  );
}
