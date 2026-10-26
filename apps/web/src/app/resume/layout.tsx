import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.resume);

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
