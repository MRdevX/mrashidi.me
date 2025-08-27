import type { Metadata } from "next";
import { coreConfig, personalInfo } from "@/data";

export const metadata: Metadata = {
  title: `About - ${personalInfo.name} | ${personalInfo.title}`,
  description: `Learn more about ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}. Discover my background, skills, and experience in software development.`,
  keywords: `${personalInfo.name}, about, software engineer, backend developer, ${personalInfo.location}, skills, experience`,
  openGraph: {
    title: `About - ${personalInfo.name}`,
    description: `Learn more about ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}.`,
    url: `${coreConfig.site.url}/about`,
    type: "profile",
    images: [
      {
        url: `${coreConfig.site.url}/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - About`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About - ${personalInfo.name}`,
    description: `Learn more about ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}.`,
    images: [`${coreConfig.site.url}/og-about.jpg`],
  },
  alternates: {
    canonical: `${coreConfig.site.url}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
