import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata((await getSiteContent()).profile, "about");
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
