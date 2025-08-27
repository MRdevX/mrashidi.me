import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";
import { PageLayout } from "@/components/layout";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.projects);

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
