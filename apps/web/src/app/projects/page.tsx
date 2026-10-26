import type { Metadata } from "next";
import { ProjectsPage } from "@/features/projects";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.projects);

export default ProjectsPage;
