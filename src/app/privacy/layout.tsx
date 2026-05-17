import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.privacy);

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
