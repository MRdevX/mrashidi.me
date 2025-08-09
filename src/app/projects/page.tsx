"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import { getTechIcon } from "@/lib/techIconMap";

const TECHNOLOGY_CATEGORIES = {
  frameworks: ["NestJS", "Next.js", "React", "Framer Motion", "TypeORM", "Drizzle ORM"],
  languages: ["TypeScript", "JavaScript", "Python", "Java", "Rust"],
  databases: ["PostgreSQL", "MongoDB", "Redis"],
  clouds: ["AWS", "Azure", "Docker", "Kubernetes"],
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStacks, setSelectedStacks] = useState<Set<string>>(new Set());
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState<boolean>(false);

  const allStacks = useMemo(() => {
    const stacks = new Set<string>();
    projects.forEach((project) => {
      project.stack.forEach((stack) => stacks.add(stack));
    });
    return Array.from(stacks).sort();
  }, []);

  const stackUsageCount = useMemo(() => {
    const count: Record<string, number> = {};
    projects.forEach((project) => {
      project.stack.forEach((stack) => {
        count[stack] = (count[stack] || 0) + 1;
      });
    });
    return count;
  }, []);

  const categorizedStacks = useMemo(() => {
    const categorized: Record<string, string[]> = {
      frameworks: [],
      languages: [],
      databases: [],
      clouds: [],
    };

    allStacks.forEach((stack) => {
      if (TECHNOLOGY_CATEGORIES.frameworks.includes(stack)) {
        categorized.frameworks.push(stack);
      } else if (TECHNOLOGY_CATEGORIES.languages.includes(stack)) {
        categorized.languages.push(stack);
      } else if (TECHNOLOGY_CATEGORIES.databases.includes(stack)) {
        categorized.databases.push(stack);
      } else if (TECHNOLOGY_CATEGORIES.clouds.includes(stack)) {
        categorized.clouds.push(stack);
      }
    });

    return categorized;
  }, [allStacks]);

  const toggleStack = (stack: string) => {
    const newSelectedStacks = new Set(selectedStacks);
    if (newSelectedStacks.has(stack)) {
      newSelectedStacks.delete(stack);
    } else {
      newSelectedStacks.add(stack);
    }
    setSelectedStacks(newSelectedStacks);
  };

  const matchesSearch = (project: any, query: string): boolean => {
    if (!query.trim()) return true;

    try {
      const regex = new RegExp(query, "i");

      if (regex.test(project.title)) return true;

      if (regex.test(project.description)) return true;

      if (project.highlights) {
        for (const highlight of project.highlights) {
          if (regex.test(highlight)) return true;
        }
      }

      for (const tech of project.stack) {
        if (regex.test(tech)) return true;
      }

      if (project.clientName && regex.test(project.clientName)) return true;

      if (project.role && regex.test(project.role)) return true;

      return false;
    } catch (error) {
      const searchText = query.toLowerCase();
      const projectText = [
        project.title,
        project.description,
        ...(project.highlights || []),
        ...project.stack,
        project.clientName,
        project.role,
      ]
        .join(" ")
        .toLowerCase();

      return projectText.includes(searchText);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!matchesSearch(project, searchQuery)) return false;

      if (selectedStacks.size > 0) {
        const projectStacks = new Set(project.stack);
        for (const selectedStack of selectedStacks) {
          if (!projectStacks.has(selectedStack)) return false;
        }
      }

      if (showOpenSourceOnly && !project.openSource) return false;

      return true;
    });
  }, [searchQuery, selectedStacks, showOpenSourceOnly]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderCategorySection = (category: string, title: string, stacks: string[]) => {
    if (stacks.length === 0) return null;

    return (
      <div key={category} className="mb-6">
        <h4 className="text-md font-semibold text-gray-300 mb-3">{title}</h4>
        <div className="flex flex-wrap gap-3">
          {stacks.map((stack) => {
            const isSelected = selectedStacks.has(stack);
            const techIcon = getTechIcon(stack.toLowerCase().replace(/\s+/g, ""));
            const usageCount = stackUsageCount[stack];

            return (
              <button
                key={stack}
                onClick={() => toggleStack(stack)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-lg"
                    : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50 hover:text-orange-400"
                }`}
              >
                {techIcon && <techIcon.Icon className={`w-5 h-5 ${techIcon.colorClass}`} />}
                <span className="text-sm font-medium">{stack}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-orange-500 text-white" : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {usageCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.h1 className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text" variants={item}>
          Projects
        </motion.h1>

        {/* Search Box */}
        <motion.div className="mb-8" variants={item}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, description, technology, or use regex patterns..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-orange-500/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-400">
              <p>
                Searching for: <span className="text-orange-400 font-mono">{searchQuery}</span>
              </p>
              <p className="text-xs mt-1">
                Supports regex patterns. Examples: "microservice", "docker|kubernetes", "202[45]", "auth.*service"
              </p>
            </div>
          )}
        </motion.div>

        {/* Technology Stack Icons - Categorized */}
        <motion.div className="mb-8" variants={item}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Filter by Technology Stack</h3>
            <p className="text-gray-400 text-sm mb-4">
              Click on technology icons to filter projects. Multiple selections are supported.
            </p>
          </div>
          <div className="space-y-4">
            {renderCategorySection("frameworks", "Frameworks", categorizedStacks.frameworks)}
            {renderCategorySection("languages", "Programming Languages", categorizedStacks.languages)}
            {renderCategorySection("databases", "Databases", categorizedStacks.databases)}
            {renderCategorySection("clouds", "Cloud & Infrastructure", categorizedStacks.clouds)}
          </div>
        </motion.div>

        {/* Additional Filters */}
        <motion.div className="mb-8" variants={item}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Source Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOpenSourceOnly}
                  onChange={(e) => setShowOpenSourceOnly(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    showOpenSourceOnly ? "bg-orange-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      showOpenSourceOnly ? "translate-x-6" : "translate-x-1"
                    } top-1`}
                  />
                </div>
                <span className="ml-3 text-sm font-semibold text-orange-400">Show Open Source Only</span>
              </label>
            </div>

            {/* Clear Filters */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStacks(new Set());
                  setShowOpenSourceOnly(false);
                }}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600/50 hover:text-white transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div className="mb-6" variants={item}>
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
        <motion.div variants={item}>
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
      </motion.div>
    </div>
  );
}
