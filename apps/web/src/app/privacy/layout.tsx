import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata((await getSiteContent()).profile, "privacy");
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
