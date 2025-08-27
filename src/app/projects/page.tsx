"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { ProjectFilters, ProjectPagination, ProjectResults, ProjectSearchBox } from "@/features/projects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { PageHeader, PageSection } from "@/components/ui";
import { pageContainerVariants, pageItemVariants } from "@/lib/animations";

export default function Projects() {
  const {
    filters: { searchQuery, selectedStacks, showOpenSourceOnly },
    setSearchQuery,
    toggleStack,
    setShowOpenSourceOnly,
    clearAllFilters,
    categorizedStacks,
    stackUsageCount,
    paginatedProjects,
    currentPage,
    totalPages,
    setPage,
    isLoadingCommitDates,
    commitInfo,
  } = useProjectFilters(6);

  return (
    <div className="page-container">
      <motion.div className="page-content" initial="hidden" animate="show" variants={pageContainerVariants}>
        <motion.div variants={pageItemVariants}>
          <PageHeader icon={FolderOpen} title="Projects" />
        </motion.div>

        <motion.div variants={pageItemVariants}>
          <PageSection>
            <div className="content-section">
              <ProjectSearchBox
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />

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
                filteredProjects={paginatedProjects}
                searchQuery={searchQuery}
                selectedStacks={selectedStacks}
                showOpenSourceOnly={showOpenSourceOnly}
                commitInfo={commitInfo}
                isLoadingCommitDates={isLoadingCommitDates}
              />

              <ProjectPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </PageSection>
        </motion.div>
      </motion.div>
    </div>
  );
}
