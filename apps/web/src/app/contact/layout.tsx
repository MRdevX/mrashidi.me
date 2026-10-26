import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata((await getSiteContent()).profile, "contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
