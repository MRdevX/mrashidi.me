import type { Metadata } from "next";
import { generatePageMetadata, pageMetadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(pageMetadataConfigs.contact);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
