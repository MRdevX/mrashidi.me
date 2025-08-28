import type { Metadata, Viewport } from "next";
import { coreConfig, personalInfo, siteConfig } from "@/data";

interface PageMetadataConfig {
  page: string;
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  ogType?: "website" | "profile";
  ogImage?: string;
}

export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const { page, title, description, keywords, ogType = "website", ogImage = `og-${page}.jpg` } = config;

  const fullTitle = `${title} - ${personalInfo.name}`;
  const fullDescription = description;
  const fullKeywords = keywords.join(", ");

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `${coreConfig.site.url}/${page}`,
      type: ogType,
      images: [
        {
          url: `${coreConfig.site.url}/${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${personalInfo.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [`${coreConfig.site.url}/${ogImage}`],
    },
    alternates: {
      canonical: `${coreConfig.site.url}/${page}`,
    },
  };
}

export function generateRootMetadata(): Metadata {
  const homeConfig = pageMetadataConfigs.home;
  const baseMetadata = generatePageMetadata(homeConfig);

  return {
    ...baseMetadata,
    creator: personalInfo.name,
    authors: [{ name: personalInfo.name, url: coreConfig.site.url }],
    robots: "index, follow",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    themeColor: siteConfig.themeColor,
    viewportFit: "cover",
  };
}

export const pageMetadataConfigs = {
  home: {
    page: "",
    title: "Home",
    description: personalInfo.intro,
    keywords: [
      personalInfo.name,
      personalInfo.title,
      "software engineer",
      "backend developer",
      "portfolio",
      "full-stack",
      "node.js",
      "typescript",
      "react",
      personalInfo.location,
    ],
    ogImage: "og-image.jpg",
  },
  about: {
    page: "about",
    title: "About",
    description: `Learn more about ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}. Discover my background, skills, and experience in software development.`,
    keywords: [
      personalInfo.name,
      "about",
      "software engineer",
      "backend developer",
      personalInfo.location,
      "skills",
      "experience",
    ],
    ogType: "profile" as const,
  },
  blog: {
    page: "blog",
    title: "Blog",
    description: `Read ${personalInfo.name}'s software engineering articles, technical insights, and development tutorials. Learn about backend development, system design, and modern web technologies.`,
    keywords: [
      personalInfo.name,
      "blog",
      "software engineering",
      "technical articles",
      "backend development",
      "tutorials",
      "system design",
      "web development",
    ],
  },
  contact: {
    page: "contact",
    title: "Contact",
    description: `Get in touch with ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}. Available for freelance work, collaboration, and technical discussions.`,
    keywords: [
      personalInfo.name,
      "contact",
      "freelance",
      "software engineer",
      "collaboration",
      personalInfo.location,
      "backend developer",
    ],
  },
  projects: {
    page: "projects",
    title: "Projects",
    description: `Explore ${personalInfo.name}'s software engineering projects. View open source contributions, full-stack applications, and technical solutions built with modern technologies.`,
    keywords: [
      personalInfo.name,
      "projects",
      "portfolio",
      "software engineer",
      "open source",
      "github",
      "node.js",
      "typescript",
      "react",
      "full-stack",
    ],
  },
  resume: {
    page: "resume",
    title: "Resume",
    description: `Download ${personalInfo.name}'s professional resume and CV. View work experience, skills, and qualifications as a ${personalInfo.title} based in ${personalInfo.location}.`,
    keywords: [
      personalInfo.name,
      "resume",
      "cv",
      "professional experience",
      personalInfo.title,
      personalInfo.location,
      "software engineer",
      "backend developer",
    ],
  },
} as const;
