"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PageHeader, PageSection, PageWrapper, Pagination } from "@/components/ui";
import { ProjectFilters, ProjectResults, ProjectSearchBox } from "@/features/projects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import {
  pageContainerVariants,
  pageItemVariants,
  reducedMotionPageContainerVariants,
  reducedMotionPageItemVariants,
} from "@/lib/animations";

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

  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionPageContainerVariants : pageContainerVariants;
  const itemVariants = prefersReducedMotion ? reducedMotionPageItemVariants : pageItemVariants;

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <PageHeader iconName="FolderOpen" title="Projects" />
        </motion.div>

        <motion.div variants={itemVariants}>
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

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </PageSection>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
