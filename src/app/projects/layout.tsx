import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.projects);

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
