import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.blog);

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
