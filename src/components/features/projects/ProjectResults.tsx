import { motion } from "framer-motion";
import { Search, Filter, Globe, Package, AlertCircle } from "lucide-react";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { projects } from "@/data";

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
  return (
    <>
      {/* Results Summary */}
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Package className="w-4 h-4" />
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {filteredProjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  Search: {searchQuery}
                </span>
              )}
              {Array.from(selectedStacks).map((stack) => (
                <span
                  key={stack}
                  className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30 flex items-center gap-1"
                >
                  <Filter className="w-3 h-3" />
                  {stack}
                </span>
              ))}
              {showOpenSourceOnly && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Open Source
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.title + idx}
                project={project}
                commitInfo={project.githubUrl ? commitInfo.get(project.githubUrl) : undefined}
                isLoadingCommitDates={isLoadingCommitDates}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              No projects found
            </div>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters to see more projects</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
