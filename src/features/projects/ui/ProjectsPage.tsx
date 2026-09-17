"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PageHeader, PageStaggerContainer, PageWrapper } from "@/components/ui";
import { ProjectCatalogProvider } from "../application/ProjectCatalogContext";
import type { Project } from "../domain/project";
import { ProjectDetailsDrawer } from "./details/ProjectDetailsDrawer";
import { ActiveFilters } from "./filters/ActiveFilters";
import { FilterBar } from "./filters/FilterBar";
import { ProjectGrid } from "./results/ProjectGrid";
import { ProjectStats } from "./results/ProjectStats";

export function ProjectsPage() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <ProjectCatalogProvider>
      <PageWrapper>
        <PageStaggerContainer>
          {({ itemVariants }) => (
            <div className="flex flex-col gap-6 md:gap-8">
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
              >
                <PageHeader iconName="FolderOpen" title="Projects" className="[&_.page-header]:mb-0" />
                <ProjectStats />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FilterBar />
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col gap-5">
                <ActiveFilters />
                <ProjectGrid onOpenProject={setOpenProject} />
              </motion.div>
            </div>
          )}
        </PageStaggerContainer>
        <ProjectDetailsDrawer project={openProject} onSelect={setOpenProject} />
      </PageWrapper>
    </ProjectCatalogProvider>
  );
}
