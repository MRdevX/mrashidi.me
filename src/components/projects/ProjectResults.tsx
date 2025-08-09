import { motion } from "framer-motion";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

interface ProjectResultsProps {
  filteredProjects: typeof projects;
  searchQuery: string;
  selectedStacks: Set<string>;
  showOpenSourceOnly: boolean;
}

export default function ProjectResults({
  filteredProjects,
  searchQuery,
  selectedStacks,
  showOpenSourceOnly,
}: ProjectResultsProps) {
  return (
    <>
      {/* Results Summary */}
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-gray-400 text-sm">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {filteredProjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                  Search: {searchQuery}
                </span>
              )}
              {Array.from(selectedStacks).map((stack) => (
                <span
                  key={stack}
                  className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30"
                >
                  {stack}
                </span>
              ))}
              {showOpenSourceOnly && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
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
              <ProjectCard key={project.title + idx} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No projects found</div>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters to see more projects</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
