import type { Metadata } from "next";
import { ProjectsPage } from "@/features/projects";
import { getSiteContent } from "@/lib/content/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata((await getSiteContent()).profile, "projects");
}

export default ProjectsPage;
