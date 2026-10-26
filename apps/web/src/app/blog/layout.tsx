import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata((await getSiteContent()).profile, "blog");
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
