import type { Metadata } from "next";
import { personalInfo, coreConfig } from "@/data";

export const metadata: Metadata = {
  title: `Projects - ${personalInfo.name} | Software Engineer Portfolio`,
  description: `Explore ${personalInfo.name}'s software engineering projects. View open source contributions, full-stack applications, and technical solutions built with modern technologies.`,
  keywords: `${personalInfo.name}, projects, portfolio, software engineer, open source, github, node.js, typescript, react, full-stack`,
  openGraph: {
    title: `Projects - ${personalInfo.name}`,
    description: `Explore ${personalInfo.name}'s software engineering projects and open source contributions.`,
    url: `${coreConfig.site.url}/projects`,
    type: "website",
    images: [
      {
        url: `${coreConfig.site.url}/og-projects.jpg`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Projects`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects - ${personalInfo.name}`,
    description: `Explore ${personalInfo.name}'s software engineering projects and open source contributions.`,
    images: [`${coreConfig.site.url}/og-projects.jpg`],
  },
  alternates: {
    canonical: `${coreConfig.site.url}/projects`,
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
