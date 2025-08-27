import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";
import { PageLayout } from "@/components/layout";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.contact);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
