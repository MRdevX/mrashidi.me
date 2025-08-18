import type { Metadata } from "next";
import { personalInfo, coreConfig } from "@/data";

export const metadata: Metadata = {
  title: `Blog - ${personalInfo.name} | Software Engineering Articles`,
  description: `Read ${personalInfo.name}'s software engineering articles, technical insights, and development tutorials. Learn about backend development, system design, and modern web technologies.`,
  keywords: `${personalInfo.name}, blog, software engineering, technical articles, backend development, tutorials, system design, web development`,
  openGraph: {
    title: `Blog - ${personalInfo.name}`,
    description: `Read ${personalInfo.name}'s software engineering articles and technical insights.`,
    url: `${coreConfig.site.url}/blog`,
    type: "website",
    images: [
      {
        url: `${coreConfig.site.url}/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog - ${personalInfo.name}`,
    description: `Read ${personalInfo.name}'s software engineering articles and technical insights.`,
    images: [`${coreConfig.site.url}/og-blog.jpg`],
  },
  alternates: {
    canonical: `${coreConfig.site.url}/blog`,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
