"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import ProjectSearchBox from "@/components/projects/ProjectSearchBox";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectResults from "@/components/projects/ProjectResults";

export default function Projects() {
  const {
    filters: { searchQuery, selectedStacks, showOpenSourceOnly },
    setSearchQuery,
    toggleStack,
    setShowOpenSourceOnly,
    clearAllFilters,
    categorizedStacks,
    stackUsageCount,
    filteredProjects,
    isLoadingCommitDates,
    commitInfo,
  } = useProjectFilters();

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

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.div className="flex items-center justify-between mb-8" variants={item}>
          <div className="flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">Projects</h1>
          </div>
        </motion.div>

        <ProjectSearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} onClear={() => setSearchQuery("")} />

        <ProjectFilters
          categorizedStacks={categorizedStacks}
          stackUsageCount={stackUsageCount}
          selectedStacks={selectedStacks}
          showOpenSourceOnly={showOpenSourceOnly}
          onToggleStack={toggleStack}
          onToggleOpenSource={setShowOpenSourceOnly}
          onClearAll={clearAllFilters}
        />

        <ProjectResults
          filteredProjects={filteredProjects}
          searchQuery={searchQuery}
          selectedStacks={selectedStacks}
          showOpenSourceOnly={showOpenSourceOnly}
          commitInfo={commitInfo}
          isLoadingCommitDates={isLoadingCommitDates}
        />
      </motion.div>
    </div>
  );
}
